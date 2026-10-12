// Programme complet du parcours Python : 100 niveaux, 10 défis (un tous les 10 niveaux), 5 grands projets finaux.
// Les niveaux 1 à 10 et le défi 1 sont disponibles ; les autres sont planifiés ici et seront ajoutés ensuite.
// Le nombre d'exercices de chaque niveau est dans js/levels/counts.js (généré par tools/gen/build.js).
const PALIERS = [
  { n: 1, title: "Fondations", icon: "🌱", levels: ["Afficher du texte avec print", "Variables et types", "Calculs et opérateurs", "Chaînes de caractères", "Conditions if / elif / else", "Logique : and, or, not", "Boucles for et range", "Boucles while", "Listes", "Premières fonctions"],
    defi: { title: "Défi des fondations", skills: "variables, calculs, chaînes, conditions, boucles, listes et fonctions réunis dans 10 vrais problèmes" } },
  { n: 2, title: "Structures de données", icon: "🗂️", levels: ["Listes avancées", "Parcours : enumerate et zip", "Listes imbriquées et matrices", "Tuples et déballage", "Ensembles", "Dictionnaires", "Dictionnaires : comptage et regroupement", "Compréhensions", "Chaînes avancées", "Tris et clés personnalisées"],
    defi: { title: "Défi traitement de données", skills: "analyser un jeu de données : filtrer, regrouper, compter, trier et présenter des résultats" } },
  { n: 3, title: "Fonctions, erreurs et fichiers", icon: "🧩", levels: ["Fonctions et paramètres avancés", "Portée et fermetures", "Récursivité I", "Récursivité II", "Erreurs et exceptions", "Fichiers texte", "CSV et JSON", "Modules de la bibliothèque standard", "Fonctions d'ordre supérieur", "Tests et débogage"],
    defi: { title: "Défi application en ligne de commande", skills: "construire un petit programme complet : menus, fichiers, erreurs gérées et tests" } },
  { n: 4, title: "Programmation orientée objet", icon: "🏗️", levels: ["Classes et objets", "Méthodes et attributs", "Encapsulation", "Méthodes spéciales", "Héritage", "Polymorphisme", "Composition", "Classes abstraites et interfaces", "Dataclasses et énumérations", "Conception orientée objet"],
    defi: { title: "Défi simulation orientée objet", skills: "modéliser un système réel (banque, bibliothèque, jeu) avec plusieurs classes qui collaborent" } },
  { n: 5, title: "Algorithmique classique", icon: "⚙️", levels: ["Recherches", "Tris simples", "Tris efficaces", "Complexité", "Piles et files", "Listes chaînées", "Arbres binaires", "Arbres binaires de recherche", "Tables de hachage", "Tas et files de priorité"],
    defi: { title: "Défi bibliothèque de structures de données", skills: "implémenter et comparer les grandes structures de données, avec leur complexité" } },
  { n: 6, title: "Algorithmique avancée", icon: "🧠", levels: ["Diviser pour régner", "Programmation dynamique I", "Programmation dynamique II", "Algorithmes gloutons", "Retour sur trace (backtracking)", "Graphes : représentation et parcours", "Plus courts chemins", "Arbres couvrants et union-find", "Graphes orientés et tri topologique", "Flots et couplages"],
    defi: { title: "Défi planificateur d'itinéraires", skills: "résoudre des problèmes de graphes et d'optimisation de bout en bout" } },
  { n: 7, title: "Mathématiques et calcul", icon: "📐", levels: ["Arithmétique modulaire", "Nombres premiers et crible", "Cryptographie classique", "Combinatoire", "Probabilités et simulation", "Calcul numérique", "Algèbre linéaire", "Géométrie algorithmique", "Grands nombres et précision", "Optimisation numérique"],
    defi: { title: "Défi cryptosystème et calcul scientifique", skills: "chiffrer, simuler et calculer : mathématiques appliquées au code" } },
  { n: 8, title: "Python avancé", icon: "🔮", levels: ["Itérateurs", "Générateurs", "Décorateurs", "Gestionnaires de contexte", "Expressions régulières", "Programmation fonctionnelle", "Typage et annotations", "Threads et processus", "Programmation asynchrone", "Métaprogrammation"],
    defi: { title: "Défi mini framework web", skills: "écrire un petit framework qui utilise décorateurs, générateurs, contextes et typage" } },
  { n: 9, title: "Problèmes de concours", icon: "🏅", levels: ["Chaînes et motifs", "Programmation dynamique avancée", "Graphes avancés", "Structures avancées (arbres de segments)", "Géométrie de concours", "Théorie des nombres de concours", "Jeux et stratégies", "Optimisation combinatoire", "Simulations complexes", "Épreuves de concours"],
    defi: { title: "Défi épreuve de grande école", skills: "une épreuve complète, longue et difficile, dans les conditions d'un concours" } },
  { n: 10, title: "Ingénierie et grands projets", icon: "🚀", levels: ["Analyse lexicale et syntaxique", "Interpréteurs", "Compilation et machines virtuelles", "Bases de données from scratch", "Réseaux et protocoles", "Serveurs web", "Apprentissage automatique from scratch", "Réseaux de neurones", "Systèmes distribués", "Synthèse : les 5 grands projets"],
    defi: { title: "Défi final : les 5 grands projets", skills: "les cinq plus grosses réalisations qu'on peut mener en Python (voir ci-dessous)" } }
];

// Les 5 grandes réalisations qui concluent le parcours (niveau 100)
const CAPSTONES = [
  { icon: "🗣️", title: "Un interpréteur complet", desc: "Un langage de programmation à toi : analyse lexicale et syntaxique, variables, fonctions, boucles, gestion d'erreurs." },
  { icon: "🗄️", title: "Un moteur de base de données", desc: "Stockage sur disque, requêtes SQL simplifiées, index et transactions." },
  { icon: "🧠", title: "Un réseau de neurones from scratch", desc: "Rétropropagation écrite à la main, entraînée sur un vrai jeu de données (par exemple des chiffres manuscrits)." },
  { icon: "🌐", title: "Un serveur web complet", desc: "Protocole HTTP, routage, sessions et persistance, sans framework." },
  { icon: "♟️", title: "Une IA de jeu et un solveur", desc: "Minimax avec élagage alpha-bêta pour un jeu de plateau, et un solveur de contraintes (Sudoku, SAT)." }
];

// Niveau d'un numéro n (1 à 100) → { palier, titre, index dans le palier }
const LEVELS = [];
PALIERS.forEach(p => p.levels.forEach((title, i) => LEVELS.push({ n: LEVELS.length + 1, palier: p.n, title, pos: i + 1 })));

// Réglages de progression
const UNLOCK_MIN = 20;       // exercices à réussir dans un niveau pour débloquer le suivant
const PAGE_SIZE = 10;        // exercices affichés par série
const DEFI_XP = 20;          // XP par exercice de défi
const DEFI_BONUS = 100;      // bonus quand le défi est entièrement réussi
const DEFI_COUNTS = { 1: 10 };   // défis disponibles → nombre d'exercices (mettre à jour quand on ajoute un défi)
const LEVEL_DATA = {};       // niveau → exercices chargés
const CHALLENGE_DATA = {};   // défi → exercices chargés
function registerLevel(n, items) { LEVEL_DATA[n] = items; }
function registerChallenge(n, items) { CHALLENGE_DATA[n] = items; }
