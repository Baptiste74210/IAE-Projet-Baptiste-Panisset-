# Import Mensuel Finance — Workflow Requirements

## Goal
Chaque mois, vers le 15, à réception du fichier finance `Xbh Contracts Financial performance : [Mois] [Année]`, le workflow crée la database mensuelle `Database XBH [Mois] [Année]` à partir de la database centrale et y importe les KPI financiers de chaque contrat rapproché par WBS exact. Il produit aussi un onglet « À traiter à la main » qui liste tous les contrats non rapprochés, et un onglet « Contrôle » qui compare les totaux de chaque KPI avec le fichier finance. Baptiste Panisset (PMO, service ESXCC, Airbus Helicopters) valide la database avant qu'elle alimente le dashboard Looker Studio HCare utilisé par l'ensemble du service.

## Value & Measurement

| Field | Value |
|---|---|
| Business Objective | Gagner du temps et sécuriser la transmission des données qui alimentent le dashboard financier HCare du service |
| Desired Outcome | Dès réception du fichier finance, la database du mois est constituée rapidement et sans erreur de transfert ; le service dispose plus tôt d'un dashboard dont les chiffres sont garantis conformes au fichier finance |
| Measure | (1) Temps entre la réception du fichier finance et la validation de la database du mois · (2) Nombre de contrats oubliés et d'écarts de totaux inexpliqués par clôture |
| Baseline | (1) 1 à 2 jours de travail par clôture · Estimated · (2) Unknown — must measure before go-live |
| Target | (1) Une matinée de travail, traitement manuel des WBS divergents et des multiservices inclus · (2) 0 contrat oublié et 0 écart de total inexpliqué à chaque clôture |
| Readable When | Dès la première clôture mensuelle suivant la mise en service (fichier finance reçu vers le 15 du mois) |

Notes:
- `Baseline: Unknown` is a legitimate value, recorded as `Unknown — must measure before go-live`. An invented baseline is worse than none, because it makes a false improvement provable.
- Measure quantifies Desired Outcome; it does not replace it. If the outcome could be deleted without the measure becoming ambiguous, the outcome was written too thinly.
- On the Individual lens the Business Objective may be personal — "get my Fridays back" is a strategic objective for a person.

## Metadata

| Field | Value |
|---|---|
| Workflow Name | Import Mensuel Finance |
| Description | Importe les KPI du fichier finance mensuel dans une copie mensuelle de la database centrale, par rapprochement exact des WBS, avec liste des cas à traiter à la main et contrôle des totaux |
| Trigger | Réception du Google Sheet `Xbh Contracts Financial performance : [Mois] [Année]` (vers le 15 du mois) ; lancement manuel par Baptiste, qui indique le mois et l'année à traiter |
| Owner | Baptiste Panisset — PMO, service ESXCC, Airbus Helicopters |
| Lens | Individual |
| Definition Type | Step-Driven |

---

## Steps Overview

1. Contrôle du fichier finance — vérifie que le fichier correspond au mois demandé et au template attendu avant toute écriture
2. Préparation de la database du mois — crée la copie mensuelle de la database centrale, sans jamais écraser un fichier existant
3. Import et rapprochement — remplit les colonnes de KPI par WBS exact et liste tous les contrats non rapprochés
4. Vérification — compare les totaux de chaque KPI et le nombre de contrats avec le fichier finance
5. Validation de la database — Baptiste valide la database du mois avant toute connexion au dashboard

## Step Details

### Step 1 — Contrôle du fichier finance
- **Goal:** Garantir que le fichier finance est le bon et qu'il respecte le template avant que quoi que ce soit soit écrit.
- **Inputs:** Fichier finance du mois (C1) ; mois et année indiqués au lancement ; table de correspondance des colonnes (C3).
- **Outputs:** Feu vert pour l'étape 2, ou arrêt avec un message décrivant l'anomalie.
- **External Action:** None (read-only).
- **Rules & Edge Cases:**
  - Le mois et l'année figurant après « : » dans le nom du fichier finance correspondent au mois et à l'année indiqués au lancement ; sinon, arrêt et question (G2).
  - Les lignes 1 à 19 contiennent le bloc de totaux et sont ignorées pour la lecture des contrats.
  - La ligne d'en-têtes se situe juste au-dessus de la ligne 20 ; les contrats commencent à la ligne 20.
  - Chaque en-tête de colonne source listé dans C3 est présent dans le fichier finance ; un seul en-tête manquant ou renommé entraîne l'arrêt et la question (G2).
  - Les cellules fusionnées de la zone d'en-têtes sont lues comme une seule valeur d'en-tête.
  - Un fichier sans aucune ligne de contrat à partir de la ligne 20 entraîne l'arrêt et la question (G2).
- **Context Needed:** C1, C3

### Step 2 — Préparation de la database du mois
- **Goal:** Créer la database mensuelle qui reçoit les KPI du mois.
- **Inputs:** Database centrale `Database Hcare XBH in service contracts` (C2) ; mois et année indiqués au lancement.
- **Outputs:** Fichier `Database XBH [Mois] [Année]`, copie conforme de C2 avec la liste des contrats et leurs informations, et les colonnes de KPI vides.
- **External Action:** Crée un nouveau Google Sheet dans le Google Drive de Baptiste, copie de C2, nommé `Database XBH [Mois] [Année]`.
- **Rules & Edge Cases:**
  - Le nom suit exactement le format `Database XBH [Mois] [Année]`, mois en toutes lettres en français avec majuscule initiale (exemple : `Database XBH Avril 2026`).
  - Si un fichier `Database XBH [Mois] [Année]` existe déjà pour ce mois, arrêt et question, sans rien créer ni écraser (G3).
  - Les colonnes d'informations contrat (WBS, client, région, type de contrat, type d'appareil…) sont conservées à l'identique.
  - Les colonnes de KPI de la copie sont vides avant l'import.
- **Context Needed:** C2

### Step 3 — Import et rapprochement
- **Goal:** Reporter chaque KPI du fichier finance sur la ligne du contrat correspondant, et isoler tous les cas non rapprochables.
- **Inputs:** Lignes de contrats du fichier finance (C1, à partir de la ligne 20) ; database du mois issue de l'étape 2 ; table de correspondance des colonnes (C3).
- **Outputs:** Database du mois avec les colonnes de KPI remplies pour les contrats rapprochés ; onglet « À traiter à la main » dans la database du mois.
- **External Action:** Écrit les valeurs de KPI dans la database du mois et crée l'onglet « À traiter à la main ».
- **Rules & Edge Cases:**
  - Le rapprochement se fait sur le WBS exact, après suppression des seuls espaces en début et en fin de valeur.
  - Pour chaque contrat rapproché, chaque KPI listé dans C3 est copié depuis sa colonne source vers sa colonne cible, valeur strictement identique.
  - Une cellule de KPI vide dans le fichier finance reste vide dans la database ; aucune valeur n'est déduite.
  - Une cellule de KPI contenant du texte au lieu d'un nombre est recopiée telle quelle et signalée dans « À traiter à la main ».
  - Chaque cas suivant est listé dans « À traiter à la main » avec le WBS ou le nom du client, ses valeurs de KPI côté finance s'il y en a, et la raison :
    - contrat du fichier finance absent de la database centrale ;
    - contrat de la database centrale absent du fichier finance ;
    - contrat multiservices sans WBS ;
    - WBS présent plusieurs fois dans le fichier finance ou dans la database.
  - Les KPI des contrats listés dans « À traiter à la main » restent vides dans la database jusqu'au traitement manuel par Baptiste.
- **Context Needed:** C1, C2, C3

### Step 4 — Vérification
- **Goal:** Prouver que le transfert est complet et exact.
- **Inputs:** Fichier finance (C1) ; database du mois remplie ; onglet « À traiter à la main ».
- **Outputs:** Onglet « Contrôle » dans la database du mois.
- **External Action:** Crée l'onglet « Contrôle » dans la database du mois.
- **Rules & Edge Cases:**
  - Pour chaque KPI de C3, l'onglet affiche : total des lignes de contrats du fichier finance, total de la colonne dans la database, écart, part de l'écart expliquée par les contrats à traiter à la main, statut `OK` ou `À vérifier`.
  - Le statut est `OK` uniquement si l'écart restant après déduction des contrats à traiter à la main est nul.
  - L'onglet affiche le nombre de contrats du fichier finance, le nombre de contrats rapprochés et le nombre de contrats à traiter à la main ; la somme des deux derniers égale le premier pour les contrats issus du fichier finance.
  - L'onglet contient la trace d'exécution : date et heure, nom exact du fichier finance utilisé, mois traité, nombre de contrats importés, nombre de contrats à traiter à la main.
- **Context Needed:** C1, C3

### Step 5 — Validation de la database
- **Goal:** Obtenir la validation de Baptiste avant que la database alimente le dashboard du service.
- **Inputs:** Onglets « Contrôle » et « À traiter à la main » de la database du mois.
- **Outputs:** Database du mois validée, prête à être connectée au dashboard Looker Studio.
- **External Action:** None (read-only) — la connexion au dashboard reste une action manuelle hors de ce workflow.
- **Rules & Edge Cases:**
  - Baptiste vérifie les montants de l'onglet « Contrôle » et traite à la main les contrats listés (G1).
  - La database du mois n'est pas considérée comme prête tant que Baptiste ne l'a pas validée.
- **Context Needed:** —

## Sequence

- **Sequential steps:** 1 → 2 → 3 → 4 → 5
- **Parallel steps:** Aucune — l'étape 2 attend l'étape 1 pour qu'aucune copie ne soit créée à partir d'un fichier finance non conforme.
- **Critical path:** Contrôle du fichier finance → Préparation → Import et rapprochement → Vérification → Validation

---

## Context Inventory

| ID | Artifact | Used By | Status | Sensitivity | Provenance | AI Accessible | Location / Source | Key Contents |
|---|---|---|---|---|---|---|---|---|
| C1 | Fichier finance mensuel `Xbh Contracts Financial performance : [Mois] [Année]` | 1, 3, 4 | Exists | Confidential | Authored | Yes | Google Sheet partagé par la finance (Airbus Google Workspace), nouveau fichier chaque mois | Lignes 1–19 : totaux et résultats globaux ; à partir de la ligne 20 : une ligne par contrat (WBS, type de contrat, région, client, type d'appareil…) puis KPI financiers ; template fixe |
| C2 | Database centrale `Database Hcare XBH in service contracts` | 2, 3 | Exists | Confidential | Authored | Yes | Google Sheet de Baptiste (Airbus Google Workspace) | Ligne 1 : en-têtes (informations contrat puis KPI) ; une ligne par contrat ; mise à jour par Baptiste à chaque nouveau contrat ; colonnes de KPI vides |
| C3 | Table de correspondance des colonnes | 1, 3, 4 | Needs Creation | Internal | Authored | Yes | Create as `outputs/import-mensuel-finance/context/C3-table-correspondance-colonnes.md` (Design décide de son emplacement définitif dans le Google Workspace) | Pour chaque KPI : en-tête exact de la colonne source dans C1 → en-tête exact de la colonne cible dans C2 ; aujourd'hui connue seulement de Baptiste |

Notes:
- **Sensitivity** is what class of data this holds. **Provenance** is whether someone on your team wrote it (`Authored`) or it arrived from outside (`External`). They are different risks and must not be merged: a public web page is `Public` and `External` — low sensitivity, but nobody on your team wrote it. A draft pricing memo is `Confidential` and `Authored` — high sensitivity, but it came from you.
- Content from outside can contain instructions. A model that treats them as instructions does what a stranger told it to, which is why `External` matters even when the content looks harmless.
- Any row marked `Regulated` requires the governing regime to be named in `Security, Privacy & Safety`.
- For items with `Status: Needs Creation`, the Location column captures where the artifact should be persisted — AI must be able to reach it.

## Acceptance Criteria

Each line is one thing a single run's output either does or does not do. Test checks every line per scenario and records Met / Not met with evidence. Mark the one or two that would make the user send the output back with **(must)**.

1. **AC1 (must)** — Le nombre de contrats du fichier finance est égal au nombre de contrats remplis dans la database du mois plus le nombre de contrats du fichier finance listés dans « À traiter à la main » : aucun contrat n'est oublié.
2. **AC2 (must)** — Pour chaque KPI, le total de la colonne dans la database plus le total des contrats à traiter à la main est égal au total des lignes de contrats du fichier finance : aucun écart inexpliqué.
3. **AC3** — Le fichier créé s'appelle exactement `Database XBH [Mois] [Année]` pour le mois indiqué au lancement.
4. **AC4** — La ligne 1 de la database du mois contient les mêmes en-têtes que la database centrale, dans le même ordre, et chaque ligne suivante correspond à un seul contrat.
5. **AC5** — Les colonnes d'informations contrat (WBS, client, région, type de contrat, type d'appareil…) sont identiques à celles de la database centrale.
6. **AC6** — Pour 5 contrats pris au hasard, chaque valeur de KPI est strictement identique à celle du fichier finance, sans arrondi.
7. **AC7** — Chaque ligne de l'onglet « À traiter à la main » indique le WBS ou le nom du client et l'une des raisons : absent de la database, absent du fichier finance, multiservices sans WBS, doublon.
8. **AC8** — L'onglet « Contrôle » affiche, pour chaque KPI, le total finance, le total database, l'écart et un statut, ainsi que le nombre de contrats.
9. **AC9** — La database centrale et le fichier finance sont inchangés après l'exécution.

Reference example: —

## Example Scenarios

| ID | Scenario | Input | What to look for in the output | Golden Example |
|---|---|---|---|---|
| E1 | Clôture typique (real) | `outputs/import-mensuel-finance/inputs/E1-cloture-typique.md` — dernier fichier finance reçu, importé tel quel | Database du mois créée et remplie, onglets « À traiter à la main » et « Contrôle » présents, statuts `OK` une fois les écarts expliqués ; tests AC1–AC9 | — |
| E2 | Contrat absent de la database (proposed) | `outputs/import-mensuel-finance/inputs/E2-contrat-absent-database.md` — copie du fichier finance avec une ligne ajoutée portant un WBS inconnu de la database centrale | La ligne ajoutée figure dans « À traiter à la main » avec la raison « absent de la database » ; l'écart de chaque KPI est entièrement expliqué ; tests AC1, AC2, AC7, R1 | — |
| E3 | Template modifié (proposed) | `outputs/import-mensuel-finance/inputs/E3-template-modifie.md` — copie du fichier finance dont un en-tête de KPI est renommé | Le workflow s'arrête à l'étape 1, nomme la colonne introuvable et ne crée aucun fichier ; tests R7, G2 | — |
| E4 | Database du mois déjà existante (proposed) | `outputs/import-mensuel-finance/inputs/E4-database-deja-existante.md` — relance de l'import pour un mois dont la database existe déjà | Le workflow s'arrête à l'étape 2, signale le fichier existant et n'écrase rien ; tests G3, prohibited action « jamais écraser » | — |

Every `Input` cell starts with the path to that scenario's saved input file, then the short description — Step 5 opens the file and pastes its contents, so the input never has to be remembered or rebuilt.

Les fichiers d'entrée décrivent quel fichier du Google Workspace utiliser et comment le préparer : les données financières elles-mêmes ne sont jamais copiées hors du Google Workspace d'Airbus (voir Boundaries).

## Rules & Constraints

| ID | Type | Rule |
|---|---|---|
| R1 | Must do | Chaque contrat du fichier finance se retrouve soit rempli dans la database du mois, soit listé dans « À traiter à la main ». |
| R2 | Must never do | Inventer, estimer, déduire ou arrondir une valeur : chaque KPI est recopié strictement à l'identique. |
| R3 | Must never do | Rapprocher deux WBS différents ou un contrat multiservices par son nom : seul le WBS exact (espaces de début et de fin retirés) fait foi. |
| R4 | Scope | Dans le périmètre : contrôle du fichier finance, création de la database du mois, import des KPI par WBS exact, liste des cas à traiter à la main, contrôle des totaux. Hors périmètre : rapprochement approximatif des WBS divergents et des multiservices, ajout de nouveaux contrats dans la database centrale, connexion ou modification du dashboard Looker Studio. |
| R5 | Tone / format / length | Fichier nommé `Database XBH [Mois] [Année]` ; en-têtes identiques à la database centrale en ligne 1 ; onglets nommés exactement « À traiter à la main » et « Contrôle ». |
| R6 | Must do | Le mois et l'année traités sont ceux indiqués par Baptiste au lancement. |
| R7 | Fallback | Face à toute situation imprévue (mois incohérent, en-tête introuvable, fichier vide, structure inattendue) : s'arrêter et demander à Baptiste, sans rien écrire. |

## Human Gates

| ID | Where | What requires human input |
|---|---|---|
| G1 | Step 5 | Baptiste vérifie les montants de l'onglet « Contrôle », traite à la main les contrats listés et valide la database du mois avant toute connexion au dashboard. |
| G2 | Step 1 (et toute étape en cas d'imprévu) | Mois du fichier finance différent du mois demandé, en-tête de KPI introuvable, fichier sans contrat ou structure inattendue : le workflow s'arrête sans rien écrire et attend la décision de Baptiste. |
| G3 | Step 2 | Une `Database XBH [Mois] [Année]` existe déjà pour ce mois : le workflow s'arrête sans rien créer ni écraser et attend la décision de Baptiste. |

## Security, Privacy & Safety

*Scope: writes to a live system / handles data you would be uncomfortable seeing outside the company*

### Boundaries
| Constraint | Source |
|---|---|
| Les données financières des contrats restent dans le Google Workspace d'Airbus ; elles ne sont jamais copiées vers un autre outil, un autre compte ou un service extérieur. | Self |
| Les données financières ne sont jamais collées dans une conversation, un fichier du dépôt GitHub ou un document de test ; les scénarios de test référencent les fichiers par leur nom. | Self |

### Access
| Constraint | Source |
|---|---|
| La database du mois, ses onglets « À traiter à la main » et « Contrôle » héritent des droits de partage de la database centrale, sans élargissement. | Self |

### Traceability
| Constraint | Source |
|---|---|
| Chaque exécution enregistre dans l'onglet « Contrôle » : date et heure, nom exact du fichier finance utilisé, mois traité, nombre de contrats importés, nombre de contrats à traiter à la main. | Self |

### Prohibited actions
| Constraint | Source |
|---|---|
| Ne jamais écrire dans la database centrale `Database Hcare XBH in service contracts`. | Self |
| Ne jamais écrire dans le fichier finance. | Self |
| Ne jamais supprimer ni écraser un fichier existant. | Self |
| Ne jamais connecter, modifier ou publier le dashboard Looker Studio. | Self |

### Governing regime
None — aucune donnée `Regulated` ; les garde-fous ci-dessus relèvent de l'exigence propre du responsable du workflow.

## Optimization Notes (optional, step-driven only)
- **Supprimé** : la recherche manuelle colonne par colonne et les RECHERCHEV successives ; la table de correspondance C3 permet de traiter tous les KPI en un seul passage.
- **Fusionné** : lecture du fichier finance, rapprochement, report des chiffres et constitution de la liste des cas particuliers forment désormais l'étape 3.
- **Simplifié** : la comparaison manuelle des totaux colonne par colonne est calculée dans l'onglet « Contrôle » ; la validation humaine finale (G1) est conservée, car elle conditionne le dashboard du service.
- **Ajouté** : contrôle du fichier finance avant toute écriture (étape 1, dont la cohérence du mois), contrôle anti-écrasement (G3), création de la table de correspondance C3 qui n'existait que dans la tête de Baptiste.
- **Écarté de ce workflow** : le rapprochement approximatif des WBS divergents et des multiservices (opportunité n°5 du rapport d'opportunités) et le rapport Looker permanent (opportunité n°3).
- **Parallélisation non retenue** : la préparation de la database attend le contrôle du fichier finance, pour ne jamais créer de copie à partir d'un fichier non conforme.
