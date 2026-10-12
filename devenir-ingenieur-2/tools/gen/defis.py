"""Génère js/challenges/defi-NNN.js : les défis (un tous les 10 niveaux).
Usage : python3 tools/gen/defis.py      — les valeurs attendues sont calculées en EXÉCUTANT la solution de référence,
puis tools/verify-levels.js vérifie le tout avec le même harnais que le site."""
import json, os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

def tests_for(name, sol, cases, floats=False, extra=()):
    ns = {}
    exec(sol, ns)
    f = ns[name]
    out = []
    for args in cases:
        exp = f(*[json.loads(json.dumps(a)) for a in args])
        a = ", ".join(repr(x) for x in args)
        label = "%s(%s) → %s" % (name, a, repr(exp))
        cmp = ("abs(r - %r) < 1e-9" % exp) if isinstance(exp, float) else ("r == %r" % exp)
        code = "r = %s(%s)\nassert %s, %s + repr(r) + %s + repr(%r)" % (name, a, cmp, repr("avec (%s) : tu renvoies " % a), repr(" au lieu de "), exp)
        out.append([label, code])
    out.extend(list(x) for x in extra)
    return out

def starter(name, params):
    return "def %s(%s):\n    pass\n" % (name, ", ".join(params))

DEFI1 = []
def add(title, q, hint, name, params, sol, cases, extra=()):
    DEFI1.append({"id": "D01-%02d" % (len(DEFI1) + 1), "t": "%d. %s" % (len(DEFI1) + 1, title), "q": q, "h": hint,
                  "s": starter(name, params), "a": sol, "k": tests_for(name, sol, cases, extra=extra)})

add("La facture",
    "Écris `facture(prix_unitaire, quantite)` qui renvoie le total à payer, arrondi à 2 décimales. À partir de **10 articles**, une remise de **10 %** s'applique sur tout le total.",
    "Calcule d'abord le total, puis applique la remise si besoin, et termine par `round(total, 2)`.",
    "facture", ["prix_unitaire", "quantite"],
    "def facture(prix_unitaire, quantite):\n    total = prix_unitaire * quantite\n    if quantite >= 10:\n        total = total * 0.9\n    return round(total, 2)",
    [(2.5, 4), (2.5, 10), (19.99, 3), (5, 12), (0.99, 100), (10, 0), (3.2, 9)])

add("La mention de la classe",
    "Écris `mention_moyenne(notes)` qui reçoit une liste de notes sur 20 et renvoie la mention de la **moyenne** : `\"Très bien\"` (≥ 16), `\"Bien\"` (≥ 14), `\"Assez bien\"` (≥ 12), `\"Passable\"` (≥ 10), sinon `\"Insuffisant\"`. Si la liste est vide, renvoie `\"Aucune note\"`.",
    "Pense à traiter la liste vide en premier, puis calcule la moyenne avec `sum` et `len`.",
    "mention_moyenne", ["notes"],
    "def mention_moyenne(notes):\n    if not notes:\n        return \"Aucune note\"\n    m = sum(notes) / len(notes)\n    if m >= 16:\n        return \"Très bien\"\n    if m >= 14:\n        return \"Bien\"\n    if m >= 12:\n        return \"Assez bien\"\n    if m >= 10:\n        return \"Passable\"\n    return \"Insuffisant\"",
    [([],), ([18, 16, 17],), ([14, 15],), ([12, 12, 13],), ([10, 10],), ([5, 9, 12],), ([20],)])

add("Acronyme",
    "Écris `acronyme(phrase)` qui renvoie les **initiales en majuscules** de chaque mot : `\"intelligence artificielle\"` → `\"IA\"`. Une phrase vide donne une chaîne vide.",
    "`phrase.split()` découpe en mots ; `mot[0].upper()` donne l'initiale.",
    "acronyme", ["phrase"],
    "def acronyme(phrase):\n    resultat = \"\"\n    for mot in phrase.split():\n        resultat += mot[0].upper()\n    return resultat",
    [("intelligence artificielle",), ("portable network graphics",), ("",), ("python",), ("  tres   petit   espace  ",), ("hyper text markup language",)])

add("Chiffres pairs",
    "Écris `somme_chiffres_pairs(n)` qui renvoie la somme des chiffres **pairs** d'un entier positif `n` (0 est pair). Exemple : `1024` → `0 + 2 + 4 = 6`.",
    "Transforme `n` en texte avec `str(n)` pour parcourir ses chiffres, puis reconvertis chacun avec `int()`.",
    "somme_chiffres_pairs", ["n"],
    "def somme_chiffres_pairs(n):\n    total = 0\n    for c in str(n):\n        d = int(c)\n        if d % 2 == 0:\n            total += d\n    return total",
    [(2468,), (13579,), (0,), (1024,), (88,), (9876543210,), (7,)])

add("Les nombres premiers",
    "Écris `premiers_jusqua(n)` qui renvoie la **liste** (dans l'ordre croissant) des nombres premiers inférieurs ou égaux à `n`. Pour `n < 2`, la liste est vide.",
    "Pour chaque candidat de 2 à `n`, cherche un diviseur entre 2 et sa racine carrée.",
    "premiers_jusqua", ["n"],
    "def premiers_jusqua(n):\n    res = []\n    for k in range(2, n + 1):\n        est_premier = True\n        for d in range(2, int(k ** 0.5) + 1):\n            if k % d == 0:\n                est_premier = False\n                break\n        if est_premier:\n            res.append(k)\n    return res",
    [(1,), (2,), (20,), (50,), (0,), (97,), (100,)])

add("La plus longue série",
    "Écris `plus_longue_serie(liste)` qui renvoie la longueur de la plus longue suite de valeurs **identiques consécutives**. Exemple : `[1, 1, 2, 2, 2, 3]` → `3`. Une liste vide donne `0`.",
    "Garde la longueur de la série en cours et la meilleure vue jusqu'ici ; compare chaque élément au précédent.",
    "plus_longue_serie", ["liste"],
    "def plus_longue_serie(liste):\n    meilleure = 0\n    courante = 0\n    for i in range(len(liste)):\n        if i > 0 and liste[i] == liste[i - 1]:\n            courante += 1\n        else:\n            courante = 1\n        if courante > meilleure:\n            meilleure = courante\n    return meilleure",
    [([],), ([1, 1, 2, 2, 2, 3],), ([5],), ([1, 2, 3],), ([7, 7, 7, 7],), (["a", "a", "b", "b", "b", "b", "a"],), ([1, 2, 2, 1, 1, 1, 2],)])

add("Le chiffrement de César",
    "Écris `cesar(texte, decalage)` qui décale chaque **lettre de a à z** (minuscule ou majuscule, en conservant la casse) de `decalage` positions dans l'alphabet, en revenant au début après `z`. Tous les autres caractères (espaces, chiffres, accents, ponctuation) restent identiques. Le décalage peut être négatif ou supérieur à 26.",
    "Pour une lettre minuscule : `chr((ord(c) - ord('a') + decalage) % 26 + ord('a'))`. Fais de même pour les majuscules avec `'A'`.",
    "cesar", ["texte", "decalage"],
    "def cesar(texte, decalage):\n    res = \"\"\n    for c in texte:\n        if \"a\" <= c <= \"z\":\n            res += chr((ord(c) - ord(\"a\") + decalage) % 26 + ord(\"a\"))\n        elif \"A\" <= c <= \"Z\":\n            res += chr((ord(c) - ord(\"A\") + decalage) % 26 + ord(\"A\"))\n        else:\n            res += c\n    return res",
    [("abc", 1), ("xyz", 3), ("Bonjour le Monde !", 5), ("abc", -1), ("Python 3.12", 26), ("zèbre", 2), ("Hello", 53)])

add("Fusion de deux listes triées",
    "Écris `fusion_triee(a, b)` qui reçoit deux listes **déjà triées** (ordre croissant) et renvoie une nouvelle liste triée contenant tous leurs éléments. Interdit d'utiliser `sorted()` ou `.sort()` : avance dans les deux listes en comparant leurs premiers éléments restants.",
    "Garde un indice `i` dans `a` et `j` dans `b`. À chaque tour, ajoute le plus petit des deux éléments, puis copie ce qui reste.",
    "fusion_triee", ["a", "b"],
    "def fusion_triee(a, b):\n    i = j = 0\n    res = []\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            res.append(a[i])\n            i += 1\n        else:\n            res.append(b[j])\n            j += 1\n    res.extend(a[i:])\n    res.extend(b[j:])\n    return res",
    [([1, 3, 5], [2, 4, 6]), ([], [1, 2]), ([4, 5], []), ([], []), ([1, 1, 2], [1, 3]), ([10, 20, 30], [1, 2, 3]), ([-5, 0, 7], [-6, 8, 9])],
    extra=[["Tu n'utilises ni sorted() ni .sort()", "import re\nassert not re.search(r'sorted\\s*\\(|\\.sort\\s*\\(', __source__), 'sorted() et .sort() sont interdits ici'"]])

add("La suite de Collatz",
    "Écris `etapes_collatz(n)` (n ≥ 1) qui renvoie le nombre d'étapes nécessaires pour atteindre **1** : si `n` est pair on le divise par 2, sinon on calcule `3 × n + 1`. Par exemple `6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1` fait 8 étapes, et `etapes_collatz(1)` vaut `0`.",
    "Utilise une boucle `while n != 1` avec un compteur d'étapes.",
    "etapes_collatz", ["n"],
    "def etapes_collatz(n):\n    etapes = 0\n    while n != 1:\n        if n % 2 == 0:\n            n //= 2\n        else:\n            n = 3 * n + 1\n        etapes += 1\n    return etapes",
    [(1,), (2,), (6,), (7,), (27,), (97,), (871,)])

add("Le rendu de monnaie",
    "Écris `rendu_monnaie(montant)` qui renvoie un **dictionnaire** `{valeur: nombre}` décrivant le plus petit nombre de pièces et billets à rendre avec les valeurs `50, 20, 10, 5, 2, 1` (en euros). Les valeurs inutilisées n'apparaissent pas. Pour `0`, renvoie `{}`. Exemple : `87` → `{50: 1, 20: 1, 10: 1, 5: 1, 2: 1}`.",
    "Parcours les valeurs de la plus grande à la plus petite avec `//` et `%` : `nb = montant // v`, `montant = montant % v`.",
    "rendu_monnaie", ["montant"],
    "def rendu_monnaie(montant):\n    res = {}\n    for v in [50, 20, 10, 5, 2, 1]:\n        nb = montant // v\n        if nb > 0:\n            res[v] = nb\n            montant = montant % v\n    return res",
    [(0,), (87,), (1,), (4,), (100,), (999,), (13,)])

def finish(path, number, items):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf8") as f:
        f.write("registerChallenge(%d, " % number)
        json.dump(items, f, ensure_ascii=False, separators=(",", ":"))
        f.write(");\n")
    print("Défi %d : %d exercices -> %s" % (number, len(items), os.path.relpath(path, ROOT)))

finish(os.path.join(ROOT, "js", "challenges", "defi-001.js"), 1, DEFI1)
