// Modules du cours. Les leçons sont dans lessons-1.js, lessons-2.js, lessons-3.js
// Types de blocs : ["h", titre] ["p", texte] ["code", python, {inputs:[], err:true}] ["out", texte attendu]
//                  ["tip", texte] ["warn", texte] ["list", [lignes]]
// Dans les textes : **gras** et `code`.
const MODULES = [
  { id: "m1", icon: "🌱", title: "Les bases de Python", desc: "Afficher, stocker, calculer, dialoguer." },
  { id: "m2", icon: "🔀", title: "Décider et répéter", desc: "Conditions et boucles : le cœur de la programmation." },
  { id: "m3", icon: "🗂️", title: "Organiser les données", desc: "Listes, tuples, ensembles et dictionnaires." },
  { id: "m4", icon: "🧩", title: "Les fonctions", desc: "Découper un programme en briques réutilisables." },
  { id: "m5", icon: "🚀", title: "Aller plus loin", desc: "Erreurs, fichiers, modules, objets et algorithmes." },
  { id: "m6", icon: "🎮", title: "Projet final", desc: "Assembler tout ce que tu as appris." }
];
const LESSONS = [];
