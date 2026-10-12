// Moteur de génération d'exercices : modèles + variantes, avec tests Python.
// Les exercices produits sont ensuite VÉRIFIÉS en exécutant leur solution (tools/verify-levels.js).
const fs = require("fs"), path = require("path");

/* ── Aléatoire reproductible ── */
function mulberry(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
class R {
  constructor(seed) { this.f = mulberry(seed); }
  int(a, b) { return a + Math.floor(this.f() * (b - a + 1)); }
  pick(arr) { return arr[Math.floor(this.f() * arr.length)]; }
  chance(p = 0.5) { return this.f() < p; }
  sample(arr, k) { const a = [...arr], out = []; while (out.length < k && a.length) out.push(a.splice(Math.floor(this.f() * a.length), 1)[0]); return out; }
  shuffle(arr) { return this.sample(arr, arr.length); }
}

/* ── Littéraux Python ── */
const tuple = (...a) => ({ __tuple: a });
function py(v) {
  if (v === null || v === undefined) return "None";
  if (typeof v === "boolean") return v ? "True" : "False";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(py).join(", ") + "]";
  if (v.__tuple) return "(" + v.__tuple.map(py).join(", ") + (v.__tuple.length === 1 ? "," : "") + ")";
  if (typeof v === "object") return "{" + Object.entries(v).map(([k, x]) => py(k) + ": " + py(x)).join(", ") + "}";
  throw new Error("py(): type inconnu");
}
const jsFloorDiv = (a, b) => Math.floor(a / b);
const jsMod = (a, b) => ((a % b) + b) % b;

/* ── Générateurs de tests ── */
const T = {
  out(lines) {
    return [["L'affichage est exactement celui demandé",
      `assert [l.rstrip() for l in __stdout__.strip().split('\\n')] == ${py(lines)}, "Tu as affiché : " + repr(__stdout__.strip())`]];
  },
  variable(name, value, strictType = true) {
    const t = [[`La variable ${name} existe`, `assert '${name}' in globals(), "Crée la variable ${name}"`],
      [`${name} vaut ${py(value)}`, `assert ${name} == ${py(value)}, "${name} vaut " + repr(${name})`]];
    if (strictType) t.push([`${name} est de type ${typeof value === "string" ? "str" : typeof value === "boolean" ? "bool" : Number.isInteger(value) ? "int" : "float"}`, `assert type(${name}) is type(${py(value)}), "${name} n'est pas du bon type : " + type(${name}).__name__`]);
    return t;
  },
  fn(name, cases, floatTol = false) {
    return cases.map(([args, exp]) => {
      const a = args.map(py).join(", ");
      const label = `${name}(${a}) → ${py(exp)}`;
      const cmp = floatTol ? `abs(r - ${py(exp)}) < 1e-9` : `r == ${py(exp)}`;
      return [label, `r = ${name}(${a})\nassert ${cmp}, ${py("avec (" + a + ") : tu renvoies ")} + repr(r) + ${py(" au lieu de ")} + repr(${py(exp)})`];
    });
  },
  /** teste qu'une fonction qui ne renvoie rien a bien affiché les lignes attendues */
  fnPrint(name, cases) {
    return cases.map(([args, lines]) => {
      const a = args.map(py).join(", ");
      return [`${name}(${a}) affiche ${lines.length} ligne(s)`, `import io, contextlib\n_b = io.StringIO()\nwith contextlib.redirect_stdout(_b):\n    ${name}(${a})\nassert [l.rstrip() for l in _b.getvalue().strip().split('\\n')] == ${py(lines)}, "Affichage obtenu : " + repr(_b.getvalue().strip())`];
    });
  },
  /** variables de départ non modifiées */
  keep(pairs) { return pairs.map(([n, v]) => [`${n} n'a pas été modifié`, `assert ${n} == ${py(v)}, "${n} a changé"`]); },
  /** le code de l'élève doit contenir un motif (ex : forcer l'usage d'une boucle) */
  uses(pattern, why) { return [[why, `import re\nassert re.search(${py(pattern)}, __source__), ${py(why)}`]]; }
};
const defStarter = (name, params) => `def ${name}(${params.join(", ")}):\n    pass\n`;

/* ── Registre ── */
const registry = {};            // niveau → [exercices]
function G(level, tpl, n, fn) {
  const list = registry[level] || (registry[level] = []);
  const seen = new Set(list.filter(e => e.tpl !== tpl).map(e => e.q));
  const mine = new Set();
  let made = 0;
  for (let attempt = 0; made < n && attempt < n * 60; attempt++) {
    const r = new R(hash(level + ":" + tpl + ":" + attempt));
    let o;
    try { o = fn(r); } catch (e) { throw new Error(`Modèle ${level}/${tpl} : ${e.message}`); }
    if (!o) continue;
    const key = o.q + "||" + (o.starter || "") + "||" + JSON.stringify(o.inputs || null);
    if (mine.has(key)) continue;
    mine.add(key);
    list.push({ level, tpl, title: o.title, q: o.q, hint: o.hint, starter: o.starter, sol: o.sol, tests: o.tests, inputs: o.inputs });
    made++;
  }
  if (made < n) console.warn(`  ⚠ ${level}/${tpl} : ${made}/${n} variantes seulement`);
}
function write(outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const summary = {};
  for (const [lvl, list] of Object.entries(registry)) {
    // ordre mélangé de façon déterministe : on alterne les modèles pour varier
    const byTpl = {}; list.forEach(e => (byTpl[e.tpl] = byTpl[e.tpl] || []).push(e));
    const queues = Object.values(byTpl); const mixed = [];
    while (queues.some(q => q.length)) for (const q of queues) if (q.length) mixed.push(q.shift());
    const items = mixed.map((e, i) => {
      const o = { id: "L" + String(lvl).padStart(3, "0") + "-" + String(i + 1).padStart(4, "0"), t: e.title, q: e.q, h: e.hint, s: e.starter, a: e.sol, k: e.tests };
      if (e.inputs) o.i = e.inputs;
      return o;
    });
    summary[lvl] = items.length;
    fs.writeFileSync(path.join(outDir, "level-" + String(lvl).padStart(3, "0") + ".js"),
      `registerLevel(${lvl}, ${JSON.stringify(items)});\n`);
  }
  return summary;
}

/* ── Jeux de données ── */
const NAMES = ["Alex", "Léa", "Hugo", "Emma", "Lucas", "Chloé", "Nathan", "Inès", "Louis", "Jade", "Adam", "Zoé", "Noah", "Lina", "Yanis", "Camille", "Sarah", "Karim", "Manon", "Théo", "Maya", "Omar", "Clara", "Ethan", "Anaïs", "Rayan", "Lola", "Samir", "Eva", "Jules"];
const LASTNAMES = ["Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit", "Durand", "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel", "Garcia", "David", "Bertrand", "Roux", "Vincent", "Fournier"];
const FRUITS = ["pomme", "kiwi", "banane", "poire", "fraise", "cerise", "mangue", "ananas", "citron", "orange", "raisin", "melon", "prune", "abricot", "pêche"];
const ANIMALS = ["chat", "chien", "cheval", "lapin", "renard", "loup", "ours", "tigre", "lion", "singe", "zèbre", "girafe", "panda", "dauphin", "requin", "aigle", "hibou", "souris", "tortue", "canard"];
const CITIES = ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Lille", "Rennes", "Dijon", "Brest", "Tours", "Reims", "Caen", "Metz", "Rouen"];
const WORDS = ["python", "ordinateur", "clavier", "souris", "écran", "variable", "fonction", "boucle", "liste", "chaîne", "nombre", "entier", "booléen", "algorithme", "programme", "bibliothèque", "robot", "réseau", "serveur", "donnée", "fichier", "dossier", "message", "image", "musique", "soleil", "montagne", "rivière", "forêt", "océan", "voiture", "bateau", "avion", "fusée", "planète", "étoile", "galaxie", "chocolat", "fromage", "croissant", "tartine", "bonjour", "merci", "vacances", "ingénieur", "science", "physique", "chimie", "biologie", "théorème", "équation", "calcul", "projet", "équipe", "école", "lycée", "cahier", "stylo", "bureau", "fenêtre", "jardin", "maison", "cuisine", "livre", "histoire", "voyage", "aventure", "courage", "amitié", "liberté", "énergie", "lumière", "silence", "vitesse", "pixel", "octet", "binaire", "compilateur", "interface", "mémoire", "processeur", "internet", "navigateur", "courriel", "mot de passe", "sécurité", "robotique", "capteur", "moteur", "circuit", "batterie", "satellite", "télescope", "microscope", "laboratoire", "expérience", "hypothèse", "résultat", "erreur", "solution", "défi", "niveau", "victoire", "partie", "joueur", "dragon", "château", "trésor", "carte", "mission", "radar", "signal", "onde", "atome", "molécule", "cellule", "genèse", "horizon", "tempête", "orage", "nuage", "neige", "printemps", "automne", "hiver", "été"];
const PHRASES = ["Bonjour le monde", "Je programme en Python", "Vive les mathématiques", "Apprendre c'est grandir", "Python est génial", "Le code est une poésie", "Tout commence par un print", "Je deviens ingénieur", "Bravo pour ton travail", "Un pas après l'autre", "Les robots arrivent", "À la conquête de l'espace", "La pratique rend parfait", "Hello World", "Premier programme réussi", "Merci pour ton aide", "Il fait beau aujourd'hui", "Rendez-vous à midi", "Le futur s'écrit en code", "Apprendre chaque jour"];

module.exports = { R, py, tuple, T, G, write, registry, defStarter, hash, jsFloorDiv, jsMod, NAMES, LASTNAMES, FRUITS, ANIMALS, CITIES, WORDS, PHRASES };
