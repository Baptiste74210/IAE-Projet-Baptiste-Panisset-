---
workflow: import-mensuel-finance
design_spec: outputs/import-mensuel-finance/design-spec.md
requirements: outputs/import-mensuel-finance/requirements.md
date: 2026-10-28
environment: "Claude Code (web), skill mon-import-mensuel-finance, programme Python de référence (identique à Apps Script, vérifié au Build), données fictives uniquement ; Google Workspace Airbus non disponible"
round_status: in-progress
criteria_total: 0
criteria_met: 0
results:
  E1: { AC1: met, AC2: met, AC3: met, AC4: met, AC5: not-run, AC6: not-run, AC7: met, AC8: met, AC9: met, AC10: met, AC11: met, AC12: met, AC13: met, R1: met, R2: met, R3: met, R4: met, R5: met, R6: met, R7: met, R8: not-run, R9: met, R10: met, G1: met, G2: met, "Step 1 output": not-run, "Step 2 output": met, "Step 3 output": met, "Step 4 output": met, "Step 5 output": met, "Step 6 output": met, "Step 8 output": not-run, edits: none }
  E5: { AC1: met, AC2: met, AC3: met, AC4: met, AC5: not-run, AC6: met, AC7: met, AC8: met, AC9: met, AC10: not-met, AC11: met, AC12: met, AC13: not-met, R1: met, R2: met, R3: met, R4: met, R5: met, R6: met, R7: met, R8: not-run, R9: met, R10: met, G1: met, G2: met, "Step 1 output": not-run, "Step 2 output": met, "Step 3 output": met, "Step 4 output": met, "Step 5 output": met, "Step 6 output": met, "Step 8 output": met, edits: minor }
  E7: { AC1: met, AC3: met, AC10: met, R8: not-run, R10: met, edits: minor }
  E2: { AC1: met, AC2: met, AC3: met, AC4: met, AC5: not-run, AC6: not-run, AC7: met, AC8: met, AC9: met, AC10: met, AC11: met, AC12: met, AC13: met, R1: met, R2: met, R3: met, R4: met, R5: met, R6: met, R7: met, R8: not-run, R9: met, R10: met, G1: met, G2: met, "Step 1 output": not-run, "Step 2 output": met, "Step 3 output": met, "Step 4 output": met, "Step 5 output": met, "Step 6 output": met, "Step 8 output": not-run, edits: none }
  E3: { AC1: not-run, AC2: not-run, AC3: met, AC4: not-run, AC5: not-run, AC6: not-run, AC7: not-run, AC8: met, AC9: not-run, AC10: not-run, AC11: not-run, AC12: met, AC13: met, R1: not-run, R2: met, R3: not-run, R4: met, R5: not-run, R6: met, R7: met, R8: not-run, R9: not-run, R10: met, G1: not-run, G2: met, "Step 1 output": not-run, "Step 2 output": met, "Step 3 output": not-run, "Step 4 output": not-run, "Step 5 output": not-run, "Step 6 output": not-run, "Step 8 output": not-run, edits: none }
  E4: { AC1: met, AC2: met, AC3: met, AC4: met, AC5: not-run, AC6: not-run, AC7: met, AC8: met, AC9: met, AC10: met, AC11: met, AC12: met, AC13: met, R1: met, R2: met, R3: met, R4: met, R5: met, R6: met, R7: met, R8: not-run, R9: met, R10: met, G1: met, G2: met, "Step 1 output": not-run, "Step 2 output": met, "Step 3 output": met, "Step 4 output": met, "Step 5 output": met, "Step 6 output": met, "Step 8 output": not-run, edits: none }
---

# Résultats de test — Import Mensuel Finance, tour 1

**Règle de réussite (confirmée le 2026-10-28) :** le workflow est **prêt** quand chaque ligne du bulletin est « atteinte » dans chaque scénario. Un raté sur une ligne **(must)** fait toujours échouer le scénario. Tout autre raté est soit corrigé, soit accepté avec sa raison. Liste des contrôles gardée telle quelle.

**Limite du tour :** la simulation tourne hors du Google Workspace Airbus. Les parties de ligne propres au Workspace (même dossier Google Drive et mêmes partages pour AC8, R8, réinjection dans la vraie database à l'étape 6) sont notées `not-run` et seront vérifiées à l'étape Run.

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

Ordre conseillé : E1, E2, E3, E4, E5 (qui note aussi E7), E6. Chaque scénario dans une **nouvelle conversation** ouverte sur le dépôt, qui n'a jamais vu les requirements, le design ni le Build.

| ID | Input | Ce que le scénario teste | Golden Example |
|---|---|---|---|
| E1 | `outputs/import-mensuel-finance/inputs/E1-cloture-typique.md` — version fictive Novembre 2026, chaque contrat présent avec son WBS exact | tests AC1–AC3, AC8, AC13 | `inputs/jeu-fictif/scenarios/corrige-scenarios-E1-E4.md` (E1) |
| E2 | `outputs/import-mensuel-finance/inputs/E2-contrat-absent-database.md` — version fictive Décembre 2026, ligne `FH.TEST001` ajoutée | tests AC1, AC4, R3 | `inputs/jeu-fictif/scenarios/corrige-scenarios-E1-E4.md` (E2) |
| E3 | `outputs/import-mensuel-finance/inputs/E3-template-modifie.md` — version fictive Janvier 2027, en-tête « Turnover (€) » renommé | tests R7, G2 | `inputs/jeu-fictif/scenarios/corrige-scenarios-E1-E4.md` (E3) |
| E4 | `outputs/import-mensuel-finance/inputs/E4-database-deja-existante.md` — version fictive Février 2027, import lancé deux fois | tests AC8, AC12 | `inputs/jeu-fictif/scenarios/corrige-scenarios-E1-E4.md` (E4) |
| E5 | `outputs/import-mensuel-finance/inputs/E5-jeu-fictif-reference.md` — jeu fictif de référence Octobre 2026, 398 lignes / 400 contrats, mémoire vide | tests AC1–AC4, AC7, AC10, AC13, R2, R3, R9 ; aux décisions G1, répondre selon la « bonne décision » du corrigé (14 Oui, faux ami Non) | `inputs/jeu-fictif/corrige-jeu-fictif.md` |
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

## Smoke run (phase 3, non noté)

Lecture de la skill `mon-import-mensuel-finance` contre les requirements : les étapes 1 à 8, les raisons (a) à (h), le point de contrôle G1 (« me présenter les correspondances à moins de 100 % et attendre mon Oui ou Non ») et G2 (« ne rien créer, m'expliquer l'anomalie ») sont présents ; la skill se termine par la liste « Ce que j'ai fait ». **Point d'attention pour AC13 :** l'étape 1 de la skill demande de confirmer que les fichiers sont fictifs ; la phrase de lancement contient « (fichiers fictifs) » pour que cette question ne soit pas posée.

## Report card

### E1 — Clôture typique (Novembre 2026, fictif) — noté le 2026-10-28

Exécution collée dans la conversation d'ouverture et notée là. La session d'exécution n'a lu que la skill (« Je n'ai ouvert ni design-spec.md, ni requirements.md, ni test-results.md, ni les corrigés »). Preuves complétées par le fichier produit `runs/Database XBH Novembre 2026.xlsx` (branche `simulation-novembre-2026`). Notes confirmées par Baptiste ; retouches : aucune.

| Expected | From | Result | Evidence |
|---|---|---|---|
| Aucune ligne oubliée | AC1 (must) | Met | 400 lignes = 398 à 100 % + 0 en attente + 2 en (c) |
| Totaux justes à 0,01 près | AC2 (must) | Met | Bloc = lignes pour les 4 KPI ; database + non rapprochées = lignes (Turnover 1 635 558 259,04 + 7 646 621,06 = 1 643 204 880,10) ; écart 0, OK ; tests AC1–AC3, AC8, AC13 |
| Aucune information client lue | AC3 (must) | Met | « il faudrait lire le nom du client, ce que la skill interdit. Je ne les ai donc pas rapprochés » |
| Correspondances incertaines listées | AC4 | Met | Aucune ; onglet présent, vide |
| Paire « Oui » mémorisée | AC5 | Not run | Aucune décision dans ce scénario |
| Paire « Non » retirée et mémorisée | AC6 | Not run | Aucune décision dans ce scénario |
| KPI strictement identiques | AC7 | Met | 398 / 398 lignes identiques au fichier finance (passe 2 : vue en E5) |
| Nom exact, aucune version modifiée | AC8 | Met | `Database XBH Novembre 2026.xlsx`, version 1 ; dossier Google Drive : Run |
| En-têtes et informations contrats identiques | AC9 | Met | En-têtes identiques ; informations des 400 contrats identiques |
| « À traiter à la main » complet | AC10 | Met | 4 lignes : n° de ligne, clé « donnée manquante », type, raison (c) |
| Onglet « Contrôle » complet | AC11 | Met | Totaux bloc / lignes / database, écart, statut, comptages par niveau, trace |
| Entrées inchangées | AC12 | Met | Seuls le fichier du mois et `runs.md` modifiés sur la branche |
| Aucune question avant « prête à valider » | AC13 | Met | « votre message indiquait que les fichiers sont fictifs, je l'ai pris comme confirmation » |
| Chaque ligne rapprochée ou listée | R1 | Met | 398 + 2 = 400 |
| Rien d'inventé ni d'arrondi | R2 | Met | 398 / 398 identiques ; multiservices sans code non devinés |
| Incertain jamais définitif sans « Oui » | R3 | Met | Aucun rapprochement incertain |
| Reste dans le périmètre | R4 | Met | Propose d'ajouter les codes `MS-…` sans le faire |
| Noms exacts | R5 | Met | Onglets Database, À traiter à la main, Correspondances à confirmer, Contrôle |
| Mois de l'ordre | R6 | Met | « Mois : Novembre 2026 » |
| Arrêt seulement si fichier inutilisable | R7 | Met | Pas d'arrêt ; cas particuliers listés |
| Rien ne sort du Workspace | R8 | Not run | Propre au Google Workspace Airbus |
| Même type, une seule fois, rejet respecté | R9 | Met | Aucune passe 2 ; chaque contrat utilisé une fois |
| Nom du client jamais utilisé | R10 | Met | Même preuve que AC3 |
| Décision avant validation | G1 | Met | Rien à décider ; « Validé : possible (case à cocher par Baptiste) » |
| Arrêt sur fichier inutilisable | G2 | Met | « Il ne s'est pas arrêté sur une anomalie » ; fichier conforme |
| Fichiers anonymisés | Step 1 output | Not run | La simulation anonymise sans écrire de fichier |
| Feu vert avec la plage | Step 2 output | Met | 400 lignes lues (lignes 20 à 419) |
| Database du mois préparée | Step 3 output | Met | 400 contrats, version 1 |
| KPI remplis, onglet à traiter | Step 4 output | Met | 398 lignes remplies, 4 à traiter |
| Onglet Contrôle | Step 5 output | Met | 4 KPI OK |
| Database complète + message « prête » | Step 6 output | Met | « la validation est possible » avec le résumé |
| Prise en compte des décisions | Step 8 output | Not run | Aucune décision |

### E5 + E7 — Jeu fictif de référence (Octobre 2026), mémoire vide — noté le 2026-10-28

Exécution lancée pour E2, mais la session a simulé Octobre 2026 avec les fichiers par défaut et une mémoire vide : notée comme **E5** (et E7 dans la même exécution), avec l'accord de Baptiste. Collée dans la conversation d'ouverture et notée là. La session n'a lu que la skill. Preuves complétées par `runs/Database XBH Octobre 2026 v2.xlsx` avant (commit 555bbf8) et après décisions (commit 224ff1b). Décisions saisies : « Tout Oui sauf 155 et 303 » (exemple proposé par la session ; le corrigé attendait 14 Oui et Non sur la ligne 171, le faux ami). Notes confirmées par Baptiste ; retouches : un peu.

| Expected | From | Result | Evidence |
|---|---|---|---|
| Aucune ligne oubliée | AC1 (must) | Met | 398 = 370 + 15 + 13 ; après décisions 398 = 383 + 15 ; tests AC1–AC4, AC7, AC10, AC13, R2, R3, R9 |
| Totaux justes à 0,01 près | AC2 (must) | Met | Écart restant 0, OK pour les 4 KPI, avant et après décisions |
| Aucune information client lue | AC3 (must) | Met | Multiservices sans code (l. 99, 409) non rapprochés : aucun nom utilisé |
| Incertains listés, Décision vide | AC4 | Met | 15 lignes : 2 clés, niveau, écart, Décision vide, statut « En attente de confirmation » |
| « Oui » reconnu le mois suivant | AC5 | Not run | Demande une exécution suivante (E6) |
| « Non » retiré, (g), mémorisé | AC6 | Met | L. 155 et 303 : KPI retirés, raison (g), « rejetée » dans `memoire-correspondances.csv` ; « plus jamais proposée » : E6 |
| KPI identiques dont passe 2 | AC7 | Met | 15 / 15 rapprochements de passe 2 identiques au fichier finance |
| Nom exact, aucune version modifiée | AC8 | Met | `Database XBH Octobre 2026 v2.xlsx` « pour ne pas écraser le fichier d'Octobre déjà présent » |
| En-têtes et informations identiques | AC9 | Met | Identiques sur 400 contrats |
| « À traiter à la main » complet | AC10 | Not met | Après l'étape 8, 4 lignes sans type de contrat : l. 155 et 303 (g), database l. 359 et l. 76 (b après rejet) ; complet avant décisions |
| Onglet Contrôle complet | AC11 | Met | Totaux, statuts, 370 / 10 / 5 / 0 / 13, trace et décisions (13 Oui, 2 Non, 0 manquante) |
| Entrées inchangées | AC12 | Met | Seuls des fichiers de `runs/` modifiés |
| Aucune question avant « prête à valider » | AC13 | Not met | « confirmez-vous que les fichiers du dossier jeu-fictif sont bien fictifs … et quel usage voulez-vous ? » posée avant le lancement |
| Chaque ligne rapprochée ou listée | R1 | Met | 398 lignes classées |
| Rien d'inventé ni d'additionné | R2 | Met | Doublons (e) jamais additionnés ; « N/A » recopié tel quel (f) |
| Incertain jamais définitif sans « Oui » | R3 | Met | « Je n'ai rien décidé à votre place » ; statut en attente jusqu'aux réponses |
| Périmètre | R4 | Met | Rien hors périmètre |
| Noms exacts | R5 | Met | Fichier et 4 onglets |
| Mois de l'ordre | R6 | Met | Octobre 2026, mois lancé |
| Arrêt seulement si inutilisable | R7 | Met | Pas d'arrêt ; pièges listés |
| Rien ne sort du Workspace | R8 | Not run | Propre au Google Workspace |
| Même type, une seule fois | R9 | Met | 0 rapprochement de types différents sur 15 ; chaque contrat une fois |
| Nom du client jamais utilisé | R10 | Met | Même preuve que AC3 |
| Décision avant validation | G1 | Met | « Validé : indisponible : décisions à prendre », puis « possible » après les 15 décisions |
| Arrêt sur fichier inutilisable | G2 | Met | Fichier utilisable, pas d'arrêt |
| Fichiers anonymisés | Step 1 output | Not run | Écrits seulement par Apps Script |
| Feu vert avec la plage | Step 2 output | Met | 398 lignes lues |
| Database du mois préparée | Step 3 output | Met | v2, 400 contrats |
| KPI remplis, onglet à traiter | Step 4 output | Met | 385 lignes remplies, 18 lignes finance + 15 lignes database à traiter |
| Onglet Contrôle | Step 5 output | Met | 4 KPI OK |
| Database complète + message « prête » | Step 6 output | Met | Résumé et demande de décisions |
| Prise en compte des décisions | Step 8 output | Met | 13 Oui / 2 Non appliqués, mémoire créée (15 paires), contrôle relancé |

**E7 (multiservices), dans la même exécution :** AC1 Met (aucune ligne multiservices oubliée) ; AC3 et R10 Met (multiservices identifiés par le seul code `MS-…`, référentiel non lu) ; AC10 Met (l. 99, 409 et database l. 30, 118 en (c) avec n° de ligne, clé, type, raison) ; R8 Not run. Les 8 codes `MS-001` à `MS-008` sont rapprochés à 100 %.

**Observation (hors bulletin) :** la session a proposé un exemple de réponse avec de vrais numéros de ligne (« tout Oui sauf 155 et 303 ») ; Baptiste l'a repris tel quel, d'où un faux ami confirmé et deux bonnes paires rejetées. Le programme a appliqué fidèlement les décisions ; le risque est dans la façon de demander.

### E2 — Contrat inconnu (Décembre 2026, fictif) — noté le 2026-10-28

Exécution collée dans la conversation d'ouverture et notée là ; la session n'a lu que la skill (« Je n'ai ouvert aucun des fichiers exclus »). Lancement en un seul message (rattachement du dépôt + ordre). Preuves complétées par `runs/Database XBH Décembre 2026.xlsx` (sur `main`). Notes confirmées par Baptiste ; retouches : aucune.

| Expected | From | Result | Evidence |
|---|---|---|---|
| Aucune ligne oubliée | AC1 (must) | Met | 401 = 398 + 0 + 3 ; tests AC1, AC4, R3 |
| Totaux justes | AC2 (must) | Met | Écart 0, OK pour les 4 KPI ; 1 000 de `FH.TEST001` dans la part non rapprochée |
| Aucune information client lue | AC3 (must) | Met | « le programme ne peut pas les relier sans code » |
| Incertains listés | AC4 | Met | Aucun ; `FH.TEST001` jamais rapproché à un contrat au hasard |
| « Oui » mémorisé | AC5 | Not run | Aucune décision |
| « Non » mémorisé | AC6 | Not run | Aucune décision |
| KPI identiques | AC7 | Met | 398 / 398 |
| Nom exact | AC8 | Met | `Database XBH Décembre 2026.xlsx`, version 1 |
| En-têtes et informations identiques | AC9 | Met | 400 contrats identiques |
| « À traiter à la main » complet | AC10 | Met | 5 lignes complètes ; ligne 420, `FH.TEST001`, XBH, (a), 1 000 par KPI |
| Onglet Contrôle | AC11 | Met | Totaux, statuts, comptages, trace |
| Entrées inchangées | AC12 | Met | Seuls le fichier du mois et `runs.md` modifiés |
| Aucune question avant « prête » | AC13 | Met | « J'ai considéré votre demande comme la confirmation que les fichiers sont fictifs » |
| Chaque ligne rapprochée ou listée | R1 | Met | 398 + 3 = 401 |
| Rien d'inventé | R2 | Met | 398 / 398 identiques |
| Jamais à 100 % sans « Oui » | R3 | Met | `FH.TEST001` en (a) « sans contrat proche », jamais à 100 % |
| Périmètre | R4 | Met | Propose de compléter les codes `MS-…` sans le faire |
| Noms exacts | R5 | Met | 4 onglets |
| Mois de l'ordre | R6 | Met | Décembre 2026 |
| Arrêt seulement si inutilisable | R7 | Met | « Le fichier finance a passé tous les contrôles » |
| Rien ne sort du Workspace | R8 | Not run | Propre au Google Workspace |
| Même type, une seule fois | R9 | Met | Aucune passe 2 ; chaque contrat une fois |
| Nom du client jamais utilisé | R10 | Met | Même preuve que AC3 |
| Décision avant validation | G1 | Met | Rien à décider ; « La validation du mois est donc possible » |
| Arrêt sur fichier inutilisable | G2 | Met | Pas d'arrêt injustifié |
| Fichiers anonymisés | Step 1 output | Not run | Écrits seulement par Apps Script |
| Feu vert avec la plage | Step 2 output | Met | 401 lignes lues |
| Database préparée | Step 3 output | Met | Version 1, 400 contrats |
| KPI remplis, onglet à traiter | Step 4 output | Met | 398 remplies, 5 à traiter |
| Onglet Contrôle | Step 5 output | Met | 4 KPI OK |
| Database complète + message | Step 6 output | Met | Résumé « La validation du mois est donc possible » |
| Prise en compte des décisions | Step 8 output | Not run | Aucune décision |

### E3 — Template modifié (Janvier 2027, fictif) — noté le 2026-10-28

Exécution collée dans la conversation d'ouverture et notée là ; la session n'a lu que la skill et la seule ligne 19 du fichier finance (« Je n'ai lu aucune donnée client, et je n'ai ouvert ni design-spec.md, ni requirements.md, ni test-results.md, ni les corrigés »). Vérifié sur `main` : aucun fichier `Database XBH Janvier 2027`, seul `runs.md` modifié. Notes confirmées par Baptiste ; retouches : aucune.

| Expected | From | Result | Evidence |
|---|---|---|---|
| Aucune information client lue | AC3 (must) | Met | « j'ai lu uniquement les en-têtes de la ligne 19. Je n'ai lu aucune donnée client » |
| Aucune version modifiée | AC8 | Met | Aucun fichier créé |
| Entrées inchangées | AC12 | Met | Seul `runs.md` modifié |
| Aucune question avant l'arrêt | AC13 | Met | Lancement direct, arrêt G2 |
| Rien d'inventé | R2 | Met | « Il ne devine pas la colonne, pour éviter de recopier un chiffre au mauvais endroit » |
| Périmètre | R4 | Met | Propose une modification de la skill sans la faire |
| Mois de l'ordre | R6 | Met | Janvier 2027 |
| Arrêt avant toute écriture | R7 | Met | « Aucune database du mois n'a été créée » ; code 2 ; tests R7, G2 |
| Nom du client jamais utilisé | R10 | Met | Même preuve que AC3 |
| Arrêt expliqué | G2 | Met | « Dans la cellule F19, l'en-tête est devenu "Turnover (€)_v2" » ; autres en-têtes confirmés |
| Feu vert ou arrêt expliqué | Step 2 output | Met | Arrêt nommant F19 et l'en-tête attendu |
| Autres lignes | AC1, AC2, AC4–AC7, AC9–AC11, R1, R3, R5, R8, R9, G1, Steps 1, 3–6, 8 | Not run | Arrêt voulu avant le rapprochement |

**Observation (hors bulletin) :** après l'arrêt, la session a proposé de modifier la skill pour accepter une variante d'en-tête ; non retenu pendant le test (règle « on ne corrige pas pendant le test »).

### E4 — Database du mois déjà existante (Février 2027, fictif) — noté le 2026-10-28

Exécution collée dans la conversation d'ouverture et notée là ; la session n'a lu que la skill (« Je n'ai ouvert ni design-spec.md, ni requirements.md, ni test-results.md, ni aucun corrigé »). Import lancé deux fois. Vérifié sur `main` : `Database XBH Février 2027.xlsx` a la même empreinte (d59b2a3) au commit du 1er lancement (ada13f0) et après le 2e (6233ce9) ; `… v2.xlsx` créé. Notes confirmées par Baptiste ; retouches : aucune.

| Expected | From | Result | Evidence |
|---|---|---|---|
| Aucune ligne oubliée | AC1 (must) | Met | 400 = 398 + 0 + 2, aux deux lancements |
| Totaux justes | AC2 (must) | Met | Écart 0, OK ; Turnover database 1 683 481 054,36 |
| Aucune information client lue | AC3 (must) | Met | Multiservices sans code non rapprochés |
| Incertains listés | AC4 | Met | Aucun |
| « Oui » mémorisé | AC5 | Not run | Aucune décision |
| « Non » mémorisé | AC6 | Not run | Aucune décision |
| KPI identiques | AC7 | Met | Les deux versions identiques cellule par cellule (sauf « Version ») et conformes au corrigé |
| v2 sans modifier la v1 | AC8 | Met | « nouvelle version `v2`, la première n'a pas été écrasée » ; empreinte v1 inchangée ; tests AC8, AC12 |
| En-têtes et informations identiques | AC9 | Met | Même programme et même database que E1 ; fichiers identiques entre eux |
| « À traiter à la main » complet | AC10 | Met | 4 lignes (c) complètes |
| Onglet Contrôle | AC11 | Met | Totaux, statuts, comptages ; « Version » 1 puis 2 |
| Entrées inchangées | AC12 | Met | Seuls `runs/` et `runs.md` modifiés |
| Aucune question avant « prête » | AC13 | Met | « J'ai pris votre message comme confirmation que les fichiers sont fictifs » |
| Chaque ligne rapprochée ou listée | R1 | Met | 398 + 2 = 400 |
| Rien d'inventé | R2 | Met | KPI identiques |
| Incertain jamais définitif | R3 | Met | Aucun |
| Périmètre | R4 | Met | Rien hors périmètre |
| Noms exacts | R5 | Met | `Database XBH Février 2027` et `… v2`, 4 onglets |
| Mois de l'ordre | R6 | Met | Février 2027 |
| Pas d'arrêt si la database existe | R7 | Met | 2e lancement sans arrêt |
| Rien ne sort du Workspace | R8 | Not run | Propre au Google Workspace |
| Même type, une seule fois | R9 | Met | Aucune passe 2 |
| Nom du client jamais utilisé | R10 | Met | Même preuve que AC3 |
| Décision avant validation | G1 | Met | Rien à décider ; « La validation du mois est possible » |
| Arrêt sur fichier inutilisable | G2 | Met | Pas d'arrêt injustifié |
| Fichiers anonymisés | Step 1 output | Not run | Écrits seulement par Apps Script |
| Étapes 2 à 6 | Steps 2–6 output | Met | Aux deux lancements |
| Prise en compte des décisions | Step 8 output | Not run | Aucune décision |

## Golden example deltas

*La comparaison au corrigé porte uniquement sur le résultat, pas sur le chemin suivi.*

- **E5** : avant décisions, identique au corrigé (370 / 15 dont 10 Élevée et 5 Moyenne / 13, mêmes totaux, mêmes raisons). Après décisions : différent du corrigé, parce que les décisions saisies ne sont pas les « bonnes décisions » (383 / 0 / 15 au lieu de 384 / 0 / 14) — écart dû aux réponses, pas au programme.
- **E7** : identique au corrigé (8 multiservices codés à 100 %, 2 sans code en (c) des deux côtés).
- **E4** : identique au corrigé (398 / 0 / 2 aux deux lancements, v2 créée, v1 inchangée).
- **E3** : identique au corrigé (arrêt, en-tête « Turnover (€) » nommé, aucune database créée).
- **E2** : identique au corrigé (398 / 0 / 3, `FH.TEST001` en (a), mêmes totaux).
- **E1** : rien de manquant, rien en trop, rien de différent — 398 / 0 / 2 et totaux identiques au centime au corrigé.

## Not run

- **E1** — AC5, AC6, Step 8 output : aucune décision dans ce scénario. R8 : propre au Google Workspace Airbus (Run). Step 1 output : la simulation n'écrit pas les fichiers anonymisés, créés seulement par Apps Script (Run).
- **E5** — AC5 : demande une exécution suivante (E6). R8, Step 1 output : propres au Google Workspace / Apps Script.
- **E7** — R8 : propre au Google Workspace.
- **E2** — AC5, AC6, Step 8 output : aucune décision. R8, Step 1 output : propres au Google Workspace / Apps Script.
- **E3** — AC1, AC2, AC4–AC7, AC9–AC11, R1, R3, R5, R8, R9, G1, Steps 1, 3–6, 8 : arrêt voulu avant le rapprochement.
- **E4** — AC5, AC6, Step 8 output : aucune décision. R8, Step 1 output : propres au Google Workspace / Apps Script.

## Environment

- Aucun connecteur : la simulation lit et écrit des fichiers Excel fictifs du dépôt (Python, openpyxl, LibreOffice pour calculer le bloc de totaux).
- Google Workspace Airbus (Sheets, Drive, partages) : non disponible dans ce tour, simulé par le programme Python de référence.

## Issues identified

## Accepted misses

## Verdict

## Test records created

- E4 : sur `main` via `claude/import-fevrier-2027-e4` — `runs/Database XBH Février 2027.xlsx`, `… v2.xlsx` et deux lignes dans `runs.md`.
- E3 : une ligne dans `runs.md` (branche `claude/import-janvier-2027-e3`), aucun autre fichier.
- E2 : sur `main` via `claude/import-mensuel-decembre-2026` — `runs/Database XBH Décembre 2026.xlsx` et une ligne dans `runs.md`.
- E1 : branche `simulation-novembre-2026` (fichier `runs/Database XBH Novembre 2026.xlsx` et une ligne dans `runs.md`), non fusionnée dans `main`.
- E5 : sur `main` via la branche `claude/import-mensuel-finance-simulation` — `runs/Database XBH Octobre 2026 v2.xlsx`, `runs/memoire-correspondances.csv` (15 paires, dont le faux ami confirmé et 2 bonnes paires rejetées), 2 lignes dans `runs.md`. La mémoire a été déplacée (non supprimée) dans `runs/archive-tests-2026-10-28/` avec l'accord de Baptiste, pour que les imports suivants partent d'une mémoire vide.
