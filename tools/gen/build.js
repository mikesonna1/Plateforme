// Génère js/levels/level-XXX.js : node tools/gen/build.js
const path = require("path"), fs = require("fs");
const lib = require("./lib");
require("./levels-01-05"); require("./levels-06-10"); require("./levels-extra");
const out = path.join(__dirname, "..", "..", "js", "levels");
fs.rmSync(out, { recursive: true, force: true });
const summary = lib.write(out);
let total = 0;
for (const [l, n] of Object.entries(summary)) { console.log(`Niveau ${String(l).padStart(3)} : ${n} exercices`); total += n; }
console.log("Total :", total);
// Nombre d'exercices par niveau (utilisé par le site pour afficher la progression sans charger les niveaux)
fs.writeFileSync(path.join(out, "counts.js"),
  "// Fichier généré par tools/gen/build.js : ne pas modifier à la main\nconst LEVEL_COUNTS = " + JSON.stringify(summary) + ";\n");
