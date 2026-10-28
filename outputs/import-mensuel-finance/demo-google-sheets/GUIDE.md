# Démo Google Sheets — Import Mensuel Finance (données fictives)

But : montrer, dans Google Sheets, que le programme transforme le fichier finance du mois en database du mois, avec le contrôle des totaux, sans aucune donnée Airbus. À faire dans **votre compte Google personnel**, jamais dans le Workspace Airbus.

Durée : environ 20 minutes d'installation, **à faire une fois aujourd'hui** (répétition), puis 10 minutes de démo demain.

## A. Installation (une seule fois)

1. **Créer un dossier** dans votre Google Drive personnel : `Démo Import Mensuel Finance`.
2. **Activer la conversion** : Google Drive → ⚙ Paramètres → cocher « Convertir les fichiers importés au format de l'éditeur Google Docs ».
3. **Importer les 4 fichiers** du dossier `1-a-importer-dans-google-drive/` dans ce dossier (Nouveau → Importer des fichiers). Ils deviennent des Google Sheets.
4. **Renommer exactement** (clic droit → Renommer) :

   | Fichier importé | Nom exact à donner |
   |---|---|
   | Database Hcare XBH in service contracts | `Database Hcare XBH in service contracts` (rien à changer) |
   | Xbh Contracts Financial performance - Novembre 2026 | `Xbh Contracts Financial performance : Novembre 2026` (remplacer « - » par « : ») |
   | Table de correspondance des colonnes | rien à changer |
   | Mémoire des correspondances | rien à changer |

   **Important (Mac) :** pour `Mémoire des correspondances`, **retapez le nom au clavier** même s'il paraît juste : importé depuis un Mac, le « é » peut être encodé autrement et le programme ne trouve pas le fichier (il en crée alors un vide, et le résultat devient 368 / 17 / 14 au lieu de 382 / 2 / 15).
   Vérifier qu'il n'existe **aucun autre fichier** portant le nom du fichier finance ailleurs dans votre Drive (le programme le cherche dans tout le Drive).
5. **Installer le programme** : ouvrir `Database Hcare XBH in service contracts` → **Extensions → Apps Script**.
   - Remplacer le contenu de `Code.gs` par celui du fichier `apps-script/Code.gs` du dépôt.
   - **+** → Script → nommer `Rapprochement` → coller `apps-script/Rapprochement.gs`.
   - ⚙ Paramètres du projet → cocher « Afficher le fichier manifeste appsscript.json » → ouvrir `appsscript.json` et coller `apps-script/appsscript.json`.
   - 💾 Enregistrer.
6. **Recharger** l'onglet de la database : le menu **Import mensuel finance** apparaît à droite d'« Aide ».
7. **Premier clic** sur un élément du menu : Google demande les autorisations. Comme c'est votre propre programme, il affiche « Google n'a pas validé cette application » → **Paramètres avancés → Accéder à … (non sécurisé)** → Autoriser. C'est normal pour un script personnel.

## B. Répétition (aujourd'hui) — puis démo (demain)

| # | Action | Ce qui doit apparaître |
|---|---|---|
| 1 | Ouvrir le fichier finance `Xbh Contracts Financial performance : Novembre 2026` | 399 contrats, bloc de totaux lignes 1 à 18, colonne client en codes neutres |
| 2 | Dans la database centrale : **Import mensuel finance → Lancer l'import**, taper `Novembre 2026` | Message « Database prête à valider » : **382 lignes à 100 %, 2 correspondances à confirmer, 15 lignes non rapprochées, contrôle OK** |
| 3 | Ouvrir le lien du message : `Database XBH Novembre 2026` | Onglets Database (KPI remplis), À traiter à la main, Correspondances à confirmer, Contrôle |
| 4 | Montrer le dossier | Nouveaux fichiers : `Database XBH Novembre 2026` et `Anonymisé – Novembre 2026` (clé, type, KPI : aucun nom de client) |
| 5 | Onglet **Correspondances à confirmer** : écrire `Oui` en colonne E pour `FH.YXSBL` et `FH.SHPKH` | — |
| 6 | Dans la database du mois : **Import mensuel finance → Prendre en compte mes décisions** | « 2 confirmée(s), 0 rejetée(s), 0 sans décision — Contrôle OK — Validation possible » ; la Mémoire reçoit 2 lignes |
| 7 | Onglet **Contrôle** | Totaux bloc = lignes = database + non rapprochées, statut OK ; 384 à 100 % |

Si vous relancez « Prendre en compte mes décisions » une deuxième fois, le message affiche « 0 confirmée(s), 0 rejetée(s) » : c'est normal, les décisions déjà prises ne sont jamais appliquées deux fois (bon point à montrer).

**Pour rejouer la démo demain à l'identique :** dans le dossier, renommer (ou mettre à la corbeille) `Database XBH Novembre 2026` et `Anonymisé – Novembre 2026` créés pendant la répétition, et supprimer dans `Mémoire des correspondances` les 2 lignes ajoutées (`FH.YXSBL`, `FH.SHPKH`). Sinon, le programme crée simplement `… v2` (c'est aussi une démonstration : il n'écrase jamais rien).

## Si quelque chose ne marche pas

Notez le message exact affiché (ou, dans Apps Script, **Exécutions** → le message d'erreur) et collez-le dans la conversation avec Claude : la répétition d'aujourd'hui sert à corriger cela avant demain. Ne collez jamais de vraies données.
