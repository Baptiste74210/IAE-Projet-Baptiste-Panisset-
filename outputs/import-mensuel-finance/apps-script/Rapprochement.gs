/**
 * Import Mensuel Finance — logique de rapprochement (aucun appel Google).
 *
 * Ce fichier contient uniquement des règles de calcul : anonymisation, rapprochement en deux passes
 * avec niveau de confiance, mise de côté, contrôle des totaux et application des décisions.
 * Il est utilisé tel quel par le programme Apps Script (Code.gs) et testé dans le dépôt avec Node.js
 * sur le jeu fictif (tests/test_rapprochement.js), où ses résultats sont comparés à ceux du programme
 * Python de référence (.claude/skills/mon-import-mensuel-finance/scripts/import_mensuel.py).
 *
 * Confidentialité : aucune fonction ne reçoit ni ne lit le nom du client ; les multiservices sont identifiés
 * par leur code MS-… écrit dans la colonne WBS.
 *
 * Toute modification d'une règle doit être faite à la fois ici et dans le programme Python,
 * puis vérifiée en relançant les deux séries de tests.
 */

var RAISONS = {
  a: '(a) absent de la database, sans aucun candidat',
  b: '(b) absent du fichier finance',
  c: '(c) multiservices sans code',
  d: '(d) clé manquante',
  e: '(e) doublon',
  f: '(f) valeur non numérique',
  g: '(g) correspondance rejetée',
  h: '(h) type de contrat différent'
};

var NIVEAU_CERTAIN = '100 %';

/** Normalise une clé : texte, espaces / insécables / invisibles retirés en début et fin, majuscules. */
function normaliserCle(k) {
  if (k === null || k === undefined) return '';
  var s = String(k);
  s = s.replace(/^[\s ​‌‍﻿⁠ ]+|[\s ​‌‍﻿⁠ ]+$/g, '');
  s = s.replace(/[­​-‏‪-‮⁠-⁤﻿]/g, '');
  return s.toUpperCase();
}

function estNombre(v) {
  return typeof v === 'number' && isFinite(v);
}

function coutSubstitution(a, b, i, j, s, t) {
  if (a === b) return 0;
  var paire = [a, b].sort().join('');
  if (paire === '0O' || paire === '1I') return 0.5;
  // lettre du préfixe FH/FB
  if (i === 1 && j === 1 && s[0] === 'F' && t[0] === 'F' && paire === 'BH') return 0.5;
  return 1;
}

/** Écart entre deux clés : 0,5 par erreur typique (O/0, I/1, inversion de deux voisins, préfixe FH/FB), 1 sinon. */
function ecartCles(s, t) {
  var n = s.length, m = t.length, d = [], i, j;
  for (i = 0; i <= n; i++) { d.push([]); for (j = 0; j <= m; j++) d[i].push(0); d[i][0] = i; }
  for (j = 0; j <= m; j++) d[0][j] = j;
  for (i = 1; i <= n; i++) {
    for (j = 1; j <= m; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1,
        d[i - 1][j - 1] + coutSubstitution(s[i - 1], t[j - 1], i - 1, j - 1, s, t));
      if (i > 1 && j > 1 && s[i - 1] === t[j - 2] && s[i - 2] === t[j - 1] && s[i - 1] !== s[i - 2]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 0.5);
      }
    }
  }
  return d[n][m];
}

/**
 * Anonymisation d'une ligne : renvoie { cle, raison } à partir de la seule colonne WBS (WBS ou code MS-…)
 * et du type de contrat. Le nom du client n'est jamais lu.
 */
function anonymiserLigne(wbs, type) {
  var k = normaliserCle(wbs);
  if (k) return { cle: k, raison: null };
  if (String(type || '').trim().toLowerCase() === 'multiservices') return { cle: '', raison: 'c' };
  return { cle: '', raison: 'd' };
}

/**
 * Rapprochement complet (étapes 4 et 5).
 *
 * fin   : [{ ligne, cle, type, kpi: { colonneSource: valeur }, raison }]  (fichier finance anonymisé)
 * db    : [{ ligne, cle, type, raison }]                                   (database anonymisée)
 * memoire : { confirmees: [[cleFinance, cleDatabase]], rejetees: [[cleFinance, cleDatabase]] }
 * kpis  : liste ordonnée des colonnes sources de KPI
 * bloc  : { colonneSource: total du bloc de totaux }
 */
function rapprocher(fin, db, memoire, kpis, bloc) {
  var i, j, r, d;
  var confirmees = {}, rejetees = {};
  (memoire.confirmees || []).forEach(function (p) { confirmees[normaliserCle(p[0]) + '|' + normaliserCle(p[1])] = [normaliserCle(p[0]), normaliserCle(p[1])]; });
  (memoire.rejetees || []).forEach(function (p) { rejetees[normaliserCle(p[0]) + '|' + normaliserCle(p[1])] = true; });

  fin = fin.map(function (x) { return { ligne: x.ligne, cle: x.cle, type: x.type, kpi: x.kpi, raison: x.raison }; });
  db = db.map(function (x) { return { ligne: x.ligne, cle: x.cle, type: x.type, raison: x.raison }; });

  var compteFin = {}, compteDb = {};
  fin.forEach(function (x) { if (x.cle) compteFin[x.cle] = (compteFin[x.cle] || 0) + 1; });
  db.forEach(function (x) { if (x.cle) compteDb[x.cle] = (compteDb[x.cle] || 0) + 1; });
  fin.forEach(function (x) { if (x.cle && compteFin[x.cle] > 1) x.raison = 'e'; });

  var matches = {};      // ligne finance -> { db, niveau, ecart, typeDiff }
  var dbUtilisee = {};   // ligne database -> true
  var dbParCle = {};
  db.forEach(function (x) { if (x.cle && compteDb[x.cle] === 1) dbParCle[x.cle] = x; });

  // Passe 1 : clé identique et unique des deux côtés, ou paire confirmée en mémoire.
  fin.forEach(function (x) {
    if (x.raison) return;
    var cible = null;
    var cand = dbParCle[x.cle];
    if (cand && !dbUtilisee[cand.ligne]) {
      cible = cand;
    } else {
      Object.keys(confirmees).forEach(function (k) {
        var p = confirmees[k];
        if (p[0] === x.cle && dbParCle[p[1]] && !dbUtilisee[dbParCle[p[1]].ligne]) cible = dbParCle[p[1]];
      });
    }
    if (cible) {
      dbUtilisee[cible.ligne] = true;
      matches[x.ligne] = { db: cible, niveau: NIVEAU_CERTAIN, ecart: 0,
        typeDiff: normaliserCle(cible.type) !== normaliserCle(x.type) };
    }
  });

  // Passe 2 : plus proche de même type, paires rejetées exclues, attribution par écart croissant.
  var enAttente = fin.filter(function (x) { return !x.raison && !matches[x.ligne]; });
  var paires = [];
  enAttente.forEach(function (x) {
    db.forEach(function (y) {
      if (y.cle && !dbUtilisee[y.ligne] && normaliserCle(y.type) === normaliserCle(x.type) &&
          !rejetees[x.cle + '|' + y.cle]) {
        paires.push({ e: ecartCles(x.cle, y.cle), fr: x.ligne, dr: y.ligne, f: x, d: y });
      }
    });
  });
  paires.sort(function (p, q) { return (p.e - q.e) || (p.fr - q.fr) || (p.dr - q.dr); });
  paires.forEach(function (p) {
    if (matches[p.fr] || dbUtilisee[p.dr]) return;
    var libres = paires.filter(function (q) { return q.fr === p.fr && !dbUtilisee[q.dr]; }).map(function (q) { return q.e; });
    var meilleur = Math.min.apply(null, libres);
    var auMeilleur = libres.filter(function (e) { return e === meilleur; }).length;
    var niveau;
    if (p.e === 0.5 && auMeilleur === 1) niveau = 'Élevée';
    else if (p.e <= 2 && p.e === meilleur && auMeilleur === 1) niveau = 'Moyenne';
    else niveau = 'Faible';
    dbUtilisee[p.dr] = true;
    matches[p.fr] = { db: p.d, niveau: niveau, ecart: p.e, typeDiff: false };
  });
  enAttente.forEach(function (x) { if (!matches[x.ligne]) x.raison = 'a'; });

  // Lignes à traiter à la main.
  var aTraiter = [];
  fin.forEach(function (x) {
    var m = matches[x.ligne];
    if (x.raison) {
      aTraiter.push({ ligne: x.ligne, cle: x.cle, type: x.type, raison: RAISONS[x.raison], kpi: x.kpi });
    } else if (m) {
      var mauvais = kpis.filter(function (h) { return !estNombre(x.kpi[h]); });
      if (mauvais.length) {
        aTraiter.push({ ligne: x.ligne, cle: x.cle, type: x.type,
          raison: RAISONS.f + ' : ' + mauvais.join(', ') + ' (ligne rapprochée)', kpi: x.kpi });
      }
      if (m.typeDiff) {
        aTraiter.push({ ligne: x.ligne, cle: x.cle, type: x.type,
          raison: RAISONS.h + ' : database = ' + m.db.type + ' (ligne rapprochée)', kpi: x.kpi });
      }
    }
  });
  var clesDoublons = {};
  Object.keys(compteFin).forEach(function (k) { if (compteFin[k] > 1) clesDoublons[k] = true; });
  db.forEach(function (y) {
    if (dbUtilisee[y.ligne]) return;
    var raison;
    if (clesDoublons[y.cle]) raison = RAISONS.e + ' côté finance (contrat de la database non rempli)';
    else if (y.raison === 'c') raison = RAISONS.c + ' (côté database)';
    else raison = RAISONS.b;
    aTraiter.push({ ligne: 'database l.' + y.ligne, cle: y.cle, type: y.type, raison: raison, kpi: null });
  });

  // Contrôle des totaux.
  var finParLigne = {};
  fin.forEach(function (x) { finParLigne[x.ligne] = x; });
  function somme(liste, h) {
    return liste.reduce(function (acc, x) { return estNombre(x.kpi[h]) ? acc + x.kpi[h] : acc; }, 0);
  }
  var lignesRapprochees = Object.keys(matches).map(function (k) { return finParLigne[k]; });
  var lignesAttente = Object.keys(matches).filter(function (k) { return matches[k].niveau !== NIVEAU_CERTAIN; })
    .map(function (k) { return finParLigne[k]; });
  var lignesNonRapprochees = fin.filter(function (x) { return !matches[x.ligne]; });
  var controle = kpis.map(function (h) {
    var lignes = somme(fin, h), dbt = somme(lignesRapprochees, h), nr = somme(lignesNonRapprochees, h),
        att = somme(lignesAttente, h);
    var reste = Math.round((bloc[h] - (dbt + nr)) * 100) / 100;
    var ok = Math.abs(bloc[h] - lignes) <= 0.01 && Math.abs(reste) <= 0.01;
    return { kpi: h, bloc: bloc[h], lignes: lignes, database: dbt, nonRapprochees: nr,
      enAttente: att, ecartRestant: reste, statut: ok ? 'OK' : 'À vérifier' };
  });

  var comptages = {};
  comptages[NIVEAU_CERTAIN] = 0;
  ['Élevée', 'Moyenne', 'Faible'].forEach(function (n) { comptages['En attente – ' + n] = 0; });
  Object.keys(matches).forEach(function (k) {
    var n = matches[k].niveau;
    if (n === NIVEAU_CERTAIN) comptages[NIVEAU_CERTAIN] += 1; else comptages['En attente – ' + n] += 1;
  });
  comptages['Non rapprochées'] = fin.length - Object.keys(matches).length;
  comptages['Total lignes fichier finance'] = fin.length;

  var aConfirmer = Object.keys(matches).map(Number).sort(function (a, b) { return a - b; })
    .filter(function (k) { return matches[k].niveau !== NIVEAU_CERTAIN; })
    .map(function (k) {
      return { ligneFinance: k, cleFinance: finParLigne[k].cle, cleDatabase: matches[k].db.cle,
        ligneDatabase: matches[k].db.ligne, niveau: matches[k].niveau, ecart: matches[k].ecart };
    });

  return { matches: matches, aTraiter: aTraiter, aConfirmer: aConfirmer, controle: controle,
    comptages: comptages, fin: fin, db: db };
}

/**
 * Étape 8 : traduit les décisions en actions, sans toucher aux fichiers.
 * lignes : [{ cleFinance, cleDatabase, niveau, decision, statut }]
 * Renvoie { actions: [{ index, type: 'oui'|'non' }], memoire: [[cleF, cleD, statut, date]], manquantes }.
 */
function preparerDecisions(lignes, date) {
  var actions = [], memoire = [], manquantes = [];
  lignes.forEach(function (l, index) {
    if (!l.cleFinance || String(l.statut || '').indexOf('En attente') !== 0) return;
    var dec = String(l.decision || '').trim().toLowerCase();
    if (dec === 'oui') {
      actions.push({ index: index, type: 'oui' });
      memoire.push([normaliserCle(l.cleFinance), normaliserCle(l.cleDatabase), 'confirmée', date]);
    } else if (dec === 'non') {
      actions.push({ index: index, type: 'non' });
      memoire.push([normaliserCle(l.cleFinance), normaliserCle(l.cleDatabase), 'rejetée', date]);
    } else {
      manquantes.push(l.cleFinance);
    }
  });
  return { actions: actions, memoire: memoire, manquantes: manquantes };
}

if (typeof module !== 'undefined') {
  module.exports = { RAISONS: RAISONS, normaliserCle: normaliserCle, ecartCles: ecartCles,
    anonymiserLigne: anonymiserLigne, rapprocher: rapprocher, preparerDecisions: preparerDecisions };
}
