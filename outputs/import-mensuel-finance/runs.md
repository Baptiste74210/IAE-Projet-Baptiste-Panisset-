# Journal des exécutions — Import Mensuel Finance

| Date | Usage | Mois | Scénario / fichier | Résultat | À confirmer | À traiter à la main |
|---|---|---|---|---|---|---|
| 2026-10-27 | tests | Octobre 2026 | E5 (mémoire vide) → `runs/Database XBH Octobre 2026.xlsx` | Conforme au corrigé (V2) : 7 à 100 % / 2 en attente (Moyenne) / 3 non rapprochées ; totaux OK | 2 | 6 (dont 2 côté database) |
| 2026-10-27 | tests | Octobre 2026 | E6 (mémoire : FB.TEST060↔FH.TEST006 confirmée, FH.TEST011↔FH.TEST010 rejetée) → `runs/Database XBH Octobre 2026 v2.xlsx` | Conforme : 8 à 100 % / 0 en attente / 4 non rapprochées ; totaux OK | 0 | 8 (dont 3 côté database) |
| 2026-10-27 | tests | Octobre 2026 | E7 (multiservices, mémoire vide) → `runs/Database XBH Octobre 2026 v3.xlsx` | Conforme : 2 à 100 % / 0 en attente / 2 non rapprochées ; totaux OK | 0 | 4 (dont 2 côté database) |
| 2026-10-27 | tests (étape 8 ajoutée) | Octobre 2026 | E5, E6, E7 et chaîne E5 → décisions (FB.TEST060 = Oui, FH.TEST011 = Non) → relance ; fichiers en dossier temporaire | Conforme au corrigé : E5 7 / 2 / 3, E6 8 / 0 / 4, E7 2 / 0 / 2 ; chaîne : 8 / 0 / 4 après décisions, mémoire de 2 paires, relance identique à E6 ; totaux OK | 0 après décisions | 4 non rapprochées |
| 2026-10-27 | tests (nouveau jeu de référence, 400 contrats) | Octobre 2026 | E5, E6 (E7 inclus), chaîne E5 → décisions → relance ; dossier temporaire | Conforme au corrigé : E5 370 / 15 / 13, E6 384 / 0 / 14, chaîne identique à E6 ; totaux OK ; 8 s | 15 (E5) | 13 non rapprochées (E5) |
| 2026-10-27 | simulation (démo) | Octobre 2026 | Jeu fictif de référence, mémoire vide → `runs/Database XBH Octobre 2026.xlsx` | 370 / 15 / 13 ; totaux OK | 15 | 13 non rapprochées |
| 2026-10-27 | tests + simulation (sans nom de client) | Octobre 2026 | Jeu fictif régénéré : colonne client en codes neutres, multiservices codés MS-… dans la colonne WBS ; programme sans lecture de la colonne client | Conforme au corrigé : E5 370 / 15 / 13, E6 384 / 0 / 14, chaîne identique à E6, 8 multiservices codés à 100 % ; tests Apps Script conformes ; démo → `runs/Database XBH Octobre 2026.xlsx` | 15 (E5) | 13 non rapprochées (E5) |
