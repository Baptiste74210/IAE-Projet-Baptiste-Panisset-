# Corrigé du jeu fictif de référence (400 contrats) — à ne pas donner au programme

*Généré par `generer_jeu_fictif.py` à partir des pièges qu'il a placés (graine fixe 2026). Version machine : `corrige-jeu-fictif.json`. Ne jamais fournir ce fichier à une exécution : il sert uniquement à vérifier les résultats.*

Fichier finance : **398 lignes** de contrats (lignes 20 à 417). Database centrale : **400 contrats**. Mois : **Octobre 2026**.

## Pièges placés

| Piège | Nombre | Résultat attendu (E5, mémoire vide) |
|---|---|---|
| WBS identiques | 347 | Rapprochés à **100 %** |
| Espaces, espaces insécables, caractère invisible, minuscules | 10 | Rapprochés à **100 %** |
| Multiservices présents dans la table (`MS-…`) | 8 | Rapprochés à **100 %** par leur code |
| Cost = « N/A » | 3 | Rapprochés à **100 %**, signalés (f) |
| Même WBS, type différent (finance XBH, database PBH) | 2 | Rapprochés à **100 %**, signalés (h) |
| WBS mal saisis (O/0, I/1, préfixe FH/FB, inversion) | 10 | À confirmer, confiance **Élevée** ; bonne décision **Oui** |
| WBS mal saisis (deux erreurs typiques, ou une autre lettre) | 4 | À confirmer, confiance **Moyenne** ; bonne décision **Oui** |
| Faux ami : nouveau contrat à un caractère d'un contrat absent | 1 | À confirmer, confiance **Moyenne** ; bonne décision **Non** |
| Doublons (même WBS sur deux lignes) | 2 WBS (4 lignes) | Non rapprochés, (e) ; jamais additionnés |
| Lignes sans WBS (type XBH) | 3 | Non rapprochées, (d) ; jamais rapprochées par le nom |
| Multiservices absents de la table | 2 | Non rapprochés, (c), des deux côtés |
| Nouveaux contrats PBH | 4 | Non rapprochés, (a) : aucun contrat PBH libre |
| Contrats de la database absents du fichier finance | 8 | (b) |

## Comptages attendus

| Scénario | 100 % | En attente (Élevée / Moyenne / Faible) | Non rapprochées | Total |
|---|---|---|---|---|
| **E5** — mémoire vide | 370 | 10 / 5 / 0 | 13 | 398 |
| **E6** — mémoire `memoire-E6 (FICTIF).csv` | 384 | 0 / 0 / 0 | 14 | 398 |
| **Chaîne** — E5, décisions de la colonne « bonne décision », relance | 384 après décisions | 0 / 0 / 0 | 14 | 398 |

Le scénario **E7 (multiservices)** se vérifie dans l'exécution de E5 : 8 multiservices rapprochés à 100 % par leur code `MS-…`, 2 en (c) des deux côtés, aucun nom de client dans les fichiers anonymisés.

## Totaux attendus

| KPI | Bloc de totaux | Database E5 | Database E6 et chaîne |
|---|---|---|---|
| Turnover (€) | 1 543 974 476,19 | 1 490 099 882,37 | 1 489 170 637,02 |
| Invoicing (€) | 1 491 446 660,64 | 1 439 160 594,39 | 1 438 281 418,04 |
| Cost (€) | 1 112 197 095,40 | 1 072 257 967,74 | 1 071 636 604,92 |
| Flight Hours | 1 776 837 | 1 716 775 | 1 715 538 |

Dans tous les cas, l'écart restant est nul (statut `OK`) : database + lignes non rapprochées = bloc de totaux.

## Correspondances à confirmer (E5)

| Clé finance | Clé database | Nature | Confiance attendue | Bonne décision |
|---|---|---|---|---|
| `FH.UWXOM` | `FH.UWX0M` | O/0 | Élevée | **Oui** |
| `FH.NBORJ` | `FH.NB0RJ` | O/0 | Élevée | **Oui** |
| `FH.OUB8S` | `FH.0UB8S` | O/0 | Élevée | **Oui** |
| `FH.8IJW6` | `FH.81JW6` | I/1 | Élevée | **Oui** |
| `FH.IPRFK` | `FH.1PRFK` | I/1 | Élevée | **Oui** |
| `FH.ENIAU` | `FH.EN1AU` | I/1 | Élevée | **Oui** |
| `FB.Z5ZT9` | `FH.Z5ZT9` | préfixe FH/FB | Élevée | **Oui** |
| `FB.86BY7` | `FH.86BY7` | préfixe FH/FB | Élevée | **Oui** |
| `FH.SHDCN` | `FH.SHCDN` | inversion | Élevée | **Oui** |
| `FH.57JZ4` | `FH.75JZ4` | inversion | Élevée | **Oui** |
| `FB.G8BW7` | `FH.G8WB7` | préfixe + inversion | Moyenne | **Oui** |
| `FB.M2HKU` | `FH.MH2KU` | préfixe + inversion | Moyenne | **Oui** |
| `FH.4R7SX` | `FH.437SX` | substitution | Moyenne | **Oui** |
| `FH.GE694` | `FH.LE694` | substitution | Moyenne | **Oui** |
| `FH.9LZYY` | `FH.9LZYW` | faux ami (contrats différents) | Moyenne | **Non** |

## Pourquoi ce corrigé est certain

- Toutes les clés de la database diffèrent d'au moins 3 caractères entre elles : un WBS mal saisi n'a qu'un seul candidat proche.
- Les nouveaux contrats sont de type PBH et aucun contrat PBH de la database ne reste libre : ils ne peuvent être rapprochés de rien.
- Le faux ami est de type FBH, et aucun autre contrat FBH ne reste libre une fois sa paire rejetée (scénario E6).
- Les contrats absents du fichier finance et les lignes sans WBS sont de type XBH : les seules lignes XBH en recherche automatique sont les WBS mal saisis, qui trouvent leur contrat avant.
