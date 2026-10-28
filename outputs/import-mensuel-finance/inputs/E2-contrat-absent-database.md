# E2 — Contrat absent de la database (proposed)

## Version fictive — tour de test 1 (2026-10-28)

Données entièrement fictives, préparées par `jeu-fictif/preparer_scenarios_E1_E4.py` à partir de la database centrale fictive (400 contrats).

**À taper dans une nouvelle conversation :** /mon-import-mensuel-finance simule l'import de décembre 2026 avec le fichier finance `outputs/import-mensuel-finance/inputs/jeu-fictif/scenarios/Xbh Contracts Financial performance - Décembre 2026 (FICTIF - E2).xlsx` (fichiers fictifs).

Contenu du fichier : la même clôture normale, plus une dernière ligne au WBS inventé `FH.TEST001` (type XBH, client vide, 1 000 dans chaque KPI).

La database centrale fictive par défaut est utilisée. Le corrigé (`jeu-fictif/scenarios/corrige-scenarios-E1-E4.md`) n'est jamais fourni à l'exécution.

## Version réelle — à faire à l'étape Run, dans le Google Workspace Airbus

Ne collez jamais de données financières ici : ce fichier décrit seulement comment préparer le test.

**À lancer :** importe le fichier finance du mois du test (le mois de la copie préparée ci-dessous).

Préparation dans le Google Drive :
1. Faire une copie du dernier fichier finance reçu et la nommer `Xbh Contracts Financial performance : [Mois] [Année]` pour un mois de test sans database existante.
2. À la fin de la liste des contrats, ajouter une ligne avec le WBS inventé `FH.TEST001`, la colonne client laissée vide et un montant de 1 000 dans chaque colonne de KPI.

Résultat attendu (version 1) : la ligne `FH.TEST001` apparaît dans « À traiter à la main » avec la raison « absent de la database » ; dans « Contrôle », l'écart de chaque KPI est entièrement expliqué par ce contrat (1 000).

Résultat attendu (version 2, workflow automatisé) : la ligne `FH.TEST001` n'est jamais rapprochée à 100 %. Si un contrat de même type reste libre dans la database, elle est rapprochée en passe 2 avec une confiance inférieure à 100 % et listée dans « Correspondances à confirmer » ; sinon, elle est listée dans « À traiter à la main » avec la raison (a). Le contrôle explique entièrement l'écart.
