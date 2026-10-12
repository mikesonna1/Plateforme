const { py, T, G, defStarter, jsFloorDiv, jsMod, NAMES, LASTNAMES, FRUITS, ANIMALS, CITIES, WORDS, PHRASES } = require("./lib");
const code = s => "`" + s + "`";

/* ═══════════ NIVEAU 1 : Afficher du texte (print) ═══════════ */
G(1, "print_word", 60, r => {
  const w = r.pick([...WORDS, ...PHRASES]);
  return { title: "Afficher un texte", q: `Affiche exactement le texte : ${code(w)}`, hint: "Utilise `print()` avec le texte entre guillemets.", starter: "# Écris ton code ici\n", sol: `print(${py(w)})`, tests: T.out([w]) };
});
G(1, "print_two_lines", 40, r => {
  const [a, b] = r.sample([...WORDS, ...PHRASES], 2);
  return { title: "Deux lignes", q: `Affiche ${code(a)} sur une première ligne, puis ${code(b)} sur la ligne suivante (avec deux \`print()\`).`, hint: "Chaque `print()` termine par un retour à la ligne.", starter: "", sol: `print(${py(a)})\nprint(${py(b)})`, tests: T.out([a, b]) };
});
G(1, "print_multi_args", 40, r => {
  const [a, b, c] = r.sample(WORDS.filter(w => !w.includes(" ")), 3);
  return { title: "Plusieurs valeurs dans print", q: `Avec **un seul** \`print()\`, affiche les trois mots ${code(a)}, ${code(b)} et ${code(c)} sur une même ligne, séparés par des espaces. Donne les trois valeurs séparées par des virgules.`, hint: "`print(a, b, c)` met un espace entre chaque valeur.", starter: "", sol: `print(${py(a)}, ${py(b)}, ${py(c)})`, tests: [...T.out([`${a} ${b} ${c}`]), ...T.uses("print\\s*\\(", "Tu utilises print()")] };
});
G(1, "print_repeat", 40, r => {
  const w = r.pick(["ha", "la", "bip", "ok", "ab", "ta", "zig", "go", "hop", "toc", "na", "yo"]), k = r.int(2, 12);
  return { title: "Répéter un texte", q: `Affiche le texte ${code(w)} répété ${k} fois, collé, sur une seule ligne (ex. pour 3 fois « ha » : \`hahaha\`). Utilise l'opérateur \`*\` sur le texte.`, hint: "En Python, `\"ab\" * 3` donne `\"ababab\"`.", starter: "", sol: `print(${py(w)} * ${k})`, tests: T.out([w.repeat(k)]) };
});
G(1, "print_number", 60, r => {
  const op = r.pick(["+", "-", "*", "//", "%", "**"]);
  let a = r.int(2, 60), b = r.int(2, 30);
  if (op === "**") { a = r.int(2, 9); b = r.int(2, 6); }
  const res = { "+": a + b, "-": a - b, "*": a * b, "//": jsFloorDiv(a, b), "%": jsMod(a, b), "**": a ** b }[op];
  const nom = { "+": "la somme", "-": "la différence", "*": "le produit", "//": "le quotient entier", "%": "le reste de la division", "**": "la puissance" }[op];
  return { title: "Afficher un calcul", q: `Affiche le résultat du calcul ${code(`${a} ${op} ${b}`)} (${nom}).`, hint: "Python calcule directement : `print(3 + 4)` affiche `7`.", starter: "", sol: `print(${a} ${op} ${b})`, tests: T.out([String(res)]) };
});
G(1, "print_escape", 30, r => {
  const [a, b] = r.sample(WORDS.filter(w => !w.includes(" ")), 2);
  return { title: "Retour à la ligne avec \\n", q: `Avec **un seul** \`print()\`, affiche ${code(a)} puis ${code(b)} sur deux lignes différentes. Utilise le code spécial \`\\n\` dans le texte.`, hint: "`\\n` à l'intérieur du texte provoque un retour à la ligne.", starter: "", sol: `print(${py(a + "\n" + b)})`, tests: [...T.out([a, b]), ...T.uses("print\\s*\\(", "Tu utilises print()")] };
});
G(1, "print_concat", 50, r => {
  const p = r.pick(NAMES), n = r.pick(LASTNAMES);
  return { title: "Concaténer des textes", q: `Les variables \`prenom\` et \`nom\` sont déjà créées. Affiche le nom complet (\`${p} ${n}\`) en les collant avec l'opérateur \`+\` (sans oublier l'espace).`, hint: "`prenom + \" \" + nom`", starter: `prenom = ${py(p)}\nnom = ${py(n)}\n# Affiche le nom complet\n`, sol: `prenom = ${py(p)}\nnom = ${py(n)}\nprint(prenom + " " + nom)`, tests: T.out([`${p} ${n}`]) };
});
G(1, "print_quote", 30, r => {
  const w = r.pick(WORDS.filter(x => !x.includes(" "))), kind = r.int(0, 2);
  const text = kind === 0 ? `L'${w} est là` : kind === 1 ? `Il dit "${w}" à voix haute` : `C'est "${w}" ou rien`;
  return { title: "Guillemets dans le texte", q: `Affiche exactement la phrase suivante, avec ses guillemets ou apostrophes : ${code(text)}`, hint: "Entoure le texte avec des guillemets d'un autre type que ceux du texte : `'...'` si le texte contient des `\"`, et `\"...\"` s'il contient des `'`. Ou utilise `\\'` / `\\\"`.", starter: "", sol: `print(${py(text)})`, tests: T.out([text]) };
});
G(1, "print_sep", 40, r => {
  const [a, b, c] = r.sample(WORDS.filter(w => !w.includes(" ")), 3), sep = r.pick(["-", "/", " | ", ", ", "+", "*", "::", "_"]);
  return { title: "Le paramètre sep", q: `Affiche ${code(a)}, ${code(b)} et ${code(c)} sur une ligne, séparés par ${code(sep)} (sans autre espace). Utilise le paramètre \`sep\` de \`print()\`.`, hint: "`print(x, y, sep=\"-\")` affiche `x-y`.", starter: "", sol: `print(${py(a)}, ${py(b)}, ${py(c)}, sep=${py(sep)})`, tests: [...T.out([[a, b, c].join(sep)]), ...T.uses("sep\\s*=", "Tu utilises le paramètre sep")] };
});
G(1, "print_end", 30, r => {
  const [a, b] = r.sample(WORDS.filter(w => !w.includes(" ")), 2), e = r.pick([" ", "", "-", " + ", "→"]);
  return { title: "Le paramètre end", q: `Avec **deux** appels à \`print()\`, affiche ${code(a)} puis ${code(b)} sur la **même ligne**, séparés par ${e === "" ? "rien (collés)" : code(e)}. Utilise le paramètre \`end\`.`, hint: "Par défaut `print` termine par `\\n`. `print(x, end=\"\")` ne passe pas à la ligne.", starter: "", sol: `print(${py(a)}, end=${py(e)})\nprint(${py(b)})`, tests: [...T.out([a + e + b]), ...T.uses("end\\s*=", "Tu utilises le paramètre end")] };
});
G(1, "print_stars", 30, r => {
  const c = r.pick(["*", "#", "=", "-", "+", "~"]), k = r.int(3, 30);
  return { title: "Une ligne de symboles", q: `Affiche une ligne composée de ${k} fois le symbole ${code(c)}, sans les taper un par un.`, hint: "Multiplie le symbole par le nombre : `\"*\" * 5`.", starter: "", sol: `print(${py(c)} * ${k})`, tests: T.out([c.repeat(k)]) };
});
G(1, "print_calc_multi", 50, r => {
  const a = r.int(5, 90), b = r.int(2, a - 1);
  return { title: "Trois calculs", q: `Les variables \`a = ${a}\` et \`b = ${b}\` sont déjà créées. Affiche sur trois lignes : leur somme, leur différence (\`a - b\`) puis leur produit.`, hint: "Trois `print()` : `print(a + b)`, …", starter: `a = ${a}\nb = ${b}\n`, sol: `a = ${a}\nb = ${b}\nprint(a + b)\nprint(a - b)\nprint(a * b)`, tests: T.out([String(a + b), String(a - b), String(a * b)]) };
});

/* ═══════════ NIVEAU 2 : Variables et types ═══════════ */
const VARNAMES = ["age", "score", "nombre", "points", "niveau", "vies", "annee", "taille", "total", "compteur", "poids", "prix", "quantite", "vitesse", "distance"];
G(2, "set_int", 40, r => { const v = r.pick(VARNAMES), n = r.int(-50, 500); return { title: "Créer une variable entière", q: `Crée une variable \`${v}\` qui contient le nombre entier **${n}**.`, hint: "On affecte avec `=` : `nom = valeur`.", starter: "# Crée la variable\n", sol: `${v} = ${n}`, tests: T.variable(v, n) }; });
G(2, "set_str", 40, r => { const v = r.pick(["nom", "ville", "animal", "fruit", "mot", "message", "titre", "couleur", "pays", "langage"]); const val = r.pick([...WORDS, ...FRUITS, ...ANIMALS, ...CITIES]); return { title: "Créer une variable texte", q: `Crée une variable \`${v}\` qui contient le texte **${val}**.`, hint: "Un texte s'écrit entre guillemets.", starter: "", sol: `${v} = ${py(val)}`, tests: T.variable(v, val) }; });
G(2, "set_float", 30, r => { const v = r.pick(["prix", "taille", "poids", "temperature", "moyenne", "note", "vitesse"]); const val = r.int(1, 99) + r.pick([0.5, 0.25, 0.75, 0.1, 0.9, 0.2, 0.4]); return { title: "Créer une variable décimale", q: `Crée une variable \`${v}\` qui contient le nombre décimal **${val}**.`, hint: "Les décimaux s'écrivent avec un **point** en Python.", starter: "", sol: `${v} = ${val}`, tests: T.variable(v, val) }; });
G(2, "set_bool", 20, r => { const v = r.pick(["actif", "termine", "connecte", "valide", "gagne", "majeur", "ouvert", "present"]), val = r.chance(); return { title: "Créer un booléen", q: `Crée une variable \`${v}\` qui vaut **${py(val)}** (un booléen).`, hint: "Les deux booléens s'écrivent `True` et `False`, avec une majuscule, sans guillemets.", starter: "", sol: `${v} = ${py(val)}`, tests: T.variable(v, val) }; });
G(2, "copy_var", 30, r => {
  const val = r.chance() ? r.int(1, 999) : r.pick(WORDS.filter(w => !w.includes(" "))); const [x, y] = r.sample(["a", "x", "p", "m", "u"], 2);
  return { title: "Copier une valeur", q: `La variable \`${x}\` vaut ${code(py(val))}. Crée une variable \`${y}\` qui contient **la même valeur** que \`${x}\`, sans retaper la valeur.`, hint: `\`${y} = ${x}\``, starter: `${x} = ${py(val)}\n`, sol: `${x} = ${py(val)}\n${y} = ${x}`, tests: [...T.variable(y, val, false), ...T.keep([[x, val]])] };
});
G(2, "swap", 40, r => {
  const num = r.chance(); const a = num ? r.int(1, 99) : r.pick(FRUITS), b = num ? r.int(100, 999) : r.pick(ANIMALS);
  return { title: "Échanger deux variables", q: `Les variables \`a = ${py(a)}\` et \`b = ${py(b)}\` sont créées. **Échange leurs valeurs** : à la fin, \`a\` doit contenir l'ancienne valeur de \`b\` et inversement. (Astuce : utilise une troisième variable temporaire, ou \`a, b = b, a\`.)`, hint: "Attention : `a = b` puis `b = a` ne marche pas, la première valeur est perdue.", starter: `a = ${py(a)}\nb = ${py(b)}\n# Échange a et b\n`, sol: `a = ${py(a)}\nb = ${py(b)}\na, b = b, a`, tests: [["a contient l'ancienne valeur de b", `assert a == ${py(b)}, "a vaut " + repr(a)`], ["b contient l'ancienne valeur de a", `assert b == ${py(a)}, "b vaut " + repr(b)`]] };
});
G(2, "geometry", 60, r => {
  const kind = r.pick(["aire_rect", "perim_rect", "volume", "aire_tri", "aire_carre", "perim_carre"]);
  const l = r.int(2, 40), h = r.int(2, 40), p = r.int(2, 20);
  let q, init, line, v, name;
  if (kind === "aire_rect") { name = "aire"; init = `longueur = ${l}\nlargeur = ${h}`; line = "aire = longueur * largeur"; v = l * h; q = `Un rectangle a pour longueur ${l} et pour largeur ${h} (variables \`longueur\` et \`largeur\`). Calcule son **aire** dans une variable \`aire\`.`; }
  if (kind === "perim_rect") { name = "perimetre"; init = `longueur = ${l}\nlargeur = ${h}`; line = "perimetre = 2 * (longueur + largeur)"; v = 2 * (l + h); q = `Un rectangle a pour longueur ${l} et pour largeur ${h}. Calcule son **périmètre** dans une variable \`perimetre\`.`; }
  if (kind === "volume") { name = "volume"; init = `longueur = ${l}\nlargeur = ${h}\nhauteur = ${p}`; line = "volume = longueur * largeur * hauteur"; v = l * h * p; q = `Un pavé a pour dimensions ${l}, ${h} et ${p} (variables \`longueur\`, \`largeur\`, \`hauteur\`). Calcule son **volume** dans une variable \`volume\`.`; }
  if (kind === "aire_tri") { name = "aire"; const b = 2 * r.int(1, 20); init = `base = ${b}\nhauteur = ${h}`; line = "aire = base * hauteur / 2"; v = b * h / 2; q = `Un triangle a pour base ${b} et pour hauteur ${h}. Calcule son **aire** (base × hauteur ÷ 2) dans une variable \`aire\`.`; }
  if (kind === "aire_carre") { name = "aire"; init = `cote = ${l}`; line = "aire = cote * cote"; v = l * l; q = `Un carré a pour côté ${l} (variable \`cote\`). Calcule son **aire** dans une variable \`aire\`.`; }
  if (kind === "perim_carre") { name = "perimetre"; init = `cote = ${l}`; line = "perimetre = 4 * cote"; v = 4 * l; q = `Un carré a pour côté ${l} (variable \`cote\`). Calcule son **périmètre** dans une variable \`perimetre\`.`; }
  return { title: "Formules de géométrie", q, hint: "Écris la formule avec les variables, par exemple `aire = a * b`.", starter: init + "\n", sol: init + "\n" + line, tests: T.variable(name, v, false) };
});
G(2, "update", 50, r => {
  const v = r.pick(["score", "points", "vies", "argent", "niveau", "energie"]), s = r.int(5, 100), k = r.int(2, 30), op = r.pick(["+=", "-=", "*="]);
  const res = op === "+=" ? s + k : op === "-=" ? s - k : s * k;
  const verb = { "+=": `ajoute ${k}`, "-=": `retire ${k}`, "*=": `multiplie par ${k}` }[op];
  return { title: "Modifier une variable", q: `La variable \`${v}\` vaut ${s}. Dans le même programme, ${verb} à sa valeur (la variable doit contenir le nouveau résultat à la fin) avec l'opérateur \`${op}\`.`, hint: `\`${v} ${op} ${k}\``, starter: `${v} = ${s}\n`, sol: `${v} = ${s}\n${v} ${op} ${k}`, tests: [...T.variable(v, res), ...T.uses(op.replace("*", "\\*").replace("+", "\\+"), `Tu utilises ${op}`)] };
});
G(2, "type_name", 40, r => {
  const pool = [[r.int(1, 99), "int"], [r.int(1, 99) + 0.5, "float"], [r.pick(WORDS), "str"], [r.chance(), "bool"]];
  const [val, tn] = r.pick(pool);
  return { title: "Connaître le type", q: `La variable \`x\` vaut ${code(py(val))}. Crée une variable \`t\` contenant **le nom du type** de \`x\` sous forme de texte (par exemple \`"int"\`). Utilise \`type(x).__name__\`.`, hint: "`type(x)` donne le type ; `.__name__` en donne le nom.", starter: `x = ${py(val)}\n`, sol: `x = ${py(val)}\nt = type(x).__name__`, tests: T.variable("t", tn) };
});
G(2, "fstring", 60, r => {
  const n = r.pick(NAMES), a = r.int(8, 60), v = r.pick(CITIES), f = r.pick(FRUITS);
  const k = r.int(0, 2);
  const out = [`${n} a ${a} ans`, `${n} habite à ${v} et a ${a} ans`, `${n} mange ${a} ${f}s`][k];
  const body = [`print(f"{nom} a {valeur} ans")`, `print(f"{nom} habite à {ville} et a {valeur} ans")`, `print(f"{nom} mange {valeur} {fruit}s")`][k];
  const init = `nom = ${py(n)}\nvaleur = ${a}\nville = ${py(v)}\nfruit = ${py(f)}`;
  return { title: "Les f-strings", q: `Les variables \`nom\`, \`valeur\`, \`ville\` et \`fruit\` existent déjà. Avec une **f-string**, affiche exactement : ${code(out)}`, hint: "`print(f\"{nom} a {valeur} ans\")`", starter: init + "\n", sol: init + "\n" + body, tests: [...T.out([out]), ...T.uses("print\\s*\\(\\s*f[\"']", "Tu utilises une f-string")] };
});
G(2, "convert", 50, r => {
  const n = r.int(10, 999), k = r.int(1, 50), kind = r.int(0, 2);
  const init = `texte = ${py(String(n))}`;
  let q, line, name, val;
  if (kind === 0) { name = "resultat"; line = `resultat = int(texte) + ${k}`; val = n + k; q = `La variable \`texte\` contient le **texte** ${code(py(String(n)))}. Crée \`resultat\` qui vaut le nombre contenu dans \`texte\` plus ${k}.`; }
  if (kind === 1) { name = "decimal"; line = "decimal = float(texte)"; val = n; q = `La variable \`texte\` contient le texte ${code(py(String(n)))}. Convertis-le en nombre **décimal** (float) dans une variable \`decimal\`.`; }
  if (kind === 2) { name = "phrase"; line = `phrase = "Il y a " + texte + " élèves"`; val = `Il y a ${n} élèves`; q = `La variable \`texte\` contient le texte ${code(py(String(n)))}. Crée \`phrase\` qui vaut le texte \`Il y a ${n} élèves\` en collant \`texte\` aux autres morceaux avec \`+\`.`; }
  return { title: "Convertir les types", q, hint: kind === 1 ? "`float(...)` convertit en décimal." : kind === 0 ? "`int(texte)` convertit le texte en entier." : "Colle trois morceaux de texte avec `+`.", starter: init + "\n", sol: init + "\n" + line, tests: T.variable(name, val, kind !== 1) };
});
G(2, "shop", 40, r => {
  const f = r.pick(FRUITS), p = r.int(1, 12), q = r.int(2, 20), frais = r.int(1, 9);
  return { title: "Le panier", q: `Un client achète ${q} ${f}s à ${p} € l'unité (variables \`prix\` et \`quantite\`), plus ${frais} € de frais de livraison. Calcule le **total à payer** dans une variable \`total\`.`, hint: "total = prix × quantité + frais.", starter: `prix = ${p}\nquantite = ${q}\n`, sol: `prix = ${p}\nquantite = ${q}\ntotal = prix * quantite + ${frais}`, tests: T.variable("total", p * q + frais) };
});

/* ═══════════ NIVEAU 3 : Calculs et opérateurs ═══════════ */
G(3, "expr", 80, r => {
  const op = r.pick(["+", "-", "*", "//", "%", "**"]);
  let a = r.int(2, 99), b = r.int(2, 40);
  if (op === "**") { a = r.int(2, 12); b = r.int(2, 5); }
  const res = { "+": a + b, "-": a - b, "*": a * b, "//": jsFloorDiv(a, b), "%": jsMod(a, b), "**": a ** b }[op];
  return { title: "Évaluer une expression", q: `Les variables \`a = ${a}\` et \`b = ${b}\` existent. Calcule \`a ${op} b\` dans une variable \`r\`.`, hint: `\`r = a ${op} b\``, starter: `a = ${a}\nb = ${b}\n`, sol: `a = ${a}\nb = ${b}\nr = a ${op} b`, tests: T.variable("r", res) };
});
G(3, "quot_reste", 60, r => {
  const b = r.int(3, 25), a = r.int(b, b * 15) + r.int(1, b - 1);
  return { title: "Quotient et reste", q: `Dans la division euclidienne de ${a} par ${b}, calcule le **quotient** dans \`q\` et le **reste** dans \`r\`.`, hint: "`//` donne le quotient, `%` donne le reste.", starter: `a = ${a}\nb = ${b}\n`, sol: `a = ${a}\nb = ${b}\nq = a // b\nr = a % b`, tests: [...T.variable("q", jsFloorDiv(a, b)), ...T.variable("r", jsMod(a, b)).slice(1)] };
});
G(3, "power", 40, r => {
  const a = r.int(2, 12), n = r.int(2, 6);
  return { title: "Puissances", q: `Calcule ${a} puissance ${n} dans une variable \`p\` (utilise l'opérateur \`**\`).`, hint: "`2 ** 3` vaut 8.", starter: "", sol: `p = ${a} ** ${n}`, tests: T.variable("p", a ** n) };
});
G(3, "priority", 60, r => {
  const a = r.int(2, 20), b = r.int(2, 12), c = r.int(2, 9), d = r.int(2, 6);
  const forms = [[`${a} + ${b} * ${c}`, a + b * c], [`(${a} + ${b}) * ${c}`, (a + b) * c], [`${a} * ${b} - ${c} * ${d}`, a * b - c * d], [`${a} + ${b} * ${c} - ${d}`, a + b * c - d], [`(${a} + ${b}) * (${c} - ${d})`, (a + b) * (c - d)], [`${a} * ${b} + ${c} ** 2`, a * b + c ** 2], [`${a} + ${b} ** 2 * ${d}`, a + b ** 2 * d]];
  const [e, v] = r.pick(forms);
  return { title: "Priorité des opérations", q: `Écris dans une variable \`r\` le résultat de l'expression ${code(e)} (respecte les priorités, ajoute les parenthèses indiquées).`, hint: "Les parenthèses d'abord, puis `**`, puis `*`, puis `+` et `-`.", starter: "", sol: `r = ${e}`, tests: T.variable("r", v) };
});
G(3, "moyenne3", 40, r => {
  const m = r.int(5, 18), d1 = r.int(-3, 3), d2 = r.int(-3, 3), a = m + d1, b = m + d2, c = 3 * m - a - b;
  return { title: "Moyenne de trois notes", q: `Calcule la **moyenne** des trois notes \`n1 = ${a}\`, \`n2 = ${b}\` et \`n3 = ${c}\` dans une variable \`moyenne\`.`, hint: "(n1 + n2 + n3) / 3 — attention aux parenthèses.", starter: `n1 = ${a}\nn2 = ${b}\nn3 = ${c}\n`, sol: `n1 = ${a}\nn2 = ${b}\nn3 = ${c}\nmoyenne = (n1 + n2 + n3) / 3`, tests: T.variable("moyenne", m, false) };
});
G(3, "heures", 50, r => {
  const m = r.int(61, 999);
  return { title: "Minutes en heures et minutes", q: `Convertis \`minutes = ${m}\` en heures entières (variable \`h\`) et minutes restantes (variable \`mn\`).`, hint: "Divise par 60 : `//` pour les heures, `%` pour le reste.", starter: `minutes = ${m}\n`, sol: `minutes = ${m}\nh = minutes // 60\nmn = minutes % 60`, tests: [...T.variable("h", jsFloorDiv(m, 60)), ...T.variable("mn", jsMod(m, 60)).slice(1)] };
});
G(3, "digits", 60, r => {
  const n = r.int(100, 999), which = r.pick(["unite", "dizaine", "centaine"]);
  const line = { unite: "n % 10", dizaine: "n // 10 % 10", centaine: "n // 100" }[which];
  const val = { unite: n % 10, dizaine: jsFloorDiv(n, 10) % 10, centaine: jsFloorDiv(n, 100) }[which];
  return { title: "Les chiffres d'un nombre", q: `Le nombre \`n = ${n}\` a trois chiffres. Récupère son chiffre des **${which === "unite" ? "unités" : which === "dizaine" ? "dizaines" : "centaines"}** dans une variable \`c\`.`, hint: "`% 10` donne le dernier chiffre ; `// 10` supprime le dernier chiffre.", starter: `n = ${n}\n`, sol: `n = ${n}\nc = ${line}`, tests: T.variable("c", val) };
});
G(3, "monnaie", 50, r => {
  const s = r.int(21, 199);
  return { title: "Rendre la monnaie", q: `Une somme de \`montant = ${s}\` euros doit être payée avec des billets de 20 € puis des pièces de 1 €. Calcule \`billets\` (nombre de billets de 20) et \`pieces\` (nombre de pièces de 1 € restantes).`, hint: "Billets : division entière par 20. Pièces : le reste.", starter: `montant = ${s}\n`, sol: `montant = ${s}\nbillets = montant // 20\npieces = montant % 20`, tests: [...T.variable("billets", jsFloorDiv(s, 20)), ...T.variable("pieces", s % 20).slice(1)] };
});
G(3, "temperature", 30, r => {
  const c = 5 * r.int(-8, 24);
  return { title: "Celsius en Fahrenheit", q: `Convertis la température \`celsius = ${c}\` en degrés Fahrenheit dans une variable \`f\` avec la formule : F = C × 9 / 5 + 32.`, hint: "`f = celsius * 9 / 5 + 32`", starter: `celsius = ${c}\n`, sol: `celsius = ${c}\nf = celsius * 9 / 5 + 32`, tests: T.variable("f", c * 9 / 5 + 32, false) };
});
G(3, "round_abs", 40, r => {
  const kind = r.pick(["abs", "round", "min", "max"]);
  if (kind === "abs") { const n = -r.int(1, 300); return { title: "Valeur absolue", q: `Avec \`n = ${n}\`, calcule la **valeur absolue** de \`n\` dans \`v\` (fonction \`abs\`).`, hint: "`abs(-5)` vaut 5.", starter: `n = ${n}\n`, sol: `n = ${n}\nv = abs(n)`, tests: T.variable("v", -n) }; }
  if (kind === "round") { const x = r.int(1, 99) + r.pick([0.25, 0.75, 0.125, 0.375, 0.6, 0.3]); const v = Math.round(x * 100) / 100; return null || { title: "Arrondir", q: `Arrondis \`x = ${x}\` à **1 chiffre après la virgule** dans \`v\` (fonction \`round(x, 1)\`).`, hint: "`round(3.14159, 2)` donne `3.14`.", starter: `x = ${x}\n`, sol: `x = ${x}\nv = round(x, 1)`, tests: T.variable("v", round1(x), false) }; }
  const a = r.int(1, 200), b = r.int(1, 200), c = r.int(1, 200);
  return { title: kind === "min" ? "Le plus petit" : "Le plus grand", q: `Avec \`a = ${a}\`, \`b = ${b}\`, \`c = ${c}\`, mets dans \`v\` le **${kind === "min" ? "plus petit" : "plus grand"}** des trois nombres (fonction \`${kind}\`).`, hint: `\`${kind}(a, b, c)\``, starter: `a = ${a}\nb = ${b}\nc = ${c}\n`, sol: `a = ${a}\nb = ${b}\nc = ${c}\nv = ${kind}(a, b, c)`, tests: T.variable("v", kind === "min" ? Math.min(a, b, c) : Math.max(a, b, c)) };
});
// arrondi « à la Python » (arrondi au pair le plus proche pour les .5 exacts)
function round1(x) { const m = x * 10, f = Math.floor(m), d = m - f; let res; if (Math.abs(d - 0.5) < 1e-9) res = f % 2 === 0 ? f : f + 1; else res = Math.round(m); return res / 10; }
G(3, "distance", 40, r => {
  const v = r.int(20, 130), t = r.int(2, 9);
  return { title: "Distance parcourue", q: `Une voiture roule à \`vitesse = ${v}\` km/h pendant \`duree = ${t}\` heures. Calcule la **distance** parcourue dans une variable \`distance\`.`, hint: "distance = vitesse × durée.", starter: `vitesse = ${v}\nduree = ${t}\n`, sol: `vitesse = ${v}\nduree = ${t}\ndistance = vitesse * duree`, tests: T.variable("distance", v * t) };
});

/* ═══════════ NIVEAU 4 : Les chaînes de caractères ═══════════ */
const SW = WORDS.filter(w => !w.includes(" ") && w.length >= 6);
G(4, "len", 50, r => { const w = r.pick(SW); return { title: "Longueur d'un mot", q: `La variable \`mot\` vaut ${code(py(w))}. Mets sa **longueur** dans une variable \`n\`.`, hint: "`len(mot)`", starter: `mot = ${py(w)}\n`, sol: `mot = ${py(w)}\nn = len(mot)`, tests: T.variable("n", [...w].length) }; });
G(4, "first_last", 50, r => { const w = r.pick(SW), first = r.chance(); const ch = first ? [...w][0] : [...w].pop(); return { title: first ? "Première lettre" : "Dernière lettre", q: `La variable \`mot\` vaut ${code(py(w))}. Mets dans \`l\` la **${first ? "première" : "dernière"} lettre** du mot.`, hint: first ? "Les indices commencent à 0 : `mot[0]`." : "`mot[-1]` est le dernier caractère.", starter: `mot = ${py(w)}\n`, sol: `mot = ${py(w)}\nl = mot[${first ? 0 : -1}]`, tests: T.variable("l", ch) }; });
G(4, "slice", 70, r => {
  const w = r.pick(SW), L = [...w].length, a = r.int(0, L - 3), b = r.int(a + 2, L);
  return { title: "Extraire un morceau", q: `La variable \`mot\` vaut ${code(py(w))}. Mets dans \`morceau\` les lettres des indices **${a} à ${b - 1}** (inclus), c'est-à-dire \`mot[${a}:${b}]\`.`, hint: "Slicing : `mot[début:fin]`, la fin est exclue.", starter: `mot = ${py(w)}\n`, sol: `mot = ${py(w)}\nmorceau = mot[${a}:${b}]`, tests: T.variable("morceau", [...w].slice(a, b).join("")) };
});
G(4, "case", 50, r => {
  const w = r.pick(SW), m = r.pick(["upper", "lower", "capitalize"]);
  const val = m === "upper" ? w.toUpperCase() : m === "lower" ? w.toUpperCase().toLowerCase() : w[0].toUpperCase() + w.slice(1);
  const given = m === "lower" ? w.toUpperCase() : w;
  return { title: "Majuscules et minuscules", q: `La variable \`mot\` vaut ${code(py(given))}. Crée \`resultat\` en ${m === "upper" ? "mettant tout en **majuscules**" : m === "lower" ? "mettant tout en **minuscules**" : "mettant seulement la **première lettre en majuscule**"} (méthode \`.${m}()\`).`, hint: `\`mot.${m}()\``, starter: `mot = ${py(given)}\n`, sol: `mot = ${py(given)}\nresultat = mot.${m}()`, tests: T.variable("resultat", val) };
});
G(4, "replace", 50, r => {
  const w = r.pick(SW.filter(x => /[aeiou]/.test(x))), c = r.pick([..."aeiou"].filter(v => w.includes(v))), n = r.pick(["*", "-", "_", "#", "@"]);
  return { title: "Remplacer des lettres", q: `La variable \`mot\` vaut ${code(py(w))}. Crée \`resultat\` en remplaçant chaque \`${c}\` par \`${n}\` (méthode \`.replace()\`).`, hint: "`mot.replace(ancien, nouveau)`", starter: `mot = ${py(w)}\n`, sol: `mot = ${py(w)}\nresultat = mot.replace(${py(c)}, ${py(n)})`, tests: T.variable("resultat", w.split(c).join(n)) };
});
G(4, "count", 40, r => {
  const w = r.pick(SW), c = r.pick([...new Set([...w])]);
  return { title: "Compter une lettre", q: `La variable \`mot\` vaut ${code(py(w))}. Mets dans \`n\` le **nombre de fois** où la lettre \`${c}\` apparaît (méthode \`.count()\`).`, hint: "`mot.count(\"e\")`", starter: `mot = ${py(w)}\n`, sol: `mot = ${py(w)}\nn = mot.count(${py(c)})`, tests: T.variable("n", [...w].filter(x => x === c).length) };
});
G(4, "reverse", 30, r => { const w = r.pick(SW); return { title: "Mot à l'envers", q: `La variable \`mot\` vaut ${code(py(w))}. Mets dans \`envers\` le mot écrit à l'envers.`, hint: "`mot[::-1]`", starter: `mot = ${py(w)}\n`, sol: `mot = ${py(w)}\nenvers = mot[::-1]`, tests: T.variable("envers", [...w].reverse().join("")) }; });
G(4, "strip", 30, r => { const w = r.pick(SW), sp = " ".repeat(r.int(1, 5)), sp2 = " ".repeat(r.int(1, 5)); return { title: "Supprimer les espaces", q: `La variable \`texte\` contient des espaces avant et après le mot. Crée \`propre\` sans ces espaces (méthode \`.strip()\`).`, hint: "`texte.strip()`", starter: `texte = ${py(sp + w + sp2)}\n`, sol: `texte = ${py(sp + w + sp2)}\npropre = texte.strip()`, tests: T.variable("propre", w) }; });
G(4, "split_count", 40, r => { const ws = r.sample(SW, r.int(2, 6)); return { title: "Compter les mots", q: `La variable \`phrase\` vaut ${code(py(ws.join(" ")))}. Mets dans \`n\` le **nombre de mots** (sépare avec \`.split()\` et compte avec \`len\`).`, hint: "`len(phrase.split())`", starter: `phrase = ${py(ws.join(" "))}\n`, sol: `phrase = ${py(ws.join(" "))}\nn = len(phrase.split())`, tests: T.variable("n", ws.length) }; });
G(4, "join", 30, r => { const ws = r.sample(SW, r.int(3, 5)), sep = r.pick(["-", ", ", " / ", "+"]); return { title: "Assembler avec join", q: `Avec la liste \`mots = ${py(ws)}\`, crée \`resultat\` en les assemblant avec ${code(sep)} entre chaque mot (méthode \`join\`).`, hint: "`\"-\".join(liste)` colle les éléments avec `-`.", starter: `mots = ${py(ws)}\n`, sol: `mots = ${py(ws)}\nresultat = ${py(sep)}.join(mots)`, tests: T.variable("resultat", ws.join(sep)) }; });
G(4, "startswith", 40, r => {
  const w = r.pick(SW), mode = r.pick(["startswith", "endswith"]), good = r.chance(), L = [...w].length, k = r.int(2, 3);
  const frag = mode === "startswith" ? (good ? [...w].slice(0, k).join("") : r.pick(["zz", "xq", "kw", "jv"])) : (good ? [...w].slice(L - k).join("") : r.pick(["zz", "xq", "kw", "jv"]));
  const val = mode === "startswith" ? w.startsWith(frag) : w.endsWith(frag);
  return { title: "Début ou fin d'un mot", q: `La variable \`mot\` vaut ${code(py(w))}. Mets dans \`rep\` le booléen qui dit si le mot ${mode === "startswith" ? "**commence** par" : "**finit** par"} ${code(frag)} (méthode \`.${mode}()\`).`, hint: `\`mot.${mode}("...")\` renvoie \`True\` ou \`False\`.`, starter: `mot = ${py(w)}\n`, sol: `mot = ${py(w)}\nrep = mot.${mode}(${py(frag)})`, tests: T.variable("rep", val) };
});
G(4, "step", 40, r => { const w = r.pick(SW), pos = r.chance(); return { title: "Une lettre sur deux", q: `La variable \`mot\` vaut ${code(py(w))}. Mets dans \`resultat\` ${pos ? "les lettres des indices **pairs** (0, 2, 4…)" : "les lettres des indices **impairs** (1, 3, 5…)"}.`, hint: pos ? "`mot[::2]`" : "`mot[1::2]`", starter: `mot = ${py(w)}\n`, sol: `mot = ${py(w)}\nresultat = mot[${pos ? "::2" : "1::2"}]`, tests: T.variable("resultat", [...w].filter((_, i) => (i % 2 === 0) === pos).join("")) }; });
G(4, "frame", 30, r => { const w = r.pick(SW), c = r.pick(["*", "=", "-", "#"]); const bar = c.repeat([...w].length + 4); return { title: "Encadrer un mot", q: `La variable \`mot\` vaut ${code(py(w))}. Affiche-le encadré sur trois lignes : une ligne de \`${c}\` de longueur \`len(mot) + 4\`, puis \`${c} mot ${c}\`, puis la même ligne de \`${c}\`.`, hint: "Calcule la ligne avec `c * (len(mot) + 4)`.", starter: `mot = ${py(w)}\n`, sol: `mot = ${py(w)}\nligne = ${py(c)} * (len(mot) + 4)\nprint(ligne)\nprint(${py(c + " ")} + mot + ${py(" " + c)})\nprint(ligne)`, tests: T.out([bar, `${c} ${w} ${c}`, bar]) }; });

/* ═══════════ NIVEAU 5 : Les conditions ═══════════ */
G(5, "majeur_seuil", 40, r => { const s = r.int(10, 30), f = r.pick(["peut_entrer", "est_assez_grand", "autorise", "accepte"]); const tests = T.fn(f, [[[s], true], [[s - 1], false], [[s + r.int(1, 30)], true], [[r.int(1, s - 2)], false], [[0], false]]); return { title: "Seuil d'âge", q: `Écris \`${f}(age)\` qui renvoie \`True\` si \`age\` est supérieur ou égal à **${s}**, sinon \`False\`.`, hint: "Une comparaison renvoie un booléen : `return age >= ...`.", starter: defStarter(f, ["age"]), sol: `def ${f}(age):\n    return age >= ${s}`, tests }; });
G(5, "signe", 20, r => { const a = r.pick(["positif", "négatif", "nul"]); return { title: "Signe d'un nombre", q: `Écris \`signe(n)\` qui renvoie \`"positif"\` si n > 0, \`"négatif"\` si n < 0 et \`"nul"\` si n vaut 0.`, hint: "`if` / `elif` / `else`.", starter: defStarter("signe", ["n"]), sol: `def signe(n):\n    if n > 0:\n        return "positif"\n    elif n < 0:\n        return "négatif"\n    return "nul"`, tests: T.fn("signe", [[[r.int(1, 99)], "positif"], [[-r.int(1, 99)], "négatif"], [[0], "nul"], [[1], "positif"], [[-1], "négatif"]]) }; });
G(5, "multiple", 40, r => { const k = r.int(2, 12); const f = "est_multiple"; const vs = [k, k * r.int(2, 9), k * r.int(10, 20), 0, k + 1, k * 3 + 1, k - 1 || 1]; return { title: `Multiple de ${k}`, q: `Écris \`${f}(n)\` qui renvoie \`True\` si \`n\` est un **multiple de ${k}**, sinon \`False\`.`, hint: `\`n % ${k} == 0\``, starter: defStarter(f, ["n"]), sol: `def ${f}(n):\n    return n % ${k} == 0`, tests: T.fn(f, vs.map(v => [[v], v % k === 0])) }; });
G(5, "pair_impair", 40, r => { const a = r.pick(["pair", "impair"]); const [x, y] = r.sample([["pair", "impair"], ["P", "I"], ["even", "odd"], ["oui", "non"]], 1)[0]; const vs = [0, 1, r.int(2, 99), r.int(100, 999), -3, -8]; return { title: "Parité", q: `Écris \`parite(n)\` qui renvoie \`"${x}"\` si \`n\` est pair et \`"${y}"\` s'il est impair.`, hint: "Un nombre est pair si `n % 2 == 0`.", starter: defStarter("parite", ["n"]), sol: `def parite(n):\n    if n % 2 == 0:\n        return ${py(x)}\n    return ${py(y)}`, tests: T.fn("parite", vs.map(v => [[v], v % 2 === 0 ? x : y])) }; });
G(5, "plus_grand2", 30, r => { const f = r.pick(["le_plus_grand", "maximum2", "gagnant"]); const cs = [[3, 8], [9, 2], [5, 5], [-1, -7], [0, 4], [r.int(1, 99), r.int(1, 99)]]; return { title: "Le plus grand de deux", q: `Écris \`${f}(a, b)\` qui renvoie le plus grand des deux nombres, **sans** utiliser \`max\`.`, hint: "`if a > b: return a`", starter: defStarter(f, ["a", "b"]), sol: `def ${f}(a, b):\n    if a >= b:\n        return a\n    return b`, tests: T.fn(f, cs.map(([a, b]) => [[a, b], Math.max(a, b)])) }; });
G(5, "mention", 50, r => {
  const t = [r.int(5, 8) * 2, r.int(11, 13), r.int(14, 15), r.int(16, 17)].sort((a, b) => a - b).filter((v, i, ar) => ar.indexOf(v) === i);
  if (t.length < 4) return null;
  const [t1, t2, t3, t4] = t, labs = r.pick([["Insuffisant", "Passable", "Bien", "Très bien", "Excellent"], ["D", "C", "B", "A", "A+"], ["Non", "Presque", "Oui", "Bravo", "Génial"]]);
  const f = (n) => n >= t4 ? labs[4] : n >= t3 ? labs[3] : n >= t2 ? labs[2] : n >= t1 ? labs[1] : labs[0];
  const vs = [0, t1 - 1, t1, t2 - 1, t2, t3 - 1, t3, t4 - 1, t4, 20];
  return { title: "Échelle de notes", q: `Écris \`appreciation(note)\` : \`${py(labs[4])}\` si note ≥ ${t4}, \`${py(labs[3])}\` si ≥ ${t3}, \`${py(labs[2])}\` si ≥ ${t2}, \`${py(labs[1])}\` si ≥ ${t1}, sinon \`${py(labs[0])}\`.`, hint: "Teste du plus grand seuil au plus petit avec `elif`.", starter: defStarter("appreciation", ["note"]), sol: `def appreciation(note):\n    if note >= ${t4}:\n        return ${py(labs[4])}\n    elif note >= ${t3}:\n        return ${py(labs[3])}\n    elif note >= ${t2}:\n        return ${py(labs[2])}\n    elif note >= ${t1}:\n        return ${py(labs[1])}\n    return ${py(labs[0])}`, tests: T.fn("appreciation", vs.map(v => [[v], f(v)])) };
});
G(5, "tarif", 50, r => {
  const a1 = r.int(3, 6), a2 = r.int(12, 18), a3 = r.int(60, 70), p0 = 0, p1 = r.int(3, 6), p2 = r.int(8, 12), p3 = r.int(5, 7);
  const f = a => a < a1 ? p0 : a < a2 ? p1 : a < a3 ? p2 : p3;
  const vs = [0, a1 - 1, a1, a2 - 1, a2, 30, a3 - 1, a3, 90];
  return { title: "Tarif selon l'âge", q: `Un cinéma applique ces tarifs : moins de ${a1} ans **gratuit** (0), de ${a1} à ${a2 - 1} ans **${p1} €**, de ${a2} à ${a3 - 1} ans **${p2} €**, ${a3} ans et plus **${p3} €**. Écris \`tarif(age)\` qui renvoie le prix.`, hint: "Enchaîne `if age < ...`, `elif age < ...`.", starter: defStarter("tarif", ["age"]), sol: `def tarif(age):\n    if age < ${a1}:\n        return 0\n    elif age < ${a2}:\n        return ${p1}\n    elif age < ${a3}:\n        return ${p2}\n    return ${p3}`, tests: T.fn("tarif", vs.map(v => [[v], f(v)])) };
});
G(5, "bissextile", 20, r => ({ title: "Année bissextile", q: "Écris `bissextile(annee)` qui renvoie `True` si l'année est bissextile : divisible par 4, sauf si elle est divisible par 100 sans l'être par 400.", hint: "Teste d'abord `annee % 400 == 0`, puis `% 100`, puis `% 4`.", starter: defStarter("bissextile", ["annee"]), sol: "def bissextile(annee):\n    if annee % 400 == 0:\n        return True\n    if annee % 100 == 0:\n        return False\n    return annee % 4 == 0", tests: T.fn("bissextile", [2000, 1900, 2024, 2023, 2100, 1996, 2400, 2001].map(a => [[a], (a % 400 === 0) || (a % 4 === 0 && a % 100 !== 0)])) }));
G(5, "triangle", 30, r => { const f = "triangle_valide"; const cs = [[3, 4, 5], [1, 2, 3], [5, 5, 5], [2, 2, 5], [10, 6, 5], [1, 1, 1], [7, 3, 3], [r.int(2, 20), r.int(2, 20), r.int(2, 20)]]; const ok = ([a, b, c]) => a + b > c && a + c > b && b + c > a; return { title: "Triangle constructible", q: "Écris `triangle_valide(a, b, c)` qui renvoie `True` si on peut construire un triangle avec ces trois longueurs : chaque côté doit être **strictement plus petit** que la somme des deux autres.", hint: "Trois comparaisons reliées par `and`.", starter: defStarter(f, ["a", "b", "c"]), sol: `def ${f}(a, b, c):\n    return a + b > c and a + c > b and b + c > a`, tests: T.fn(f, cs.map(c => [c, ok(c)])) }; });
G(5, "jour", 20, r => { const jours = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]; const bad = r.pick(["numéro invalide", "inconnu", "erreur"]); return { title: "Numéro du jour", q: `Écris \`jour(n)\` qui renvoie le nom du jour de la semaine : 1 → \`"lundi"\`, … 7 → \`"dimanche"\`. Pour tout autre nombre, renvoie \`"${bad}"\`.`, hint: "Une série de `if n == 1:` / `elif n == 2:` …", starter: defStarter("jour", ["n"]), sol: "def jour(n):\n" + jours.map((j, i) => `    ${i ? "elif" : "if"} n == ${i + 1}:\n        return ${py(j)}\n`).join("") + `    return ${py(bad)}`, tests: T.fn("jour", [1, 2, 3, 4, 5, 6, 7, 0, 8, -1].map(n => [[n], n >= 1 && n <= 7 ? jours[n - 1] : bad])) }; });
G(5, "ecart", 40, r => { const k = r.int(2, 20); const f = "compare"; const vs = [[3, 3], [5, 2], [1, 9], [r.int(1, 50), r.int(1, 50)], [0, 0], [-4, 2]]; return { title: "Comparer deux nombres", q: `Écris \`comparer(a, b)\` qui renvoie \`"égal"\` si a == b, \`"a est plus grand"\` si a > b, et \`"b est plus grand"\` sinon.`, hint: "Trois cas : `if`, `elif`, `else`.", starter: defStarter("comparer", ["a", "b"]), sol: "def comparer(a, b):\n    if a == b:\n        return \"égal\"\n    elif a > b:\n        return \"a est plus grand\"\n    return \"b est plus grand\"", tests: T.fn("comparer", vs.map(([a, b]) => [[a, b], a === b ? "égal" : a > b ? "a est plus grand" : "b est plus grand"])) }; });
G(5, "remise", 40, r => { const seuil = r.int(5, 20) * 10, pct = r.pick([5, 10, 15, 20, 25]); const f = m => m >= seuil ? m * (100 - pct) / 100 : m; const ms = [0, seuil - 1, seuil, seuil + 40, 500, 40]; return { title: "Remise sur achat", q: `Une boutique offre **${pct} %** de remise si le montant atteint au moins **${seuil} €**. Écris \`a_payer(montant)\` qui renvoie la somme à payer.`, hint: `Remise : \`montant * ${100 - pct} / 100\`.`, starter: defStarter("a_payer", ["montant"]), sol: `def a_payer(montant):\n    if montant >= ${seuil}:\n        return montant * ${100 - pct} / 100\n    return montant`, tests: T.fn("a_payer", ms.map(m => [[m], f(m)]), true) }; });
