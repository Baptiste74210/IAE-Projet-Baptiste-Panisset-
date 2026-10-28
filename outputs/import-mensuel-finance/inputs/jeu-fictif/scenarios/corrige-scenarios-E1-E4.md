# Corrigé des scénarios fictifs E1 à E4 — à ne pas donner au programme

*Calculé par `preparer_scenarios_E1_E4.py` à partir des fichiers qu'il écrit, sans lancer le programme testé. Ne jamais fournir ce fichier à une exécution.*

Database centrale fictive utilisée : `Database Hcare XBH in service contracts (FICTIF).xlsx` (400 contrats, dont 2 multiservices sans code), inchangée.

## E1 — Clôture typique (Novembre 2026)

Fichier : `scenarios/Xbh Contracts Financial performance - Novembre 2026 (FICTIF - E1).xlsx` — **400 lignes** de contrats (lignes 20 à 419).

- **398 lignes à 100 %** (dont 1 WBS avec un espace en fin et 1 en minuscules) ;
- **0 correspondance à confirmer** ;
- **2 lignes non rapprochées**, raison (c) multiservices sans code (et les 2 mêmes contrats en (c) côté database) ;
- totaux `OK` ; exécution sans aucune question jusqu'au résumé.

| KPI | Bloc de totaux = total des lignes | Total database attendu |
|---|---|---|
| Turnover (€) | 1 643 204 880,10 | 1 635 558 259,04 |
| Invoicing (€) | 1 558 037 313,33 | 1 550 574 888,47 |
| Cost (€) | 1 231 205 862,69 | 1 225 000 158,87 |
| Flight Hours | 1 633 992,00 | 1 624 605,00 |

## E2 — Contrat inconnu (Décembre 2026)

Fichier : `scenarios/Xbh Contracts Financial performance - Décembre 2026 (FICTIF - E2).xlsx` — **401 lignes** ; dernière ligne `FH.TEST001` (XBH, client vide, 1 000 dans chaque KPI).

- **398 lignes à 100 %** ; **0 à confirmer** : tous les contrats XBH de la database sont déjà pris, il n'y a aucun candidat libre ;
- **3 lignes non rapprochées** : `FH.TEST001` en (a) absent de la database, et les 2 multiservices sans code en (c) ;
- `FH.TEST001` n'est **jamais** rapprochée à 100 % ; l'écart de chaque KPI (1 000) est expliqué par cette ligne ; totaux `OK`.

| KPI | Bloc de totaux = total des lignes | Total database attendu |
|---|---|---|
| Turnover (€) | 1 629 735 253,88 | 1 620 669 366,87 |
| Invoicing (€) | 1 548 160 782,71 | 1 539 632 292,69 |
| Cost (€) | 1 218 100 602,74 | 1 210 272 959,39 |
| Flight Hours | 1 583 922,00 | 1 578 769,00 |

## E3 — Template modifié (Janvier 2027)

Fichier : `scenarios/Xbh Contracts Financial performance - Janvier 2027 (FICTIF - E3).xlsx` — en-tête F19 renommé « Turnover (€)_v2 ».

- **Arrêt** avant toute écriture, avec un message qui nomme l'en-tête « Turnover (€) » introuvable ;
- **aucun** fichier `Database XBH Janvier 2027` créé ; mémoire inchangée.

## E4 — Database du mois déjà existante (Février 2027)

Fichier : `scenarios/Xbh Contracts Financial performance - Février 2027 (FICTIF - E4).xlsx` — l'import est lancé **deux fois** pour le même mois.

- 1er lancement : `Database XBH Février 2027.xlsx` créée (398 à 100 %, 0 à confirmer, 2 en (c)) ;
- 2e lancement : **pas d'arrêt**, `Database XBH Février 2027 v2.xlsx` créée avec les mêmes comptages ;
- la première version est **inchangée** (même empreinte avant et après le 2e lancement) ;
- le fichier finance et la database centrale sont inchangés.

| KPI | Bloc de totaux = total des lignes | Total database attendu |
|---|---|---|
| Turnover (€) | 1 689 586 583,69 | 1 683 481 054,36 |
| Invoicing (€) | 1 601 928 688,39 | 1 596 197 105,53 |
| Cost (€) | 1 271 067 167,73 | 1 266 659 756,31 |
| Flight Hours | 1 592 094,00 | 1 586 902,00 |
