"""Prépare les données de test de Rapprochement.gs (jeu fictif uniquement).

À lancer depuis la racine du dépôt :
  python3 -I outputs/import-mensuel-finance/apps-script/tests/exporter_jeu.py SORTIE.json
Pour E5 et E6 (jeu fictif de référence), lit les fichiers fictifs avec le programme Python de référence, les anonymise,
puis enregistre dans SORTIE.json les entrées anonymisées et les résultats attendus du programme Python.
"""
import json, os, sys, tempfile
sys.path.insert(0, os.path.join(".claude", "skills", "mon-import-mensuel-finance", "scripts"))
import import_mensuel as im  # noqa: E402

MOIS = "Octobre 2026"


def scenario(label, fin_path, db_path, memoire):
    fin, block = im.read_finance(fin_path, MOIS)
    _, db = im.read_db(db_path)
    anon_fin, anon_db = [], []
    for r in fin:
        k, why = im.anonymise(r["wbs"], r["type"])
        anon_fin.append({"ligne": r["row"], "cle": k, "type": r["type"], "kpi": r["kpi"], "raison": why})
    for r in db:
        k, why = im.anonymise(r["wbs"], r["type"])
        anon_db.append({"ligne": r["row"], "cle": k, "type": r["type"], "raison": why})
    with tempfile.TemporaryDirectory() as tmp:
        mem_path = memoire
        attendu = im.run(fin_path, db_path, mem_path, MOIS, tmp, label)
    m = im.load_memory(memoire)
    mem = {"confirmees": sorted([list(p) for p in m["confirmée"]]), "rejetees": sorted([list(p) for p in m["rejetée"]])}
    return {"scenario": label, "entree": {"fin": anon_fin, "db": anon_db, "memoire": mem,
            "kpis": im.KPI_SRC, "bloc": block},
            "attendu": {"counts": attendu["counts"], "matches": attendu["matches"],
                        "a_traiter": attendu["a_traiter"], "controle": attendu["controle"]}}


if __name__ == "__main__":
    out = [scenario("E5", im.DEFAULTS["finance"], im.DEFAULTS["database"], None),
           scenario("E6", im.DEFAULTS["finance"], im.DEFAULTS["database"], im.MEMOIRE_E6)]
    with open(sys.argv[1], "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, default=str)
    print(f"{len(out)} scénarios exportés dans {sys.argv[1]}")
