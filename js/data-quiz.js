// Questions de quiz. a = indice de la bonne réponse.
// Si run:true, la bonne réponse doit être exactement la sortie du code (vérifié automatiquement).
const QUIZ_THEMES = ["Bases", "Conditions et boucles", "Structures de données", "Fonctions", "POO et erreurs", "Algorithmique", "Culture informatique"];
const QUIZ = [
  // ── Bases (10) ──
  { t: "Bases", q: "Quelle fonction affiche du texte à l'écran ?", o: ["input()", "print()", "show()", "len()"], a: 1, why: "`print()` affiche ; `input()` lit une saisie." },
  { t: "Bases", q: "Quel type renvoie toujours `input()` ?", o: ["int", "float", "str", "bool"], a: 2, why: "`input()` renvoie toujours du texte (`str`), même si l'utilisateur tape un nombre." },
  { t: "Bases", q: "Que vaut `7 // 2` ?", o: ["3.5", "3", "4", "1"], a: 1, why: "`//` est la division entière : le quotient, soit 3." },
  { t: "Bases", q: "Que vaut `17 % 5` ?", o: ["3", "2", "3.4", "12"], a: 1, why: "`%` donne le reste : 17 = 3×5 + 2." },
  { t: "Bases", q: "Quel est le résultat de ce code ?", code: "x = 4\nx += 3\nprint(x * 2)", o: ["7", "14", "11", "8"], a: 1, why: "x devient 7, puis 7 × 2 = 14.", run: true },
  { t: "Bases", q: "Quel est le type de `3.0` ?", o: ["int", "float", "str", "bool"], a: 1, why: "Un nombre avec un point décimal est un `float`, même si sa partie décimale est nulle." },
  { t: "Bases", q: "Que renvoie `int(\"12\") + 1` ?", o: ["13", "\"121\"", "Une erreur", "12"], a: 0, why: "`int(\"12\")` vaut 12, donc 12 + 1 = 13." },
  { t: "Bases", q: "Quel nom de variable est valide en Python ?", o: ["2nom", "nom complet", "nom_complet", "nom-complet"], a: 2, why: "Pas d'espace, pas de tiret, et on ne commence pas par un chiffre." },
  { t: "Bases", q: "Que vaut `2 ** 3 ** 2` ?", o: ["64", "512", "36", "18"], a: 1, why: "La puissance s'évalue de droite à gauche : 3 ** 2 = 9 puis 2 ** 9 = 512." },
  { t: "Bases", q: "Quel symbole commence un commentaire ?", o: ["//", "#", "--", "/*"], a: 1, why: "En Python, `#` commence un commentaire jusqu'à la fin de la ligne." },

  // ── Conditions et boucles (10) ──
  { t: "Conditions et boucles", q: "Quel opérateur teste l'égalité ?", o: ["=", "==", "!=", "=>"], a: 1, why: "`=` affecte une valeur, `==` compare." },
  { t: "Conditions et boucles", q: "Que s'affiche-t-il ?", code: "for i in range(3):\n    print(i)", o: ["1 2 3", "0 1 2", "0 1 2 3", "1 2"], a: 1, why: "`range(3)` produit 0, 1, 2 (la fin est exclue). Les nombres sont affichés un par ligne.", run: false },
  { t: "Conditions et boucles", q: "Combien de fois la boucle s'exécute-t-elle ?", code: "n = 0\nwhile n < 5:\n    n += 1\nprint(n)", o: ["4", "5", "6", "Infiniment"], a: 1, why: "n passe de 0 à 5, soit 5 tours. Le programme affiche ensuite 5.", run: false },
  { t: "Conditions et boucles", q: "Que s'affiche-t-il ?", code: "x = 10\nif x > 5 and x < 8:\n    print(\"A\")\nelif x > 5:\n    print(\"B\")\nelse:\n    print(\"C\")", o: ["A", "B", "C", "A puis B"], a: 1, why: "La première condition est fausse (x n'est pas < 8). La deuxième est vraie : `B`.", run: true },
  { t: "Conditions et boucles", q: "Que fait `break` dans une boucle ?", o: ["Passe au tour suivant", "Arrête la boucle immédiatement", "Redémarre la boucle", "Arrête le programme"], a: 1, why: "`break` sort de la boucle. C'est `continue` qui passe au tour suivant." },
  { t: "Conditions et boucles", q: "Que vaut `total` à la fin ?", code: "total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)", o: ["10", "15", "4", "6"], a: 0, why: "1 + 2 + 3 + 4 = 10 (5 est exclu).", run: true },
  { t: "Conditions et boucles", q: "Quelle valeur est considérée comme fausse dans un `if` ?", o: ["\"False\"", "[0]", "\"\" (texte vide)", "-1"], a: 2, why: "Le texte vide, `0`, `[]` et `None` sont faux. `\"False\"` est un texte non vide, donc vrai." },
  { t: "Conditions et boucles", q: "Que s'affiche-t-il ?", code: "for n in range(1, 8):\n    if n % 3 == 0:\n        continue\n    if n > 5:\n        break\n    print(n, end=\" \")", o: ["1 2 4 5", "1 2 3 4 5", "1 2 4 5 7", "3 6"], a: 0, why: "3 et 6 sont sautés par `continue`, puis la boucle s'arrête à 7 (`break`, car 7 > 5).", run: true },
  { t: "Conditions et boucles", q: "Quelle boucle choisir pour répéter « tant que l'utilisateur n'a pas tapé \"stop\" » ?", o: ["for", "while", "if", "def"], a: 1, why: "Le nombre de tours est inconnu : `while` est adapté." },
  { t: "Conditions et boucles", q: "Que s'affiche-t-il ?", code: "x = 5\nprint(0 < x < 10, not x == 5)", o: ["True False", "True True", "False False", "False True"], a: 0, why: "`0 < x < 10` est vrai ; `x == 5` est vrai donc `not` donne False.", run: true },

  // ── Structures de données (10) ──
  { t: "Structures de données", q: "Quel est le premier indice d'une liste ?", o: ["1", "0", "-1", "Cela dépend"], a: 1, why: "L'indexation de Python commence à 0." },
  { t: "Structures de données", q: "Que s'affiche-t-il ?", code: "l = [10, 20, 30, 40]\nprint(l[1:3])", o: ["[10, 20, 30]", "[20, 30]", "[20, 30, 40]", "[10, 20]"], a: 1, why: "Le slicing `[1:3]` prend les indices 1 et 2.", run: true },
  { t: "Structures de données", q: "Que vaut `l` à la fin ?", code: "l = [1, 2]\nl.append(3)\nl.insert(0, 9)\nprint(l)", o: ["[9, 1, 2, 3]", "[1, 2, 3, 9]", "[9, 1, 2]", "[1, 9, 2, 3]"], a: 0, why: "`append` ajoute à la fin, `insert(0, 9)` place 9 au début.", run: true },
  { t: "Structures de données", q: "Que s'affiche-t-il ?", code: "a = [1, 2]\nb = a\nb.append(3)\nprint(a)", o: ["[1, 2]", "[1, 2, 3]", "[3]", "Une erreur"], a: 1, why: "`b = a` ne copie pas : `a` et `b` désignent la même liste.", run: true },
  { t: "Structures de données", q: "Quelle structure ne garde aucun doublon ?", o: ["list", "tuple", "set", "str"], a: 2, why: "Un `set` (ensemble) contient des valeurs uniques." },
  { t: "Structures de données", q: "Quelle structure n'est PAS modifiable ?", o: ["list", "dict", "set", "tuple"], a: 3, why: "Un tuple est immuable une fois créé." },
  { t: "Structures de données", q: "Que s'affiche-t-il ?", code: "d = {\"a\": 1, \"b\": 2}\nprint(d.get(\"c\", 0))", o: ["None", "0", "Une erreur KeyError", "\"c\""], a: 1, why: "`get` renvoie la valeur par défaut (0) si la clé n'existe pas.", run: true },
  { t: "Structures de données", q: "Que s'affiche-t-il ?", code: "print(len(set([1, 2, 2, 3, 3, 3])))", o: ["6", "3", "2", "1"], a: 1, why: "Le set supprime les doublons : {1, 2, 3} contient 3 éléments.", run: true },
  { t: "Structures de données", q: "Que s'affiche-t-il ?", code: "print([x * 2 for x in range(4) if x != 2])", o: ["[0, 2, 6]", "[0, 2, 4, 6]", "[2, 6]", "[0, 1, 3]"], a: 0, why: "x vaut 0, 1, 3 (2 est exclu) : doublés, cela donne 0, 2, 6.", run: true },
  { t: "Structures de données", q: "Que s'affiche-t-il ?", code: "print(\"python\"[::-1])", o: ["python", "nohtyp", "pyt", "Une erreur"], a: 1, why: "`[::-1]` inverse la chaîne.", run: true },

  // ── Fonctions (8) ──
  { t: "Fonctions", q: "Quel mot-clé définit une fonction ?", o: ["function", "def", "fun", "make"], a: 1, why: "En Python, on écrit `def nom(paramètres):`." },
  { t: "Fonctions", q: "Que s'affiche-t-il ?", code: "def f(x):\n    print(x * 2)\n\nr = f(4)\nprint(r)", o: ["8 puis 8", "8 puis None", "None puis 8", "8"], a: 1, why: "`f` affiche 8 mais ne renvoie rien (donc `None`). Sans `return`, la valeur est `None`.", run: false },
  { t: "Fonctions", q: "Quelle est la différence entre `print` et `return` ?", o: ["Aucune", "`print` affiche, `return` renvoie une valeur utilisable", "`return` affiche plus joliment", "`print` ne marche qu'en dehors des fonctions"], a: 1, why: "`return` donne une valeur au code appelant ; `print` ne fait qu'afficher." },
  { t: "Fonctions", q: "Que s'affiche-t-il ?", code: "def saluer(nom, mot=\"Bonjour\"):\n    return mot + \" \" + nom\n\nprint(saluer(\"Alex\"))", o: ["Bonjour Alex", "Alex Bonjour", "Une erreur", "Alex"], a: 0, why: "Le paramètre `mot` prend sa valeur par défaut si on ne le donne pas.", run: true },
  { t: "Fonctions", q: "Que s'affiche-t-il ?", code: "def f():\n    x = 5\n\nf()\nprint(x)", o: ["5", "None", "Une erreur NameError", "0"], a: 2, why: "`x` est locale à la fonction : elle n'existe pas à l'extérieur.", err: true },
  { t: "Fonctions", q: "Que renvoie cette fonction ?", code: "def mystere(n):\n    if n <= 1:\n        return 1\n    return n * mystere(n - 1)\n\nprint(mystere(4))", o: ["10", "24", "16", "4"], a: 1, why: "C'est la factorielle : 4 × 3 × 2 × 1 = 24.", run: true },
  { t: "Fonctions", q: "Que doit toujours avoir une fonction récursive ?", o: ["Une boucle for", "Un cas de base", "Une variable globale", "Un paramètre par défaut"], a: 1, why: "Le cas de base arrête la récursion ; sans lui, c'est une `RecursionError`." },
  { t: "Fonctions", q: "Que s'affiche-t-il ?", code: "def f(*args):\n    return len(args)\n\nprint(f(1, 2, 3))", o: ["1", "3", "6", "Une erreur"], a: 1, why: "`*args` regroupe tous les arguments dans un tuple de 3 éléments.", run: true },

  // ── POO et erreurs (6) ──
  { t: "POO et erreurs", q: "Quel est le rôle de `__init__` ?", o: ["Détruire l'objet", "Initialiser l'objet à sa création", "Afficher l'objet", "Importer un module"], a: 1, why: "`__init__` est le constructeur : appelé automatiquement à la création d'un objet." },
  { t: "POO et erreurs", q: "Que représente `self` dans une méthode ?", o: ["La classe", "L'objet courant", "Le module", "Le paramètre suivant"], a: 1, why: "`self` désigne l'objet sur lequel la méthode est appelée." },
  { t: "POO et erreurs", q: "Quelle erreur provoque `int(\"abc\")` ?", o: ["TypeError", "ValueError", "NameError", "IndexError"], a: 1, why: "Le type est bon (un texte) mais la valeur n'est pas convertible : `ValueError`." },
  { t: "POO et erreurs", q: "Que s'affiche-t-il ?", code: "try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print(\"Impossible\")\nfinally:\n    print(\"Fin\")", o: ["Impossible puis Fin", "Fin puis Impossible", "Impossible", "Une erreur"], a: 0, why: "L'exception est attrapée (`Impossible`), puis `finally` s'exécute toujours (`Fin`). Les deux lignes sont affichées l'une après l'autre.", run: false },
  { t: "POO et erreurs", q: "Quelle erreur provoque `[1, 2, 3][5]` ?", o: ["KeyError", "IndexError", "ValueError", "SyntaxError"], a: 1, why: "L'indice 5 est hors de la liste : `IndexError`." },
  { t: "POO et erreurs", q: "Que s'affiche-t-il ?", code: "class A:\n    def __init__(self):\n        self.v = 1\n    def inc(self):\n        self.v += 1\n\na = A()\na.inc()\na.inc()\nprint(a.v)", o: ["1", "2", "3", "0"], a: 2, why: "v commence à 1 puis `inc` est appelée deux fois : 3.", run: true },

  // ── Algorithmique (8) ──
  { t: "Algorithmique", q: "La recherche dichotomique exige que la liste soit…", o: ["De petite taille", "Triée", "Composée de nombres pairs", "Sans doublon"], a: 1, why: "Elle repose sur la comparaison avec l'élément du milieu : il faut que la liste soit triée." },
  { t: "Algorithmique", q: "Quelle est la complexité de la recherche dichotomique ?", o: ["O(1)", "O(log n)", "O(n)", "O(n²)"], a: 1, why: "On divise l'espace de recherche par 2 à chaque étape : O(log n)." },
  { t: "Algorithmique", q: "Environ combien d'étapes pour une dichotomie dans 1 000 000 d'éléments ?", o: ["1 000 000", "1 000", "20", "2"], a: 2, why: "log₂(1 000 000) ≈ 20 : c'est la puissance de « diviser par deux »." },
  { t: "Algorithmique", q: "Quelle est la complexité d'un tri à bulles ?", o: ["O(n)", "O(log n)", "O(n²)", "O(1)"], a: 2, why: "Deux boucles imbriquées sur n éléments : de l'ordre de n² comparaisons." },
  { t: "Algorithmique", q: "Que fait cet algorithme ?", code: "def f(l):\n    m = l[0]\n    for x in l:\n        if x > m:\n            m = x\n    return m\n\nprint(f([3, 9, 4]))", o: ["Le minimum", "Le maximum", "La somme", "La moyenne"], a: 1, why: "Il garde le plus grand élément rencontré : c'est le maximum.", run: false },
  { t: "Algorithmique", q: "Quelle est l'idée de l'algorithme d'Euclide ?", o: ["Trier une liste", "Calculer un PGCD par divisions successives", "Rechercher un mot", "Calculer une factorielle"], a: 1, why: "pgcd(a, b) = pgcd(b, a % b) jusqu'à ce que le reste soit nul." },
  { t: "Algorithmique", q: "Quelle structure de données fonctionne en « dernier entré, premier sorti » ?", o: ["La file", "La pile", "Le dictionnaire", "L'ensemble"], a: 1, why: "Une pile (stack) : on empile et dépile par le haut. On l'utilise pour les appels de fonctions, l'annulation (Ctrl+Z)…" },
  { t: "Algorithmique", q: "Que s'affiche-t-il ?", code: "a, b = 0, 1\nfor _ in range(6):\n    a, b = b, a + b\nprint(a)", o: ["5", "8", "13", "6"], a: 1, why: "Suite de Fibonacci : 0, 1, 1, 2, 3, 5, 8. Après 6 tours, a vaut 8.", run: true },

  // ── Culture informatique (8) ──
  { t: "Culture informatique", q: "Que signifie « IA » ?", o: ["Interface Automatique", "Intelligence Artificielle", "Information Avancée", "Intégration Applicative"], a: 1, why: "L'intelligence artificielle regroupe les techniques qui permettent aux machines d'accomplir des tâches demandant habituellement de l'intelligence humaine." },
  { t: "Culture informatique", q: "Combien de valeurs peut prendre un bit ?", o: ["2", "8", "10", "256"], a: 0, why: "Un bit vaut 0 ou 1. Un octet regroupe 8 bits (256 valeurs possibles)." },
  { t: "Culture informatique", q: "Qui exécute le code d'un programme ?", o: ["Le processeur (CPU)", "L'écran", "Le disque dur uniquement", "Le clavier"], a: 0, why: "Le processeur exécute les instructions ; la mémoire stocke temporairement les données." },
  { t: "Culture informatique", q: "À quoi sert Git ?", o: ["À dessiner des interfaces", "À suivre et partager l'historique d'un code", "À compiler du Python", "À chiffrer des mots de passe"], a: 1, why: "Git est un système de gestion de versions : il garde l'historique des modifications et facilite le travail en équipe." },
  { t: "Culture informatique", q: "Quel langage structure le contenu d'une page web ?", o: ["CSS", "HTML", "SQL", "Python"], a: 1, why: "HTML structure le contenu, CSS le met en forme, JavaScript le rend interactif." },
  { t: "Culture informatique", q: "Quel langage sert à interroger une base de données ?", o: ["SQL", "HTML", "CSS", "Bash"], a: 0, why: "SQL (Structured Query Language) sert à lire et modifier des bases de données relationnelles." },
  { t: "Culture informatique", q: "Quelle bonne pratique protège un compte en ligne ?", o: ["Le même mot de passe partout", "Un mot de passe long et unique + double authentification", "Partager son mot de passe avec un ami", "Noter son mot de passe sur un site"], a: 1, why: "Un mot de passe long, unique par service, et la double authentification limitent fortement les risques." },
  { t: "Culture informatique", q: "Un « bug » est…", o: ["Un virus", "Une erreur dans un programme", "Un type de variable", "Une extension de fichier"], a: 1, why: "Un bug est un défaut de fonctionnement d'un programme. Chercher et corriger les bugs s'appelle déboguer." }
];
