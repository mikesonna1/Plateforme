// Exécution de Python dans le navigateur avec Pyodide, dans un Web Worker.
// Avantage : une boucle infinie est stoppée au bout de quelques secondes sans figer la page.
const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
const RUN_TIMEOUT_MS = 8000;

const PyRunner = (() => {
  let worker = null, ready = null, seq = 0;
  const pending = new Map();

  function workerSource() {
    return `
      importScripts(${JSON.stringify(PYODIDE_URL + "pyodide.js")});
      let pyodideReady = (async () => {
        const py = await loadPyodide({ indexURL: ${JSON.stringify(PYODIDE_URL)} });
        py.runPython(${JSON.stringify(PY_HARNESS)});
        return py;
      })();
      self.onmessage = async (e) => {
        const { id, code, tests, inputs } = e.data;
        try {
          const py = await pyodideReady;
          py.globals.set("__code", code);
          py.globals.set("__tests", py.toPy(tests || []));
          py.globals.set("__inputs", py.toPy(inputs || []));
          const json = py.runPython("__run(__code, [tuple(t) for t in __tests], list(__inputs))");
          self.postMessage({ id, result: JSON.parse(json) });
        } catch (err) {
          self.postMessage({ id, fatal: String(err) });
        }
      };
      pyodideReady.then(() => self.postMessage({ id: "ready" })).catch(err => self.postMessage({ id: "ready", fatal: String(err) }));
    `;
  }

  function start() {
    const blob = new Blob([workerSource()], { type: "text/javascript" });
    worker = new Worker(URL.createObjectURL(blob));
    ready = new Promise((resolve, reject) => {
      worker.onmessage = (e) => {
        const m = e.data;
        if (m.id === "ready") return m.fatal ? reject(new Error(m.fatal)) : resolve();
        const p = pending.get(m.id);
        if (!p) return;
        pending.delete(m.id);
        clearTimeout(p.timer);
        m.fatal ? p.reject(new Error(m.fatal)) : p.resolve(m.result);
      };
      worker.onerror = (e) => reject(new Error(e.message || "Impossible de démarrer Python"));
    });
    return ready;
  }

  async function run(code, { tests = [], inputs = [], onStatus } = {}) {
    if (!worker) {
      onStatus && onStatus("Chargement de Python (première fois : quelques secondes)…");
      start();
    }
    try { await ready; } catch (err) { worker = null; throw new Error("Python n'a pas pu être chargé. Vérifie ta connexion internet puis réessaie. (" + err.message + ")"); }
    onStatus && onStatus("Exécution…");
    const id = ++seq;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id);
        worker.terminate(); worker = null; ready = null; // on redémarrera au prochain essai
        resolve({ timeout: true, stdout: "", tests: [], error: null });
      }, RUN_TIMEOUT_MS);
      pending.set(id, { resolve, reject, timer });
      worker.postMessage({ id, code, tests, inputs });
    });
  }
  function preload() { if (!worker) { start().catch(() => { worker = null; }); } }
  return { run, preload };
})();

// Explications en français des erreurs les plus fréquentes
const ERROR_HELP = {
  SyntaxError: "Faute de grammaire : il manque peut-être un guillemet, une parenthèse ou un deux-points `:`.",
  IndentationError: "Problème d'indentation : les lignes d'un même bloc doivent être décalées de la même façon (4 espaces).",
  NameError: "Python ne connaît pas ce nom : faute de frappe ? variable pas encore créée ? guillemets oubliés autour d'un texte ?",
  TypeError: "Opération impossible entre ces types (par exemple additionner un texte et un nombre). Pense à int(), float() ou str().",
  ValueError: "La valeur donnée n'a pas le bon format (par exemple int(\"abc\")).",
  ZeroDivisionError: "On ne peut pas diviser par zéro.",
  IndexError: "Cet indice n'existe pas dans la liste ou le texte (rappel : on commence à 0).",
  KeyError: "Cette clé n'existe pas dans le dictionnaire. `get()` évite l'erreur.",
  AttributeError: "Cet objet n'a pas cet attribut ou cette méthode : vérifie l'orthographe et le type de l'objet.",
  RecursionError: "La fonction s'appelle trop de fois : vérifie son cas de base.",
  NoMoreInput: "Ton programme demande plus de saisies que celles prévues. Ajoute des lignes dans la case Saisies."
};
function formatError(err) {
  if (!err) return "";
  const where = err.line ? ` (ligne ${err.line})` : "";
  return `${err.type}${where} : ${err.msg}`;
}
