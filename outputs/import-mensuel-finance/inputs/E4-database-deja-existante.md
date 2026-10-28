# E4 — Database du mois déjà existante (proposed)

## Version fictive — tour de test 1 (2026-10-28)

Données entièrement fictives, préparées par `jeu-fictif/preparer_scenarios_E1_E4.py` à partir de la database centrale fictive (400 contrats).

**À taper dans une nouvelle conversation :** /mon-import-mensuel-finance simule l'import de février 2027 avec le fichier finance `outputs/import-mensuel-finance/inputs/jeu-fictif/scenarios/Xbh Contracts Financial performance - Février 2027 (FICTIF - E4).xlsx` (fichiers fictifs), puis relance exactement le même import une deuxième fois.

Contenu du fichier : la même clôture normale ; le test consiste à lancer deux fois l'import du même mois.

La database centrale fictive par défaut est utilisée. Le corrigé (`jeu-fictif/scenarios/corrige-scenarios-E1-E4.md`) n'est jamais fourni à l'exécution.

## Version réelle — à faire à l'étape Run, dans le Google Workspace Airbus

Ne collez jamais de données financières ici : ce fichier décrit seulement comment préparer le test.

**À lancer :** importe le fichier finance d'un mois déjà traité, dont la `Database XBH [Mois] [Année]` existe déjà dans le Google Drive (exemple : relancer le mois traité en E1).

Préparation : aucune, si le scénario E1 a été lancé avant ; sinon, utiliser un mois dont la database mensuelle existe déjà.

Résultat attendu (version 2, workflow automatisé) : le workflow ne s'arrête pas ; il crée `Database XBH [Mois] [Année] v2`, sans modifier ni écraser la version existante.
