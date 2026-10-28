# Chaîne de données — Import Mensuel Finance

**Atelier 1 (mercredi 2026-10-28)** · Baptiste Panisset, alternant BA/PMO, Airbus Helicopters (service ESXCC, contrats HCare)
**Workflow :** Import Mensuel Finance (requirements : `requirements.md`)

> Confidentialité : ce document ne contient aucun nom de client ni aucun montant réel.

## 1. Les sources

| Source | Système | Qui la produit | Fréquence |
|---|---|---|---|
| Données financières des contrats (classiques et multiservices) | **SAP** (logiciel de gestion d'Airbus) | Équipe finance | Mensuelle |
| Fichier finance `Xbh Contracts Financial performance : [Mois] [Année]` | Google Sheets | Équipe finance : extrait SAP puis mis en forme à la main | Vers le 15 du mois |
| Liste des nouveaux contrats | Information orale ou par e-mail | Contract Managers | Au fil de l'eau |
| Database centrale `Database Hcare XBH in service contracts` | Google Sheets | Baptiste | Mise à jour à chaque nouveau contrat |

## 2. Le chemin de la donnée

1. **Extraction** : la finance exporte les chiffres depuis SAP. *À la main.*
2. **Transformation 1** : la finance met en forme l'export par copier-coller dans le fichier finance Google Sheets. *À la main, c'est la cause du délai d'envoi.*
3. **Stockage** : Baptiste ajoute à la main les nouveaux contrats dans la database centrale, puis il en fait une copie pour le mois : `Database XBH [Mois] [Année]`. *À la main.*
4. **Transformation 2 (rapprochement)** : Baptiste reporte les KPI du fichier finance dans la database du mois avec des RECHERCHEV sur le WBS (numéro d'identification du contrat). *À la main, 1 à 2 jours.* Demain, ce sera le programme Apps Script (menus « Lancer l'import » et « Prendre en compte mes décisions »).
5. **Contrôle** : il n'y a aujourd'hui pas de contrôle formel, seulement une relecture visuelle. Demain, l'onglet « Contrôle » comparera les totaux, et Baptiste devra valider les correspondances incertaines.
6. **Exploitation** : dans Looker Studio (l'outil de dashboard de Google), Baptiste copie le dashboard du mois précédent, connecte la copie à la nouvelle database, puis fait les derniers ajustements. *À la main.*
7. **Décisions** : le dashboard sert à deux publics.
   - Les **managers** qui dirigent l'activité suivent la performance financière des contrats du service.
   - Les **Contract Managers**, qui gèrent directement les contrats, voient s'ils doivent revoir les données contractuelles.

## 3. Les ruptures

Une rupture est un endroit où la donnée est recopiée, retapée, perdue ou dégradée.

| # | Où | Type de rupture | Conséquence |
|---|---|---|---|
| R1 | SAP → fichier finance | Donnée **recopiée** (copier-coller) | Erreur de ligne ou de colonne possible ; retard de transmission |
| R2 | Contract Managers → database centrale | Donnée **retapée** à partir d'une information orale | Nouveau contrat oublié ou WBS mal saisi |
| R3 | Fichier finance ↔ database | WBS **dégradé** (O/0, I/1, inversion, préfixe FH/FB) | La RECHERCHEV ne trouve rien : KPI **perdu** sans alerte |
| R4 | Fichier finance → database du mois | KPI **recopiés** par formule puis figés | Valeur décalée ou « N/A » non repérés |
| R5 | Database du mois → Looker Studio | **Reconnexion** manuelle du dashboard copié | Graphique cassé, ou dashboard branché sur la database du mauvais mois |

## 4. Tableau de la chaîne de données

| Étape | Système | Responsable | Risque |
|---|---|---|---|
| 1. Source des chiffres financiers | SAP | Équipe finance | Données de clôture pas encore définitives au moment de l'export |
| 2. Extraction | Export SAP | Équipe finance | Mauvais périmètre ou mauvais mois exporté |
| 3. Mise en forme du fichier finance | Google Sheets (copier-coller) | Équipe finance | Erreurs de recopie (R1) ; envoi tardif, vers le 15 |
| 4. Mise à jour des nouveaux contrats | Database centrale (Google Sheets) | Baptiste, informé par les Contract Managers | Contrat oublié ou WBS mal tapé (R2) |
| 5. Copie de la database du mois | Google Drive | Baptiste | Écrasement d'un mois existant (évité demain par les versions `vN`) |
| 6. Rapprochement des KPI | RECHERCHEV, demain Apps Script | Baptiste | WBS divergents, KPI perdus sans alerte (R3, R4) ; 1 à 2 jours de travail |
| 7. Contrôle | Relecture visuelle, demain onglet « Contrôle » | Baptiste | Écart de totaux non détecté ; correspondance fausse acceptée |
| 8. Exploitation | Looker Studio (copie du dashboard précédent) | Baptiste | Dashboard branché sur la mauvaise database ou graphique cassé (R5) |
| 9a. Pilotage de l'activité | Dashboard Looker Studio | Managers du service | Pilotage de la performance financière sur des chiffres faux ou en retard |
| 9b. Révision des contrats | Dashboard Looker Studio | Contract Managers | Données contractuelles revues à tort, ou pas revues alors qu'il le fallait |

## 5. Ce que le programme corrige déjà, et ce qui reste

- **Corrigé par le programme Apps Script :** R3 et R4 (rapprochement automatique avec niveau de confiance, liste « À traiter à la main », contrôle des totaux), ainsi que le risque d'écrasement à l'étape 5.
- **Reste manuel :** R1 (côté finance), R2 (nouveaux contrats) et R5 (reconnexion de Looker Studio).
- **Hors de portée :** un export SAP automatique au bon format n'est pas possible ; l'extraction et la mise en forme restent le travail de la finance. R1 est donc accepté, et c'est le contrôle des totaux du programme qui le surveille.

## 6. Question pour le tuteur ou l'équipe data

Contrainte : Looker Studio ne peut être connecté qu'à un Google Sheet (pas directement à SAP ni à une autre source).

> **Peut-on brancher le dashboard Looker Studio sur un Google Sheet fixe (une database « mois courant » que le programme met à jour chaque mois, avec les mois précédents gardés en copie), au lieu de copier le dashboard et de le reconnecter à chaque fois ?**
> Cela supprimerait la rupture R5 : managers et Contract Managers verraient toujours le bon mois, sans risque de graphique cassé ni de mauvaise database.
