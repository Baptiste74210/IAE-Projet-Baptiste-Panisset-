# Fiche données — Import Mensuel Finance

*Baptiste Panisset · Airbus Helicopters, service ESXCC · 2026-10-28. Aucun nom de client ni montant réel dans ce document. Détail du chemin de la donnée : `chaine-de-donnees.md`.*

## 1. Les sources

| ID | Fichier | Système | Producteur | Fréquence | Sensibilité |
|---|---|---|---|---|---|
| C1 | `Xbh Contracts Financial performance : [Mois] [Année]` | Google Sheets (extrait SAP mis en forme) | Équipe finance | Mensuelle, vers le 15 | **Confidentiel**, externe à l'équipe |
| C2 | `Database Hcare XBH in service contracts` | Google Sheets | Baptiste | À chaque nouveau contrat | **Confidentiel** |
| C3 | `Table de correspondance des colonnes` | Google Sheets | Baptiste | Rarement (si le format change) | Interne (en-têtes seulement) |
| C5 | `Référentiel des contrats multiservices` | Google Sheets | Baptiste | À chaque nouveau multiservice | **Confidentiel**, jamais lu par le programme |
| C6 | `Mémoire des correspondances` | Google Sheets | Le programme, après les décisions de Baptiste | Chaque mois | Interne (clés seulement) |

## 2. Les colonnes

**Fichier finance (C1)** — lignes 1 à 18 : bloc de totaux ; ligne 19 : en-têtes ; contrats à partir de la ligne 20.

| Colonne | Type | Lue par le programme ? | Remarque |
|---|---|---|---|
| WBS | texte (ex. `FH.XXXXX`, ou `MS-001` pour un multiservice) | **Oui — clé** | Peut être mal saisie (O/0, I/1, inversion, FH/FB) |
| Client Name | texte | **Jamais** | Donnée sensible |
| Contract Type | XBH, FBH, PBH, Multiservices | Oui | Sert à limiter la recherche aux contrats du même type |
| Region, Country | texte | Non | — |
| Turnover (€), Invoicing (€), Cost (€) | nombre | Oui — KPI | Recopiés à l'identique ; « N/A » possible |
| Flight Hours | nombre | Oui — KPI | — |
| Bloc de totaux (F5 à F8) | formule | Oui | Sert au contrôle des totaux |

**Database centrale (C2)** — ligne 1 : en-têtes `WBS, Client, Type de contrat, Région, Pays, Turnover, Invoicing, Cost, FH` ; une ligne par contrat ; colonnes de KPI vides. Seules les colonnes WBS, Type de contrat et KPI sont lues ; Client n'est jamais lu.

## 3. Les contrôles

| Contrôle | Quand | Si ça ne va pas |
|---|---|---|
| Mois du nom de fichier = mois demandé | Avant tout | Arrêt, rien n'est créé |
| Un seul onglet, en-têtes en ligne 19, chaque KPI de C3 présent une fois | Avant tout | Arrêt, colonne en cause nommée |
| Pas de ligne « Total » parmi les contrats, au moins un contrat | Avant tout | Arrêt |
| KPI de la database centrale vides | Avant tout | Arrêt |
| Chaque ligne finance rapprochée ou listée avec sa raison (a) à (h) | Après le rapprochement | Ligne dans « À traiter à la main » |
| Total bloc = total des lignes = total database + non rapprochées, à 0,01 près | Après le rapprochement et après les décisions | Statut « À vérifier » |
| Correspondance à moins de 100 % | Après le rapprochement | Attend le « Oui » ou « Non » de Baptiste |

## 4. Les données sensibles et leur protection

- **Nom du client** : jamais lu, jamais écrit dans un fichier produit par le programme. Les multiservices sont reconnus par un code `MS-…` dans la colonne WBS, pas par le nom.
- **Montants liés à un WBS** : ne permettent pas d'identifier un client (décision validée à l'oral du 2026-10-27) ; ils restent néanmoins dans le Google Workspace d'Airbus.
- **Données réelles** : ne sortent jamais du Google Workspace d'Airbus. Claude et GitHub ne voient que des **données fictives** (jeu de 400 contrats, codes clients neutres « Client 001 »…).
- **Fichiers produits** : la database du mois reçoit les mêmes partages que la database centrale, sans élargissement ; rien n'est jamais écrasé (versions `v2`, `v3`…).
