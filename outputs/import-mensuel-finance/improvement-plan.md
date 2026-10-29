---
workflow: import-mensuel-finance
review_type: revue anticipée (avant le premier lancement réel)
date: 2026-10-29
baseline: outputs/import-mensuel-finance/test-results.md (tour 2, readiness ready, 153 / 153)
recommendation: tune
focus: lignes « À traiter à la main »
next_review: 2027-01-29
---

# Improve — Import Mensuel Finance : revue anticipée du 2026-10-29

**Pourquoi maintenant :** demandée par Baptiste avant la soutenance. Le workflow n'a pas encore tourné sur des données réelles : la revue s'appuie sur les 2 tours de test, la répétition de la démo dans Google Sheets, le journal `runs.md` et les tests automatiques relancés aujourd'hui. **Le bilan complet reste prévu le 29/01/2027**, après trois clôtures réelles.

## 1. En bref

- **L'outil marche et rien ne s'est dégradé** : tous les tests repassent (153 / 153 au tour 2, tests automatiques conformes aujourd'hui).
- **La principale marge de progrès, ce sont les lignes « À traiter à la main »** : chaque mois, environ **15 lignes sur 399 (≈ 4 %)** ne peuvent pas être rapprochées automatiquement et me reviennent. Le programme les repère et les explique — c'est déjà un progrès par rapport à la RECHERCHEV, qui les perdait sans alerte — mais **la plupart ont une cause à la source qui peut être supprimée**.

## 2. La marge d'amélioration : les lignes « À traiter à la main »

Mois de démonstration (Novembre 2026, fictif) : **15 lignes du fichier finance** à traiter à la main, plus 16 contrats de la database restés sans chiffres.

| Raison | Lignes | D'où vient le problème | Qui peut le corriger | Action d'amélioration |
|---|---|---|---|---|
| (e) Doublon — même WBS sur 2 lignes | 4 (2 WBS) | Saisie en double dans le fichier finance | Équipe finance | Signaler les doublons à la finance chaque mois ; ils sont corrigés à la source |
| (d) Clé manquante — ligne sans WBS | 3 | WBS non renseigné dans le fichier finance | Équipe finance | Rendre le WBS obligatoire dans le fichier finance |
| (c) Multiservices sans code `MS-…` | 2 (+ 2 côté database) | Code `MS-…` pas encore attribué | Baptiste et la finance | Attribuer les derniers codes `MS-…` dans les deux fichiers |
| (a) Contrat absent de la database | 6 | Nouveau contrat pas encore saisi par moi (5), ou faux ami rejeté (1) | Contract Managers et Baptiste | Être prévenu plus tôt des nouveaux contrats ; à terme, automatiser leur saisie (opportunité n° 2 du rapport) |
| **Total** | **15** | | | |

Côté database, 12 contrats sont absents du fichier finance (b) : à vérifier avec la finance chaque mois (contrat terminé ? oublié dans l'export ?).

**Ce qu'on peut viser (hypothèse) :** une fois les doublons, les WBS manquants et les codes `MS-…` corrigés à la source, il resterait environ **6 lignes par mois**, uniquement des contrats réellement nouveaux. Avec une saisie plus rapide des nouveaux contrats, on pourrait descendre à **1 ou 2**.

```
Aujourd'hui (démo) : 15 lignes  ███████████████
Causes source corrigées :  6 lignes  ██████
Nouveaux contrats saisis plus tôt : 1–2 lignes  ██
```

## 3. Les autres constats

| # | Constat | Cause | Bloc | Gravité |
|---|---|---|---|---|
| P1 | À la répétition, la `Mémoire des correspondances` importée depuis un Mac n'a pas été trouvée ; le programme en a créé une vide sans prévenir (368 / 17 / 14 au lieu de 382 / 2 / 15) | Le « é » du nom de fichier était encodé autrement | `Code.gs` | Moyenne |
| P2 | Le faux ami a été confirmé à tort 3 fois pendant les tests | Une correspondance « Moyenne » ressemble à une faute de frappe | Onglet « Correspondances à confirmer » | Moyenne (risque humain) |
| P3 | Lignes jamais testées : fichiers anonymisés, partages, données qui ne sortent pas | Pas d'accès au Workspace Airbus pendant les tests | Environnement | À vérifier à l'essai à blanc |

## 4. Régression

Aucune ligne n'est passée de « atteint » à « non atteint ». La seule ligne qui a changé s'est améliorée : **E5 · AC10** (type de contrat après un « Non »), non atteint au tour 1, atteint au tour 2 et aujourd'hui. Retouches : « aucune » sur 6 des 7 scénarios du tour 2.

## 5. Changement de mécanisme ?

**Non.** Le chemin reste fixe ; le programme déterministe reste le bon choix. Pas d'agent.

## 6. Recommandation : **Tune** (ajustements ciblés, non bloquants pour le pilote)

| Action | Ce qu'elle change | Bloc | Effort |
|---|---|---|---|
| **A1 — Synthèse des lignes à traiter** | Nouvel onglet qui regroupe les lignes « À traiter à la main » **par cause et par responsable** (finance, Contract Managers, moi), prêt à envoyer à la finance chaque mois | `Code.gs`, programme Python | ~1 h + tests |
| **A2 — Suivi mensuel** | Ajouter dans `runs.md` et le tableau de pilotage le **nombre de lignes à traiter à la main** chaque mois, avec un objectif en baisse (15 → 6 → 1–2) | `runs.md`, `dashboard.html` | ~15 min |
| A3 — Accents | Retrouver les fichiers même si l'accent est encodé autrement, et **alerter** si la mémoire est introuvable | `Code.gs` | ~30 min |
| A4 — Vigilance | Colonne « À vérifier » sur les correspondances Moyenne et Faible | `Code.gs`, Python, skill | ~30 min |
| A5 — Avec la finance | Leur présenter la synthèse A1 : doublons, WBS manquants, codes `MS-…` | Organisation | 1 réunion |

**Suite :** `build` en mode correction sur A1, A3 et A4, puis `test` sur E5 et E6.

## 7. Prochaine revue — 29 janvier 2027

Après trois clôtures réelles, on mesurera :

| Indicateur | Aujourd'hui | Objectif |
|---|---|---|
| Temps par clôture | 1 à 2 jours | ½ journée |
| Lignes oubliées sans alerte | 34 / 398 avec RECHERCHEV | 0 |
| **Lignes à traiter à la main** | ~15 par mois | **6, puis 1 à 2** |
| Correspondances à confirmer | 15 le 1er mois | en baisse chaque mois (2 en démo grâce à la mémoire) |

Phrase pour la lancer : « Lance la skill improve sur Import Mensuel Finance. »
