# Texte de la soutenance — slide par slide

*6 minutes de présentation, démo comprise, puis 5 minutes de questions. Environ 150 mots par minute : chaque texte tient dans son temps. Ce qui est entre crochets est une action, pas à dire.*

---

## Slide 1 — Synthèse : problème et valeur · 30 s

Voici ma synthèse en une page. Le problème : chaque mois, je passe 1 à 2 jours en RECHERCHEV, et surtout, sur notre jeu de test, 34 lignes sur 398 seraient perdues ou faussées sans aucune alerte. Ma solution : un programme déterministe qui rapproche les 400 contrats, contrôle les totaux au centime et explique chaque écart ; je ne valide que les cas incertains. La valeur : environ 3 400 € par an de temps gagné, en hypothèse à 40 € de l’heure, mais surtout des chiffres fiables pour les managers et les Contract Managers. Coût environ 1 700 €, retour en 7 mois environ. Je demande un GO pour lancer le pilote dès aujourd’hui sur la clôture de novembre : le programme tourne dans Google Workspace, l’environnement qu’Airbus utilise déjà. Bilan le 29 janvier.

---

## Slide 2 — Le workflow déconstruit · 30 s

Huit étapes. Le programme anonymise, contrôle le fichier, prépare la database du mois, rapproche, vérifie les totaux et réinjecte. Le rapprochement cherche d’abord le WBS identique, sinon le plus proche du même type, avec un niveau de confiance. Une seule étape est humaine, la 7 : je dis Oui ou Non sur chaque cas incertain, et le programme s’en souvient le mois suivant. Ce qui ne peut pas être rapproché est mis de côté avec sa raison, et un fichier inutilisable arrête tout sans rien écrire.

---

## Slide 3 — Le classement · 30 s

Mon workflow est déterministe : il applique des règles écrites, comme une calculatrice, donc le même fichier donne toujours le même résultat, sans IA pendant l’exécution. Il est automatisé : je tape le mois, et rien ne m’est demandé jusqu’au message « prête à valider ». L’humain, c’est moi, à l’étape 7. Je n’ai pas pris d’agent : il n’y a aucun chemin à choisir, donc un programme fixe est plus sûr.

---

## Slide 4 — L'architecture · 45 s

Deux briques, un même calcul. En production, un programme Apps Script installé dans ma database Google Sheets, chez Airbus : il ajoute un menu, et les vraies données ne sortent jamais du Workspace. Pour construire et tester, une skill Claude Code qui fait exactement le même calcul sur un jeu fictif de 400 contrats. 33 tests automatiques vérifient que les deux donnent le même résultat. Au total : un programme, une skill, aucun agent. Ce que je n’ai volontairement pas fait : pas d’IA pendant l’exécution, pas d’export SAP (la finance ne peut pas le fournir), et je ne touche pas au dashboard Looker.

---

## Slide 5 — La chaîne de données · 30 s

Les chiffres viennent de SAP ; la finance les met en forme dans un Google Sheet vers le 15. Mon programme se place au milieu : il contrôle le fichier, rapproche les contrats, puis je valide les cas incertains avant que le dashboard Looker ne les montre aux managers et aux Contract Managers. Les contrôles : arrêt avant toute écriture si le fichier est mal formé, totaux au centime, chaque ligne a une destination. Côté sensible : le nom du client n’est jamais lu, et les vraies données ne quittent jamais Airbus.

---

## Slide 6 — La démo en direct · 2 min

Je vous montre maintenant le prototype, dans Google Sheets, sur un mois de novembre fictif que je n'ai jamais utilisé en test.

[Ouvrir le fichier finance.] Voici le fichier de la finance : 399 contrats. La colonne client ne contient que des codes neutres.

[Ouvrir la database centrale → Import mensuel finance → Lancer l'import → taper « Novembre 2026 ».] Je donne un seul ordre : le mois.

[Le message apparaît.] Résultat : 382 contrats rapprochés à 100 %, 2 à confirmer, 15 à traiter à la main, et le contrôle des totaux est OK. Les 14 WBS mal saisis en octobre sont reconnus tout seuls grâce à la mémoire. Le « faux ami » que j'avais refusé en octobre n'est plus proposé.

[Ouvrir la database du mois → onglet Correspondances à confirmer.] Voici le moment humain. Première paire : deux lettres inversées, c'est une faute de frappe, je dis Oui. Deuxième : une seule lettre change, je vérifie, je dis Oui.

[Import mensuel finance → Prendre en compte mes décisions.] Le programme applique mes décisions : contrôle OK, validation possible. C'est exactement le résultat attendu, que j'avais écrit à l'avance dans demo-attendu.md.

*Si la connexion lâche : « Je vous montre la capture de la répétition d'hier. »*

---

## Slide 7 — Les tests · 45 s

J’ai testé 7 scénarios : un mois normal, un contrat inconnu, un fichier mal formé, un mois relancé, 400 contrats piégés, le mois suivant avec la mémoire, et les multiservices. Chaque test a tourné dans une conversation neuve, qui ne connaissait pas mon design, puis j’ai noté chaque critère. Tour 1 : 153 lignes sur 155, avec un vrai défaut : après un « Non », le type de contrat n’était pas recopié. Corrigé. Tour 2 : 153 sur 153, verdict prêt. La leçon : un exemple de réponse m’a fait valider un faux ami ; je l’ai retiré, et ma vigilance reste essentielle. La limite : ce qui ne se voit que dans le vrai Workspace Airbus.

---

## Slide 8 — Pilotage et production · 30 s

[Montrer le tableau de pilotage.] Voici mon tableau de pilotage.

Ma décision : **GO**. La solution est prête, et Apps Script est natif du Google Workspace qu'Airbus utilise déjà. Le pilote démarre maintenant, en quatre étapes : activer le script, créer la table des colonnes et les codes multiservices, faire un essai à blanc dans le Workspace, puis la clôture de novembre.

Je supervise avec l'onglet Contrôle à chaque import et une ligne par mois dans mon journal. Objectif : passer d'un ou deux jours à une demi-journée, sans aucune ligne oubliée. Première vraie clôture vers le 15 novembre, et bilan en janvier.

Merci, je suis prêt pour vos questions.

---

## Questions probables du jury

- **Pourquoi pas une IA qui décide seule ?** Le rapprochement est un calcul : une règle écrite est plus sûre et vérifiable au centime. Le seul jugement, sur les cas incertains, reste humain — et les tests montrent qu'il demande de la vigilance.
- **Et si la finance change le format du fichier ?** Le programme s'arrête sans rien créer et dit quelle colonne manque (test E3).
- **Et si on relance le même mois ?** Il crée une version 2, sans jamais écraser l'ancienne (test E4).
- **Comment gérez-vous la confidentialité ?** Le nom du client n'est jamais lu ; les multiservices ont un code ; les vraies données restent dans le Workspace Airbus ; Claude et GitHub ne voient que des données fictives.
- **Pourquoi 399 lignes et pas 30 ?** C'est le vrai volume d'un mois : la démo prouve que le prototype tient la charge réelle.
- **D'où viennent les euros ?** Ce sont des hypothèses, affichées comme telles : 84 h par an gagnées (1 jour par mois), à 40 €/h chargé ; 5 jours de construction et 1 jour par an de maintenance. À confirmer avec mon tuteur.
- **D'où vient « 34 lignes sur 398 » ?** C'est la mesure sur le jeu de test fictif : une RECHERCHEV exacte ne retrouve pas 22 contrats au WBS légèrement différent, perd une ligne de chaque doublon, et ignore sans alerte les lignes sans clé, les types différents et les « N/A ».
- **Et si l'informatique d'Airbus bloque Apps Script ?** C'est un outil natif du Google Workspace qu'Airbus utilise déjà ; la première étape du pilote est justement de vérifier qu'il est activé pour mon compte. Si besoin, je demande son activation à l'équipe IT : le programme ne fait sortir aucune donnée.
- **Combien de temps gagné ?** Aujourd'hui 1 à 2 jours ; cible une demi-journée, à mesurer sur la clôture de novembre.
