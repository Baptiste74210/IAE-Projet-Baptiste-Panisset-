---
workflow: import-mensuel-finance
requirements_file: outputs/import-mensuel-finance/requirements.md
spec_version: 3.0
approved: true
definition_type: Step-Driven
mechanism: Skill
involvement: Automated
platform: Google Workspace (Apps Script)
platform_mode: code
packaging: Loose Files
counts:
  steps: 8
  skills: 1
  agents: 0
  integrations: 3
---

# Import Mensuel Finance — Design Spec

## Source

**Workflow Requirements:** `outputs/import-mensuel-finance/requirements.md` (version 2 du 2026-10-27, après l'oral)

This Design Spec consumes the Workflow Requirements as canonical input. Goal, Value & Measurement, Metadata, Context Inventory, Security, Privacy & Safety, Acceptance Criteria, Example Scenarios, Human Gates, Steps Overview, and per-step requirements are defined there — not restated here. Read the Workflow Requirements alongside this spec when building.

**Révision du 2026-10-27 (soir), ré-approuvée par Baptiste le 2026-10-28 :** le nom du client n'est plus jamais lu ; les multiservices sont identifiés par un code `MS-…` écrit dans la colonne WBS ; la table de pseudonymisation C5 devient un référentiel non lu par le programme.

Version précédente archivée : `outputs/import-mensuel-finance/design-spec-2026-10-27-v1.md` (workflow augmenté sur Claude Code, remplacé après l'oral). Synthèse sur une page : `outputs/import-mensuel-finance/use-case-canvas.md`.

## Value & Measurement

| Field | Value |
|---|---|
| Business Objective | Gagner du temps et sécuriser la transmission des données qui alimentent le dashboard financier HCare du service |
| Desired Outcome | Dès réception du fichier finance, la database du mois est constituée automatiquement et sans erreur de transfert, sans qu'aucune information confidentielle de contrat ne sorte d'Airbus ; Baptiste n'intervient qu'à la validation ; le service dispose plus tôt après réception d'un dashboard aux chiffres garantis conformes |
| Measure | (1) Temps de travail de Baptiste entre l'ordre de lancement et la validation · (2) Lignes oubliées et écarts de totaux inexpliqués par clôture · (3) Correspondances à confirmer par clôture |
| Baseline | (1) 1 à 2 jours par clôture · Estimated · (2) Unknown — must measure before go-live · (3) Unknown — must measure before go-live (plan : clôture de novembre 2026) |
| Target | (1) Une matinée au plus, confirmations et validation incluses · (2) 0 ligne oubliée et 0 écart inexpliqué à chaque clôture · (3) En baisse d'un mois sur l'autre grâce à la mémoire |

---

The spec is organized into three layers that build on each other:

1. **Architecture (L1)** — strategic decisions: platform, mechanism, autonomy, packaging
2. **Decomposition (L2)** — for each step (or capability domain), what AI building block delivers it
3. **Component Blueprints (L3)** — field-level specs for each new skill and agent

---

## Layer 1 — Architecture

*Strategic decisions that shape everything downstream.*

## Execution Pattern

**Skill** — Le workflow suit toujours les mêmes 8 étapes avec des règles de calcul et se lance sur un ordre de Baptiste : un enchaînement fixe suffit. En production, cet enchaînement est un programme Apps Script qui tourne dans le Google Workspace Airbus, sans IA pendant l'exécution, pour qu'aucune donnée ne sorte ; une skill Claude Code (S1) le simule sur données fictives, le teste et le fait évoluer. Un agent n'apporterait rien, car le chemin ne dépend jamais de ce qui est trouvé.

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Lens | Individual | Workflow lancé et validé par une seule personne (Baptiste, PMO) |
| Platform | Google Workspace (Apps Script) | Seul environnement où les données réelles peuvent être lues, anonymisées, rapprochées et réinjectées sans jamais sortir d'Airbus ; Claude Code sert d'environnement de construction, de test et de maintenance sur données fictives |
| Platform Mode | code | Programme Apps Script (JavaScript) et skill Claude Code exécutant le même code de rapprochement avec Node.js |
| Orchestration | Skill | Enchaînement fixe lancé par un ordre ; aucune décision de chemin à l'exécution |
| Involvement | Automated | Étapes 1 à 6 et 8 sans intervention ; Baptiste ne contrôle que le résultat, à l'étape 7 |
| Packaging | Loose Files | Projet Apps Script (fichiers à coller une fois dans l'éditeur Apps Script de la database centrale) et skill dans `.claude/skills/` : deux emplacements distincts, sans distribution commune |
| Trigger | Ordre de Baptiste : menu « Import mensuel finance » → « Lancer l'import », saisie du mois et de l'année ; puis « Prendre en compte mes décisions » après l'étape 7 | Pas de planification ; une exécution par ordre |

## Autonomy Spectrum Summary

Niveau du workflow : **Deterministic**.

- **Deterministic — Steps 1, 2, 3, 4, 5, 6, 8.** Chaque étape applique une règle écrite : colonnes conservées à l'anonymisation, contrôles du template, versionnement, rapprochement en deux passes avec un écart calculé entre clés (erreurs typiques pondérées), niveau de confiance déduit de l'écart et du nombre de candidats, comparaison des totaux à 0,01 près, application mécanique des décisions. Le même fichier d'entrée et la même mémoire produisent toujours le même résultat. Aucun jugement n'est délégué à une IA.
- **Human — Step 7.** Seul Baptiste décide si une correspondance à moins de 100 % est juste ; c'est le seul point où un jugement est nécessaire.

## Safety & Permissions

| Question | Finding | Mitigation |
|---|---|---|
| **Write access** — which integrations can this workflow create, modify, or send through? | Google Drive (créer les fichiers anonymisés C7, créer la database du mois `vN`, copier les partages de C2) ; Google Sheets (écrire les KPI et les onglets « À traiter à la main », « Correspondances à confirmer », « Contrôle » ; ajouter des lignes à C6) | Le programme n'écrit que dans les fichiers qu'il crée et dans C6 ; C1, C2 et C5 sont ouverts en lecture seule ; aucune suppression ni aucun renommage ; nom déjà pris → nouvelle version ; écriture sous un nom temporaire puis renommage final uniquement en cas de succès complet ; autorisations Apps Script limitées aux fichiers auxquels Baptiste a déjà accès |
| **Untrusted input** — does any step consume content the user didn't author (inbound email, web pages, form submissions, shared docs)? | Fichier finance (C1, provenance External) | Le programme lit les cellules comme des valeurs et n'interprète jamais un texte : une instruction dans une cellule est sans effet ; aucun modèle d'IA ne lit C1 à l'exécution ; seules les colonnes de C3 sont lues |
| **Unattended runs** — does this run on a schedule or without a human watching? | No — exécution sur ordre, sans intervention pendant le déroulement | Trace de chaque exécution dans « Contrôle » ; arrêt avant écriture sur fichier inutilisable (G2) ; message de fin à Baptiste |
| **Blast radius** — worst realistic outcome if a run goes wrong? | Un faux rapprochement automatique (deux WBS proches mais contrats différents) transmis au dashboard | Toute correspondance à moins de 100 % est marquée « en attente de confirmation » et listée ; la database porte le statut « non validée » tant que la case « Validé » n'est pas cochée (G1) ; une paire rejetée n'est plus jamais proposée ; la connexion au dashboard reste manuelle et hors workflow |

### Constraint Conformance

| Constraint | From | Met by | State |
|---|---|---|---|
| Les informations des contrats (client, pays, région…) ne sortent jamais du Google Workspace d'Airbus | Boundaries · Self, enseignante | Toutes les étapes s'exécutent en Apps Script dans le Workspace ; aucune donnée n'est envoyée à un service extérieur | Satisfied |
| Seules les données anonymisées peuvent être traitées par un outil extérieur au Workspace | Boundaries · Self, enseignante | Aucun outil extérieur ne traite de données réelles, même anonymisées ; l'anonymisation (étape 1) reste exigée et produit C7 pour limiter les colonnes lues par le rapprochement | Satisfied |
| Le nom du client n'est jamais lu ni traité par le workflow | Boundaries · Self, enseignante | `Code.gs` et `Rapprochement.gs` ne lisent que les colonnes WBS (ou code `MS-…`), type de contrat et KPI ; aucune fonction ne reçoit la colonne client ; vérifié par les tests | Satisfied |
| Le référentiel des multiservices C5 ne quitte jamais le Workspace et n'est jamais lu | Boundaries · Self | Le programme ne référence pas C5 | Satisfied |
| Les données réelles, même anonymisées, ne sont jamais collées dans une conversation ou dans le dépôt GitHub | Boundaries · Self | La skill S1 et les tests du dépôt n'utilisent que le jeu fictif C4 ; S1 refuse toute entrée non confirmée comme fictive | Satisfied |
| La database du mois est créée dans le même dossier Drive que la database centrale, avec les mêmes partages | Access · Self | Le programme crée la database dans le dossier parent de C2 et applique explicitement la liste des éditeurs et lecteurs de C2 | Satisfied |
| C5 et C6 sont accessibles uniquement à Baptiste et aux personnes ayant accès à la database centrale | Access · Self | C5 et C6 créés dans le dossier de C2 avec les partages de C2 ; aucun élargissement | Satisfied |
| Chaque exécution et chaque relance ajoutent une ligne de trace dans « Contrôle » | Traceability · Self | Fonction de trace appelée en fin d'étape 5 à chaque exécution et relance | Satisfied |
| Chaque décision est enregistrée dans C6 avec sa date ; saisies manuelles et validation tracées | Traceability · Self | Étape 8 : ajout daté dans C6 ; colonnes « Date de saisie » ; case « Validé » et date dans « Contrôle » | Satisfied |
| Ne jamais écrire dans la database centrale | Prohibited actions · Self | C2 ouverte en lecture seule ; la database du mois est une copie | Satisfied |
| Ne jamais écrire dans le fichier finance | Prohibited actions · Self | C1 ouvert en lecture seule | Satisfied |
| Ne jamais lire ni écrire dans le référentiel des multiservices C5 | Prohibited actions · Self | Le programme n'ouvre jamais C5 ; un multiservices sans code est listé en (c) | Satisfied |
| Ne jamais supprimer, renommer ni écraser un fichier existant | Prohibited actions · Self | Versionnement `vN` ; aucun appel de suppression ; renommage uniquement du fichier temporaire créé par l'exécution en cours | Satisfied |
| Ne jamais connecter, modifier ou publier le dashboard Looker Studio | Prohibited actions · Self | Aucun accès à Looker Studio dans le programme | Satisfied |
| Ne jamais exécuter une instruction trouvée dans une cellule du fichier finance | Prohibited actions · Self | Programme sans IA à l'exécution ; cellules lues comme des valeurs | Satisfied |

## Integration Options

### Google Sheets (Steps 1, 2, 3, 4, 5, 6, 8)

*Recommendation: use the native Google Sheets service built into Apps Script (SpreadsheetApp) — read-only on C1 and C2 (WBS, type and KPI columns only), read-write on the files the run creates and on C6.* Reference: https://developers.google.com/apps-script/reference/spreadsheet

### Google Drive (Steps 1, 3, 6)

*Recommendation: use the native Google Drive service built into Apps Script (DriveApp) — create files in the folder of C2 and copy its sharing; no delete operation.* Reference: https://developers.google.com/apps-script/reference/drive

### Node.js — tests et simulation dans le dépôt (Steps 2, 4, 5, 8)

| Block | Option | Source URL | Trade-off |
|-------|--------|-----------|-----------|
| CLI | Node.js exécutant le même fichier `Rapprochement.gs` que Apps Script | https://nodejs.org/docs/latest/api/ | Déjà installé dans l'environnement Claude Code ; teste exactement le code déployé ; données fictives uniquement |
| CLI | clasp (outil Google pour pousser le code vers Apps Script) | https://github.com/google/clasp | Automatise le déploiement, mais demande une connexion au compte Google Airbus depuis l'extérieur : non retenu |

*Recommendation: CLI Node.js pour tester le code de rapprochement sur E5 et E6 ; déploiement par copier-coller dans l'éditeur Apps Script, sans connexion du dépôt au compte Airbus.*

## Model Recommendation

**Default capability:** fast — aucun modèle n'intervient à l'exécution réelle (programme Apps Script) ; dans la skill S1, le modèle ne fait qu'enchaîner la simulation, lancer les tests et expliquer les résultats.

*(Plain-language gloss for non-technical users: **reasoning-heavy** = slower but handles complex judgment/nuance; **fast** = quicker, best for simple/high-volume steps; **vision** = can read images/screenshots.)*

**Per-step overrides** (optional):
- Maintenance du code (modification d'une règle dans S1) : reasoning-heavy — écrire et corriger du code demande plus de raisonnement.

**Per-platform mapping:** resolved by Build at generation time — Build verifies the current model names for Claude Code via web search. Record only capability tiers here.

---

## Layer 2 — Decomposition

*For each step or capability domain, what AI building block delivers it.*

## Step-by-Step Decomposition

| Step | Name (from Requirements) | Autonomy | Orchestration | Integration (use/build) | Intelligence | Build Output | Human Gate? |
|------|------|----------|---------------|------------------------|--------------|--------------|-------------|
| Step 1 | Anonymisation | Deterministic | Skill | API: Google Sheets SpreadsheetApp (use) ; API: Google Drive DriveApp (use) | No model at runtime; Context: C1, C2, C3 | Handled by orchestrator | No |
| Step 2 | Contrôle du fichier finance anonymisé | Deterministic | Skill | API: Google Sheets SpreadsheetApp (use) ; CLI: Node.js (use, tests) | No model at runtime; Context: C3, C7 | Handled by orchestrator | Yes (G2, fichier inutilisable) |
| Step 3 | Préparation de la database du mois | Deterministic | Skill | API: Google Drive DriveApp (use) | No model at runtime; Context: C7 | Handled by orchestrator | Yes (G2, KPI déjà remplis) |
| Step 4 | Rapprochement automatique | Deterministic | Skill | API: Google Sheets SpreadsheetApp (use) ; CLI: Node.js (use, tests) | No model at runtime; Context: C3, C6, C7 | Handled by orchestrator | No |
| Step 5 | Vérification | Deterministic | Skill | API: Google Sheets SpreadsheetApp (use) ; CLI: Node.js (use, tests) | No model at runtime; Context: C3, C7 | Handled by orchestrator | No |
| Step 6 | Réinjection | Deterministic | Skill | API: Google Drive DriveApp (use) ; API: Google Sheets SpreadsheetApp (use) | No model at runtime; Context: C2 | Handled by orchestrator | Yes (G2, clé introuvable) |
| Step 7 | Validation | Human | — | — | — | Human (no artifact) | Yes (G1) |
| Step 8 | Prise en compte de la validation | Deterministic | Skill | API: Google Sheets SpreadsheetApp (use) ; CLI: Node.js (use, tests) | No model at runtime; Context: C6 | Handled by orchestrator | No |

Notes :
- **Orchestrateur de production** : le programme Apps Script (`Code.gs` + `Rapprochement.gs`), qui enchaîne les étapes 1 à 6 sur « Lancer l'import » et l'étape 8 sur « Prendre en compte mes décisions ».
- **Orchestrateur de simulation et de maintenance** : la skill S1 dans Claude Code, qui exécute les étapes 2 à 5 et 8 avec le même `Rapprochement.gs` sous Node.js, sur le jeu fictif ; les étapes 1 et 6 (lecture et écriture Google) sont simulées par des fichiers locaux.
- `Rapprochement.gs` ne contient que de la logique pure (aucun appel Google) : c'est ce qui permet de tester sous Node.js exactement le code déployé.

## Orchestrator Prompt Outline

```
[Intro] Skill import-mensuel-finance (Claude Code) : simule, teste et maintient le programme
Apps Script du workflow Import Mensuel Finance. Données fictives uniquement. Trois usages :
« simule l'import d'octobre 2026 », « lance les tests », « modifie la règle … ».

[Lancement]
  - User provides: usage (simulation / tests / modification) ; pour une simulation : mois et
    année, fichiers fictifs (inputs/jeu-fictif/ ou E5), état de la mémoire C6 (vide ou fichier)
  - Confirmation obligatoire : « Les fichiers sont-ils fictifs ? » — sinon arrêt

[Step 1 invocation — simulée]
  - Source: Workflow Requirements Step 1
  - Build Output: Handled by orchestrator (lecture des fichiers fictifs, colonnes conservées : ligne, clé, type, KPI)
  - Produces: fichiers anonymisés locaux

[Step 2 invocation]
  - Source: Workflow Requirements Step 2
  - Build Output: Handled by orchestrator (Rapprochement.gs, fonction controlerFichier)
  - Produces: plage des contrats ou anomalie bloquante

[PAUSE — G2] fichier inutilisable : la simulation s'arrête et affiche l'anomalie (comportement identique au programme réel)

[Step 3 invocation]
  - Source: Workflow Requirements Step 3
  - Build Output: Handled by orchestrator (fonction preparerDatabase, versionnement vN)

[Step 4 invocation]
  - Source: Workflow Requirements Step 4
  - Build Output: Handled by orchestrator (fonction rapprocher : passe 1, passe 2, niveaux de confiance)
  - Produces: KPI remplis, « À traiter à la main », « Correspondances à confirmer »

[Step 5 invocation]
  - Source: Workflow Requirements Step 5
  - Build Output: Handled by orchestrator (fonction verifier)
  - Produces: « Contrôle » et trace

[Step 6 invocation — simulée]
  - Source: Workflow Requirements Step 6
  - Build Output: Handled by orchestrator (écriture d'un fichier Excel local runs/Database XBH [Mois] [Année].xlsx)

[PAUSE — G1] Validation par Baptiste
  - What user is reviewing: « Correspondances à confirmer », « À traiter à la main », « Contrôle »
  - User decides: Oui / Non pour chaque correspondance à moins de 100 %

[Step 8 invocation]
  - Source: Workflow Requirements Step 8
  - Build Output: Handled by orchestrator (fonction appliquerDecisions, mise à jour de la mémoire C6 locale)

[Tests] « lance les tests » : exécute E5 et E6 et compare chaque résultat au corrigé
  inputs/jeu-fictif/corrige-jeu-fictif.md (jeu fictif de référence, 400 contrats) ; affiche Met / Not met par critère

[Maintenance] « modifie la règle … » : propose la modification de Rapprochement.gs, relance les
  tests, puis indique à Baptiste les fichiers à recoller dans l'éditeur Apps Script

[Final output] fichier Excel de simulation dans outputs/import-mensuel-finance/runs/ + résumé
  en 3 lignes (lignes à 100 %, en attente de confirmation, non rapprochées)

[Closing run summary — "What I did"] étapes exécutées dans l'ordre ; chaque arrêt (G1, G2) et la
  décision prise ; chaque action fichier (ex. « Fichiers : créé runs/Database XBH Octobre 2026.xlsx ») ;
  résultat des tests le cas échéant ; emplacement du livrable
```

## Data Readiness Summary

| Context ID | Current State | Required Action | Affects Steps |
|---|---|---|---|
| C1 | Partial — lisible uniquement dans le Google Workspace Airbus | Aucune pour la production (lu par Apps Script sur place) ; jamais exporté | Step 1 |
| C2 | Partial — lisible uniquement dans le Google Workspace Airbus | Aucune pour la production (lu par Apps Script sur place) ; jamais exporté | Steps 1, 6 |
| C3 | Needs Creation | Créer la table de correspondance des colonnes (en-têtes et cellules de totaux uniquement) ; pour les tests, utiliser celle de E5 | Steps 1, 2, 4, 5 |
| C5 | No — Needs Creation | Créer le référentiel des multiservices (code `MS-…` → contrat) dans le dossier de C2 ; écrire chaque code dans la colonne WBS de C2 ; demander à l'équipe finance de l'écrire dans C1 ; non lu par le programme | — (aucune étape ne le lit) |
| C6 | Needs Creation | Créé vide automatiquement par le programme au premier lancement, dans le dossier de C2 | Steps 4, 8 |
| C7 | Needs Creation | Produit automatiquement à chaque exécution par l'étape 1 | Steps 2 à 6 |

## Recommended Implementation Order

### Quick Wins (implement first)
1. **`Rapprochement.gs`** — logique pure des étapes 2, 4, 5 et 8 ; testée immédiatement sous Node.js sur E5 et E6 contre le corrigé, sans aucun compte Google.

### Core (implement second)
1. **S1 — `import-mensuel-finance`** — skill Claude Code de simulation, de tests et de maintenance, qui enchaîne le code testé sur données fictives.
2. **`Code.gs` et `appsscript.json`** — menu, lecture et écriture Google Sheets et Drive (étapes 1, 3, 6), appels à `Rapprochement.gs`, autorisations ; guide de déploiement pas à pas dans `build-notes.md`.

### Future Enhancement (optional)
1. **Historique unique de tous les mois** (opportunité n°3 du rapport) pour supprimer la reconnexion mensuelle de Looker Studio.
2. **Notification par e-mail** à Baptiste en fin d'exécution (service Gmail d'Apps Script), si le message dans le Sheet ne suffit pas.

---

## Layer 3 — Component Blueprints

## Skill Candidates

### S1 — import-mensuel-finance

| Field | Detail |
|---|---|
| **ID** | S1 |
| **Name** | import-mensuel-finance |
| **Description** | This skill should be used when Baptiste wants to simulate, test or maintain the Import Mensuel Finance Apps Script program on fictitious data, for example "simule l'import d'octobre 2026", "lance les tests de l'import mensuel finance", "relance le contrôle", or "modifie la règle de rapprochement des WBS". It runs the program's matching logic (exact WBS match, then closest match with a confidence level, memory of confirmed and rejected pairs, totals control) on the fictitious finance file and database, produces the monthly database with « À traiter à la main », « Correspondances à confirmer » and « Contrôle », checks results against the answer key, and prepares code changes to paste into Apps Script. Fictitious data only. Do not use on real Airbus data or for the Looker Studio dashboard. |
| **Purpose** | Skill d'orchestration de simulation et de maintenance du workflow ; le programme de production est le projet Apps Script. Propre à ce workflow. |
| **Covers Steps / Domains** | Steps 1 à 6 et 8 (étapes 1 et 6 simulées par des fichiers locaux ; Step 7 humaine) |
| **Inputs** | usage — simulation, tests ou modification<br>mois_annee — mois en français et année, ex. « Octobre 2026 »<br>fichier_finance — fichier finance fictif (`inputs/jeu-fictif/` ou E5)<br>database_centrale — database centrale fictive<br>memoire — fichier de mémoire C6 fictif, ou vide<br>decisions — Oui / Non pour chaque correspondance à confirmer (simulation de l'étape 7)<br>confirmation_fictif — oui / non |
| **Outputs** | `outputs/import-mensuel-finance/runs/Database XBH [Mois] [Année].xlsx` (ou `vN`) avec les onglets database, « À traiter à la main », « Correspondances à confirmer », « Contrôle » ; mémoire C6 fictive mise à jour ; rapport de tests Met / Not met par critère ; pour une modification : fichiers Apps Script à jour dans `outputs/import-mensuel-finance/apps-script/` ; liste « What I did » ; ligne ajoutée à `outputs/import-mensuel-finance/runs.md` |
| **Decision Logic** | Suit l'Orchestrator Prompt Outline et les Step Details du Workflow Requirements, en appelant `Rapprochement.gs` :<br>• arrêt sans lecture si confirmation_fictif ≠ oui<br>• anonymisation : seules les colonnes ligne, clé, type, KPI sont conservées<br>• contrôle : mois, onglet unique, totaux lignes 1–18, en-têtes ligne 19, contrats dès ligne 20, en-têtes de C3 présents et uniques, pas de ligne « Total » ; sinon arrêt (G2)<br>• passe 1 : clé normalisée identique (espaces, insécables, invisibles, casse) et unique de chaque côté, ou paire « confirmée » dans C6 → 100 %<br>• passe 2 : candidats de même type, non rapprochés, paire non « rejetée » ; écart pondéré (O/0, I/1, inversion de deux caractères voisins, lettre du préfixe FH/FB comptent moins) ; attribution par écart croissant, un candidat utilisé une seule fois ; meilleure correspondance toujours appliquée ; confiance Élevée / Moyenne / Faible selon l'écart et le nombre de candidats à cet écart<br>• raisons (a) à (h) ; KPI recopiés à l'identique ; doublons jamais additionnés<br>• vérification : totaux bloc / lignes / database, tolérance 0,01, comptages par confiance, trace<br>• décisions : Oui → mémoire « confirmée » ; Non → retrait, raison (g), mémoire « rejetée »<br>• modification de règle : modifier `Rapprochement.gs`, relancer tous les tests, ne livrer que si E5 et E6 sont conformes au corrigé |
| **Failure Modes** | Données non confirmées fictives → arrêt, rien n'est lu<br>Fichier inutilisable (G2) → arrêt, anomalie affichée avec la cellule ou la ligne<br>Fichier du mois déjà présent dans `runs/` → création de `vN`, rien n'est écrasé<br>Fichier d'entrée introuvable → arrêt avec le chemin attendu<br>Test en échec après une modification → la modification n'est pas livrée ; écart affiché critère par critère<br>Erreur d'exécution → arrêt, fichier temporaire jamais renommé en nom final, message d'erreur |
| **Required Tools** | CLI: Node.js (use) ; skill existante `xlsx` (use) pour le fichier Excel de simulation |
| **Depends On** | Artefacts : `outputs/import-mensuel-finance/apps-script/Rapprochement.gs` (logique partagée), `inputs/jeu-fictif/` et son corrigé ; skill existante `xlsx` |
| **Stateful?** | No — la mémoire des correspondances est un fichier de données (C6), lu et écrit explicitement ; la skill ne garde rien entre deux sessions |

## Prerequisites

1. **Autorisation d'Apps Script** confirmée par le tuteur ou l'informatique d'Airbus pour le compte de Baptiste.
2. **Table de correspondance des colonnes C3** créée (en-têtes réels du fichier finance et de la database, cellules des totaux).
3. **Codes multiservices** : référentiel C5 créé dans le dossier de la database centrale ; chaque code `MS-…` écrit dans la colonne WBS de la database centrale ; **accord de l'équipe finance** pour écrire ce code dans la colonne WBS de ses lignes multiservices.
4. Accès en lecture au fichier finance du mois et en écriture au dossier de la database centrale.
5. Pour la simulation : session Claude Code ouverte sur le dépôt, Node.js disponible (présent).

## Deployment Plan

| Artifact | Target Location | Deployment Steps |
|---|---|---|
| Programme Apps Script — `Rapprochement.gs` | `outputs/import-mensuel-finance/apps-script/Rapprochement.gs`, puis éditeur Apps Script de la database centrale (Extensions → Apps Script) | Écrire et tester sous Node.js ; coller le fichier dans un fichier `Rapprochement.gs` de l'éditeur Apps Script |
| Programme Apps Script — `Code.gs` et `appsscript.json` | `outputs/import-mensuel-finance/apps-script/`, puis éditeur Apps Script de la database centrale | Coller les fichiers ; enregistrer ; recharger le Sheet ; accepter les autorisations au premier lancement ; vérifier le menu « Import mensuel finance » |
| S1 — `import-mensuel-finance` | `.claude/skills/import-mensuel-finance/SKILL.md` (+ `scripts/simuler.js` qui charge `Rapprochement.gs`) | Écrire la skill ; commit ; lancer avec `/import-mensuel-finance` dans une nouvelle session ; exécuter « lance les tests » |
| Notes de build | `outputs/import-mensuel-finance/build-notes.md` | Emplacement des fichiers, guide de déploiement Apps Script pas à pas, résultat des tests |

**Packaging note:** Loose Files — le projet Apps Script vit dans `outputs/import-mensuel-finance/apps-script/` (source de référence versionnée) et est déployé par copier-coller dans l'éditeur Apps Script, sans connexion du dépôt au compte Airbus ; la skill S1 vit dans `.claude/skills/import-mensuel-finance/`. La version personnelle écrite par Baptiste en partie 5 (`.claude/skills/mon-import-mensuel-finance/`) coexiste sous un nom distinct.

**Orchestrator artifact (primary-loop platforms):** côté Claude Code, l'entrée utilisateur est la skill S1, qui porte le nom du workflow ; côté production, l'orchestrateur est le programme Apps Script lancé depuis son menu. Aucun agent (`agents: 0`).

**Run Logging:** la skill S1 ajoute une ligne à `outputs/import-mensuel-finance/runs.md` à chaque simulation ou série de tests (date, usage, mois, résultat, nombre de lignes à confirmer et à traiter) ; le programme Apps Script trace chaque exécution réelle dans l'onglet « Contrôle » de la database du mois.

**Recommended for frequent use:** en production, épingler la database centrale dans Google Drive et utiliser le menu ; en maintenance, lancer `/import-mensuel-finance` puis « lance les tests » après chaque modification.

---

## Cross-Layer Sections

## Evaluation Inputs

**Acceptance Criteria (AC1 à AC13), Example Scenarios (E1 à E7, avec le corrigé du jeu fictif de référence comme Golden Example pour E5, E6 et E7) and Human Gates (G1, G2) are sourced from the Workflow Requirements file** (`outputs/import-mensuel-finance/requirements.md`). Do not duplicate them here. Step 5 (Test) reads them from that file directly. E5 et E6 s'exécutent dans le dépôt via S1 ; E1 à E4 s'exécutent dans le Google Workspace Airbus avec le programme déployé.

## Deferred to Build

- [ ] Exact model version for Claude Code (mapping above is guidance; Build verifies current names)
- [ ] Format des fichiers fictifs lus sous Node.js (lecture directe des `.xlsx` ou conversion préalable en CSV) et bibliothèque éventuelle
- [ ] Valeurs exactes de pondération de l'écart (erreur typique contre autre modification) et seuils des niveaux Élevée / Moyenne / Faible, calibrés pour que E5 et E6 donnent les résultats du corrigé
- [ ] Liste précise des autorisations Apps Script (`appsscript.json`) au plus juste
- [ ] Forme du message de fin d'exécution dans le Sheet (boîte de dialogue ou note dans « Contrôle »)
- [ ] Shareability : code et skill partagés via le dépôt GitHub du cours

## Self-Test Summary

**Structure**
- ✓ Frontmatter is present with workflow, requirements_file, spec_version (`3.0`), approved (`true` — révision ré-approuvée le 2026-10-28), definition_type, mechanism, involvement, platform, platform_mode, packaging, and counts
- ✓ Frontmatter `counts` match the body — skills = 1 (S1), agents = 0, integrations = 3 (Google Sheets, Google Drive, Node.js)
- ✓ Source section names the Workflow Requirements file path
- ✓ All mandatory template sections are present in template order; Orchestrator Prompt Outline present (mechanism Skill); Agent Configuration and Multi-Agent Configuration omitted (no agents); Stakeholders omitted (Individual lens)
- ✓ Architecture Decisions table has Lens, Platform, Platform Mode, Orchestration, Involvement, Packaging, and Trigger rows
- ✓ Every step in the decomposition table has separate Orchestration, Integration, Intelligence, and Build Output columns
- ✓ Step IDs in the decomposition table match the Workflow Requirements (Step 1 to Step 8)
- ✓ Every step uses canonical autonomy terms (Deterministic, Human)
- ✓ Every Integration column entry includes the block type, tool name, and use/build tag (Step 7 is "—", no tool)
- ✓ Every Build Output value is one of the canonical forms (Handled by orchestrator, Human (no artifact))
- ✓ Packaging value is canonical (Loose Files)
- ✓ Mechanism is `Skill`

**Skill Candidates**
- ✓ Every `New skill: SN` reference has a matching Skill Candidates entry (S1 is the orchestrator; no component `New skill` references)
- ✓ S1 has all 12 fields
- ✓ S1 Name conforms to format rules and, as the orchestrator, takes the workflow slug
- ✓ S1 Description starts with "This skill should be used when...", is ≤1024 chars, is third-person, and names concrete trigger keywords
- ✓ No two Skill Candidates describe the same capability
- ✓ For a Skill mechanism, S1 is the orchestrator skill named with the workflow slug, covering all automated steps (Step 7 is human)
- ✓ No `Extend existing` cells — item not applicable

**Agent Configuration**
- ✓ No `New agent` references — item not applicable
- ✓ No Agent Configuration entries — item not applicable
- ✓ No Agent Configuration entries — item not applicable
- ✓ No agent tools — item not applicable
- ✓ Fewer than two agents — Multi-Agent Configuration correctly omitted

**Cross-references**
- ✓ Every tool in the Integration column has a matching Integration Options entry: Google Sheets and Google Drive as native one-liners (with reference links), Node.js with Source URLs
- ✓ S1 Depends On references defined artifacts (`Rapprochement.gs`, the fictitious dataset, the existing `xlsx` skill)

**Mechanism-specific**
- ✓ Orchestrator Prompt Outline is present (mechanism Skill)
- ✓ Orchestrator Prompt Outline names the closing "What I did" run summary
- ✓ `agents: 0` is set and orchestration logic is documented in the Deployment Plan (orchestrator artifact)

**Safety**
- ✓ Safety & Permissions answers all four questions with mitigations
- ✓ Constraint Conformance lists every constraint from Security, Privacy & Safety (15 constraints), all `Satisfied`; no `Accepted` or `Open`
- ✓ Value & Measurement restates objective, desired outcome, measure, baseline and target; `Baseline: Unknown` carried through
- ✓ Requirements include these sections — no backfill needed
- ✓ Untrusted input (C1) meets write access: mitigated by human gate G1 and the « non validée » status before any downstream use, read-only inputs, and no AI interpretation of cell content at runtime

**Completeness**
- ✓ Model Recommendation is present with a default capability and per-platform mapping note
- ✓ Data Readiness Summary is present and references C1, C2, C3, C5, C6, C7
- ✓ Deployment Plan is present with target location and deployment steps for each artifact, plus a Packaging note
- ✓ Evaluation Inputs points to the Workflow Requirements file without duplicating it
- ✓ Deferred to Build lists what Build resolves
- ✓ Self-Test Summary is present and enumerates every checklist item
