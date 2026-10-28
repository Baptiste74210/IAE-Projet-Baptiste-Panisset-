# Texte de la soutenance — slide par slide

*6 minutes de présentation, démo comprise, puis 5 minutes de questions. Environ 150 mots par minute : chaque texte tient dans son temps. Ce qui est entre crochets est une action, pas à dire.*

---

## Slide 1 — Le problème métier · 30 s

Bonjour. Je suis alternant BA/PMO chez Airbus Helicopters, dans le service qui suit les contrats de support HCare.

Chaque mois, vers le 15, la finance m'envoie un fichier d'environ 400 contrats. Je dois reporter les chiffres — chiffre d'affaires, facturation, coûts, heures de vol — dans ma database, qui alimente le dashboard du service. Je le fais à la main, avec des RECHERCHEV : cela me prend un à deux jours par mois, et quand un WBS est mal saisi, le chiffre se perd sans alerte.

C'est l'opportunité numéro 1 de mon rapport : une structure stable et un travail purement mécanique.

---

## Slide 2 — Le workflow déconstruit · 30 s

J'ai décomposé ce travail en 8 étapes. Le programme anonymise les fichiers, contrôle le format, prépare la database du mois, rapproche les contrats, vérifie les totaux et réinjecte les résultats.

Une seule étape demande une décision humaine : la 7. Je dis Oui ou Non sur chaque correspondance qui n'est pas sûre à 100 %. Ensuite, le programme s'en souvient le mois suivant.

Tout ce qui ne peut pas être rapproché part dans une liste « à traiter à la main », avec sa raison. Et si le fichier est inutilisable, il s'arrête sans rien écrire.

---

## Slide 3 — Le classement · 30 s

Mon workflow est **déterministe** : chaque étape applique une règle écrite, et le même fichier donne toujours le même résultat. Il n'y a pas d'IA pendant l'exécution.

Il est **automatisé** : je tape seulement le mois, et rien ne m'est demandé jusqu'au message « database prête à valider ».

La place de l'humain, c'est moi, à l'étape 7 uniquement. Je n'ai pas choisi d'agent : il n'y a aucun chemin à décider, donc un programme fixe est plus sûr et se vérifie au centime.

---

## Slide 4 — L'architecture · 45 s

Il y a deux briques, avec le même calcul.

À gauche, la **production** : un programme Apps Script installé directement dans ma database Google Sheets, dans le Google Workspace d'Airbus. Il ajoute un menu « Import mensuel finance ». C'est la seule façon de traiter les vraies données sans qu'elles sortent de l'entreprise.

À droite, la **construction** : une skill Claude Code qui fait exactement le même calcul, mais sur des données fictives. Elle me sert à simuler, tester et faire évoluer le programme. Des tests automatiques vérifient que les deux versions donnent le même résultat.

Ce que je n'ai volontairement pas fait : pas d'IA à l'exécution, pas d'agent, pas d'export SAP automatique — la finance ne peut pas le fournir — et je ne touche pas au dashboard Looker Studio.

---

## Slide 5 — La chaîne de données · 30 s

Les chiffres viennent de SAP. La finance les met en forme dans un Google Sheet, par copier-coller. Mon programme lit ce fichier, le contrôle, rapproche les contrats, et produit la database du mois que je valide. Looker Studio l'affiche ensuite aux managers et aux Contract Managers.

Les contrôles : arrêt avant toute écriture si le fichier est mal formé, et des totaux vérifiés au centime.

Les données sensibles : le nom du client n'est jamais lu, et les vraies données ne quittent jamais Airbus. Claude et GitHub ne voient que du fictif.

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

J'ai testé le workflow sur 7 scénarios : un mois normal, un contrat inconnu, un fichier mal formé, un mois lancé deux fois, 400 contrats avec des pièges, le mois suivant avec la mémoire, et les multiservices.

Chaque test a été lancé dans une conversation neuve, qui ne connaissait ni mes requirements ni mon design, puis noté ligne par ligne contre mes critères.

Au premier tour : 153 lignes sur 155. Le test a trouvé un vrai défaut — après un « Non », le type de contrat n'était pas recopié. Je l'ai corrigé. Au deuxième tour : 153 sur 153.

Les tests m'ont aussi appris quelque chose sur moi : un exemple de réponse m'a fait valider un faux ami. J'ai retiré cet exemple. La limite : ce qui ne se voit que dans le vrai Workspace Airbus.

---

## Slide 8 — Pilotage et production · 30 s

[Montrer le tableau de pilotage.] Voici mon tableau de pilotage.

Ma décision : **GO** pour la démo et pour un pilote sur données fictives. **PAS ENCORE** pour les données réelles, tant que quatre conditions ne sont pas remplies : l'accord de mon tuteur pour Apps Script, la table des colonnes, les codes multiservices, et un essai à blanc dans le Workspace.

Je supervise avec l'onglet Contrôle à chaque import et une ligne par mois dans mon journal. Objectif : passer d'un ou deux jours à une demi-journée, sans aucune ligne oubliée. Première vraie clôture vers le 15 novembre, et bilan en janvier.

Merci, je suis prêt pour vos questions.

---

## Questions probables du jury

- **Pourquoi pas une IA qui décide seule ?** Le rapprochement est un calcul : une règle écrite est plus sûre et vérifiable au centime. Le seul jugement, sur les cas incertains, reste humain — et les tests montrent qu'il demande de la vigilance.
- **Et si la finance change le format du fichier ?** Le programme s'arrête sans rien créer et dit quelle colonne manque (test E3).
- **Et si on relance le même mois ?** Il crée une version 2, sans jamais écraser l'ancienne (test E4).
- **Comment gérez-vous la confidentialité ?** Le nom du client n'est jamais lu ; les multiservices ont un code ; les vraies données restent dans le Workspace Airbus ; Claude et GitHub ne voient que des données fictives.
- **Pourquoi 399 lignes et pas 30 ?** C'est le vrai volume d'un mois : la démo prouve que le prototype tient la charge réelle.
- **Combien de temps gagné ?** Aujourd'hui 1 à 2 jours ; cible une demi-journée, à mesurer sur la clôture de novembre.
