# Corrigé du jeu fictif E5 — à ne pas donner au prompt

Ce fichier sert uniquement à vérifier les résultats. Ne le joignez jamais à l'exécution d'un prompt.

## Pièges volontaires

| Piège | Ligne(s) | Résultat attendu |
|---|---|---|
| WBS divergent (`FB.TEST060` côté finance, `FH.TEST006` côté database) | 25 | Aucun rapprochement ; les deux côtés dans « À traiter à la main » |
| Espace parasite en fin de WBS (`FH.TEST007 `) | 26 | Rapproché avec `FH.TEST007` (seuls les espaces de début et fin sont retirés) |
| Texte au lieu d'un nombre (Cost = `N/A`) | 27 | Rapproché, `N/A` recopié tel quel et signalé dans « À traiter à la main » |
| WBS en double (`FH.TEST009` deux fois) | 28-29 | Aucun rapprochement ; les deux lignes dans « À traiter à la main » (doublon) |
| Nouveau contrat absent de la database (`FH.TEST011`) | 30 | « À traiter à la main » : absent de la database |
| Contrat sans WBS (Lynx Helicopter Services) | 31 | « À traiter à la main » : WBS manquant ; jamais rapproché par nom avec `FH.TEST012` |
| Contrats de la database absents du fichier finance (`FH.TEST006`, `FH.TEST010`, `FH.TEST012`) | — | « À traiter à la main » : absent du fichier finance |

## Contrôle d'exhaustivité attendu

- Lignes de contrats dans le fichier finance : **12**
- Rapprochées et remplies : **7** (`FH.TEST001` à `005`, `007`, `008`)
- Lignes du fichier finance dans « À traiter à la main » : **5** (`FB.TEST060`, `FH.TEST009` ×2, `FH.TEST011`, ligne sans WBS)
- Contrats de la database absents du fichier finance : **3** (`FH.TEST006`, `FH.TEST010`, `FH.TEST012`)
- Vérification : 7 + 5 = 12 ✔

## Totaux attendus dans la database du mois (contrats rapprochés uniquement)

| KPI | Total fichier finance | Total database | Écart expliqué par les cas manuels |
|---|---|---|---|
| Turnover | 13 587 501,65 | 8 048 601,65 | 5 538 900,00 |
| Invoicing | 13 218 400,00 | 7 787 500,00 | 5 430 900,00 |
| Cost | 9 356 130,35 | 5 044 480,35 | 4 311 650,00 |
| FH | 33 417 | 20 170 | 13 247 |

Le Cost de `FH.TEST008` (`N/A`) n'entre dans aucun total.
