# E5 — Jeu fictif de référence : 398 lignes de contrats, 400 contrats en database (proposed)

**Données entièrement fictives** : WBS et montants inventés, aucune donnée Airbus ; **aucun nom de client** (colonne client remplie de codes neutres « Client 001 »…, jamais lue par le programme). Fichiers à utiliser (dans `inputs/jeu-fictif/`) :

- `Xbh Contracts Financial performance - Octobre 2026 (FICTIF).xlsx` — fichier finance : lignes 1 à 18 = bloc de totaux, ligne 19 = en-têtes, contrats à partir de la ligne 20 ;
- `Database Hcare XBH in service contracts (FICTIF).xlsx` — database centrale, KPI vides ;
- `referentiel-multiservices (FICTIF).csv` — référentiel des codes `MS-…` (aide-mémoire, jamais lu par le programme) ; les codes sont écrits dans la colonne WBS des deux fichiers ;
- `table-correspondance-colonnes (FICTIF).csv` — colonnes de KPI et cellules des totaux ;
- `memoire-E6 (FICTIF).csv` — mémoire des correspondances du scénario E6 (mois suivant).

Mois demandé au lancement : **Octobre 2026**. Le contenu complet figure dans les fichiers Excel ; ce fichier n'en donne qu'un aperçu.

## Aperçu des 15 premières lignes du fichier finance

| Ligne | WBS | Client Name | Contract Type | Region | Country | Turnover (€) | Invoicing (€) | Cost (€) | Flight Hours |
|---|---|---|---|---|---|---|---|---|---|
| 20 | `FH.C7JUR` | Client 068 | XBH | APAC | Malaisie | 5 966 585,56 | 5 862 408,91 | 4 744 868,37 | 5598 |
| 21 | `FH.9PZL5` | Client 052 | XBH | NORAM | États-Unis | 2 426 746,22 | 2 420 814,44 | 1 692 609,99 | 1644 |
| 22 | `FH.4KCZW` | Client 400 | XBH | LATAM | Chili | 4 842 973,27 | 4 756 214,48 | 3 204 130,50 | 7531 |
| 23 | `FH.NDXZK` | Client 353 | XBH | Europe | Suisse | 2 816 229,25 | 2 694 737,58 | 2 099 570,94 | 6588 |
| 24 | `FH.ZPV68` | Client 053 | PBH | APAC | Inde | 1 517 147,20 | 1 464 279,80 | 965 486,76 | 8580 |
| 25 | `FH.UDHX5` | Client 118 | XBH | Europe | France | 2 957 976,48 | 2 819 595,20 | 2 162 417,02 | 3160 |
| 26 | `FH.G43AR` | Client 071 | FBH | APAC | Japon | 6 667 769,22 | 6 299 751,55 | 4 111 644,92 | 4587 |
| 27 | `FH.ZZUN4` | Client 253 | XBH | APAC | Japon | 2 928 787,25 | 2 903 875,85 | N/A | 7448 |
| 28 | `FH.VSQLW` | Client 021 | XBH | Europe | Pologne | 7 326 620,83 | 7 127 365,63 | 6 249 383,95 | 344 |
| 29 | `FH.G4QHE` | Client 122 | PBH | LATAM | Mexique | 2 080 148,62 | 1 975 282,80 | 1 283 732,07 | 8799 |
| 30 | `FH.T99FJ` | Client 339 | XBH | APAC | Singapour | 762 516,55 | 711 547,33 | 557 305,22 | 2080 |
| 31 | `FH.U2BF9` | Client 143 | XBH | APAC | Inde | 5 214 501,13 | 5 071 838,01 | 3 782 430,07 | 1617 |
| 32 | `FH.TL3DE` | Client 125 | PBH | LATAM | Mexique | 7 220 524,87 | 7 208 151,15 | 6 151 665,87 | 6811 |
| 33 | `FH.4M5ES` | Client 107 | XBH | Europe | France | 2 689 385,91 | 2 612 088,18 | 1 918 736,43 | 891 |
| 34 | `FH.GTBP8` | Client 316 | PBH | LATAM | Argentine | 6 800 346,49 | 6 775 621,66 | 4 392 076,09 | 6807 |
