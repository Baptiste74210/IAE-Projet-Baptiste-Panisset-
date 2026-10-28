# Démonstration du prototype — Import Mensuel Finance (2026-10-29)

*Données entièrement fictives. Aucun nom de client, aucun chiffre Airbus.*

**Le message à faire passer :** chaque mois, au lieu de 1 à 2 jours de RECHERCHEV, Baptiste donne un ordre, le prototype rapproche les ~400 contrats, contrôle les totaux et ne lui demande que les cas incertains. Ses décisions sont mémorisées : le mois suivant, il y a de moins en moins de questions.

## Avant la démo (5 minutes)

1. Ouvrir GitHub sur le dossier `outputs/import-mensuel-finance/` (pour montrer les livrables).
2. Avoir sous la main le fichier finance fictif `inputs/jeu-fictif/demo/Xbh Contracts Financial performance - Novembre 2026 (FICTIF - démo).xlsx` (à télécharger depuis GitHub pour l'ouvrir dans Excel).
3. Ouvrir une **nouvelle session** Claude Code, sans rien lancer.

## Déroulé (10 minutes)

| # | Ce que vous faites | Ce que vous montrez / dites |
|---|---|---|
| 1 | Montrer le fichier finance fictif dans Excel | « 399 contrats ; la colonne client est remplie de codes neutres et le programme ne la lit jamais. » |
| 2 | Coller le message de lancement (ci-dessous) dans la nouvelle session | « Un seul ordre : le mois et le fichier. » |
| 3 | Lire le résumé | **382 à 100 %, 2 à confirmer, 15 à traiter à la main, totaux OK.** « Les 14 WBS mal saisis d'octobre sont reconnus grâce à la mémoire ; le faux ami rejeté en octobre n'est plus proposé. » |
| 4 | Répondre aux 2 correspondances | `FH.YXSBL = Oui` (deux caractères inversés, confiance Élevée) et `FH.SHPKH = Oui` (une lettre, confiance Moyenne) — « je reste le décideur ». |
| 5 | Ouvrir la database du mois produite (le fichier `runs/Database XBH Novembre 2026 vN.xlsx` indiqué dans le résumé, sur GitHub) | Les 4 onglets : Database, À traiter à la main (avec la raison de chaque ligne), Correspondances à confirmer, Contrôle (totaux OK, trace). |
| 6 | Conclure | « En production, la même logique tourne en Apps Script dans le Google Workspace d'Airbus : les données ne sortent jamais. Tests : 153 lignes sur 153 atteintes. » |

**Message de lancement à coller :**

```
Rattache le dépôt Baptiste74210/IAE-Projet-Baptiste-Panisset- avec droit d'écriture, puis utilise la skill mon-import-mensuel-finance pour simuler l'import de novembre 2026 avec le fichier finance "outputs/import-mensuel-finance/inputs/jeu-fictif/demo/Xbh Contracts Financial performance - Novembre 2026 (FICTIF - démo).xlsx" et la mémoire "outputs/import-mensuel-finance/inputs/jeu-fictif/demo/memoire-apres-octobre (FICTIF).csv" (fichiers fictifs, usage simulation). N'ouvre pas design-spec.md, requirements.md, test-results.md ni les corrigés. Enregistre les résultats sur une branche dont le nom commence par claude/.
```

Remarque : le nom exact du fichier produit dépend des versions déjà présentes dans `runs/` (le programme ne remplace jamais un fichier existant) ; la session l'indique dans son résumé.

## Si on vous pose la question

- **Et si le fichier finance change de format ?** Le programme s'arrête sans rien créer et dit quelle colonne manque (test E3).
- **Et si on relance le même mois ?** Il crée une nouvelle version, sans toucher l'ancienne (test E4).
- **Et le nom du client ?** Jamais lu : les multiservices sont reconnus par un code `MS-…` dans la colonne WBS.
- **Pourquoi pas une IA qui décide seule ?** Le rapprochement est un calcul déterministe ; seul le jugement sur les cas incertains est humain — et le test a montré que ce jugement demande de la vigilance (faux ami).
