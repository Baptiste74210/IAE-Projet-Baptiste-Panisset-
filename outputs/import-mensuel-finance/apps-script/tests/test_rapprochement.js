// Vérifie que Rapprochement.gs donne exactement les mêmes résultats que le programme Python de référence.
// À lancer depuis la racine du dépôt :
//   python3 -I outputs/import-mensuel-finance/apps-script/tests/exporter_jeu.py /tmp/jeu.json
//   node outputs/import-mensuel-finance/apps-script/tests/test_rapprochement.js /tmp/jeu.json
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const code = fs.readFileSync(path.join(__dirname, '..', 'Rapprochement.gs'), 'utf8');
const ctx = { module: { exports: {} } };
vm.createContext(ctx);
vm.runInContext(code, ctx);
const R = ctx.module.exports;

const scenarios = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
let echecs = 0;
function verifier(nom, ok, detail) {
  console.log(`${ok ? 'Conforme    ' : 'NON CONFORME'} ${nom}${ok ? '' : ' — ' + detail}`);
  if (!ok) echecs += 1;
}
const egal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

for (const s of scenarios) {
  const e = s.entree, att = s.attendu;
  const res = R.rapprocher(e.fin, e.db, e.memoire, e.kpis, e.bloc);
  const ctrlJs = res.controle.map(c => [c.kpi, c.bloc, c.lignes, c.database, c.nonRapprochees, c.enAttente, c.ecartRestant, c.statut]);
  console.log(`== ${s.scenario}`);
  verifier('comptages', egal(res.comptages, att.counts), JSON.stringify(res.comptages));
  const mJs = Object.keys(res.matches).map(Number).sort((a, b) => a - b)
    .map(k => ({ ligne: k, cle_finance: res.fin.find(x => x.ligne === k).cle, cle_db: res.matches[k].db.cle,
      niveau: res.matches[k].niveau, ecart: res.matches[k].ecart }));
  verifier('rapprochements et niveaux de confiance', egal(mJs, att.matches), JSON.stringify(mJs));
  const tJs = res.aTraiter.map(x => [String(x.ligne), x.cle, x.raison]);
  const tPy = att.a_traiter.map(x => [x.ligne, x.cle, x.raison]);
  verifier('lignes à traiter à la main et raisons', egal(tJs, tPy), JSON.stringify(tJs));
  const ctrlOk = ctrlJs.every((c, i) => c.every((v, j) => typeof v === 'number'
    ? Math.abs(v - att.controle[i][j]) <= 0.005 : v === att.controle[i][j]));
  verifier('contrôle des totaux', ctrlOk, JSON.stringify(ctrlJs));
}

// Étape 8 : décisions de E5 tirées de la mémoire E6 (confirmée → Oui, rejetée → Non), puis relance.
const e5 = scenarios.find(s => s.scenario === 'E5'), e6 = scenarios.find(s => s.scenario === 'E6');
const bonnes = {};
e6.entree.memoire.confirmees.forEach(p => { bonnes[p[0]] = 'Oui'; });
e6.entree.memoire.rejetees.forEach(p => { bonnes[p[0]] = 'Non'; });
const r5 = R.rapprocher(e5.entree.fin, e5.entree.db, e5.entree.memoire, e5.entree.kpis, e5.entree.bloc);
const lignes = r5.aConfirmer.map(c => ({ cleFinance: c.cleFinance, cleDatabase: c.cleDatabase, niveau: c.niveau,
  decision: bonnes[c.cleFinance], statut: 'En attente de confirmation' }));
const dec = R.preparerDecisions(lignes, '2026-10-27');
console.log('== Chaîne E5 → décisions → relance');
const memAttendue = e6.entree.memoire.confirmees.map(p => p.concat('confirmée')).concat(e6.entree.memoire.rejetees.map(p => p.concat('rejetée')));
const trier = l => l.map(x => x.join('|')).sort();
verifier('mémoire produite = mémoire E6', egal(trier(dec.memoire.map(m => m.slice(0, 3))), trier(memAttendue)), JSON.stringify(dec.memoire));
verifier('aucune décision manquante', dec.manquantes.length === 0, JSON.stringify(dec.manquantes));
const memoire = { confirmees: dec.memoire.filter(m => m[2] === 'confirmée').map(m => [m[0], m[1]]),
  rejetees: dec.memoire.filter(m => m[2] === 'rejetée').map(m => [m[0], m[1]]) };
const relance = R.rapprocher(e5.entree.fin, e5.entree.db, memoire, e5.entree.kpis, e5.entree.bloc);
verifier('relance identique à E6', egal(relance.comptages, e6.attendu.counts), JSON.stringify(relance.comptages));
const vide = R.preparerDecisions(lignes.map(l => Object.assign({}, l, { decision: '' })), '2026-10-27');
verifier('décisions vides → restent en attente', vide.actions.length === 0 && vide.manquantes.length === lignes.length, JSON.stringify(vide.manquantes.length));

console.log(echecs ? `\n${echecs} vérification(s) non conforme(s).` : '\nToutes les vérifications sont conformes.');
process.exit(echecs ? 1 : 0);
