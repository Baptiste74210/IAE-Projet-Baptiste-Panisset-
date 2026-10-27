# Corrigé du jeu fictif E5 — à ne pas donner au prompt

*Version 1 : requirements du matin du 2026-10-27 (workflow augmenté, aucun rapprochement par ressemblance). Version 2 : section en fin de fichier.*

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


---

# Version 2 — workflow automatisé (requirements du 2026-10-27, après l'oral)

Le jeu E5 est d'abord anonymisé : seuls le numéro de ligne, le WBS, le type de contrat et les KPI sont conservés. Aucun contrat n'est de type « Multiservices » dans ce jeu.

## Résultats attendus (E5, mémoire C6 vide)

| Ligne(s) | Clé finance | Résultat attendu |
|---|---|---|
| 20 à 24 | `FH.TEST001` à `FH.TEST005` | Rapprochées à **100 %** |
| 26 | `FH.TEST007 ` | Rapprochée à **100 %** (espace retiré) |
| 27 | `FH.TEST008` | Rapprochée à **100 %**, `N/A` recopié et signalé (f) |
| 25 | `FB.TEST060` | Rapprochée en passe 2 avec `FH.TEST006` (préfixe et deux chiffres inversés : erreurs typiques), confiance **inférieure à 100 %** (Moyenne attendue), « en attente de confirmation ». Bonne décision : **Oui** (même contrat Falcon Offshore) |
| 30 | `FH.TEST011` | Rapprochée en passe 2 avec `FH.TEST010` (un chiffre différent), confiance **inférieure à 100 %**, « en attente de confirmation ». **Piège** : ce sont deux contrats différents (Kestrel Charter et Juniper Air). Bonne décision : **Non** |
| 28-29 | `FH.TEST009` ×2 | Non rapprochées, raison (e) doublon ; le `FH.TEST009` de la database reste vide |
| 31 | *(vide)*, type FBH | Non rapprochée, raison (d) clé manquante ; jamais rapprochée avec `FH.TEST012` |
| — | `FH.TEST012` (database) | Raison (b) absent du fichier finance |

Contrôle d'exhaustivité attendu : 12 lignes = 7 à 100 % + 2 en attente de confirmation + 3 non rapprochées.

| KPI | Total fichier finance | Total database | Lignes non rapprochées | Dont en attente de confirmation (inclus dans la database) |
|---|---|---|---|---|
| Turnover | 13 587 501,65 | 12 271 101,65 | 1 316 400,00 | 4 222 500,00 |
| Invoicing | 13 218 400,00 | 11 933 000,00 | 1 285 400,00 | 4 145 500,00 |
| Cost | 9 356 130,35 | 8 324 730,35 | 1 031 400,00 | 3 280 250,00 |
| FH | 33 417 | 29 965 | 3 452 | 9 795 |

## Après les décisions de Baptiste (étape 8)

- `FB.TEST060` ↔ `FH.TEST006` : **Oui** → statut « certain », paire enregistrée « confirmée » dans C6.
- `FH.TEST011` ↔ `FH.TEST010` : **Non** → KPI retirés, ligne en (g) correspondance rejetée, paire enregistrée « rejetée » dans C6 ; `FH.TEST010` passe en (b).
- Comptage attendu après prise en compte : 12 lignes = 8 à 100 % + 0 en attente + 4 non rapprochées ; totaux identiques à ceux du scénario E6 ; validation « possible ».
- Relance avec la mémoire obtenue : résultat identique au scénario E6.

## Scénario E6 — mois suivant, mémoire C6 renseignée

- `FB.TEST060` est rapprochée à **100 %** dès la passe 1, sans apparaître dans « Correspondances à confirmer ».
- `FH.TEST011` n'est plus jamais proposée avec `FH.TEST010` ; aucun autre candidat XBH libre → raison (a). `FH.TEST010` → raison (b).
- Comptage : 12 lignes = 8 à 100 % + 0 en attente + 4 non rapprochées.

| KPI | Total fichier finance | Total database | Lignes non rapprochées |
|---|---|---|---|
| Turnover | 13 587 501,65 | 11 151 101,65 | 2 436 400,00 |
| Invoicing | 13 218 400,00 | 10 837 500,00 | 2 380 900,00 |
| Cost | 9 356 130,35 | 7 454 480,35 | 1 901 650,00 |
| FH | 33 417 | 27 090 | 6 327 |

---

## Scénario E7 — multiservices (version 2)

| Ligne | Contrat (fictif) | Clé après anonymisation | Résultat attendu |
|---|---|---|---|
| 20 | Quartz Aviation, XBH | `FH.TEST101` | Rapprochée à **100 %** |
| 21 | Nova Energy Services, Multiservices | `MS-001` (présent dans la table) | Rapprochée à **100 %** avec le contrat de la database qui reçoit aussi `MS-001` |
| 22 | Orion Medical Fleet, Multiservices | vide, « multiservices sans code » | Non rapprochée, raison **(c)** ; le contrat Orion de la database est aussi en (c) |
| 23 | Polar Air, XBH | vide | Non rapprochée, raison **(d)** clé manquante ; jamais rapprochée par le nom avec `FH.TEST104` |
| — | `FH.TEST104` (database) | `FH.TEST104` | Raison **(b)** absent du fichier finance ; aucun candidat en passe 2, car la ligne 23 n'a pas de clé |

Contrôle d'exhaustivité attendu : 4 lignes = 2 à 100 % + 0 en attente de confirmation + 2 non rapprochées.

| KPI | Total fichier finance | Total database | Lignes non rapprochées |
|---|---|---|---|
| Turnover | 1 811 450,00 | 1 157 700,00 | 653 750,00 |
| Invoicing | 1 760 000,00 | 1 130 000,00 | 630 000,00 |
| Cost | 1 366 600,00 | 854 200,00 | 512 400,00 |
| FH | 3 390 | 2 210 | 1 180 |

Aucun nom de client, pays ou région ne figure dans les fichiers anonymisés ; le nom sert uniquement à la recherche du code `MS-…` dans la table.
