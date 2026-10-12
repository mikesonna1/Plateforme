// Code Python exécuté pour lancer le code d'un élève et vérifier ses tests.
// Partagé entre le navigateur (Web Worker), le script de vérification Node et le générateur d'exercices.
// Point d'entrée : __run(code, tests, inputs) exécute le code, puis lance les tests écrits en Python.
// Les tests peuvent utiliser __stdout__ (ce qui a été affiché) et __source__ (le code de l'élève).
const PY_HARNESS = String.raw`
import sys, io, builtins, traceback, json, linecache, contextlib

def __errinfo(e):
    tb = traceback.extract_tb(e.__traceback__)
    line = None
    for fr in tb:
        if fr.filename == "<ton code>":
            line = fr.lineno
    if isinstance(e, SyntaxError) and e.filename == "<ton code>":
        line = e.lineno
    return {"type": type(e).__name__, "msg": str(e), "line": line}

def __register(code):
    linecache.cache["<ton code>"] = (len(code), None, code.splitlines(True), "<ton code>")

def __run(code, tests, inputs):
    out = io.StringIO()
    old_out, old_in = sys.stdout, builtins.input
    queue = [str(x) for x in inputs]
    class NoMoreInput(Exception): pass
    def fake_input(prompt=''):
        out.write(str(prompt))
        if not queue:
            raise NoMoreInput("Le programme demande plus de saisies que prévu. Ajoute des lignes dans la case Saisies.")
        v = queue.pop(0)
        out.write(v + "\n")
        return v
    ns = {"__name__": "__main__"}
    res = {"error": None, "tests": [], "stdout": ""}
    sys.stdout = out
    builtins.input = fake_input
    __register(code)
    try:
        try:
            exec(compile(code, "<ton code>", "exec"), ns)
        except BaseException as e:
            res["error"] = __errinfo(e)
        if res["error"] is None or tests:
            ns["__stdout__"] = out.getvalue()
            ns["__source__"] = code
            if res["error"] is None:
                for desc, t in tests:
                    try:
                        exec(compile(t, "<test>", "exec"), ns)
                        res["tests"].append([desc, True, ""])
                    except AssertionError as e:
                        res["tests"].append([desc, False, str(e)])
                    except BaseException as e:
                        res["tests"].append([desc, False, type(e).__name__ + " : " + str(e)])
    finally:
        sys.stdout = old_out
        builtins.input = old_in
    res["stdout"] = out.getvalue()
    return json.dumps(res)
`;
if (typeof module !== "undefined") module.exports = { PY_HARNESS };
