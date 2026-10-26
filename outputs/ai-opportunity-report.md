# Rapport d'opportunités IA — Pilotage financier HCare ESXCC

| | |
|---|---|
| **Nom** | Baptiste Panisset |
| **Rôle** | Alternant PMO / Business Analyst — Airbus Helicopters, service ESXCC (ex-ERSB), suivi des contrats de support HCare (XBH/PBH et multiservices) |
| **Date** | 2026-10-26 |
| **Angle** | Individuel (Airbus uniquement) |
| **Opportunités identifiées** | 6 |
| **Recommandation n°1** | Extraction automatique du fichier finance : c'est l'étape qui coûte 1 à 2 jours par mois, sur une structure stable, et un script peut la réduire à quelques minutes. |

**Contexte technique déterminant** : tout le flux passe par Google Workspace (Sheets, Looker Studio, Gemini). Les automatisations peuvent donc être écrites en **Google Apps Script**, directement dans les fichiers Airbus. Aucune donnée ne sort de l'environnement de l'entreprise.

---

## Tableau de synthèse

| # | Opportunité | Autonomie | Implication | Impact |
|---|---|---|---|---|
| 1 | Extraction mensuelle du fichier finance | Deterministic | Augmented | **High** |
| 2 | Saisie des nouveaux contrats | Deterministic | Automated | **High** |
| 3 | Rapport Looker permanent | Deterministic | Automated | Medium |
| 4 | Intégration bookings et mouvements de flotte | Deterministic | Augmented | Medium |
| 5 | Rapprochement WBS et rapport d'écarts | Guided | Augmented | **High** |
| 6 | Relances qualité de données | Guided | Augmented | Medium |

---

## Top 3 des recommandations

1. **Extraction mensuelle du fichier finance (#1)** : c'est le gain de temps le plus important (12 à 24 jours par an). Le travail est entièrement mécanique et la structure source est stable. Le dashboard peut ainsi être produit même pendant les semaines à l'IAE.
2. **Rapprochement WBS et rapport d'écarts (#5)** : c'est la principale source d'erreurs et de recherches manuelles. Il se branche naturellement sur la sortie du n°1.
3. **Saisie des nouveaux contrats (#2)** : c'est l'interruption la plus fréquente (quotidienne). Elle supprime les ressaisies et fiabilise la base à la source.

---

## Fiches détaillées

### Deterministic

---

**1. Extraction mensuelle du fichier finance**

**Autonomie :** Deterministic
**Implication :** Augmented (vous lancez le script et validez le contrôle des totaux)

**Pourquoi c'est un bon candidat :**
La structure est fixe : une ligne par WBS, les contrats à partir de la ligne 20, les totaux globaux sur les lignes 1 à 19, des colonnes toujours identiques (infos contrat puis KPI financiers). Les entrées et sorties sont claires, et l'opération est identique chaque mois. C'est exactement ce qu'un script fait mieux qu'un humain.

**Point de douleur actuel :**
Le Google Sheet de la finance est conçu pour être lu, pas pour Looker Studio. Vous transférez à la main les données vers votre Sheet personnel, ce qui prend une grosse journée, parfois deux, chaque mois. Le risque d'erreur de copie est réel, et le travail est bloqué quand vous êtes à l'IAE.

**Comment l'IA ou l'automatisation aide :**
Un script Apps Script, lancé depuis un menu dans votre Sheet :
1. ouvre le fichier finance du mois ;
2. ignore le bloc de totaux et gère les cellules fusionnées des en-têtes ;
3. lit chaque ligne de contrat et la normalise (dates, nombres, WBS sans espaces parasites) ;
4. ajoute une colonne « Mois de clôture » et ajoute les lignes à la suite de l'historique, sans écraser les mois précédents ;
5. **contrôle** : recalcule les totaux à partir des lignes transférées, les compare au bloc de totaux de la finance, et affiche les écarts éventuels.

Gemini dans Sheets peut vous aider à écrire et à faire évoluer le script.

**Pour démarrer cette semaine :**
Dupliquez le fichier finance d'un mois passé et votre Sheet personnel. Notez pour chaque colonne cible la colonne source correspondante : c'est la table de mapping, qui constitue 80 % du travail de conception.

---

**2. Saisie des nouveaux contrats**

**Autonomie :** Deterministic
**Implication :** Automated

**Pourquoi c'est un bon candidat :**
L'événement est récurrent, les informations à saisir sont toujours les mêmes, et le volume est faible mais fréquent. Une saisie structurée à la source supprime la ressaisie.

**Point de douleur actuel :**
Les Contract Managers vous informent de chaque nouveau contrat par mail ou à l'oral, avec des informations de forme variable. Vous les recopiez dans votre base : quelques minutes par jour, qui fragmentent votre concentration. Les informations arrivent parfois incomplètes, et la ligne peut exister dans votre base sans exister encore dans le fichier finance, ce qui crée des décalages.

**Comment l'IA ou l'automatisation aide :**
Un **Google Form « Nouveau contrat »** remplace le mail. Il comporte des champs obligatoires (WBS au format contrôlé, client, type de contrat XBH ou multiservices, région, Contract Manager, type d'appareil, dates, flotte). Chaque envoi :
- ajoute automatiquement une ligne dans votre base ;
- marque la ligne « En attente finance » tant qu'elle n'apparaît pas dans le fichier finance (ce qui alimente l'opportunité n°5) ;
- vous envoie une notification récapitulative.

Variante pour plus tard : Gemini lit les mails des Contract Managers et pré-remplit la ligne, que vous validez.

**Pour démarrer cette semaine :**
Listez les colonnes de votre base qui décrivent un contrat. Créez le Form avec ces champs, liez-le à un onglet de réponses, et testez-le avec un Contract Manager volontaire.

---

**3. Rapport Looker permanent**

**Autonomie :** Deterministic
**Implication :** Automated

**Pourquoi c'est un bon candidat :**
La copie et la reconnexion mensuelles du rapport Looker deviennent inutiles dès que la source contient l'historique de tous les mois.

**Point de douleur actuel :**
Chaque mois, vous dupliquez le rapport du mois précédent, vous le reconnectez à la nouvelle source et vous refaites les ajustements de forme. C'est du temps perdu, il y a un risque de casser un graphique, et les rapports se multiplient en versions.

**Comment l'IA ou l'automatisation aide :**
Une transformation unique, sans IA en continu :
- un seul Sheet source, alimenté par le n°1, avec une colonne « Mois de clôture » ;
- un seul rapport Looker connecté en permanence, avec un contrôle de période et des champs calculés « mois en cours » et « YTD » ;
- les titres de type « Data as of … » sont calculés automatiquement à partir de la dernière date présente.

**Pour démarrer cette semaine :**
Dans une copie du rapport actuel, remplacez la source par un Sheet contenant deux mois empilés avec une colonne « Mois », et vérifiez que les filtres de date fonctionnent.

---

**4. Intégration des bookings et des mouvements de flotte**

**Autonomie :** Deterministic
**Implication :** Augmented

**Pourquoi c'est un bon candidat :**
C'est un nouveau flux récurrent de votre périmètre en M2 : le fichier externe des entrées et sorties d'appareils, et les contrats en cours de finalisation. Il est préférable de l'automatiser dès sa mise en place, plutôt que d'installer une nouvelle routine manuelle.

**Point de douleur actuel :**
C'est un futur point de douleur : deux sources de plus à croiser à la main avec la base de référence, avec les mêmes problèmes de clés que le fichier finance.

**Comment l'IA ou l'automatisation aide :**
Le même modèle que le n°1 : import par script, normalisation, rattachement au contrat par WBS, mise à jour de la flotte par contrat, et passage automatique d'un booking au statut « contrat actif » lorsqu'il apparaît dans le fichier finance.

**Pour démarrer cette semaine :**
Récupérez un exemplaire de chacun des deux fichiers et vérifiez s'ils contiennent le WBS ou une autre clé exploitable.

---

### Guided

---

**5. Rapprochement WBS et rapport d'écarts**

**Autonomie :** Guided (le script propose des correspondances, vous tranchez)
**Implication :** Augmented

**Pourquoi c'est un bon candidat :**
Les erreurs suivent des schémas réguliers : faute dans le préfixe, inversion de caractères (`FH.BO2IO` contre `FB.BOI2O`), confusion O/0 ou I/1. Une correspondance approximative (distance de Levenshtein, similarité de noms) les détecte de façon fiable. La décision finale reste humaine, ce qui convient bien à des données financières.

**Point de douleur actuel :**
Les WBS ne concordent pas toujours entre le fichier finance et votre base. Vous complétez alors à la main, ou vous recherchez par nom de client, ce qui est lent et peu fiable, car un client peut avoir plusieurs contrats. Les contrats multiservices n'ont pas de WBS et ne se croisent que par leur nom. Un nouveau contrat présent d'un seul côté crée un décalage.

**Comment l'IA ou l'automatisation aide :**
Après chaque import (n°1), un onglet **« Écarts du mois »** est généré :
- **Correspondances exactes** : traitées automatiquement.
- **Correspondances probables** : WBS ou nom similaire, avec un score de confiance et les éléments de contexte (client, montants). Vous validez en un clic par une case à cocher.
- **Présents uniquement dans votre base** : les nouveaux contrats pas encore chez la finance.
- **Présents uniquement chez la finance** : les contrats à créer dans la base.
- **Informations financières manquantes**.

Chaque validation alimente une **table de correspondance** (WBS erroné vers WBS correct, nom multiservices vers ID interne), réutilisée automatiquement les mois suivants. Le travail manuel diminue donc à chaque clôture. Cette table servira aussi d'argument pour votre chantier de WBS universel.

**Pour démarrer cette semaine :**
Rassemblez les correspondances que vous avez faites à la main lors des dernières clôtures : c'est la première version de la table de correspondance.

---

**6. Relances qualité de données**

**Autonomie :** Guided
**Implication :** Augmented

**Pourquoi c'est un bon candidat :**
Rédiger des relances ciblées et diplomatiques à partir d'une liste d'anomalies, c'est un travail de langage où Gemini excelle. Vous gardez la main sur l'envoi.

**Point de douleur actuel :**
Les estimations ne sont pas toujours mises à jour après les Contract Reviews. Les relances génériques par mail restent sans réponse, ce qui vous oblige à aller voir chacun en personne.

**Comment l'IA ou l'automatisation aide :**
À partir du rapport d'écarts (n°5), les anomalies sont regroupées par Contract Manager. Pour chacun, un brouillon de mail est préparé dans Gmail : liste précise des contrats concernés, de la donnée manquante et de l'échéance, avec un ton conforme au guide de communication interne. Vous relisez, ajustez et envoyez. Un suivi indique qui a répondu.

**Pour démarrer cette semaine :**
Rédigez une relance « modèle » qui a déjà bien fonctionné. Elle servira de référence de ton pour Gemini.

---

## Annexe : définitions des classifications

**Autonomie : quelle part de décision a l'IA ?**

- **Deterministic** : l'IA ou le script applique des règles fixes, sans jugement. La même entrée donne toujours la même sortie (exemples : mise en forme, extraction de données).
- **Guided** : l'IA prend des décisions encadrées. L'humain fixe la direction, l'IA choisit comment l'atteindre dans ces limites (exemples : rédaction, rapprochement approximatif, analyse).
- **Autonomous** : l'IA planifie, décide et s'adapte seule, utilise des outils et ajuste son approche selon ce qu'elle trouve.

**Implication humaine : un humain intervient-il pendant l'exécution ?**

- **Augmented** : l'humain participe pendant le déroulement (relit, oriente ou décide à des moments clés).
- **Automated** : l'IA s'exécute seule de bout en bout. L'humain ne vérifie que le résultat final.
