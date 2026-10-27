"""Exporte les valeurs brutes du jeu fictif de référence pour le test de Code.gs avec un faux Google Sheets.
À lancer depuis la racine du dépôt : python3 -I outputs/import-mensuel-finance/apps-script/tests/exporter_brut.py SORTIE.json
"""
import json, os, sys
sys.path.insert(0, os.path.join(".claude", "skills", "mon-import-mensuel-finance", "scripts"))
import import_mensuel as im  # noqa: E402
import openpyxl  # noqa: E402

def valeurs(path, block=None):
    ws = openpyxl.load_workbook(path).active
    rows = [[("" if c.value is None else c.value) for c in r] for r in ws.iter_rows()]
    if block:  # remplace les formules du bloc de totaux par leurs valeurs calculées
        for h, r in im.BLOCK_ROWS.items():
            rows[r - 1][5] = block[h]
        rows[9][5] = sum(1 for r in rows[19:] if r[2] != "")
    return rows

def lire_csv(path):
    import csv
    with open(path, newline="", encoding="utf-8-sig") as f:
        return [r for r in csv.reader(f)]

fin_path = im.DEFAULTS["finance"]
block = im.recalc_block(fin_path)
out = {"finance": valeurs(fin_path, block), "database": valeurs(im.DEFAULTS["database"]),
       "correspondance": lire_csv(os.path.join(im.JEU, "table-correspondance-colonnes (FICTIF).csv")),
       "memoire_e6": lire_csv(im.MEMOIRE_E6),
       "corrige": json.load(open(os.path.join(im.JEU, "corrige-jeu-fictif.json"), encoding="utf-8")),
       "clients": sorted({r[1] for r in valeurs(im.DEFAULTS["database"])[1:] if r[1]}),
       "pays": sorted({r[4] for r in valeurs(im.DEFAULTS["database"])[1:] if r[4]})}
json.dump(out, open(sys.argv[1], "w", encoding="utf-8"), ensure_ascii=False, default=str)
print("export brut OK")
