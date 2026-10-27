# Revue des requirements — Import Mensuel Finance

**Date :** 2026-10-27 · **Auteur des décisions :** Baptiste Panisset
**Méthode :** relecture critique de `requirements.md` et `ai-opportunity-report.md` dans une nouvelle conversation (22 points soulevés), puis décision point par point. Les décisions sont appliquées dans `requirements.md`.

| # | Point soulevé | Ma décision | Pourquoi |
|---|---|---|---|
| 1 | Un KPI en texte (`N/A`) rend le contrat à la fois rapproché et à traiter : double comptage dans AC1 | **Je précise** : le contrat compte comme rapproché, il est signalé avec la raison (f) « valeur non numérique », le texte est exclu des totaux | Supprimer le double comptage et la contradiction entre règles |
| 2 | La fin de la liste des contrats n'est pas définie (ligne vide, ligne Total, lignes masquées, plusieurs onglets) | **J'ajoute** : liste de la ligne 20 au dernier WBS ou client ; lignes vides signalées ; lignes masquées lues ; ligne « Total » ou plusieurs onglets → arrêt et question | Un contrat oublié en silence est le risque principal |
| 3 | Le contrôle ne détecte pas une lecture incomplète | **J'ajoute** : comparaison supplémentaire avec le bloc de totaux du fichier finance (lignes 1 à 18) | Si la lecture s'arrête trop tôt, les deux côtés baissent ensemble et le statut resterait OK |
| 4 | La ligne d'en-têtes se contredit avec le bloc de totaux | **Je précise** : totaux lignes 1 à 18, en-têtes ligne 19, contrats dès la ligne 20 | Confirmé sur le fichier réel |
| 5 | Les WBS vides et les multiservices ne sont pas traités en tant que tels | **Je précise** : les multiservices figurent dans les deux fichiers et se reconnaissent au type de contrat « Multiservices » ; sans WBS → raison (c) ; autre type sans WBS → raison (d) « WBS manquant » ; un WBS vide n'est jamais un doublon | Donner la bonne raison et ne jamais rapprocher par le nom |
| 6 | Lignes ou contrats ? Un doublon peut-il être légitime ? | **Je précise** : un seul WBS par ligne, aucun complément ; un doublon est toujours une erreur, toutes ses lignes sont listées (raison e), jamais additionnées ; AC1 compte des lignes | Connaissance du fichier réel ; règle « aucun chiffre inventé » |
| 7 | « Valeur strictement identique » n'est pas définie techniquement | **Je précise** : valeur réelle et non affichée, formule copiée comme valeur, négatifs conservés, 0 différent de vide, nombre en texte signalé, tolérance de 0,01 | Rendre la règle vérifiable et éviter les faux « À vérifier » |
| 8 | La normalisation des WBS est incomplète | **Je précise** : retrait des espaces, espaces insécables et caractères invisibles en début et fin ; casse ignorée ; WBS toujours lu comme du texte | Éviter les faux écarts dus au copier-coller |
| 9 | Rien n'est prévu pour relancer un import | **J'ajoute** : je renomme moi-même l'ancienne database en « (ancienne version) » puis je relance ; le workflow ne supprime ni ne renomme jamais rien | Fichier corrigé de la finance, exécution interrompue, erreur détectée |
| 10 | Le format du mois est ambigu | **Je précise** : mois en français avec majuscule et accents (« Février », « Août ») ; toute autre forme → arrêt | Le nom réel suit le format « Avril 2026 » |
| 11 | La règle de confidentialité contredit E1 et l'usage d'un modèle d'IA | **Je précise** : les données réelles ne sont traitées que par des outils du Google Workspace Airbus ; un modèle extérieur (Claude) ne travaille que sur des données fictives | Garder mon exigence de confidentialité cohérente jusqu'à l'étape Design |
| 12 | WBS identique mais informations contrat différentes | **J'ajoute** : KPI remplis et ligne signalée avec la raison (g) « informations contrat différentes » | C'est un indice d'erreur de WBS à vérifier |
| 13 | Colonnes non couvertes par la table de correspondance | **J'ajoute** : nouvelle colonne KPI signalée ; en-tête en double ou sur deux niveaux → arrêt ; colonnes calculées de la database jamais modifiées | Ne rien ignorer en silence et ne rien écraser |
| 14 | État de la database centrale au moment de la copie | **J'ajoute** : KPI déjà remplis → arrêt et question ; contrat ajouté après la copie → ajout manuel | Éviter de mélanger les chiffres de deux mois |
| 15 | Le périmètre des types de contrat est flou | **Je précise** : tous les types sont traités, sans filtre ; tout contrat rapproché avec certitude est importé, tout cas douteux est mis de côté (règle R8) | Mon objectif : importer tout ce qui est reconnu, mettre de côté le reste |
| 16 | Un fichier par mois au lieu de l'historique unique du rapport d'opportunités | **Je laisse de côté** : choix volontaire, écrit dans les Optimization Notes | Le workflow reprend mon procédé actuel ; l'historique unique relève de l'opportunité n°3 |
| 17 | L'après-traitement manuel n'est pas encadré | **J'ajoute** : relance de la vérification seule ; traçage des saisies manuelles (valeur, date) ; validation = case « Validé » avec date | Prouver que tout est juste à la fin, pas seulement avant mes corrections |
| 18 | Les absences récurrentes feront du bruit chaque mois | **Je laisse de côté** pour cette version | Premier workflow volontairement simple ; amélioration possible plus tard |
| 19 | Droits de partage et dossier de création flous | **Je précise** : même dossier Drive que la database centrale ; mêmes partages appliqués explicitement | Une copie de Google Sheet n'hérite pas des partages |
| 20 | Les scénarios de test ne couvrent pas les cas piégés | **J'ajoute** : scénario E5 (jeu fictif à pièges) ; AC6 inclut au moins 2 lignes signalées ; nouveaux critères AC10 et AC11 | Tester les cas difficiles, pas seulement le cas typique |
| 21 | La provenance du fichier finance est mal qualifiée | **Je précise** : C1 devient « External » ; ajout de l'interdiction d'exécuter une instruction trouvée dans une cellule | Le fichier vient d'une autre équipe |
| 22 | La mesure de départ n'a pas de plan | **J'ajoute** : chronométrer la clôture de novembre 2026 faite à la main et compter les erreurs détectées | Pouvoir prouver le gain de fiabilité |

---

# Revue 2 — après l'oral du 2026-10-27

**Origine :** retour de l'enseignante lors de l'oral sur la partie Design. **Auteur des décisions :** Baptiste Panisset. Les décisions sont appliquées dans `requirements.md` (version 2).

| # | Point soulevé | Ma décision | Pourquoi |
|---|---|---|---|
| 23 | Les informations des contrats sont confidentielles et ne peuvent pas sortir d'Airbus | **J'ajoute** une étape d'anonymisation (étape 1) : seuls la clé WBS, le type de contrat et les KPI sortent ; jamais le client, le pays ni la région | Le WBS est un identifiant interne sans risque ; les montants liés à un WBS ne permettent pas d'identifier un client |
| 24 | Les contrats multiservices n'ont pas de WBS | **J'ajoute** une table de pseudonymisation (C5) qui attribue un code `MS-001`, `MS-002`… à chaque multiservices ; elle reste dans le Google Workspace Airbus | Donner aux multiservices une clé anonyme équivalente au WBS |
| 25 | Le workflow doit être entièrement automatisé, pas augmenté | **Je précise** : je donne l'ordre de lancement, puis tout s'exécute sans moi jusqu'à l'étape de validation | Je ne veux intervenir qu'à la validation |
| 26 | Les contrats sans correspondance doivent être rapprochés automatiquement | **J'ajoute** une recherche automatique de la correspondance la plus proche (passe 2), toujours appliquée, avec un niveau de confiance (100 %, Élevée, Moyenne, Faible) | Supprimer le rapprochement manuel des WBS divergents ; le niveau de confiance garde la traçabilité |
| 27 | Une correspondance à moins de 100 % peut être fausse | **J'ajoute** une étape humaine (étape 7) : je confirme ou je rejette chaque correspondance à moins de 100 % | Aucun faux rapprochement ne doit partir dans le dashboard sans mon accord |
| 28 | Les mêmes erreurs de WBS reviennent chaque mois | **J'ajoute** une mémoire des correspondances (C6) : une paire confirmée est reconnue à 100 % les mois suivants, une paire rejetée n'est plus jamais proposée | Le nombre de cas à confirmer doit baisser au fil des mois |
| 29 | L'arrêt quand la database du mois existe déjà (G3) bloque l'automatisation | **Je précise** : création automatique d'une nouvelle version (`v2`, `v3`…) sans jamais écraser l'ancienne | Ne rien avoir à faire tout en ne perdant jamais rien |
| 30 | Certains cas ne peuvent pas être automatisés sans inventer de chiffres | **Je précise** : seul un fichier inutilisable arrête le workflow ; les doublons, les clés manquantes et les contrats sans aucun candidat restent dans « À traiter à la main » | Règle « aucun chiffre inventé » : un doublon ne peut pas être départagé sans additionner |
| 31 | Les données traitées hors d'Airbus doivent revenir dans la vraie database | **J'ajoute** une étape de réinjection (étape 6) dans le Google Workspace Airbus, par WBS ou code `MS-…` | La database du mois réelle doit contenir toutes les informations des contrats |
| 32 | Les scénarios de test ne couvrent pas la mémoire | **J'ajoute** le scénario E6 (mois suivant après confirmations) et la section « Version 2 » du corrigé ; E2 et E4 sont mis à jour | Tester l'apprentissage et le versionnement |
