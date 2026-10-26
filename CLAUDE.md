# Projet étudiant — Cours « IA : Claude Coding M1/M2 » (IAE)

Ce dépôt est le projet individuel d'un étudiant en management, non développeur.
Tu l'accompagnes dans le AI Workflow Framework, une étape à la fois.

## Langue et ton
- Réponds toujours en **français**, avec des mots simples. Explique tout terme technique la première fois.
- Pose **une question à la fois** pendant les interviews des skills.

## Les skills du cours
- Les skills sont dans `.claude/skills/` (copie du plugin open source Hands-on AI, licence MIT).
- Quand un skill parle de fichiers « in this plugin » ou du « plugin root », cela désigne `.claude/skills/`
  (ex. `indexing-registry/references/registry-bundle.md` = `.claude/skills/indexing-registry/references/registry-bundle.md`).
  Le registre des plateformes est dans `.claude/registries/platform-registry.json`.
- Ordre du cours : **analyze** (lundi) → **deconstruct** (lundi) → **use-case-canvas** (fiche de synthèse, après deconstruct) → design → build → test → run → improve.
- Si l'étudiant demande « continue my workflow » ou « on reprend », regarde `outputs/` et `registry/` pour savoir où il en est.

## Registre (registry)
- Lundi, ne propose pas de créer le registre (`scaffolding-registry`) : le rapport et les requirements
  dans `outputs/` suffisent. Ne le crée que si l'enseignante ou l'étudiant le demande.

## Enregistrement du travail sur GitHub
- Tout livrable est écrit dans un fichier du dépôt, jamais seulement dans la conversation :
  - Analyze → `outputs/ai-opportunity-report.md`
  - Deconstruct → `outputs/<nom-du-workflow>/requirements.md` (+ `inputs/`, `context/`)
  - Canvas → `outputs/<nom-du-workflow>/use-case-canvas.md`
- **Après chaque fichier créé ou modifié, fais un commit** avec un message clair en français
  (ex. « Analyze : rapport d'opportunités IA », « Deconstruct : requirements du workflow X »).
  Les commits sont poussés automatiquement sur GitHub.
- Une automatisation GitHub (`.github/workflows/fusion-automatique.yml`) fusionne toute seule chaque
  push d'une branche `claude/…` dans `main`, en une minute environ. L'étudiant n'a **pas** besoin de
  créer de pull request ni de cliquer sur Merge : ne le lui demande pas. Ne modifie pas ce fichier.
- Quand une étape est terminée, dis-lui que son travail sera visible dans `outputs/` sur GitHub
  (branche `main`) d'ici une minute.
- Ne supprime jamais un fichier existant sans demander.
- Ne modifie pas les skills du cours déjà présents dans `.claude/skills/` (analyze, deconstruct, use-case-canvas, design, build…).

## Skills créés par l'étudiant (étape Build)
- Un skill construit à l'étape Build va dans **`.claude/skills/<nom-du-skill>/SKILL.md`** (+ ses fichiers
  de référence), pour que l'étudiant puisse le lancer en tapant `/<nom-du-skill>`.
- Dans `outputs/<workflow>/`, garde seulement un court fichier `build-notes.md` qui indique où est le skill
  et ce qui a été construit.
- S'il n'y a pas d'outil de création de skill dans la session, écris les fichiers toi-même, sans le signaler
  comme un problème.

## Mon projet
<!-- À compléter : prénom et nom, entreprise / cas étudié, problème choisi. -->
