# Démo — résultat attendu, ligne par ligne

*Jeu de démo : `inputs/demo.csv` (399 lignes de contrats, Novembre 2026, 100 % fictif). C'est l'export CSV du fichier joué en direct : `inputs/jeu-fictif/demo/Xbh Contracts Financial performance - Novembre 2026 (FICTIF - démo).xlsx`, importé dans Google Sheets sous le nom `Xbh Contracts Financial performance : Novembre 2026`. Mémoire de départ : les décisions justes d'octobre (`inputs/jeu-fictif/demo/memoire-apres-octobre (FICTIF).csv`). Les numéros de « Ligne » sont ceux du fichier finance.*

## Pourquoi ce jeu

| Exigence | Dans ce jeu |
|---|---|
| **Neuf** | Jamais utilisé pendant les tests E1 à E7 : nouveau mois, nouveaux montants, 3 nouveautés. |
| **Réaliste** | Le vrai volume d'un mois (399 lignes, 400 contrats dans la database) et les colonnes du fichier finance (`fiche-donnees.md`) ; codes clients neutres. |
| **Un piège** | 2 WBS nouvellement mal saisis, 1 contrat inconnu, et le « faux ami » d'octobre (deux contrats différents aux WBS proches). |
| **Un moment humain** | 2 correspondances à confirmer par Baptiste (« Oui » / « Non ») avant validation. |

## Résultat global attendu

| | Attendu |
|---|---|
| Message « Database prête à valider » | **382 lignes à 100 % · 2 correspondances à confirmer · 15 lignes non rapprochées · Contrôle des totaux : OK** |
| Fichiers créés | `Database XBH Novembre 2026` (onglets Contracts, À traiter à la main, Correspondances à confirmer, Contrôle) et `Anonymisé – Novembre 2026` |
| Totaux du bloc = total des lignes = total database + non rapprochées | Turnover 1 514 539 851,79 = 1 461 583 635,39 + 52 956 216,40 · Invoicing 1 462 080 721,19 · Cost 1 095 212 711,09 · Flight Hours 1 801 874 — écart 0, statut OK |
| Après les 2 « Oui » et « Prendre en compte mes décisions » | « 2 confirmée(s), 0 rejetée(s), 0 sans décision · Contrôle OK · Validation possible » ; **384** lignes à 100 % ; Mémoire + 2 lignes |
| Relance de « Prendre en compte » | « 0 confirmée(s) » : une décision n'est jamais appliquée deux fois |

## 1. Le moment humain — à confirmer

| Ligne | Clé finance | Clé database | Confiance | Écart | Ce que c'est | Bonne décision |
|---|---|---|---|---|---|---|
| 114 | `FH.YXSBL` | `FH.YSXBL` | Élevée | 0,5 | deux caractères voisins inversés | **Oui** |
| 271 | `FH.SHPKH` | `FH.SHPUH` | Moyenne | 1 | une lettre remplacée | **Oui** |

## 2. Reconnues à 100 % grâce à la mémoire d'octobre (aucune question)

Lignes 31, 61, 65, 155, 156, 160, 183, 259, 269, 303, 306, 351, 374, 385 — par exemple ligne 61 `FH.BCIWH` → `FH.BC1WH` (I/1), ligne 160 `FB.AVDW9` → `FH.AVDW9` (préfixe FB/FH), ligne 374 `FH.OQ37D` → `FH.0Q37D` (O/0).

## 3. Non rapprochées — « À traiter à la main » (15 lignes du fichier finance)

| Ligne | Clé | Type | Raison attendue |
|---|---|---|---|
| 43, 118, 260 | (vide) | XBH | (d) clé manquante |
| 77, 176, 267, 343 | `FH.T4W3X`, `FH.F9XFC`, `FH.BQC7T`, `FH.4SF5Z` | PBH | (a) absent de la database, sans candidat |
| 418 | `FH.N7VEA` | PBH | (a) **nouveau contrat de novembre**, absent de la database |
| 171 | `FH.F4ZSJ` | FBH | (a) **le faux ami rejeté en octobre n'est plus proposé** |
| 99, 409 | (vide) | Multiservices | (c) multiservices sans code `MS-…` |
| 331 et 365 | `FH.P5N5B` | XBH | (e) doublon — jamais additionné |
| 360 et 364 | `FH.GEXK7` | XBH | (e) doublon — jamais additionné |

## 4. Rapprochées mais signalées

| Ligne | Clé | Raison |
|---|---|---|
| 27, 150, 290 | `FH.ZZUN4`, `FH.TTWL9`, `FH.MG5HE` | (f) Cost = « N/A », recopié tel quel |
| 66, 152 | `FH.976NT`, `FH.KW7NS` | (h) type différent (XBH côté finance, PBH côté database) |

Côté database, sont aussi listés : 12 contrats absents du fichier finance (b), dont `FH.FVZSJ` (le vrai contrat proche du faux ami), 2 multiservices sans code (c) et les 2 contrats des doublons (e).

## 5. Toutes les autres lignes

Les 368 autres lignes sont rapprochées à 100 % par WBS identique (dont les 8 multiservices codés `MS-001` à `MS-008`), avec des KPI recopiés à l'identique.
