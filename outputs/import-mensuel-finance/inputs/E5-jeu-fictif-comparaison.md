# E5 — Jeu fictif de comparaison (proposed)

**Données entièrement fictives** : aucun client, montant ou WBS Airbus réel. Ce jeu sert à comparer les prompts et à tester le workflow sans faire sortir de données d'Airbus.

Mois demandé au lancement : **Octobre 2026**. Fichiers Excel équivalents dans `inputs/jeu-fictif/`.

## Fichier finance : `Xbh Contracts Financial performance : Octobre 2026`

### Lignes 1 à 18 — bloc de totaux (à ignorer pour la lecture des contrats)

| Ligne | Libellé | Valeur |
|---|---|---|
| 5 | Total Turnover (€) | 13 587 501,65 |
| 6 | Total Invoicing (€) | 13 218 400,00 |
| 7 | Total Cost (€) | 9 356 130,35 |
| 8 | Total Flight Hours | 33 417 |
| 10 | Nombre de lignes de contrats | 12 |

### Ligne 19 — en-têtes ; à partir de la ligne 20 — contrats

| Ligne | WBS | Client Name | Contract Type | Region | Country | Turnover (€) | Invoicing (€) | Cost (€) | Flight Hours |
|---|---|---|---|---|---|---|---|---|---|
| 20 | `FH.TEST001` | Alpha Aviation | XBH | Europe | France | 1 254 300,50 | 1 180 000,00 | 842 150,25 | 3 120 |
| 21 | `FH.TEST002` | Bravo Heli Services | XBH | NORAM | États-Unis | 2 310 450,00 | 2 295 000,00 | 1 650 300,00 | 5 480 |
| 22 | `FH.TEST003` | Condor Air | XBH | LATAM | Brésil | 876 200,00 | 812 500,00 | 701 950,00 | 2 140 |
| 23 | `FH.TEST004` | Dragon Rotor | FBH | APAC | Japon | 1 543 980,75 | 1 500 000,00 | 998 400,10 | 3 765 |
| 24 | `FH.TEST005` | Eagle Medevac | XBH | AFME | Afrique du Sud | 654 320,00 | 640 000,00 | 512 780,00 | 1 890 |
| 25 | `FB.TEST060` | Falcon Offshore | XBH | Europe | Norvège | 3 102 500,00 | 3 050 000,00 | 2 410 000,00 | 6 920 |
| 26 | `FH.TEST007 ` | Gaviota Patrol | FBH | LATAM | Mexique | 421 750,40 | 400 000,00 | 338 900,00 | 1 215 |
| 27 | `FH.TEST008` | Harbor Police Wing | XBH | APAC | Australie | 987 600,00 | 960 000,00 | N/A | 2 560 |
| 28 | `FH.TEST009` | Ibex Mountain Rescue | FBH | Europe | Suisse | 732 100,00 | 720 000,00 | 590 400,00 | 1 980 |
| 29 | `FH.TEST009` | Ibex Mountain Rescue | FBH | Europe | Suisse | 15 400,00 | 15 400,00 | 9 800,00 | 42 |
| 30 | `FH.TEST011` | Kestrel Charter | XBH | NORAM | Canada | 1 120 000,00 | 1 095 500,00 | 870 250,00 | 2 875 |
| 31 | *(vide)* | Lynx Helicopter Services | FBH | AFME | Émirats arabes unis | 568 900,00 | 550 000,00 | 431 200,00 | 1 430 |

## Database du mois : `Database XBH Octobre 2026` (copie de la database centrale, KPI vides)

| Ligne | WBS | Client | Type de contrat | Région | Pays | Turnover | Invoicing | Cost | FH |
|---|---|---|---|---|---|---|---|---|---|
| 2 | `FH.TEST001` | Alpha Aviation | XBH | Europe | France |  |  |  |  |
| 3 | `FH.TEST002` | Bravo Heli Services | XBH | NORAM | États-Unis |  |  |  |  |
| 4 | `FH.TEST003` | Condor Air | XBH | LATAM | Brésil |  |  |  |  |
| 5 | `FH.TEST004` | Dragon Rotor | FBH | APAC | Japon |  |  |  |  |
| 6 | `FH.TEST005` | Eagle Medevac | XBH | AFME | Afrique du Sud |  |  |  |  |
| 7 | `FH.TEST006` | Falcon Offshore | XBH | Europe | Norvège |  |  |  |  |
| 8 | `FH.TEST007` | Gaviota Patrol | FBH | LATAM | Mexique |  |  |  |  |
| 9 | `FH.TEST008` | Harbor Police Wing | XBH | APAC | Australie |  |  |  |  |
| 10 | `FH.TEST009` | Ibex Mountain Rescue | FBH | Europe | Suisse |  |  |  |  |
| 11 | `FH.TEST010` | Juniper Air | XBH | Europe | Italie |  |  |  |  |
| 12 | `FH.TEST012` | Lynx Helicopter Services | FBH | AFME | Émirats arabes unis |  |  |  |  |

## Table de correspondance des colonnes (fictive)

| Colonne du fichier finance | Colonne de la database |
|---|---|
| Turnover (€) | Turnover |
| Invoicing (€) | Invoicing |
| Cost (€) | Cost |
| Flight Hours | FH |
