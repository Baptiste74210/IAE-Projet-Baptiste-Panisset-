# Corrigé du jeu fictif de référence (400 contrats) — à ne pas donner au programme

*Généré par `generer_jeu_fictif.py` à partir des pièges qu'il a placés (graine fixe 2026). Version machine : `corrige-jeu-fictif.json`. Ne jamais fournir ce fichier à une exécution : il sert uniquement à vérifier les résultats.*

Fichier finance : **398 lignes** de contrats (lignes 20 à 417). Database centrale : **400 contrats**. Mois : **Octobre 2026**.

## Pièges placés

| Piège | Nombre | Résultat attendu (E5, mémoire vide) |
|---|---|---|
| WBS identiques | 347 | Rapprochés à **100 %** |
| Espaces, espaces insécables, caractère invisible, minuscules | 10 | Rapprochés à **100 %** |
| Multiservices codés `MS-…` dans la colonne WBS | 8 | Rapprochés à **100 %** par leur code |
| Cost = « N/A » | 3 | Rapprochés à **100 %**, signalés (f) |
| Même WBS, type différent (finance XBH, database PBH) | 2 | Rapprochés à **100 %**, signalés (h) |
| WBS mal saisis (O/0, I/1, préfixe FH/FB, inversion) | 10 | À confirmer, confiance **Élevée** ; bonne décision **Oui** |
| WBS mal saisis (deux erreurs typiques, ou une autre lettre) | 4 | À confirmer, confiance **Moyenne** ; bonne décision **Oui** |
| Faux ami : nouveau contrat à un caractère d'un contrat absent | 1 | À confirmer, confiance **Moyenne** ; bonne décision **Non** |
| Doublons (même WBS sur deux lignes) | 2 WBS (4 lignes) | Non rapprochés, (e) ; jamais additionnés |
| Lignes sans WBS (type XBH) | 3 | Non rapprochées, (d) ; jamais rapprochées par le nom |
| Multiservices sans code (WBS vide) | 2 | Non rapprochés, (c), des deux côtés |
| Nouveaux contrats PBH | 4 | Non rapprochés, (a) : aucun contrat PBH libre |
| Contrats de la database absents du fichier finance | 8 | (b) |

## Comptages attendus

| Scénario | 100 % | En attente (Élevée / Moyenne / Faible) | Non rapprochées | Total |
|---|---|---|---|---|
| **E5** — mémoire vide | 370 | 10 / 5 / 0 | 13 | 398 |
| **E6** — mémoire `memoire-E6 (FICTIF).csv` | 384 | 0 / 0 / 0 | 14 | 398 |
| **Chaîne** — E5, décisions de la colonne « bonne décision », relance | 384 après décisions | 0 / 0 / 0 | 14 | 398 |

Le scénario **E7 (multiservices)** se vérifie dans l'exécution de E5 : 8 multiservices rapprochés à 100 % par leur code `MS-…`, 2 sans code en (c) des deux côtés ; la colonne client n'est jamais lue.

## Totaux attendus

| KPI | Bloc de totaux | Database E5 | Database E6 et chaîne |
|---|---|---|---|
| Turnover (€) | 1 516 914 829,77 | 1 467 184 114,25 | 1 465 282 374,18 |
| Invoicing (€) | 1 463 742 453,74 | 1 416 332 660,37 | 1 414 550 037,66 |
| Cost (€) | 1 092 766 728,71 | 1 059 643 928,11 | 1 058 131 510,01 |
| Flight Hours | 1 801 640 | 1 760 223 | 1 754 967 |

Dans tous les cas, l'écart restant est nul (statut `OK`) : database + lignes non rapprochées = bloc de totaux.

## Correspondances à confirmer (E5)

| Clé finance | Clé database | Nature | Confiance attendue | Bonne décision |
|---|---|---|---|---|
| `FH.EPZRO` | `FH.EPZR0` | O/0 | Élevée | **Oui** |
| `FH.OQ37D` | `FH.0Q37D` | O/0 | Élevée | **Oui** |
| `FH.H7OY5` | `FH.H70Y5` | O/0 | Élevée | **Oui** |
| `FH.2HFIB` | `FH.2HF1B` | I/1 | Élevée | **Oui** |
| `FH.8FIBA` | `FH.8F1BA` | I/1 | Élevée | **Oui** |
| `FH.BCIWH` | `FH.BC1WH` | I/1 | Élevée | **Oui** |
| `FB.RBMUF` | `FH.RBMUF` | préfixe FH/FB | Élevée | **Oui** |
| `FB.AVDW9` | `FH.AVDW9` | préfixe FH/FB | Élevée | **Oui** |
| `FH.U2BF9` | `FH.U2B9F` | inversion | Élevée | **Oui** |
| `FH.GRTWQ` | `FH.RGTWQ` | inversion | Élevée | **Oui** |
| `FB.VXVFM` | `FH.XVVFM` | préfixe + inversion | Moyenne | **Oui** |
| `FB.8UZAW` | `FH.8UAZW` | préfixe + inversion | Moyenne | **Oui** |
| `FH.KAPLC` | `FH.KAULC` | substitution | Moyenne | **Oui** |
| `FH.X8BS2` | `FH.X87S2` | substitution | Moyenne | **Oui** |
| `FH.F4ZSJ` | `FH.FVZSJ` | faux ami (contrats différents) | Moyenne | **Non** |

## Pourquoi ce corrigé est certain

- Toutes les clés de la database diffèrent d'au moins 3 caractères entre elles : un WBS mal saisi n'a qu'un seul candidat proche.
- Les nouveaux contrats sont de type PBH et aucun contrat PBH de la database ne reste libre : ils ne peuvent être rapprochés de rien.
- Le faux ami est de type FBH, et aucun autre contrat FBH ne reste libre une fois sa paire rejetée (scénario E6).
- Les contrats absents du fichier finance et les lignes sans WBS sont de type XBH : les seules lignes XBH en recherche automatique sont les WBS mal saisis, qui trouvent leur contrat avant.
