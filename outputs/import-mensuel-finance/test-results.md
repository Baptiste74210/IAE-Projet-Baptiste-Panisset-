---
workflow: import-mensuel-finance
design_spec: outputs/import-mensuel-finance/design-spec.md
requirements: outputs/import-mensuel-finance/requirements.md
date: 2026-10-28
environment: "Claude Code (web), skill mon-import-mensuel-finance après correction AC10 (commit 3d33e72), programme Python de référence, données fictives uniquement ; Google Workspace Airbus non disponible"
round_status: in-progress
criteria_total: 0
criteria_met: 0
results: {}
---

# Résultats de test — Import Mensuel Finance, tour 2

**Tour précédent :** `test-results-2026-10-28-tour1.md` — pas encore prêt (153 / 155) ; AC10 corrigé au Build, AC13 accepté.

**Règle de réussite (inchangée, confirmée au tour 1) :** prêt quand chaque ligne est « atteinte » dans chaque scénario ; un raté sur une ligne **(must)** fait échouer le scénario ; tout autre raté est corrigé ou accepté avec sa raison. Raté déjà accepté : AC13 lorsque l'ordre ne précise pas « fichiers fictifs ».

**Limite du tour :** comme au tour 1, R8, Step 1 output et le dossier / les partages Google Drive (AC8) sont `not-run` et seront vérifiés à l'étape Run.

## Check list

**Critères d'acceptation**
- AC1 (must) — Lignes du fichier finance = lignes rapprochées (100 % ou en attente) + lignes listées avec une raison (a) à (e) ou (g) : aucune ligne oubliée.
- AC2 (must) — Pour chaque KPI : total database + total des lignes non rapprochées = total des lignes de contrats = total du bloc de totaux, à 0,01 près.
- AC3 (must) — Fichiers anonymisés sans autre information que n° de ligne, clé, type de contrat et KPI ; aucun client, pays, région ; colonne client jamais lue.
- AC4 — Chaque rapprochement à moins de 100 % figure dans « Correspondances à confirmer » avec ses deux clés, son niveau de confiance et une colonne « Décision » vide.
- AC5 — Une paire confirmée « Oui » est enregistrée dans la mémoire et rapprochée à 100 % à l'exécution suivante, sans réapparaître à confirmer.
- AC6 — Une paire rejetée « Non » est retirée de la database, passe en (g), est enregistrée « rejetée » et n'est plus jamais proposée.
- AC7 — Pour 5 lignes (dont au moins 2 en passe 2), chaque KPI est strictement identique au fichier finance, sans arrondi.
- AC8 — Fichier nommé exactement `Database XBH [Mois] [Année]` (ou `… vN`), dans le même dossier que la database centrale, aucune version existante modifiée.
- AC9 — Ligne 1 de la database du mois = en-têtes de la database centrale, même ordre, informations des contrats identiques.
- AC10 — Chaque ligne de « À traiter à la main » indique n° de ligne d'origine, clé, type de contrat et une raison (a) à (h).
- AC11 — Onglet « Contrôle » : par KPI, totaux bloc, lignes et database, écart restant et statut ; comptages par niveau de confiance.
- AC12 — Database centrale et fichier finance inchangés après l'exécution.
- AC13 — Aucune action humaine demandée entre l'ordre de lancement et le message « prête à valider », sauf arrêt G2.

**Règles**
- R1 — Chaque ligne du fichier finance est rapprochée ou listée dans « À traiter à la main ».
- R2 — Jamais inventer, estimer, déduire, additionner ou arrondir une valeur.
- R3 — Tout rapprochement à moins de 100 % est appliqué avec son niveau de confiance et le statut « en attente de confirmation », jamais définitif sans « Oui ».
- R4 — Reste dans le périmètre (pas d'ajout de contrats, pas de référentiel MS, pas de dashboard).
- R5 — Noms exacts : fichier `Database XBH [Mois] [Année]` (ou `… vN`), onglets « À traiter à la main », « Correspondances à confirmer », « Contrôle ».
- R6 — Le mois traité est celui de l'ordre de lancement.
- R7 — Seul un fichier inutilisable arrête le workflow avant toute écriture ; tout autre cas est traité sans arrêt et listé.
- R8 — Aucune information de contrat autre que clé, type et KPI ne sort du Google Workspace Airbus.
- R9 — Candidat de passe 2 de même type ; chaque contrat de la database rapproché une seule fois ; paire rejetée jamais reproposée.
- R10 — Le nom du client n'est jamais lu ni utilisé.

**Points de contrôle humain**
- G1 — Baptiste indique « Oui » ou « Non » pour chaque correspondance à moins de 100 % avant validation.
- G2 — Fichier inutilisable : arrêt sans rien écrire sous le nom final, anomalie expliquée.

**Résultats des étapes** (l'étape 7 est notée par G1)
- Step 1 output — Fichiers anonymisés (n° de ligne, clé, type, KPI ; bloc de totaux pour le fichier finance).
- Step 2 output — Feu vert avec la plage exacte des lignes de contrats, ou arrêt expliqué.
- Step 3 output — Database du mois avec la liste des contrats et KPI vides avant remplissage.
- Step 4 output — KPI remplis pour les lignes rapprochées, niveau de confiance et statut ; onglet « À traiter à la main ».
- Step 5 output — Onglet « Contrôle ».
- Step 6 output — Database du mois complète, informations des contrats remises, message « prête à valider » avec les comptages.
- Step 8 output — Database mise à jour après décisions, mémoire enrichie, contrôle relancé.

## Scenarios to run

Ordre du tour 2 : **E5 d'abord** (scénario raté au tour 1, avec au moins une décision « Non »), puis E1, E2, E3, E4, E6. E7 est noté dans E5. Chaque scénario dans une **nouvelle conversation** ouverte sur le dépôt, qui n'a jamais vu les requirements, le design ni le Build.

| ID | Input | Ce que le scénario teste | Golden Example |
|---|---|---|---|
| E1 | `outputs/import-mensuel-finance/inputs/E1-cloture-typique.md` — version fictive Novembre 2026, chaque contrat présent avec son WBS exact | tests AC1–AC3, AC8, AC13 | `inputs/jeu-fictif/scenarios/corrige-scenarios-E1-E4.md` (E1) |
| E2 | `outputs/import-mensuel-finance/inputs/E2-contrat-absent-database.md` — version fictive Décembre 2026, ligne `FH.TEST001` ajoutée | tests AC1, AC4, R3 | `inputs/jeu-fictif/scenarios/corrige-scenarios-E1-E4.md` (E2) |
| E3 | `outputs/import-mensuel-finance/inputs/E3-template-modifie.md` — version fictive Janvier 2027, en-tête « Turnover (€) » renommé | tests R7, G2 | `inputs/jeu-fictif/scenarios/corrige-scenarios-E1-E4.md` (E3) |
| E4 | `outputs/import-mensuel-finance/inputs/E4-database-deja-existante.md` — version fictive Février 2027, import lancé deux fois | tests AC8, AC12 | `inputs/jeu-fictif/scenarios/corrige-scenarios-E1-E4.md` (E4) |
| E5 | `outputs/import-mensuel-finance/inputs/E5-jeu-fictif-reference.md` — jeu fictif de référence Octobre 2026, 398 lignes / 400 contrats, mémoire vide | tests AC1–AC4, AC7, AC10, AC13, R2, R3, R9 ; aux décisions G1, Baptiste juge chaque paire lui-même ; au moins un « Non » est attendu pour vérifier AC10 | `inputs/jeu-fictif/corrige-jeu-fictif.md` |
| E6 | Même jeu que E5 relancé avec la mémoire `inputs/jeu-fictif/memoire-E6 (FICTIF).csv` | tests AC5, AC6 | `inputs/jeu-fictif/corrige-jeu-fictif.md` |
| E7 | Noté dans l'exécution de E5 : 8 multiservices codés `MS-…`, 2 sans code, référentiel non lu | tests AC1, AC3, AC10, R8, R10 | `inputs/jeu-fictif/corrige-jeu-fictif.md` |

**Phrase à taper dans la nouvelle conversation :**
- E1 : `/mon-import-mensuel-finance simule l'import de novembre 2026 avec le fichier finance "outputs/import-mensuel-finance/inputs/jeu-fictif/scenarios/Xbh Contracts Financial performance - Novembre 2026 (FICTIF - E1).xlsx" (fichiers fictifs).`
- E2 : `/mon-import-mensuel-finance simule l'import de décembre 2026 avec le fichier finance "outputs/import-mensuel-finance/inputs/jeu-fictif/scenarios/Xbh Contracts Financial performance - Décembre 2026 (FICTIF - E2).xlsx" (fichiers fictifs).`
- E3 : `/mon-import-mensuel-finance simule l'import de janvier 2027 avec le fichier finance "outputs/import-mensuel-finance/inputs/jeu-fictif/scenarios/Xbh Contracts Financial performance - Janvier 2027 (FICTIF - E3).xlsx" (fichiers fictifs).`
- E4 : `/mon-import-mensuel-finance simule l'import de février 2027 avec le fichier finance "outputs/import-mensuel-finance/inputs/jeu-fictif/scenarios/Xbh Contracts Financial performance - Février 2027 (FICTIF - E4).xlsx" (fichiers fictifs), puis relance exactement le même import une deuxième fois.`
- E5 + E7 : `/mon-import-mensuel-finance simule l'import d'octobre 2026 avec les fichiers fictifs par défaut et une mémoire vide (fichiers fictifs).`
- E6 : `/mon-import-mensuel-finance simule l'import d'octobre 2026 avec les fichiers fictifs par défaut et la mémoire "outputs/import-mensuel-finance/inputs/jeu-fictif/memoire-E6 (FICTIF).csv" (fichiers fictifs).`

À la fin de chaque exécution, écrire **test this** dans la même conversation.

## Report card

## Golden example deltas

*La comparaison au corrigé porte uniquement sur le résultat, pas sur le chemin suivi.*

## Not run

## Environment

- Aucun connecteur : la simulation lit et écrit des fichiers Excel fictifs du dépôt.
- Google Workspace Airbus : non disponible dans ce tour.

## Issues identified

## Accepted misses

- **AC13** (repris du tour 1) : question « fichiers fictifs ? » de la simulation quand l'ordre ne le précise pas — garde-fou volontaire, absent du programme Apps Script.

## Verdict

## Test records created

- Tour 2, 1er essai E5 (non noté, à relancer) : `runs/Database XBH Octobre 2026 v4.xlsx` et 2 lignes dans `runs.md` (branche `claude/simulation-octobre-2026`). Décisions « oui pour l'ensemble » : aucun « Non », donc AC10 après un rejet non vérifiable ; le faux ami (l. 171, `FH.F4ZSJ` ↔ `FH.FVZSJ`) confirmé. La mémoire créée a été déplacée (non supprimée) dans `runs/archive-tests-2026-10-28/memoire-correspondances (tour 2, E5 tout Oui).csv`, avec l'accord de Baptiste. La skill a bien présenté chaque paire et un exemple à clés inventées (correction de l'étape 8 vérifiée).
