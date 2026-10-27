# E7 — Multiservices (proposed)

**Données entièrement fictives** : aucun client, montant ou WBS Airbus réel. Ce scénario teste le traitement des contrats multiservices sans WBS grâce à la table de pseudonymisation.

Mois demandé au lancement : **Octobre 2026**. Fichiers Excel dans `inputs/jeu-fictif/` : `Xbh Contracts Financial performance - Octobre 2026 (FICTIF E7).xlsx`, `Database Hcare XBH in service contracts (FICTIF E7).xlsx`, et la table `table-pseudonymisation-multiservices (FICTIF).csv`. Mémoire des correspondances : vide.

## Fichier finance (lignes 1 à 18 : totaux ; ligne 19 : en-têtes ; contrats dès la ligne 20)

| Ligne | Libellé | Valeur |
|---|---|---|
| 5 | Total Turnover (€) | 1 811 450,00 |
| 6 | Total Invoicing (€) | 1 760 000,00 |
| 7 | Total Cost (€) | 1 366 600,00 |
| 8 | Total Flight Hours | 3 390 |
| 10 | Nombre de lignes de contrats | 4 |

| Ligne | WBS | Client Name | Contract Type | Region | Country | Turnover (€) | Invoicing (€) | Cost (€) | Flight Hours |
|---|---|---|---|---|---|---|---|---|---|
| 20 | `FH.TEST101` | Quartz Aviation | XBH | Europe | Belgique | 845 200,00 | 830 000,00 | 612 400,00 | 2 210 |
| 21 | *(vide)* | Nova Energy Services | Multiservices | AFME | Nigeria | 312 500,00 | 300 000,00 | 241 800,00 | 0 |
| 22 | *(vide)* | Orion Medical Fleet | Multiservices | APAC | Singapour | 198 750,00 | 190 000,00 | 150 300,00 | 0 |
| 23 | *(vide)* | Polar Air | XBH | NORAM | Canada | 455 000,00 | 440 000,00 | 362 100,00 | 1 180 |

## Database centrale (KPI vides)

| Ligne | WBS | Client | Type de contrat | Région | Pays | Turnover | Invoicing | Cost | FH |
|---|---|---|---|---|---|---|---|---|---|
| 2 | `FH.TEST101` | Quartz Aviation | XBH | Europe | Belgique |  |  |  |  |
| 3 | *(vide)* | Nova Energy Services | Multiservices | AFME | Nigeria |  |  |  |  |
| 4 | *(vide)* | Orion Medical Fleet | Multiservices | APAC | Singapour |  |  |  |  |
| 5 | `FH.TEST104` | Polar Air | XBH | NORAM | Canada |  |  |  |  |

## Table de pseudonymisation des multiservices (fictive)

| Client | Code MS |
|---|---|
| Nova Energy Services | `MS-001` |
| Atlas Offshore Services | `MS-002` |

## Table de correspondance des colonnes (fictive)

| Colonne du fichier finance | Colonne de la database |
|---|---|
| Turnover (€) | Turnover |
| Invoicing (€) | Invoicing |
| Cost (€) | Cost |
| Flight Hours | FH |
