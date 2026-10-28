# E1 — Clôture typique (real)

## Version fictive — tour de test 1 (2026-10-28)

Données entièrement fictives, préparées par `jeu-fictif/preparer_scenarios_E1_E4.py` à partir de la database centrale fictive (400 contrats).

**À taper dans une nouvelle conversation :** /mon-import-mensuel-finance simule l'import de novembre 2026 avec le fichier finance `outputs/import-mensuel-finance/inputs/jeu-fictif/scenarios/Xbh Contracts Financial performance - Novembre 2026 (FICTIF - E1).xlsx` (fichiers fictifs).

Contenu du fichier : une clôture normale : chaque contrat de la database fictive est présent dans le fichier finance avec son WBS exact (deux WBS ont juste un espace ou des minuscules) ; les 2 multiservices sans code restent sans code.

La database centrale fictive par défaut est utilisée. Le corrigé (`jeu-fictif/scenarios/corrige-scenarios-E1-E4.md`) n'est jamais fourni à l'exécution.

## Version réelle — à faire à l'étape Run, dans le Google Workspace Airbus

Ne collez jamais de données financières ici : ce fichier décrit seulement quoi lancer.

**À lancer :** importe le fichier finance d'octobre 2026.

- Fichier finance : le dernier fichier reçu de la finance, au format `Xbh Contracts Financial performance : [Mois] [Année]` (exemple : `Xbh Contracts Financial performance : Octobre 2026`), utilisé tel quel.
- Mois indiqué au lancement : le même mois et la même année que dans le nom du fichier.
- Database centrale : `Database Hcare XBH in service contracts`, non modifiée.
- Avant de lancer : vérifier qu'aucune `Database XBH [Mois] [Année]` n'existe déjà pour ce mois (sinon, la renommer temporairement pour ce test).
