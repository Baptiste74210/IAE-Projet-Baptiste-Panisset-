# E5 — Jeu fictif de référence : 398 lignes de contrats, 400 contrats en database (proposed)

**Données entièrement fictives** : clients, WBS et montants inventés, aucune donnée Airbus. Fichiers à utiliser (dans `inputs/jeu-fictif/`) :

- `Xbh Contracts Financial performance - Octobre 2026 (FICTIF).xlsx` — fichier finance : lignes 1 à 18 = bloc de totaux, ligne 19 = en-têtes, contrats à partir de la ligne 20 ;
- `Database Hcare XBH in service contracts (FICTIF).xlsx` — database centrale, KPI vides ;
- `table-pseudonymisation-multiservices (FICTIF).csv` — codes `MS-…` des multiservices ;
- `table-correspondance-colonnes (FICTIF).csv` — colonnes de KPI et cellules des totaux ;
- `memoire-E6 (FICTIF).csv` — mémoire des correspondances du scénario E6 (mois suivant).

Mois demandé au lancement : **Octobre 2026**. Le contenu complet figure dans les fichiers Excel ; ce fichier n'en donne qu'un aperçu.

## Aperçu des 15 premières lignes du fichier finance

| Ligne | WBS | Client Name | Contract Type | Region | Country | Turnover (€) | Invoicing (€) | Cost (€) | Flight Hours |
|---|---|---|---|---|---|---|---|---|---|
| 20 | `FH.SWJJL` | Vista Aero Rescue | XBH | AFME | Kenya | 2 359 949,76 | 2 211 892,02 | 1 734 712,28 | 6945 |
| 21 | `FH.6DNK9` | Pacific Wings Offshore | PBH | Europe | Allemagne | 937 309,77 | 899 284,58 | 676 113,20 | 6398 |
| 22 | `FH.8HBEP` | Condor Flight Rescue | FBH | NORAM | États-Unis | 7 280 172,93 | 6 803 752,45 | 5 221 854,31 | 4687 |
| 23 | `FH.C72UG` | Cardinal Fleet Services | FBH | NORAM | Canada | 6 568 758,85 | 6 173 109,49 | 4 511 848,72 | 4381 |
| 24 | `FH.TSHBL` | Falcon Aviation Patrol | FBH | APAC | Australie | 1 096 068,26 | 1 093 827,10 | 799 558,66 | 8132 |
| 25 | `FH.7NUJV` | Lynx Air Medevac | XBH | LATAM | Brésil | 5 068 791,69 | 4 733 684,55 | 4 173 267,45 | 675 |
| 26 | `FH.PBSL8` | Sierra Heli Partners (nouveau) | PBH | LATAM | Brésil | 3 934 293,95 | 3 884 933,65 | 2 881 889,17 | 4954 |
| 27 | `FH.LXYK4` | Nordic Flight Logistics | XBH | AFME | Nigeria | 5 558 993,20 | 5 497 501,50 | 3 772 636,54 | 8230 |
| 28 | `FH.FNUE9` | Sierra Aero Medevac | XBH | Europe | Suisse | 4 590 897,27 | 4 433 928,78 | 3 686 578,09 | 1643 |
| 29 | `FH.H4P7D` | Cardinal Aviation Patrol | FBH | AFME | Nigeria | 2 486 291,64 | 2 429 955,82 | 1 884 864,51 | 5578 |
| 30 | `FH.PPLEJ` | Orion Flight Services | XBH | Europe | France | 4 661 018,10 | 4 438 402,63 | 3 469 910,41 | 3825 |
| 31 | `FH.TPLPH` | Crystal Lift Medevac | FBH | APAC | Inde | 1 239 235,29 | 1 216 098,60 | 793 405,98 | 8268 |
| 32 | `FH.RSU9T` | Polar Rotor Operations | XBH | LATAM | Chili | 2 144 684,63 | 2 122 819,92 | 1 635 876,11 | 7695 |
| 33 | `FH.GX87S` | Pacific Air Group | PBH | NORAM | Canada | 6 341 822,96 | 6 269 330,73 | 5 080 448,19 | 836 |
| 34 | `FH.6CFK6` | Granite Lift Medevac | PBH | NORAM | Canada | 3 470 496,38 | 3 406 253,95 | 2 908 621,08 | 8674 |
