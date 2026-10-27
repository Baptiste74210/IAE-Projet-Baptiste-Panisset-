# Build notes — Import Mensuel Finance

**Date :** 2026-10-27 · **Design spec :** `design-spec.md` (v2, approuvé) · **Requirements :** `requirements.md` (v2)

## Ce qui a été construit

| Build Output (from spec) | Artifact | Path | Status |
|---|---|---|---|
| New skill: S1 (orchestrateur de simulation et de maintenance) | `mon-import-mensuel-finance` + programme Python de référence | `.claude/skills/mon-import-mensuel-finance/SKILL.md` et `scripts/import_mensuel.py` | Created |
| Handled by orchestrator — Steps 1 à 6 (production) | Programme Apps Script : menu « Lancer l'import » | `outputs/import-mensuel-finance/apps-script/Code.gs` + `Rapprochement.gs` | Created |
| Human (no artifact) — Step 7 | Colonne « Décision » et case « Validé » dans la database du mois | — | — |
| Handled by orchestrator — Step 8 (production) | Programme Apps Script : menu « Prendre en compte mes décisions » | `outputs/import-mensuel-finance/apps-script/Code.gs` + `Rapprochement.gs` | Created |
| Handled by orchestrator — Step 8 (simulation) | Mode `decisions` du programme Python | `.claude/skills/mon-import-mensuel-finance/scripts/import_mensuel.py` | Created |
| Use existing: xlsx | Écriture des fichiers Excel de simulation (via openpyxl) | skill intégrée | Reused |
| Connector: Google Sheets (natif Apps Script) | SpreadsheetApp | autorisation au premier lancement | Installed by you |
| Connector: Google Drive (natif Apps Script) | DriveApp | autorisation au premier lancement | Installed by you |
| Connector: Node.js (tests) | `tests/test_rapprochement.js`, `tests/test_code_mock.js` | `outputs/import-mensuel-finance/apps-script/tests/` | Created |
| Autorisations | `appsscript.json` (Sheets, Drive, interface du Sheet uniquement) | `outputs/import-mensuel-finance/apps-script/appsscript.json` | Created |

**Écart assumé par rapport au design :** le design prévoyait une skill nommée `import-mensuel-finance` partageant son code JavaScript avec Apps Script. La skill de Baptiste `mon-import-mensuel-finance` existait déjà, avec un programme Python testé : elle tient le rôle de S1 pour éviter un doublon. Le programme Python est la **référence** ; `Rapprochement.gs` en est la traduction, et les tests vérifient que les deux donnent exactement les mêmes résultats.

## Résultats des tests (données fictives)

| Test | Commande (depuis la racine du dépôt) | Résultat |
|---|---|---|
| Programme Python : E5, E6 (E7 inclus dans E5), chaîne E5 → décisions → relance, sur le jeu fictif de référence (400 contrats) | `python3 -I .claude/skills/mon-import-mensuel-finance/scripts/import_mensuel.py tests` | Conforme au corrigé : E5 370/15/13, E6 384/0/14, chaîne identique à E6 ; environ 8 secondes |
| `Rapprochement.gs` contre le programme Python | `python3 -I outputs/import-mensuel-finance/apps-script/tests/exporter_jeu.py /tmp/jeu.json` puis `node outputs/import-mensuel-finance/apps-script/tests/test_rapprochement.js /tmp/jeu.json` | 14 vérifications conformes (E5, E6, chaîne) |
| `Code.gs` avec un faux Google Sheets | `python3 -I outputs/import-mensuel-finance/apps-script/tests/exporter_brut.py /tmp/brut.json` puis `node outputs/import-mensuel-finance/apps-script/tests/test_code_mock.js /tmp/brut.json` | 18 vérifications conformes sur 398 lignes : import, partages, anonymisation sans nom de client, entrées inchangées, version v2, arrêts, décisions, mémoire, mois suivant |

**Limite :** `Code.gs` n'a pas encore tourné dans un vrai Google Workspace ; le faux Google Sheets imite les fonctions utilisées, mais le premier lancement réel doit se faire sur une copie fictive (voir ci-dessous).

## Guide de déploiement dans le Google Workspace Airbus

**Avant de commencer :** confirmer avec le tuteur ou l'informatique d'Airbus qu'Apps Script est autorisé.

1. **Créer les deux tables** dans le dossier Google Drive de la database centrale :
   - `Table de correspondance des colonnes` — un Google Sheet avec en ligne 1 : `Colonne finance` | `Colonne database` | `Cellule du total`, puis une ligne par KPI (en-tête exact du fichier finance, en-tête exact de la database, cellule du total dans le bloc, ex. `F5`). Aucun montant.
   - `Table de pseudonymisation multiservices` — un Google Sheet avec en ligne 1 : `Client` | `Code MS`, puis une ligne par contrat multiservices (`MS-001`, `MS-002`…). Ce fichier ne sort jamais du Workspace.
   - La `Mémoire des correspondances` est créée automatiquement au premier lancement.
2. **Vérifier les paramètres** en haut de `Code.gs` (bloc `PARAMETRES`) : noms exacts des colonnes WBS, client et type de contrat dans le fichier finance et dans la database, ligne des en-têtes (19), première ligne de contrats (20).
3. **Coller le programme** : ouvrir la database centrale → **Extensions → Apps Script** → créer trois fichiers et y coller `Code.gs`, `Rapprochement.gs` et `appsscript.json` (pour ce dernier : **Paramètres du projet → Afficher le fichier manifeste**). Enregistrer.
4. **Recharger** la database centrale : le menu **Import mensuel finance** apparaît. Au premier clic, Google demande les autorisations (Sheets, Drive, interface) : les accepter.
5. **Premier essai sur des copies fictives** : importer dans Google Sheets les fichiers du dossier `inputs/jeu-fictif/` (fichier finance, database, `table-pseudonymisation-multiservices (FICTIF).csv`, `table-correspondance-colonnes (FICTIF).csv`), les placer dans un dossier de test sous les noms attendus (`Xbh Contracts Financial performance : Octobre 2026`, `Database Hcare XBH in service contracts`, `Table de pseudonymisation multiservices`, `Table de correspondance des colonnes`), coller le programme dans la database fictive, lancer l'import d'Octobre 2026 et vérifier 370 / 15 / 13 comme dans le corrigé.
6. **Utilisation réelle, chaque mois :**
   1. à réception du fichier finance, ouvrir la database centrale → **Import mensuel finance → Lancer l'import** → saisir le mois (« Novembre 2026 ») ;
   2. ouvrir la database du mois créée, remplir « Oui » ou « Non » dans l'onglet « Correspondances à confirmer », traiter si besoin « À traiter à la main » ;
   3. **Import mensuel finance → Prendre en compte mes décisions** (le menu est aussi présent dans la database du mois) ;
   4. vérifier l'onglet « Contrôle », puis cocher **Validé** et la date avant de connecter le dashboard.

## Ce qui reste à faire

- Obtenir l'autorisation Apps Script et faire le premier essai réel sur copies fictives (étape 5 du guide).
- Créer les vraies tables C3 et C5 (étape 1 du guide).
- Étape suivante du cours : **Test** (Step 5) sur les scénarios E1 à E7.

**Jeu fictif :** depuis le 2026-10-27, le seul jeu de référence est celui de 400 contrats (`inputs/jeu-fictif/`, régénérable avec `generer_jeu_fictif.py`) ; le premier jeu de 12 contrats et ses résultats sont archivés dans `inputs/archive-v1/` et `runs/archive-v1/`.
