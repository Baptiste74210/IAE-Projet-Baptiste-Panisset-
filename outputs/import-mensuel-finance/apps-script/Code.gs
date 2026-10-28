/**
 * Import Mensuel Finance — programme Apps Script (Google Workspace Airbus).
 *
 * À coller dans l'éditeur Apps Script de la database centrale « Database Hcare XBH in service contracts »
 * (Extensions → Apps Script), avec Rapprochement.gs et appsscript.json. Voir build-notes.md.
 *
 * Menu « Import mensuel finance » :
 *   - Lancer l'import                 → étapes 1 à 6 (depuis la database centrale)
 *   - Prendre en compte mes décisions → étape 8 (depuis la database du mois)
 *
 * Toutes les données restent dans le Google Workspace : aucun service extérieur n'est appelé.
 * La colonne client n'est jamais lue : seules les colonnes WBS (WBS ou code MS-… des multiservices),
 * type de contrat et KPI sont lues.
 * Le programme ne modifie jamais la database centrale ni le fichier finance, ne lit jamais le référentiel
 * des multiservices, et ne supprime ni n'écrase aucun fichier.
 */

// ---------------------------------------------------------------------------------------------
// Paramètres à vérifier une fois, avec les en-têtes réels (aucune donnée de contrat ici).
// ---------------------------------------------------------------------------------------------
var PARAMETRES = {
  prefixeFichierFinance: 'Xbh Contracts Financial performance : ',  // suivi du mois, ex. « Octobre 2026 »
  prefixeDatabaseMois: 'Database XBH ',
  ligneEnTetesFinance: 19,
  premiereLigneContrats: 20,
  colonnesFinance: { wbs: 'WBS', type: 'Contract Type' },       // le code MS-… des multiservices est dans la colonne WBS
  colonnesDatabase: { wbs: 'WBS', type: 'Type de contrat' },
  tableCorrespondance: 'Table de correspondance des colonnes',          // C3, même dossier que la database centrale
  memoire: 'Mémoire des correspondances',                               // C6, même dossier (créée si absente)
  prefixeAnonymise: 'Anonymisé – '                                      // C7, un fichier par exécution
};

var MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre',
  'Octobre', 'Novembre', 'Décembre'];
var ONGLET_A_TRAITER = 'À traiter à la main';
var ONGLET_CONFIRMER = 'Correspondances à confirmer';
var ONGLET_CONTROLE = 'Contrôle';
var EN_TETES_CONFIRMER = ['Clé finance', 'Clé database', 'Niveau de confiance', 'Écart', 'Décision (Oui / Non)',
  'Statut', "Ligne finance d'origine", "Ligne dans l'onglet Database"];

function Arret(message) { this.message = message; }

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Import mensuel finance')
    .addItem("Lancer l'import", 'lancerImport')
    .addItem('Prendre en compte mes décisions', 'prendreEnCompteDecisions')
    .addToUi();
}

// ---------------------------------------------------------------------------------------------
// Étapes 1 à 6
// ---------------------------------------------------------------------------------------------
function lancerImport() {
  var ui = SpreadsheetApp.getUi();
  var rep = ui.prompt('Import mensuel finance', 'Mois et année à importer (ex. : Octobre 2026) :', ui.ButtonSet.OK_CANCEL);
  if (rep.getSelectedButton() !== ui.Button.OK) return;
  var mois = rep.getResponseText().trim();
  try {
    var resume = executerImport(mois);
    ui.alert('Database prête à valider',
      resume.nom + '\n\n' +
      resume.comptages['100 %'] + ' lignes à 100 %\n' +
      resume.enAttente + ' correspondances à confirmer\n' +
      resume.comptages['Non rapprochées'] + ' lignes non rapprochées\n\n' +
      'Contrôle des totaux : ' + resume.statutControle + '\n\n' + resume.url, ui.ButtonSet.OK);
  } catch (e) {
    ui.alert('Import arrêté', (e instanceof Arret ? e.message : 'Erreur inattendue : ' + e) +
      '\n\nAucune database du mois n’a été créée sous son nom final.', ui.ButtonSet.OK);
    if (!(e instanceof Arret)) throw e;
  }
}

function executerImport(mois) {
  if (!new RegExp('^(' + MOIS.join('|') + ') \\d{4}$').test(mois)) {
    throw new Arret('Mois « ' + mois + ' » mal écrit : attendu par exemple « Octobre 2026 » (en français, majuscule, accents).');
  }
  var centrale = SpreadsheetApp.getActiveSpreadsheet();
  if (centrale.getSheetByName(ONGLET_CONFIRMER)) {
    throw new Arret("Lancer l'import depuis la database centrale, pas depuis une database du mois.");
  }
  var fichierCentrale = DriveApp.getFileById(centrale.getId());
  var dossier = fichierCentrale.getParents().next();

  var correspondance = lireCorrespondance(dossier);       // C3
  var memoireTable = ouvrirMemoire(dossier, fichierCentrale);  // C6
  var memoire = lireMemoire(memoireTable);

  // Étape 2 — contrôle du fichier finance
  var finance = ouvrirFichierFinance(mois);
  var feuillesFinance = finance.getSheets();
  if (feuillesFinance.length !== 1) throw new Arret('Le fichier finance contient ' + feuillesFinance.length + ' onglets au lieu d’un seul.');
  var fFin = feuillesFinance[0];
  var valFin = fFin.getDataRange().getValues();
  var enTetes = valFin[PARAMETRES.ligneEnTetesFinance - 1] || [];
  var colFin = {};
  var requises = [PARAMETRES.colonnesFinance.wbs, PARAMETRES.colonnesFinance.type]
    .concat(correspondance.map(function (c) { return c.source; }));
  requises.forEach(function (h) {
    var n = enTetes.filter(function (x) { return x === h; }).length;
    if (n !== 1) throw new Arret('En-tête « ' + h + ' » trouvé ' + n + ' fois en ligne ' + PARAMETRES.ligneEnTetesFinance + ' (attendu : 1).');
    colFin[h] = enTetes.indexOf(h);
  });
  var bloc = {};
  correspondance.forEach(function (c) {
    var v = fFin.getRange(c.celluleTotal).getValue();
    if (typeof v !== 'number') throw new Arret('Total du bloc non numérique en ' + c.celluleTotal + ' pour « ' + c.source + ' ».');
    bloc[c.source] = v;
  });

  // Étape 1 — anonymisation (en mémoire), puis lignes de contrats
  var fin = [];
  for (var i = PARAMETRES.premiereLigneContrats - 1; i < valFin.length; i++) {
    var ligne = valFin[i];
    ligne.forEach(function (v) {
      if (typeof v === 'string' && /^\s*(sous-)?total/i.test(v)) throw new Arret('Ligne « Total » trouvée en ligne ' + (i + 1) + '.');
    });
    var wbs = ligne[colFin[PARAMETRES.colonnesFinance.wbs]], type = ligne[colFin[PARAMETRES.colonnesFinance.type]];
    if ((wbs === '' || wbs === null) && (type === '' || type === null)) continue;
    var a = anonymiserLigne(wbs, type);
    var kpi = {};
    correspondance.forEach(function (c) { kpi[c.source] = ligne[colFin[c.source]] === '' ? null : ligne[colFin[c.source]]; });
    fin.push({ ligne: i + 1, cle: a.cle, type: type, kpi: kpi, raison: a.raison });
  }
  if (!fin.length) throw new Arret('Aucun contrat à partir de la ligne ' + PARAMETRES.premiereLigneContrats + '.');

  var fDb = centrale.getSheets()[0];
  var valDb = fDb.getDataRange().getValues();
  var enTetesDb = valDb[0];
  var colDb = {};
  [PARAMETRES.colonnesDatabase.wbs, PARAMETRES.colonnesDatabase.type]
    .concat(correspondance.map(function (c) { return c.cible; })).forEach(function (h) {
      if (enTetesDb.indexOf(h) < 0) throw new Arret('Colonne « ' + h + ' » absente de la database centrale.');
      colDb[h] = enTetesDb.indexOf(h);
    });
  var db = [];
  for (var j = 1; j < valDb.length; j++) {
    var l = valDb[j];
    if (l.every(function (v) { return v === '' || v === null; })) continue;
    correspondance.forEach(function (c) {
      if (l[colDb[c.cible]] !== '' && l[colDb[c.cible]] !== null) {
        throw new Arret('KPI déjà rempli dans la database centrale : ligne ' + (j + 1) + ', colonne ' + c.cible + '.');
      }
    });
    var b = anonymiserLigne(l[colDb[PARAMETRES.colonnesDatabase.wbs]], l[colDb[PARAMETRES.colonnesDatabase.type]]);
    db.push({ ligne: j + 1, cle: b.cle, type: l[colDb[PARAMETRES.colonnesDatabase.type]], raison: b.raison });
  }
  ecrireAnonymise(dossier, mois, fin, db, correspondance);   // C7 : clé, type, KPI uniquement

  // Étapes 4 et 5 — rapprochement et vérification
  var kpis = correspondance.map(function (c) { return c.source; });
  var res = rapprocher(fin, db, memoire, kpis, bloc);

  // Étapes 3 et 6 — database du mois (copie de la centrale, nouvelle version si besoin) et réinjection
  var nom = nomLibre(dossier, PARAMETRES.prefixeDatabaseMois + mois);
  var copie = fichierCentrale.makeCopy(nom + ' (en cours)', dossier);
  copierPartages(fichierCentrale, copie);
  var mensuelle = SpreadsheetApp.openById(copie.getId());
  var fMois = mensuelle.getSheets()[0];
  var finParLigne = {};
  res.fin.forEach(function (x) { finParLigne[x.ligne] = x; });
  var derniere = valDb.length;
  correspondance.forEach(function (c) {           // une seule écriture par colonne de KPI (rapide sur 400 contrats)
    var colonne = [];
    for (var n = 2; n <= derniere; n++) colonne.push(['']);
    Object.keys(res.matches).forEach(function (k) {
      var v = finParLigne[k].kpi[c.source];
      colonne[res.matches[k].db.ligne - 2] = [v === null || v === undefined ? '' : v];
    });
    if (colonne.length) fMois.getRange(2, colDb[c.cible] + 1, colonne.length, 1).setValues(colonne);
  });
  ecrireOngletsMois(mensuelle, res, kpis, mois, finance.getName(), nom);
  SpreadsheetApp.flush();
  copie.setName(nom);

  var enAttente = res.aConfirmer.length;
  var statut = res.controle.every(function (c) { return c.statut === 'OK'; }) ? 'OK' : 'À vérifier';
  return { nom: nom, url: mensuelle.getUrl(), comptages: res.comptages, enAttente: enAttente, statutControle: statut };
}

// ---------------------------------------------------------------------------------------------
// Étape 8
// ---------------------------------------------------------------------------------------------
function prendreEnCompteDecisions() {
  var ui = SpreadsheetApp.getUi();
  try {
    var r = executerDecisions();
    ui.alert('Décisions prises en compte',
      r.oui + ' confirmée(s), ' + r.non + ' rejetée(s), ' + r.manquantes + ' sans décision.\n\n' +
      'Contrôle des totaux : ' + r.statut + '\nValidation : ' + r.validation, ui.ButtonSet.OK);
  } catch (e) {
    ui.alert('Prise en compte arrêtée', e instanceof Arret ? e.message : 'Erreur inattendue : ' + e, ui.ButtonSet.OK);
    if (!(e instanceof Arret)) throw e;
  }
}

function executerDecisions() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var fConf = ss.getSheetByName(ONGLET_CONFIRMER), fMan = ss.getSheetByName(ONGLET_A_TRAITER),
      fCtl = ss.getSheetByName(ONGLET_CONTROLE), fDb = ss.getSheets()[0];
  if (!fConf || !fMan || !fCtl) throw new Arret('Ouvrir la database du mois produite par l’import (onglets manquants).');
  var fichier = DriveApp.getFileById(ss.getId());
  var dossier = fichier.getParents().next();
  var correspondance = lireCorrespondance(dossier);
  var enTetesDb = fDb.getRange(1, 1, 1, fDb.getLastColumn()).getValues()[0];
  var aujourd = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');

  var valConf = fConf.getDataRange().getValues();
  var lignes = valConf.slice(1).map(function (v) {
    return { cleFinance: v[0], cleDatabase: v[1], niveau: v[2], decision: v[4], statut: v[5], ligneFin: v[6], ligneDb: v[7] };
  });
  var prep = preparerDecisions(lignes, aujourd);
  var delta = {};
  correspondance.forEach(function (c) { delta[c.source] = { db: 0, nr: 0, att: 0 }; });
  var niveaux = {}, oui = 0, non = 0;
  prep.actions.forEach(function (a) {
    var l = lignes[a.index], rang = a.index + 2;
    var valeurs = {};
    correspondance.forEach(function (c) {
      valeurs[c.source] = fDb.getRange(l.ligneDb, enTetesDb.indexOf(c.cible) + 1).getValue();
      if (typeof valeurs[c.source] === 'number') delta[c.source].att -= valeurs[c.source];
    });
    niveaux[l.niveau] = (niveaux[l.niveau] || 0) + 1;
    // Type de contrat repris de la database : en passe 2, il est identique des deux côtés (R9).
    var colType = enTetesDb.indexOf(PARAMETRES.colonnesDatabase.type) + 1;
    var typeContrat = colType > 0 ? fDb.getRange(l.ligneDb, colType).getValue() : '';
    if (a.type === 'oui') {
      fConf.getRange(rang, 6).setValue('Confirmée le ' + aujourd + ' (certaine)');
      oui += 1;
    } else {
      correspondance.forEach(function (c) {
        if (typeof valeurs[c.source] === 'number') { delta[c.source].db -= valeurs[c.source]; delta[c.source].nr += valeurs[c.source]; }
        fDb.getRange(l.ligneDb, enTetesDb.indexOf(c.cible) + 1).clearContent();
      });
      fConf.getRange(rang, 6).setValue('Rejetée le ' + aujourd);
      fMan.appendRow([l.ligneFin, l.cleFinance, typeContrat, RAISONS.g + ' (proposée avec ' + l.cleDatabase + ')']
        .concat(correspondance.map(function (c) { return valeurs[c.source]; })).concat(['', '']));
      fMan.appendRow(['database l.' + l.ligneDb, l.cleDatabase, typeContrat, RAISONS.b + ' (après rejet de ' + l.cleFinance + ')']
        .concat(correspondance.map(function () { return ''; })).concat(['', '']));
      non += 1;
    }
  });
  if (prep.memoire.length) {
    var mem = ouvrirMemoire(dossier, fichier).getSheets()[0];
    var existantes = {};
    mem.getDataRange().getValues().slice(1).forEach(function (v) { existantes[v[0] + '|' + v[1] + '|' + v[2]] = true; });
    prep.memoire.forEach(function (m) { if (!existantes[m[0] + '|' + m[1] + '|' + m[2]]) mem.appendRow(m); });
  }

  // Relance du contrôle (étape 5)
  var valCtl = fCtl.getDataRange().getValues(), statut = 'OK';
  valCtl.forEach(function (v, i) {
    var lab = v[0], rang = i + 1;
    if (delta[lab]) {
      var dbt = v[3] + delta[lab].db, nr = v[4] + delta[lab].nr, att = v[5] + delta[lab].att;
      var reste = Math.round((v[1] - (dbt + nr)) * 100) / 100;
      var ok = Math.abs(v[1] - v[2]) <= 0.01 && Math.abs(reste) <= 0.01;
      if (!ok) statut = 'À vérifier';
      fCtl.getRange(rang, 4, 1, 5).setValues([[dbt, nr, att, reste, ok ? 'OK' : 'À vérifier']]);
    } else if (lab === '100 %') {
      fCtl.getRange(rang, 2).setValue(v[1] + oui);
    } else if (typeof lab === 'string' && lab.indexOf('En attente – ') === 0) {
      fCtl.getRange(rang, 2).setValue(v[1] - (niveaux[lab.split('– ')[1]] || 0));
    } else if (lab === 'Non rapprochées') {
      fCtl.getRange(rang, 2).setValue(v[1] + non);
    } else if (lab === 'Validation') {
      fCtl.getRange(rang, 2).setValue(prep.manquantes.length ? 'indisponible : décisions à prendre' : 'possible : cocher la case « Validé »');
    }
  });
  fCtl.appendRow(['']);
  fCtl.appendRow(['Prise en compte des décisions', aujourd]);
  fCtl.appendRow(['Décisions « Oui »', oui]);
  fCtl.appendRow(['Décisions « Non »', non]);
  fCtl.appendRow(['Décisions manquantes', prep.manquantes.length]);
  return { oui: oui, non: non, manquantes: prep.manquantes.length, statut: statut,
    validation: prep.manquantes.length ? 'indisponible' : 'possible' };
}

// ---------------------------------------------------------------------------------------------
// Lecture des tables et écriture des onglets
// ---------------------------------------------------------------------------------------------
function trouverDansDossier(dossier, nom) {
  var it = dossier.getFilesByName(nom);
  return it.hasNext() ? SpreadsheetApp.openById(it.next().getId()) : null;
}

function lireCorrespondance(dossier) {
  var t = trouverDansDossier(dossier, PARAMETRES.tableCorrespondance);
  if (!t) throw new Arret('Table « ' + PARAMETRES.tableCorrespondance + ' » introuvable dans le dossier de la database centrale.');
  var v = t.getSheets()[0].getDataRange().getValues().slice(1).filter(function (x) { return x[0] !== ''; });
  if (!v.length) throw new Arret('La table de correspondance des colonnes est vide.');
  return v.map(function (x) { return { source: String(x[0]).trim(), cible: String(x[1]).trim(), celluleTotal: String(x[2]).trim() }; });
}

function ouvrirMemoire(dossier, reference) {
  var t = trouverDansDossier(dossier, PARAMETRES.memoire);
  if (t) return t;
  t = SpreadsheetApp.create(PARAMETRES.memoire);
  var f = DriveApp.getFileById(t.getId());
  f.moveTo(dossier);
  copierPartages(reference, f);
  t.getSheets()[0].appendRow(['clé finance', 'clé database', 'statut', 'date']);
  return t;
}

function lireMemoire(table) {
  var m = { confirmees: [], rejetees: [] };
  table.getSheets()[0].getDataRange().getValues().slice(1).forEach(function (x) {
    if (x[2] === 'confirmée') m.confirmees.push([x[0], x[1]]);
    if (x[2] === 'rejetée') m.rejetees.push([x[0], x[1]]);
  });
  return m;
}

function ouvrirFichierFinance(mois) {
  var it = DriveApp.getFilesByName(PARAMETRES.prefixeFichierFinance + mois), fichiers = [];
  while (it.hasNext()) fichiers.push(it.next());
  if (fichiers.length !== 1) {
    throw new Arret(fichiers.length + ' fichier(s) « ' + PARAMETRES.prefixeFichierFinance + mois + ' » trouvé(s) (attendu : 1).');
  }
  return SpreadsheetApp.openById(fichiers[0].getId());
}

function nomLibre(dossier, base) {
  var nom = base, v = 1;
  while (dossier.getFilesByName(nom).hasNext() || dossier.getFilesByName(nom + ' (en cours)').hasNext()) {
    v += 1;
    nom = base + ' v' + v;
  }
  return nom;
}

function copierPartages(source, cible) {
  var editeurs = source.getEditors().map(function (u) { return u.getEmail(); }).filter(String);
  var lecteurs = source.getViewers().map(function (u) { return u.getEmail(); }).filter(String);
  if (editeurs.length) cible.addEditors(editeurs);
  if (lecteurs.length) cible.addViewers(lecteurs);
}

function ecrireAnonymise(dossier, mois, fin, db, correspondance) {
  var t = SpreadsheetApp.create(PARAMETRES.prefixeAnonymise + mois);
  var f = DriveApp.getFileById(t.getId());
  f.moveTo(dossier);
  copierPartages(DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId()), f);
  var kpis = correspondance.map(function (c) { return c.source; });
  var s1 = t.getSheets()[0];
  s1.setName('Fichier finance');
  var lignes1 = [['Ligne d’origine', 'Clé', 'Type de contrat'].concat(kpis)].concat(
    fin.map(function (x) { return [x.ligne, x.cle, x.type].concat(kpis.map(function (h) { return x.kpi[h]; })); }));
  s1.getRange(1, 1, lignes1.length, lignes1[0].length).setValues(lignes1);
  var s2 = t.insertSheet('Database');
  var lignes2 = [['Ligne d’origine', 'Clé', 'Type de contrat']].concat(db.map(function (x) { return [x.ligne, x.cle, x.type]; }));
  s2.getRange(1, 1, lignes2.length, 3).setValues(lignes2);
}

function ecrireOngletsMois(ss, res, kpis, mois, nomFinance, nomDatabase) {
  var fMan = ss.insertSheet(ONGLET_A_TRAITER);
  var man = [["N° de ligne d'origine", 'Clé', 'Type de contrat', 'Raison']
    .concat(kpis.map(function (h) { return h + ' (finance)'; })).concat(['Valeur saisie à la main', 'Date de saisie'])]
    .concat(res.aTraiter.map(function (x) {
      return [x.ligne, x.cle || 'donnée manquante', x.type, x.raison]
        .concat(kpis.map(function (h) { return x.kpi ? x.kpi[h] : ''; })).concat(['', '']);
    }));
  fMan.getRange(1, 1, man.length, man[0].length).setValues(man);

  var fConf = ss.insertSheet(ONGLET_CONFIRMER);
  var conf = [EN_TETES_CONFIRMER].concat(res.aConfirmer.map(function (c) {
    return [c.cleFinance, c.cleDatabase, c.niveau, c.ecart, '', 'En attente de confirmation', c.ligneFinance, c.ligneDatabase];
  }));
  fConf.getRange(1, 1, conf.length, conf[0].length).setValues(conf);
  if (res.aConfirmer.length) {
    var regle = SpreadsheetApp.newDataValidation().requireValueInList(['Oui', 'Non'], true).build();
    fConf.getRange(2, 5, res.aConfirmer.length, 1).setDataValidation(regle);
  }

  var fCtl = ss.insertSheet(ONGLET_CONTROLE);
  var ctl = [['KPI', 'Total du bloc', 'Total des lignes', 'Total database', 'Part non rapprochée',
    'Part en attente de confirmation', 'Écart restant', 'Statut']].concat(res.controle.map(function (c) {
    return [c.kpi, c.bloc, c.lignes, c.database, c.nonRapprochees, c.enAttente, c.ecartRestant, c.statut];
  }));
  fCtl.getRange(1, 1, ctl.length, 8).setValues(ctl);
  fCtl.appendRow(['']);
  Object.keys(res.comptages).forEach(function (k) { fCtl.appendRow([k, res.comptages[k]]); });
  fCtl.appendRow(['']);
  fCtl.appendRow(["Date d'exécution", Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm')]);
  fCtl.appendRow(['Fichier finance', nomFinance]);
  fCtl.appendRow(['Mois', mois]);
  fCtl.appendRow(['Version', nomDatabase]);
  fCtl.appendRow(['']);
  fCtl.appendRow(['Validation', res.aConfirmer.length ? 'indisponible : décisions à prendre' : 'possible : cocher la case « Validé »']);
  fCtl.appendRow(['Validé', false, 'Date de validation', '']);
  fCtl.getRange(fCtl.getLastRow(), 2).insertCheckboxes();
}
