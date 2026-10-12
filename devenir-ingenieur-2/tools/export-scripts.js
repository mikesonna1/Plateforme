// Génère videos/SCRIPTS.md : le script de chacune des 21 vidéos, prêt à coller dans un outil de vidéo IA.
// Utilisation : node tools/export-scripts.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = {}; vm.createContext(ctx);
for (const f of ["data-courses.js", "lessons-1.js", "lessons-2.js", "lessons-3.js"]) vm.runInContext(fs.readFileSync(path.join(root, "js", f), "utf8").replace(/^const /gm, "var "), ctx);
const clean = s => String(s).replace(/`/g, "").replace(/\*\*/g, "");
let md = "# Scripts des vidéos\n\nUn script par cours. Chaque vidéo suit la même structure : accroche → démonstration → à retenir → conclusion.\nCopie la partie « Narration » dans ton outil de vidéo IA (voix + avatar) et utilise « À l'écran » comme consigne visuelle.\nNomme ensuite le fichier `videos/<identifiant>.mp4` et déclare-le dans `js/data-videos.js`.\n\n";
ctx.LESSONS.forEach((l, i) => {
  const firstCode = l.blocks.find(b => b[0] === "code");
  md += `---\n\n## Cours ${i + 1} · ${l.title}  (\`${l.id}\`)\n\n**Titre de la vidéo :** ${l.video.title}  \n**Durée visée :** ${l.video.duration}\n\n`;
  md += `### 1. Accroche\n**Narration :** ${l.video.hook}\n\n**À l'écran :** titre animé « ${l.title} ».\n\n`;
  md += `### 2. Démonstration\n**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)\n\n**À l'écran :** ${l.video.demo} Utilise un éditeur de code${firstCode ? ", avec par exemple :" : "."}\n\n`;
  if (firstCode) md += "```python\n" + firstCode[1] + "\n```\n\n";
  md += `### 3. À retenir\n**Narration :** Pour résumer. ${l.recap.map(clean).join(" ")}\n\n`;
  md += `### 4. Conclusion\n**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.\n\n`;
});
fs.writeFileSync(path.join(root, "videos", "SCRIPTS.md"), md);
console.log("videos/SCRIPTS.md écrit (" + ctx.LESSONS.length + " scripts)");
