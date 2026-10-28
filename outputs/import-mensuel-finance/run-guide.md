# Import Mensuel Finance — Run Card

*Fiche d'utilisation d'une page. Rédigée le 2026-10-28, après le tour de test 2 (verdict « prêt », 153 lignes sur 153). Elle ne contient aucune donnée réelle.*

## Your first real run

**Premier lancement : démonstration sur un mois fictif réaliste (Novembre 2026), le 2026-10-29, devant l'enseignante.** Fichier `inputs/jeu-fictif/demo/…Novembre 2026 (FICTIF - démo).xlsx` et mémoire des décisions justes d'octobre ; attendu : 382 à 100 %, 2 à confirmer, 15 à traiter à la main, totaux OK. Démo dans Google Sheets (compte personnel, programme Apps Script, fichiers fictifs) : `demo-google-sheets/GUIDE.md` ; solution de secours avec la skill Claude : `deroule-demo.md`.

**Répétition faite le 2026-10-28 dans Google Sheets** (compte personnel, données fictives) : 382 / 2 / 15, contrôle OK, 2 « Oui » pris en compte, validation possible — le programme Apps Script fonctionne dans un vrai Google Sheets. Seul souci, réglé : le nom du fichier « Mémoire des correspondances » importé depuis un Mac n'était pas reconnu (accent) ; il a suffi de retaper le nom.

**Lancement sur données réelles** — pas encore fait : le premier lancement réel se fait par Baptiste dans le Google Workspace d'Airbus, jamais dans Claude, d'abord sur des copies fictives puis sur la clôture de **novembre 2026** (fichier finance reçu vers le 15 novembre). Ce jour-là, il permettra aussi de vérifier ce que les tests n'ont pas pu voir : fichiers « Anonymisé – … » créés, database du mois dans le même dossier avec les mêmes partages, rien qui sorte du Workspace.

**À faire une seule fois, avant le premier lancement :**
1. Obtenir l'accord du tuteur ou de l'informatique d'Airbus pour utiliser Apps Script.
2. Dans le dossier Google Drive de la database centrale, créer la `Table de correspondance des colonnes` (en-têtes uniquement, aucun montant) et le `Référentiel des contrats multiservices` (aide-mémoire, jamais lu par le programme).
3. Écrire le code `MS-001`, `MS-002`… dans la colonne WBS des multiservices de la database centrale, et demander à la finance de faire de même dans son fichier.
4. Ouvrir la database centrale → **Extensions → Apps Script** → coller `Code.gs`, `Rapprochement.gs` et `appsscript.json` (dossier `outputs/import-mensuel-finance/apps-script/` du dépôt), enregistrer, recharger, accepter les autorisations.
5. **Essai à blanc** : importer dans un dossier de test du Workspace les fichiers fictifs de `inputs/jeu-fictif/`, lancer l'import d'Octobre 2026 et vérifier **370 / 15 / 13**, totaux OK. Ensuite seulement, passer aux vraies données.

Le détail de chaque étape est dans `build-notes.md`, section « Guide de déploiement ».

## How to start it

Chaque mois, à réception du fichier `Xbh Contracts Financial performance : [Mois] [Année]` :
1. Ouvrir la database centrale `Database Hcare XBH in service contracts`.
2. Menu **Import mensuel finance → Lancer l'import**, puis saisir le mois en français, avec majuscule et accents : `Novembre 2026`.
3. Attendre le message « database prête à valider » avec les comptages. Aucune autre action n'est demandée avant.

Ce workflow se lance à la main, sur votre ordre : il n'est pas programmé. Si vous voulez plus tard un lancement automatique, revenez à cette étape.

Pour simuler ou tester sur données fictives (après une modification du programme, par exemple), ouvrir une nouvelle session Claude Code sur le dépôt et écrire : `/mon-import-mensuel-finance lance les tests` ou `simule l'import de [mois] (fichiers fictifs)`.

## What to have ready

- Le fichier finance du mois, au bon nom, avec un seul onglet, les en-têtes en ligne 19 et les contrats à partir de la ligne 20.
- La database centrale à jour : nouveaux contrats ajoutés et codes `MS-…` des multiservices dans la colonne WBS.
- Dans le dossier de la database centrale : `Table de correspondance des colonnes`, `Référentiel des contrats multiservices` et `Mémoire des correspondances` (créée toute seule au premier lancement).
- Le programme Apps Script installé dans la database centrale, avec les autorisations acceptées (Sheets, Drive, interface).
- Aucune donnée réelle ne passe par Claude ni par GitHub.

## What to check before you act on the output

- **Correspondances à confirmer (G1)** : pour chaque ligne, écrire « Oui » ou « Non » dans la colonne Décision. **Vérifier le contrat avant un « Oui » de confiance « Moyenne » ou « Faible »** : au test, un « faux ami » (deux contrats différents aux WBS proches) a été confirmé trois fois. Puis **Import mensuel finance → Prendre en compte mes décisions**.
- **À traiter à la main** : saisir si besoin les valeurs avec leur date (contrats inconnus, multiservices sans code, doublons, valeurs non numériques…).
- **Arrêt (G2)** : si le programme s'arrête (mauvais mois, en-tête renommé, plusieurs onglets, ligne « Total »…), il n'a rien créé ; corriger le fichier et relancer.
- **Avant de connecter le dashboard Looker Studio**, deux points obligatoires dans l'onglet « Contrôle » : aucune ligne oubliée (lignes finance = rapprochées + à traiter) et statut **OK** sur chaque KPI. Puis cocher **Validé** avec la date.

## Log the run

Après chaque clôture réelle, ajouter **une ligne** dans `outputs/import-mensuel-finance/runs.md`, section « Lancements réels » : date, mois, comptages (100 % / à confirmer / à traiter), temps passé, retouches (aucune / un peu / beaucoup), remarques. **Jamais de montant, de nom de client ni de WBS réel** dans ce fichier. Le programme Apps Script, lui, trace déjà chaque exécution dans l'onglet « Contrôle » de la database du mois, à l'intérieur du Workspace. Dix secondes par mois : c'est la preuve dont votre premier bilan aura besoin (temps gagné, lignes oubliées, correspondances à confirmer en baisse).

## Your first review

**Le 29 janvier 2027**, après trois clôtures réelles (novembre, décembre, janvier), le temps nécessaire pour lire la mesure (3) « correspondances à confirmer en baisse d'un mois sur l'autre ».
Ce jour-là, ou plus tôt si les résultats demandent de plus en plus de retouches, ouvrir une nouvelle conversation et dire : **« Lance la skill improve sur Import Mensuel Finance. »** Rien à préparer : les résultats de test et le journal `runs.md` suffisent.
