# Corrigé de la démo Novembre 2026 — à ne pas donner au programme

Fichier : `demo/Xbh Contracts Financial performance - Novembre 2026 (FICTIF - démo).xlsx` — lignes de contrats 20 à 418. Mémoire de départ : `demo/memoire-apres-octobre (FICTIF).csv` (décisions justes d'octobre).

## Nouveautés de novembre

| Ligne | Clé finance | Clé database | Piège | Bonne décision |
|---|---|---|---|---|
| 114 | `FH.YXSBL` | `FH.YSXBL` | deux caractères voisins inversés | **Oui** |
| 271 | `FH.SHPKH` | `FH.SHPUH` | une lettre remplacée | **Oui** |
| 418 | `FH.N7VEA` | — | nouveau contrat PBH inconnu | (a), à traiter à la main |

## Ce que la démo doit montrer

- les 14 WBS confirmés en octobre sont rapprochés à 100 % grâce à la mémoire, sans question ;
- le faux ami rejeté en octobre (`FH.F4ZSJ`) n'est plus proposé : il part en (a) ;
- seules les 2 nouvelles erreurs de novembre sont à confirmer ;
- les totaux restent `OK`.

## Comptages attendus (vérifiés en lançant le programme une fois à la préparation)

| 100 % | À confirmer (Élevée / Moyenne / Faible) | Non rapprochées | Total |
|---|---|---|---|
| 382 | 2 (1 / 1 / 0) | 15 | 399 |

Après les 2 « Oui » : 384 / 0 / 15 ; totaux `OK` avant et après.
