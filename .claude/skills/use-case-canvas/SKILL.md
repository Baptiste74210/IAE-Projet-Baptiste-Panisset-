---
name: use-case-canvas
description: Génère la fiche « Use case canvas » (synthèse sur une page, 9 cases) d'un workflow à partir de son fichier requirements.md produit par l'étape Deconstruct. À utiliser quand l'étudiant dit « fais mon canvas », « use case canvas », « fiche canvas » ou « synthèse sur une page », après l'étape 2 (Deconstruct).
---

# Use case canvas — synthèse sur une page

Tu produis la fiche canvas du cours « IA : Claude Coding M1/M2 » : 9 cases qui résument le cas d'usage
sur une page. Tout vient des fichiers déjà produits ; tu n'inventes rien.

## 1. Trouver les sources

1. Liste les dossiers `outputs/*/` qui contiennent un `requirements.md`.
   - Aucun : dis à l'étudiant qu'il faut d'abord terminer l'étape Deconstruct (`/deconstruct`), puis arrête-toi.
   - Plusieurs : demande lequel (une seule question).
2. Lis `outputs/<workflow>/requirements.md` en entier.
3. Lis aussi `outputs/ai-opportunity-report.md` s'il existe (utile pour le problème et les irritants).

## 2. Remplir les 9 cases

Chaque case : **1 à 2 lignes maximum**, des mots simples, des éléments séparés par « · » ou « → ».
Correspondance avec `requirements.md` :

| Case | Où chercher |
|---|---|
| **Problème** | `Goal`, pain point de la fiche candidate du rapport Analyze, `Optimization Notes` |
| **Utilisateurs** | `Metadata` (Owner, Stakeholders) + qui intervient dans les `Human Gates` — avec leur rôle entre parenthèses |
| **Valeur** | `Value & Measurement` → Desired Outcome (+ gain de temps s'il est cité) |
| **Processus et acteurs** | `Steps Overview` (ou l'objectif et sa plage si goal-driven) — étapes reliées par « → » |
| **Données** | `Context Inventory` (artefacts) + entrées des étapes |
| **Irritants** | difficultés actuelles : rapport Analyze, `Optimization Notes`, cas limites des étapes |
| **Règles** | `Rules & Constraints` (Must do / Must never) + `Human Gates` + Prohibited actions |
| **Risques** | `Security, Privacy & Safety`, cas limites, règle de repli (Fallback) |
| **Indicateurs de réussite** | `Value & Measurement` → Measure + Target, et les critères **(must)** de `Acceptance Criteria` |

Règles :
- Si une information manque ou n'est qu'une hypothèse dans `requirements.md`, écris-la suivie de *(à vérifier)*,
  ou écris « À compléter » — jamais de chiffre ou de fait inventé.
- Garde les identifiants utiles entre parenthèses quand ils aident à retrouver le détail (ex. « (R2) »).

## 3. Écrire le fichier

Écris `outputs/<workflow>/use-case-canvas.md` avec exactement cette forme (un tableau 3 × 3 lisible sur GitHub) :

```markdown
# Use case canvas — <Nom du workflow>

*Synthèse sur une page · <Prénom Nom de l'étudiant si connu (README)> · <date du jour>*

| **PROBLÈME** | **UTILISATEURS** | **VALEUR** |
|---|---|---|
| … | … | … |
| **PROCESSUS ET ACTEURS** | **DONNÉES** | **IRRITANTS** |
| … | … | … |
| **RÈGLES** | **RISQUES** | **INDICATEURS DE RÉUSSITE** |
| … | … | … |

*Chaque case se retrouve, en détail, dans [requirements.md](requirements.md).*

## Points à vérifier
- … (liste des éléments marqués « à vérifier » ou « À compléter » ; écrire « Aucun » sinon)
```

Si le fichier existe déjà, renomme l'ancien en `use-case-canvas-AAAA-MM-JJ.md` avant d'écrire le nouveau.

## 4. Terminer

1. Fais un commit : « Canvas : use case canvas du workflow <nom> ».
2. Montre le tableau dans la conversation, puis dis à l'étudiant : « Votre canvas est dans
   `outputs/<workflow>/use-case-canvas.md` ; il sera visible sur GitHub (branche main) d'ici une minute.
   Relisez les points à vérifier avant de le rendre. »
