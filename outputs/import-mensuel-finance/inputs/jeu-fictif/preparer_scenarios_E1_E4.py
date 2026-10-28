"""Prépare les versions fictives des scénarios E1 à E4 (tour de test 1) — données entièrement inventées.

À lancer depuis la racine du dépôt :
  python3 -I outputs/import-mensuel-finance/inputs/jeu-fictif/preparer_scenarios_E1_E4.py

Part de la database centrale fictive (400 contrats, inchangée) et écrit dans
`inputs/jeu-fictif/scenarios/` :
  - E1 Novembre 2026 : clôture typique, chaque contrat de la database présent avec son WBS exact
    (un WBS avec un espace en fin, un autre en minuscules) ; les 2 multiservices sans code restent sans code ;
  - E2 Décembre 2026 : comme E1, plus une ligne au WBS inventé `FH.TEST001` (client vide, 1 000 par KPI) ;
  - E3 Janvier 2027 : comme E1, mais l'en-tête « Turnover (€) » est renommé « Turnover (€)_v2 » ;
  - E4 Février 2027 : comme E1 ; le scénario consiste à lancer l'import deux fois pour le même mois.
Le corrigé `corrige-scenarios-E1-E4.md` est calculé à partir de ce qui est écrit ici, sans lancer le
programme testé ; il ne doit jamais être fourni à une exécution. Graine fixe : mêmes fichiers à chaque fois.
"""
import os, random
import openpyxl
from openpyxl import Workbook
from openpyxl.styles import Font

JEU = os.path.join("outputs", "import-mensuel-finance", "inputs", "jeu-fictif")
OUT = os.path.join(JEU, "scenarios")
DB = os.path.join(JEU, "Database Hcare XBH in service contracts (FICTIF).xlsx")
HEAD = ["WBS", "Client Name", "Contract Type", "Region", "Country",
        "Turnover (€)", "Invoicing (€)", "Cost (€)", "Flight Hours"]
REGIONS = ["Europe", "NORAM", "LATAM", "APAC", "AFME"]


def lignes_e1(rng):
    ws = openpyxl.load_workbook(DB).active
    out = []
    for i, r in enumerate(ws.iter_rows(min_row=2, values_only=True)):
        wbs, client, typ, reg, pays = r[:5]
        if wbs is None and client is None:
            continue
        t = round(rng.uniform(300_000, 8_000_000), 2)
        inv = round(t * rng.uniform(0.9, 1.0), 2)
        cost = round(t * rng.uniform(0.6, 0.9), 2)
        fh = rng.randint(200, 8000)
        out.append([wbs, client, typ, reg, pays, t, inv, cost, fh])
    # Deux petites variations de saisie, rapprochées à 100 % après normalisation.
    keyed = [l for l in out if l[0]]
    keyed[5][0] = keyed[5][0] + " "
    keyed[11][0] = keyed[11][0].lower()
    return out


def ecrire(path, titre, lignes, entetes=HEAD):
    wb = Workbook(); ws = wb.active; ws.title = "XBH Contracts"
    last = 19 + len(lignes)
    ws["A1"] = f"{titre} — DONNÉES FICTIVES"; ws["A1"].font = Font(bold=True)
    ws["A2"] = "Jeu de test fictif — aucune donnée Airbus réelle"
    ws["A4"] = "TOTAUX GLOBAUX — tous contrats"
    for row, (lab, col) in zip(range(5, 9), [("Turnover (€)", "F"), ("Invoicing (€)", "G"),
                                             ("Cost (€)", "H"), ("Flight Hours", "I")]):
        ws.cell(row, 1, lab); ws.cell(row, 6, f"=SUM({col}20:{col}{last})")
    ws["A10"] = "Nombre de lignes de contrats"; ws["F10"] = f"=COUNTA(C20:C{last})"
    ws["A12"] = "TOTAUX PAR RÉGION — Turnover (€)"
    for row, reg in zip(range(13, 18), REGIONS):
        ws.cell(row, 1, reg); ws.cell(row, 6, f'=SUMIFS(F20:F{last},D20:D{last},"{reg}")')
    for j, h in enumerate(entetes, 1):
        ws.cell(19, j, h).font = Font(bold=True)
    for i, l in enumerate(lignes):
        for j, v in enumerate(l, 1):
            ws.cell(20 + i, j, v)
    wb.save(path)


def fr(v):
    return f"{v:,.2f}".replace(",", " ").replace(".", ",")


def tot(lignes, j):
    return round(sum(l[j] for l in lignes), 2)


def main():
    os.makedirs(OUT, exist_ok=True)
    cor = ["# Corrigé des scénarios fictifs E1 à E4 — à ne pas donner au programme", "",
           "*Calculé par `preparer_scenarios_E1_E4.py` à partir des fichiers qu'il écrit, sans lancer le "
           "programme testé. Ne jamais fournir ce fichier à une exécution.*", "",
           "Database centrale fictive utilisée : `Database Hcare XBH in service contracts (FICTIF).xlsx` "
           "(400 contrats, dont 2 multiservices sans code), inchangée.", ""]
    noms = {}
    for sc, mois, graine in [("E1", "Novembre 2026", 11), ("E2", "Décembre 2026", 12),
                             ("E3", "Janvier 2027", 1), ("E4", "Février 2027", 2)]:
        rng = random.Random(2026 * 100 + graine)
        lignes = lignes_e1(rng)
        entetes = list(HEAD)
        if sc == "E2":
            lignes.append(["FH.TEST001", None, "XBH", "Europe", "France", 1000, 1000, 1000, 1000])
        if sc == "E3":
            entetes[5] = "Turnover (€)_v2"
        nom = f"Xbh Contracts Financial performance - {mois} (FICTIF - {sc}).xlsx"
        ecrire(os.path.join(OUT, nom), f"Xbh Contracts Financial performance : {mois}", lignes, entetes)
        noms[sc] = (nom, mois, lignes)

    def bloc_totaux(lignes, rapproche):
        out = ["| KPI | Bloc de totaux = total des lignes | Total database attendu |", "|---|---|---|"]
        for lab, j in [("Turnover (€)", 5), ("Invoicing (€)", 6), ("Cost (€)", 7), ("Flight Hours", 8)]:
            out.append(f"| {lab} | {fr(tot(lignes, j))} | {fr(tot(rapproche, j))} |")
        return out

    nom, mois, l1 = noms["E1"]
    ok1 = [l for l in l1 if l[0]]
    cor += [f"## E1 — Clôture typique ({mois})", "", f"Fichier : `scenarios/{nom}` — **{len(l1)} lignes** "
            "de contrats (lignes 20 à " + str(19 + len(l1)) + ").", "",
            f"- **{len(ok1)} lignes à 100 %** (dont 1 WBS avec un espace en fin et 1 en minuscules) ;",
            "- **0 correspondance à confirmer** ;",
            "- **2 lignes non rapprochées**, raison (c) multiservices sans code (et les 2 mêmes contrats en (c) "
            "côté database) ;", "- totaux `OK` ; exécution sans aucune question jusqu'au résumé.", ""]
    cor += bloc_totaux(l1, ok1) + [""]

    nom, mois, l2 = noms["E2"]
    ok2 = [l for l in l2 if l[0] and l[0] != "FH.TEST001"]
    cor += [f"## E2 — Contrat inconnu ({mois})", "", f"Fichier : `scenarios/{nom}` — **{len(l2)} lignes** ; "
            "dernière ligne `FH.TEST001` (XBH, client vide, 1 000 dans chaque KPI).", "",
            f"- **{len(ok2)} lignes à 100 %** ; **0 à confirmer** : tous les contrats XBH de la database sont "
            "déjà pris, il n'y a aucun candidat libre ;",
            "- **3 lignes non rapprochées** : `FH.TEST001` en (a) absent de la database, et les 2 multiservices "
            "sans code en (c) ;",
            "- `FH.TEST001` n'est **jamais** rapprochée à 100 % ; l'écart de chaque KPI (1 000) est expliqué "
            "par cette ligne ; totaux `OK`.", ""]
    cor += bloc_totaux(l2, ok2) + [""]

    nom, mois, _ = noms["E3"]
    cor += [f"## E3 — Template modifié ({mois})", "", f"Fichier : `scenarios/{nom}` — en-tête F19 renommé "
            "« Turnover (€)_v2 ».", "",
            "- **Arrêt** avant toute écriture, avec un message qui nomme l'en-tête « Turnover (€) » introuvable ;",
            f"- **aucun** fichier `Database XBH {mois}` créé ; mémoire inchangée.", ""]

    nom, mois, l4 = noms["E4"]
    ok4 = [l for l in l4 if l[0]]
    cor += [f"## E4 — Database du mois déjà existante ({mois})", "", f"Fichier : `scenarios/{nom}` — "
            "l'import est lancé **deux fois** pour le même mois.", "",
            f"- 1er lancement : `Database XBH {mois}.xlsx` créée ({len(ok4)} à 100 %, 0 à confirmer, 2 en (c)) ;",
            f"- 2e lancement : **pas d'arrêt**, `Database XBH {mois} v2.xlsx` créée avec les mêmes comptages ;",
            "- la première version est **inchangée** (même empreinte avant et après le 2e lancement) ;",
            "- le fichier finance et la database centrale sont inchangés.", ""]
    cor += bloc_totaux(l4, ok4) + [""]
    with open(os.path.join(OUT, "corrige-scenarios-E1-E4.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(cor))
    print("\n".join(cor))


if __name__ == "__main__":
    main()
