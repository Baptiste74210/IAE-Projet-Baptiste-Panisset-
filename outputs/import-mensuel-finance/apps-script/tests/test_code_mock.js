// Teste Code.gs avec un faux Google Sheets / Google Drive, sur le jeu fictif de référence (aucun accès Google).
// À lancer depuis la racine du dépôt :
//   python3 -I outputs/import-mensuel-finance/apps-script/tests/exporter_brut.py /tmp/brut.json
//   node outputs/import-mensuel-finance/apps-script/tests/test_code_mock.js /tmp/brut.json
const fs = require('fs'), path = require('path'), vm = require('vm');
const brut = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
let idSeq = 0; const fichiers = {}; const alertes = [];

class Plage {
  constructor(f, r, c, nr = 1, nc = 1) { Object.assign(this, { f, r, c, nr, nc }); }
  getValue() { return this.f.get(this.r, this.c); }
  getValues() { const o = []; for (let i = 0; i < this.nr; i++) { const l = []; for (let j = 0; j < this.nc; j++) l.push(this.f.get(this.r + i, this.c + j)); o.push(l); } return o; }
  setValue(v) { this.f.set(this.r, this.c, v); return this; }
  setValues(v) { v.forEach((l, i) => l.forEach((x, j) => this.f.set(this.r + i, this.c + j, x))); return this; }
  clearContent() { this.f.set(this.r, this.c, ''); return this; }
  setDataValidation() { return this; }
  insertCheckboxes() { return this; }
}
class Feuille {
  constructor(nom, data) { this.nom = nom; this.d = (data || []).map(l => l.slice()); }
  get(r, c) { const l = this.d[r - 1]; return l && l[c - 1] !== undefined ? l[c - 1] : ''; }
  set(r, c, v) { while (this.d.length < r) this.d.push([]); const l = this.d[r - 1]; while (l.length < c) l.push(''); l[c - 1] = v; }
  getName() { return this.nom; } setName(n) { this.nom = n; }
  getLastRow() { return this.d.length; }
  getLastColumn() { return Math.max(0, ...this.d.map(l => l.length)); }
  getDataRange() { return new Plage(this, 1, 1, this.getLastRow(), this.getLastColumn()); }
  getRange(a, b, c, d) {
    if (typeof a === 'string') { const m = a.match(/^([A-Z]+)(\d+)$/); return new Plage(this, +m[2], m[1].charCodeAt(0) - 64); }
    return new Plage(this, a, b, c || 1, d || 1);
  }
  appendRow(v) { this.d.push(v.slice()); }
}
class Classeur {
  constructor(nom, feuilles) { this.id = 'id' + (++idSeq); this.feuilles = feuilles; this.fichier = new Fichier(nom, this); fichiers[this.id] = this.fichier; }
  getId() { return this.id; } getUrl() { return 'https://docs.google.com/' + this.id; } getName() { return this.fichier.nom; }
  getSheets() { return this.feuilles; }
  getSheetByName(n) { return this.feuilles.find(f => f.nom === n) || null; }
  insertSheet(n) { const f = new Feuille(n); this.feuilles.push(f); return f; }
}
class Fichier {
  constructor(nom, classeur) { Object.assign(this, { nom, classeur, dossier: null, editeurs: ['baptiste@airbus.test'], lecteurs: ['service@airbus.test'] }); }
  getId() { return this.classeur.id; } getName() { return this.nom; } setName(n) { this.nom = n; return this; }
  getParents() { const d = this.dossier; return { next: () => d, hasNext: () => !!d }; }
  moveTo(d) { this.dossier = d; return this; }
  makeCopy(nom, d) {
    const c = new Classeur(nom, this.classeur.feuilles.map(f => new Feuille(f.nom, f.d)));
    c.fichier.dossier = d; c.fichier.editeurs = []; c.fichier.lecteurs = []; return c.fichier;
  }
  getEditors() { return this.editeurs.map(e => ({ getEmail: () => e })); }
  getViewers() { return this.lecteurs.map(e => ({ getEmail: () => e })); }
  addEditors(l) { this.editeurs.push(...l); } addViewers(l) { this.lecteurs.push(...l); }
}
const dossier = { getFilesByName: n => { const l = Object.values(fichiers).filter(f => f.dossier === dossier && f.nom === n); let i = 0; return { hasNext: () => i < l.length, next: () => l[i++] }; } };
function classeur(nom, data, dans = dossier) { const c = new Classeur(nom, [new Feuille('Feuille 1', data)]); c.fichier.dossier = dans; return c; }

const centrale = classeur('Database Hcare XBH in service contracts', brut.database);
const finance = classeur('Xbh Contracts Financial performance : Octobre 2026', brut.finance, { autre: true });
classeur('Table de correspondance des colonnes', brut.correspondance);
classeur('Table de pseudonymisation multiservices', brut.pseudo);
const instantCentrale = JSON.stringify(centrale.feuilles[0].d), instantFinance = JSON.stringify(finance.feuilles[0].d);
let actif = centrale;

const ctx = {
  console, Math, JSON, Object, String, RegExp, Date, Number, isFinite,
  SpreadsheetApp: {
    getActiveSpreadsheet: () => actif, openById: id => fichiers[id].classeur, flush: () => {},
    create: nom => { const c = new Classeur(nom, [new Feuille('Feuille 1')]); return c; },
    newDataValidation: () => ({ requireValueInList() { return this; }, build() { return {}; } }),
    getUi: () => ({ alert: (t, m) => alertes.push(t + ' : ' + m) })
  },
  DriveApp: {
    getFileById: id => fichiers[id],
    getFilesByName: n => { const l = Object.values(fichiers).filter(f => f.nom === n); let i = 0; return { hasNext: () => i < l.length, next: () => l[i++] }; }
  },
  Utilities: { formatDate: () => '2026-10-27' }, Session: { getScriptTimeZone: () => 'Europe/Paris' }
};
vm.createContext(ctx);
const dir = path.join(__dirname, '..');
vm.runInContext(fs.readFileSync(path.join(dir, 'Rapprochement.gs'), 'utf8') + '\n' + fs.readFileSync(path.join(dir, 'Code.gs'), 'utf8')
  + '\nthis.executerImport = executerImport; this.executerDecisions = executerDecisions; this.Arret = Arret;', ctx);

let echecs = 0;
const v = (nom, ok, det) => { console.log(`${ok ? 'Conforme    ' : 'NON CONFORME'} ${nom}${ok ? '' : ' — ' + det}`); if (!ok) echecs++; };

// 1. Import
const C = brut.corrige, E5 = C.E5, E6 = C.E6;
const attenteE5 = E5['En attente – Élevée'] + E5['En attente – Moyenne'] + E5['En attente – Faible'];
const t0 = Date.now();
const r1 = ctx.executerImport('Octobre 2026');
console.log(`(import de ${C.lignes_finance} lignes en ${Date.now() - t0} ms dans le faux Google Sheets)`);
v('nom de la database du mois', r1.nom === 'Database XBH Octobre 2026', r1.nom);
v(`comptages ${E5['100 %']} / ${attenteE5} / ${E5['Non rapprochées']}`, r1.comptages['100 %'] === E5['100 %'] && r1.enAttente === attenteE5 && r1.comptages['Non rapprochées'] === E5['Non rapprochées'], JSON.stringify(r1));
v('contrôle des totaux OK', r1.statutControle === 'OK', r1.statutControle);
const mois = Object.values(fichiers).find(f => f.nom === 'Database XBH Octobre 2026').classeur;
v('partages recopiés', JSON.stringify(mois.fichier.editeurs) === '["baptiste@airbus.test"]' && mois.fichier.lecteurs.length === 1, JSON.stringify(mois.fichier.editeurs));
v('4 onglets', mois.feuilles.map(f => f.nom).join('|') === 'Feuille 1|À traiter à la main|Correspondances à confirmer|Contrôle', mois.feuilles.map(f => f.nom).join('|'));
const anon = Object.values(fichiers).find(f => f.nom === 'Anonymisé – Octobre 2026').classeur;
const texteAnon = JSON.stringify(anon.feuilles.map(f => f.d));
const fuite = brut.clients.concat(brut.pays, ['Europe', 'NORAM', 'LATAM', 'APAC', 'AFME']).filter(n => texteAnon.includes(n));
v('aucun nom de client, pays ou région dans le fichier anonymisé', fuite.length === 0, fuite.slice(0, 5).join(', '));
const fMoisDb = mois.feuilles[0].d, hDb = fMoisDb[0];
const totalDb = h => fMoisDb.slice(1).reduce((a, l) => typeof l[hDb.indexOf(h)] === 'number' ? a + l[hDb.indexOf(h)] : a, 0);
v('total Turnover de la database = corrigé', Math.abs(totalDb('Turnover') - C.database_E5['Turnover (€)']) <= 0.01, totalDb('Turnover'));
v('database centrale inchangée', JSON.stringify(centrale.feuilles[0].d) === instantCentrale, '');
v('fichier finance inchangé', JSON.stringify(finance.feuilles[0].d) === instantFinance, '');

// 2. Relance → nouvelle version, sans écraser
const r2 = ctx.executerImport('Octobre 2026');
v('relance → version v2', r2.nom === 'Database XBH Octobre 2026 v2', r2.nom);

// 3. Arrêts
let arret = '';
try { ctx.executerImport('octobre 2026'); } catch (e) { arret = e.message; }
v('mois mal écrit → arrêt', /mal écrit/.test(arret), arret);
try { ctx.executerImport('Novembre 2026'); } catch (e) { arret = e.message; }
v('fichier finance du mois absent → arrêt', /0 fichier/.test(arret), arret);

// 4. Décisions (étape 8) dans la database du mois
actif = mois;
const conf = mois.getSheetByName('Correspondances à confirmer');
const bonnes = {}; C.a_confirmer_E5.forEach(a => { bonnes[a.cle_finance] = a.bonne_decision; });
conf.d.slice(1).forEach((l, i) => { conf.set(i + 2, 5, bonnes[l[0]]); });
const nOui = C.a_confirmer_E5.filter(a => a.bonne_decision === 'Oui').length, nNon = C.a_confirmer_E5.length - nOui;
const r3 = ctx.executerDecisions();
v(`${nOui} Oui, ${nNon} Non, 0 manquante`, r3.oui === nOui && r3.non === nNon && r3.manquantes === 0, JSON.stringify(r3));
v('contrôle OK après décisions', r3.statut === 'OK' && r3.validation === 'possible', JSON.stringify(r3));
const ctl = mois.getSheetByName('Contrôle').d;
const val = lab => (ctl.find(l => l[0] === lab) || [])[1];
v(`comptages ${E6['100 %']} / 0 / ${E6['Non rapprochées']} après décisions`, val('100 %') === E6['100 %'] && val('En attente – Élevée') === 0 && val('En attente – Moyenne') === 0 && val('Non rapprochées') === E6['Non rapprochées'], JSON.stringify(ctl.slice(6, 12)));
const mem = Object.values(fichiers).find(f => f.nom === 'Mémoire des correspondances').classeur.feuilles[0].d;
const trier = l => l.map(x => x.slice(0, 3).join('|')).sort();
v(`mémoire : ${nOui} confirmées, ${nNon} rejetée(s), identique à la mémoire E6`, JSON.stringify(trier(mem.slice(1))) === JSON.stringify(trier(brut.memoire_e6.slice(1))), JSON.stringify(mem.slice(1, 3)));
const r4 = ctx.executerDecisions();
v('nouvelle prise en compte sans effet', r4.oui === 0 && r4.non === 0, JSON.stringify(r4));

// 5. Mois suivant simulé : relance depuis la centrale avec la mémoire
actif = centrale;
const r5 = ctx.executerImport('Octobre 2026');
v(`relance avec mémoire → ${E6['100 %']} / 0 / ${E6['Non rapprochées']} (comme E6)`, r5.comptages['100 %'] === E6['100 %'] && r5.enAttente === 0 && r5.comptages['Non rapprochées'] === E6['Non rapprochées'], JSON.stringify(r5));

console.log(echecs ? `\n${echecs} vérification(s) non conforme(s).` : '\nToutes les vérifications de Code.gs sont conformes.');
process.exit(echecs ? 1 : 0);
