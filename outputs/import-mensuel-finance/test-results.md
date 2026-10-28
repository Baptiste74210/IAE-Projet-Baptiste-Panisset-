---
workflow: import-mensuel-finance
design_spec: outputs/import-mensuel-finance/design-spec.md
requirements: outputs/import-mensuel-finance/requirements.md
date: 2026-10-28
environment: "Claude Code (web), skill mon-import-mensuel-finance après correction AC10 (commit 3d33e72), programme Python de référence, données fictives uniquement ; Google Workspace Airbus non disponible"
round_status: in-progress
criteria_total: 0
criteria_met: 0
results:
  E5: { AC1: met, AC2: met, AC3: met, AC4: met, AC5: not-run, AC6: not-run, AC7: met, AC8: met, AC9: met, AC10: met, AC11: met, AC12: met, AC13: met, R1: met, R2: met, R3: met, R4: met, R5: met, R6: met, R7: met, R8: not-run, R9: met, R10: met, G1: met, G2: met, "Step 1 output": not-run, "Step 2 output": met, "Step 3 output": met, "Step 4 output": met, "Step 5 output": met, "Step 6 output": met, "Step 8 output": met, edits: none }
  E7: { AC1: met, AC3: met, AC10: met, R8: not-run, R10: met, edits: none }
  E6: { AC1: met, AC2: met, AC3: met, AC4: met, AC5: met, AC6: met, AC7: met, AC8: met, AC9: met, AC10: met, AC11: met, AC12: met, AC13: met, R1: met, R2: met, R3: met, R4: met, R5: met, R6: met, R7: met, R8: not-run, R9: met, R10: met, G1: met, G2: met, "Step 1 output": not-run, "Step 2 output": met, "Step 3 output": met, "Step 4 output": met, "Step 5 output": met, "Step 6 output": met, "Step 8 output": not-run, edits: none }
  E1: { AC1: met, AC2: met, AC3: met, AC4: met, AC5: not-run, AC6: not-run, AC7: met, AC8: met, AC9: met, AC10: met, AC11: met, AC12: met, AC13: met, R1: met, R2: met, R3: met, R4: met, R5: met, R6: met, R7: met, R8: not-run, R9: met, R10: met, G1: met, G2: met, "Step 1 output": not-run, "Step 2 output": met, "Step 3 output": met, "Step 4 output": met, "Step 5 output": met, "Step 6 output": met, "Step 8 output": not-run, edits: none }
  E2: { AC1: met, AC2: met, AC3: met, AC4: met, AC5: not-run, AC6: not-run, AC7: met, AC8: met, AC9: met, AC10: met, AC11: met, AC12: met, AC13: met, R1: met, R2: met, R3: met, R4: met, R5: met, R6: met, R7: met, R8: not-run, R9: met, R10: met, G1: met, G2: met, "Step 1 output": not-run, "Step 2 output": met, "Step 3 output": met, "Step 4 output": met, "Step 5 output": met, "Step 6 output": met, "Step 8 output": not-run, edits: none }
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

### E5 + E7 — Jeu fictif de référence (Octobre 2026), mémoire vide — tour 2, noté le 2026-10-28

Relance après un premier essai sans « Non ». Exécution collée dans la conversation d'ouverture et notée là ; la session n'a lu que la skill (« Je n'ai ouvert ni les specs, ni les requirements, ni les résultats de tests, ni les corrigés »). Preuves complétées par `runs/Database XBH Octobre 2026 v5.xlsx` (sur `main`). Décisions de Baptiste : « Oui pour les 15 et aucun NON » — Baptiste confirme qu'il juge les 15 paires justes. Notes confirmées par Baptiste ; retouches : aucune.

| Expected | From | Result | Evidence |
|---|---|---|---|
| Aucune ligne oubliée | AC1 (must) | Met | 398 = 370 + 15 + 13 ; après décisions 385 + 13 |
| Totaux justes | AC2 (must) | Met | Écart 0, OK pour les 4 KPI, avant et après décisions |
| Aucune information client lue | AC3 (must) | Met | « anonymisation sans lire la colonne client » ; multiservices sans code non rapprochés |
| Incertains listés | AC4 | Met | 15 paires : clés, niveau, écart, Décision vide |
| « Oui » reconnu le mois suivant | AC5 | Not run | Demande une exécution suivante (E6) |
| « Non » retiré, (g), mémorisé | AC6 | Not run | Aucun « Non » saisi |
| KPI identiques | AC7 | Met | Totaux database identiques au corrigé avant décisions (1 467 184 114,25) |
| Nom exact | AC8 | Met | `… Octobre 2026 v5.xlsx` ; « Les versions 1 à 4 sont conservées » |
| En-têtes et informations identiques | AC9 | Met | Même programme et même database |
| « À traiter à la main » complet | AC10 | Met | 33 lignes, toutes avec n°, clé, type, raison (aucune ligne (g) créée faute de « Non ») |
| Onglet Contrôle | AC11 | Met | Totaux, statuts, comptages, décisions (15 Oui, 0 Non) |
| Entrées inchangées | AC12 | Met | Seuls des fichiers de `runs/` modifiés |
| Aucune question avant « prête » | AC13 | Met | « prérequis OK … Je lance la simulation » |
| Chaque ligne rapprochée ou listée | R1 | Met | 398 lignes classées |
| Rien d'inventé ni d'additionné | R2 | Met | Doublons « n'ont pas été additionnés » ; N/A tel quel |
| Incertain jamais définitif sans « Oui » | R3 | Met | « Tant que tu n'as pas décidé … La validation reste impossible » |
| Périmètre | R4 | Met | Rien hors périmètre |
| Noms exacts | R5 | Met | 4 onglets |
| Mois de l'ordre | R6 | Met | Octobre 2026 |
| Arrêt seulement si inutilisable | R7 | Met | Pas d'arrêt |
| Rien ne sort du Workspace | R8 | Not run | Propre au Google Workspace |
| Même type, une seule fois | R9 | Met | Paires de même type, chaque contrat une fois |
| Nom du client jamais utilisé | R10 | Met | Même preuve que AC3 |
| Décision avant validation | G1 | Met | « Pour chacune, réponds Oui ou Non. La décision t'appartient » ; exemple à clés inventées ; validation possible seulement après les 15 réponses |
| Arrêt sur fichier inutilisable | G2 | Met | Pas d'arrêt injustifié |
| Fichiers anonymisés | Step 1 output | Not run | Écrits seulement par Apps Script |
| Étapes 2 à 6 | Steps 2–6 output | Met | v5, KPI remplis, Contrôle OK, résumé |
| Prise en compte des décisions | Step 8 output | Met | 15 Oui appliqués, mémoire créée, contrôle relancé |

**E7 :** AC1, AC3, AC10, R10 Met (8 codes `MS-…` à 100 %, 2 sans code en (c) des deux côtés) ; R8 Not run.

**Point de vigilance (hors bulletin) :** Baptiste a confirmé la paire de la ligne 171 (`FH.F4ZSJ` ↔ `FH.FVZSJ`), que le jeu de test présente comme un faux ami (deux contrats différents). Le workflow a fait ce qu'il doit : proposer avec la confiance « Moyenne » et laisser la décision à Baptiste. Sur des données réelles, les correspondances « Moyenne » demandent une vérification contrat par contrat.

### E6 — Mois suivant après confirmations (Octobre 2026, mémoire E6) — tour 2, noté le 2026-10-28

Exécution collée dans la conversation d'ouverture et notée là ; la session n'a lu que la skill. Preuves : `runs/Database XBH Octobre 2026 v6.xlsx` (sur `main`), comparé à `v3` (E6 du tour 1) : identiques (384 / 0 / 14, 12 contrats (b), mêmes totaux). La session indiquait « 13 au lieu de 12 » pour la v3 : erreur du résumé de la session du tour 1, pas du programme. Notes confirmées par Baptiste ; retouches : aucune.

| Expected | From | Result | Evidence |
|---|---|---|---|
| Aucune ligne oubliée | AC1 (must) | Met | 398 = 384 + 0 + 14 |
| Totaux justes | AC2 (must) | Met | Écart 0, OK ; Turnover database 1 465 282 374,18 |
| Aucune information client lue | AC3 (must) | Met | « Le programme n'a lu ni la colonne client, ni le corrigé, ni le référentiel des multiservices » |
| Incertains listés | AC4 | Met | 0 à confirmer |
| « Oui » reconnu le mois suivant | AC5 | Met | « 14 rapprochées grâce aux paires confirmées dans la mémoire E6 » |
| « Non » jamais reproposé | AC6 | Met | Faux ami en (a) « sans aucun candidat » |
| KPI identiques | AC7 | Met | Identique à v3 et au corrigé |
| Nom exact | AC8 | Met | `… v6.xlsx` ; « Les versions v1 à v5 sont conservées » |
| En-têtes et informations identiques | AC9 | Met | Identique à v3 |
| « À traiter à la main » complet | AC10 | Met | 35 lignes, toutes avec type |
| Onglet Contrôle | AC11 | Met | Totaux, statuts, comptages |
| Entrées inchangées | AC12 | Met | « Aucun fichier d'entrée et aucune mémoire n'ont été modifiés » |
| Aucune question | AC13 | Met | Lancement direct |
| Règles R1–R7, R9, R10 | R1–R7, R9, R10 | Met | Doublons non additionnés ; N/A tel quel ; paire rejetée exclue ; pas d'arrêt |
| Rien ne sort du Workspace | R8 | Not run | Google Workspace |
| Décision avant validation | G1 | Met | Rien à décider ; « la validation est possible » |
| Arrêt sur fichier inutilisable | G2 | Met | Pas d'arrêt injustifié |
| Fichiers anonymisés | Step 1 output | Not run | Apps Script |
| Étapes 2 à 6 | Steps 2–6 output | Met | v6, KPI, Contrôle OK, résumé |
| Prise en compte des décisions | Step 8 output | Not run | Aucune décision |

### E1 — Clôture typique (Novembre 2026, fictif) — tour 2, noté le 2026-10-28

Exécution collée dans la conversation d'ouverture et notée là ; la session n'a lu que la skill. Preuve : `runs/Database XBH Novembre 2026.xlsx` (sur `main`), identique cellule par cellule (hors date) à celui du tour 1 (branche `simulation-novembre-2026`). Notes confirmées par Baptiste ; retouches : aucune.

| Expected | From | Result | Evidence |
|---|---|---|---|
| Aucune ligne oubliée | AC1 (must) | Met | 400 = 398 + 0 + 2 |
| Totaux justes | AC2 (must) | Met | OK pour les 4 KPI ; Turnover database 1 635 558 259,04 |
| Aucune information client lue | AC3 (must) | Met | Multiservices sans code non rapprochés |
| Incertains listés | AC4 | Met | Aucun : « La deuxième passe … n'a rien proposé » |
| « Oui » / « Non » mémorisés | AC5, AC6 | Not run | Aucune décision |
| KPI, nom, en-têtes, à traiter, Contrôle, entrées | AC7–AC12 | Met | Fichier identique au tour 1 ; version 1 ; seuls `runs/` et `runs.md` modifiés |
| Aucune question | AC13 | Met | Lancement direct |
| Règles R1–R7, R9, R10 | R1–R7, R9, R10 | Met | 398 + 2 ; pas d'arrêt ; aucun nom de client |
| Rien ne sort du Workspace | R8 | Not run | Google Workspace |
| Décision avant validation | G1 | Met | « Validé : possible, c'est à vous de cocher la case » |
| Arrêt sur fichier inutilisable | G2 | Met | « aucune anomalie … ne s'est pas arrêté » |
| Fichiers anonymisés | Step 1 output | Not run | Apps Script |
| Étapes 2 à 6 | Steps 2–6 output | Met | Comme au tour 1 |
| Prise en compte des décisions | Step 8 output | Not run | Aucune décision |

### E2 — Contrat inconnu (Décembre 2026, fictif) — tour 2, noté le 2026-10-28

Exécution collée dans la conversation d'ouverture et notée là ; la session n'a lu que la skill. Preuves : `runs/Database XBH Décembre 2026 v2.xlsx` (sur `main`), identique hors date et version au fichier du tour 1 ; la v1 garde la même empreinte (0241d18) avant et après. Notes confirmées par Baptiste ; retouches : aucune.

| Expected | From | Result | Evidence |
|---|---|---|---|
| Aucune ligne oubliée | AC1 (must) | Met | 401 = 398 + 0 + 3 |
| Totaux justes | AC2 (must) | Met | « 1 629 735 253,88 € = 1 620 669 366,87 € + 9 065 887,01 € » ; OK pour les 4 KPI |
| Aucune information client lue | AC3 (must) | Met | Multiservices sans code non rapprochés |
| Incertains listés / jamais à tort | AC4 | Met | `FH.TEST001` : « aucun code proche n'a été trouvé (raison a) » |
| « Oui » / « Non » mémorisés | AC5, AC6 | Not run | Aucune décision |
| KPI identiques | AC7 | Met | Identique au tour 1 et au corrigé |
| v2 sans modifier la v1 | AC8 | Met | « Le programme ne l'a pas touché et a créé … v2.xlsx » ; empreinte v1 inchangée |
| En-têtes, à traiter, Contrôle, entrées | AC9–AC12 | Met | Identique au tour 1 ; seuls `runs/` et `runs.md` modifiés |
| Aucune question | AC13 | Met | Lancement direct |
| Règles R1–R7, R9, R10 | R1–R7, R9, R10 | Met | 398 + 3 ; `FH.TEST001` jamais à 100 % (R3) ; pas d'arrêt |
| Rien ne sort du Workspace | R8 | Not run | Google Workspace |
| Décision avant validation | G1 | Met | « la validation est déjà possible » |
| Arrêt sur fichier inutilisable | G2 | Met | « aucune anomalie dans le fichier » |
| Fichiers anonymisés | Step 1 output | Not run | Apps Script |
| Étapes 2 à 6 | Steps 2–6 output | Met | v2, KPI, Contrôle OK, résumé |
| Prise en compte des décisions | Step 8 output | Not run | Aucune décision |

## Golden example deltas

*La comparaison au corrigé porte uniquement sur le résultat, pas sur le chemin suivi.*

- **E5** : avant décisions, identique au corrigé (370 / 15 dont 10 Élevée et 5 Moyenne / 13, mêmes totaux). Après décisions : 385 / 0 / 13 au lieu de 384 / 0 / 14, parce que le faux ami a été confirmé — écart dû à la décision, pas au programme.
- **E7** : identique au corrigé.
- **E6** : identique au corrigé et au tour 1.
- **E1** : identique au corrigé et au tour 1.
- **E2** : identique au corrigé et au tour 1.

## Not run

- **E5** — AC5 : vu en E6. AC6 : aucun « Non » saisi ; **AC10 après un « Non »** n'a donc pas été exercé dans une exécution notée. Il est couvert par les tests automatiques du Build correctif : chaîne Python E5 → décisions (avec le « Non » du faux ami) → `lignes_a_traiter_sans_type` = 0, et vérification `Code.gs` « type de contrat sur chaque ligne, y compris après un Non » (non conforme sur l'ancien code, conforme sur le nouveau). R8, Step 1 output : Google Workspace.
- **E7** — R8 : Google Workspace.
- **E1** — AC5, AC6, Step 8 output : aucune décision. R8, Step 1 output : Google Workspace / Apps Script.
- **E2** — AC5, AC6, Step 8 output : aucune décision. R8, Step 1 output : Google Workspace / Apps Script.
- **E6** — Step 8 output : aucune décision. R8, Step 1 output : Google Workspace / Apps Script.

## Environment

- Aucun connecteur : la simulation lit et écrit des fichiers Excel fictifs du dépôt.
- Google Workspace Airbus : non disponible dans ce tour.

## Issues identified

## Accepted misses

- **AC13** (repris du tour 1) : question « fichiers fictifs ? » de la simulation quand l'ordre ne le précise pas — garde-fou volontaire, absent du programme Apps Script.

## Verdict

## Test records created

- Tour 2, E2 : `runs/Database XBH Décembre 2026 v2.xlsx` et une ligne dans `runs.md` (branche `claude/import-decembre-2026-e2`).

- Tour 2, E1 : `runs/Database XBH Novembre 2026.xlsx` et une ligne dans `runs.md` (branche `claude/import-novembre-2026`).

- Tour 2, E6 : `runs/Database XBH Octobre 2026 v6.xlsx` et une ligne dans `runs.md` (branche `claude/simulation-octobre-2026-memoire-e6`).

- Tour 2, E5 noté : `runs/Database XBH Octobre 2026 v5.xlsx`, 2 lignes dans `runs.md` (branche `claude/simulation-octobre-2026-v5`) ; la mémoire créée a été déplacée (non supprimée) dans `runs/archive-tests-2026-10-28/memoire-correspondances (tour 2, E5 relance, 15 Oui).csv`.

- Tour 2, 1er essai E5 (non noté, à relancer) : `runs/Database XBH Octobre 2026 v4.xlsx` et 2 lignes dans `runs.md` (branche `claude/simulation-octobre-2026`). Décisions « oui pour l'ensemble » : aucun « Non », donc AC10 après un rejet non vérifiable ; le faux ami (l. 171, `FH.F4ZSJ` ↔ `FH.FVZSJ`) confirmé. La mémoire créée a été déplacée (non supprimée) dans `runs/archive-tests-2026-10-28/memoire-correspondances (tour 2, E5 tout Oui).csv`, avec l'accord de Baptiste. La skill a bien présenté chaque paire et un exemple à clés inventées (correction de l'étape 8 vérifiée).
