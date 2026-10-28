# E3 — Template modifié (proposed)

## Version fictive — tour de test 1 (2026-10-28)

Données entièrement fictives, préparées par `jeu-fictif/preparer_scenarios_E1_E4.py` à partir de la database centrale fictive (400 contrats).

**À taper dans une nouvelle conversation :** /mon-import-mensuel-finance simule l'import de janvier 2027 avec le fichier finance `outputs/import-mensuel-finance/inputs/jeu-fictif/scenarios/Xbh Contracts Financial performance - Janvier 2027 (FICTIF - E3).xlsx` (fichiers fictifs).

Contenu du fichier : la même clôture normale, mais un en-tête de KPI de la ligne 19 a été renommé.

La database centrale fictive par défaut est utilisée. Le corrigé (`jeu-fictif/scenarios/corrige-scenarios-E1-E4.md`) n'est jamais fourni à l'exécution.

## Version réelle — à faire à l'étape Run, dans le Google Workspace Airbus

Ne collez jamais de données financières ici : ce fichier décrit seulement comment préparer le test.

**À lancer :** importe le fichier finance du mois du test (le mois de la copie préparée ci-dessous).

Préparation dans le Google Drive :
1. Faire une copie du dernier fichier finance reçu et la nommer `Xbh Contracts Financial performance : [Mois] [Année]` pour un mois de test sans database existante.
2. Dans la ligne d'en-têtes, renommer un seul en-tête de KPI listé dans la table de correspondance C3 (exemple : ajouter « _v2 » à la fin de l'en-tête).

Résultat attendu : le workflow s'arrête à l'étape 1, indique l'en-tête introuvable et ne crée aucune `Database XBH [Mois] [Année]`.
