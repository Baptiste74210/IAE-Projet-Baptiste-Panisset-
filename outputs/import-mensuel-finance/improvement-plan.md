---
workflow: import-mensuel-finance
review_type: revue anticipée (avant le premier lancement réel)
date: 2026-10-29
baseline: outputs/import-mensuel-finance/test-results.md (tour 2, readiness ready, 153 / 153)
recommendation: tune
next_review: 2027-01-29
---

# Improve — Import Mensuel Finance : revue anticipée du 2026-10-29

**Pourquoi maintenant :** demandée par Baptiste avant la soutenance. Le workflow n'a pas encore tourné sur des données réelles : cette revue s'appuie sur les preuves disponibles (2 tours de test, répétition de la démo dans Google Sheets, journal `runs.md`, tests automatiques relancés aujourd'hui). **Le bilan complet reste prévu le 29/01/2027**, après trois clôtures réelles.

## 1. Performance actuelle

| Source | Ce qu'elle montre |
|---|---|
| Tour de test 1 (2026-10-28) | 153 / 155 lignes atteintes ; 1 défaut (AC10) ; 1 raté accepté (AC13) |
| Tour de test 2 — **baseline** | 153 / 153, verdict prêt ; résultats identiques aux corrigés |
| Répétition Google Sheets (2026-10-28) | 1er essai 368 / 17 / 14 (mémoire non trouvée), 2e essai **382 / 2 / 15, contrôle OK** ; 2 « Oui » pris en compte ; relance sans double application |
| Tests automatiques relancés (2026-10-29) | Python : E5 370 / 15 / 13, E6 384 / 0 / 14, chaîne identique à E6, 0 ligne sans type · `Rapprochement.gs` conforme · `Code.gs` 19 vérifications conformes |
| Journal `runs.md` | Uniquement des lancements fictifs ; aucune clôture réelle encore |

**Retouches nécessaires (edits) :** « aucune » sur 6 des 7 scénarios du tour 2 ; « un peu » sur E5 au tour 1 (corrigé). Tendance stable.

## 2. Régression : lignes qui ont changé

Comparaison tour 1 → tour 2 (baseline) → aujourd'hui (tests automatiques relancés).

| Scénario | Ligne | Tour 1 | Tour 2 | Aujourd'hui | Preuve |
|---|---|---|---|---|---|
| E5 | AC10 — « À traiter à la main » complet | Non atteint | Atteint | Atteint | Type de contrat écrit après un « Non » ; `lignes_a_traiter_sans_type` = 0 ; vérification `Code.gs` AC10 conforme |
| E5 | AC13 — aucune question avant « prête » | Non atteint (accepté) | Atteint | — | Question « fichiers fictifs ? » posée seulement si l'ordre ne le précise pas |

**Aucune ligne n'est passée de « atteint » à « non atteint ».** Pas de régression.

## 3. Problèmes identifiés

| # | Constat | Cause | Bloc concerné | Gravité |
|---|---|---|---|---|
| P1 | À la répétition, la `Mémoire des correspondances` importée depuis un Mac n'a pas été trouvée : le programme en a créé une vide (368 / 17 / 14 au lieu de 382 / 2 / 15) | Le « é » du nom de fichier était encodé autrement (NFD) ; la recherche par nom exact échoue | Apps Script `Code.gs` (`trouverDansDossier`, `ouvrirFichierFinance`) | Moyenne : pas d'erreur de chiffre, mais la mémoire est ignorée sans alerte |
| P2 | Le faux ami (l. 171) a été confirmé à tort 3 fois pendant les tests | Une correspondance « Moyenne » ressemble à une faute de frappe ; rien n'invite à vérifier le contrat | Onglet « Correspondances à confirmer » (`Code.gs`, skill) | Moyenne : risque humain, pas du programme |
| P3 | Lignes jamais testées : fichiers anonymisés, dossier et partages, données qui ne sortent pas (R8) | Pas d'accès au Workspace Airbus pendant les tests | Environnement | À vérifier à l'essai à blanc |

## 4. Changement de mécanisme ?

**Non.** Le chemin reste fixe (8 étapes), aucune nouvelle décision n'est apparue : le programme déterministe reste le bon choix. Pas de passage à un agent.

## 5. Recommandation : **Tune** (ajustements légers, non bloquants pour le pilote)

La logique de rapprochement et les contrôles ne changent pas. Deux ajustements ciblés avant la première clôture réelle :

| Action | Bloc | Effort |
|---|---|---|
| A1 — Rechercher les fichiers en ignorant les différences d'encodage des accents (comparaison des noms normalisés) et **alerter** si la mémoire attendue est introuvable au lieu d'en créer une vide en silence | `Code.gs` | ~30 min + relance des tests |
| A2 — Dans « Correspondances à confirmer », ajouter une colonne « À vérifier » pour les confiances Moyenne et Faible (ex. « une lettre différente : vérifier le contrat ») | `Code.gs`, programme Python, skill | ~30 min + relance de E5 |
| A3 — À l'essai à blanc dans le Workspace Airbus, cocher les lignes non testées (P3) et noter le résultat dans `runs.md` | Run | Pendant le pilote |

**Suite :** `build` en mode correction sur A1 et A2, puis `test` sur E5 et E6.

## 6. Prochaine revue

**29 janvier 2027**, après trois clôtures réelles. On mesurera : temps par clôture (cible ½ journée), lignes oubliées (cible 0), correspondances à confirmer en baisse d'un mois sur l'autre. Phrase pour la lancer : « Lance la skill improve sur Import Mensuel Finance. »
