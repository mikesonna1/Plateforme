// Familles supplémentaires (niveaux 5 à 10) : énoncés vraiment différents grâce aux paramètres.
const { py, tuple, T, G, defStarter, jsFloorDiv, jsMod, NAMES, WORDS } = require("./lib");
const code = s => "`" + s + "`";
const randList = (r, lo, hiN, a, b) => Array.from({ length: r.int(lo, hiN) }, () => r.int(a, b));
const SW = WORDS.filter(w => !w.includes(" ") && w.length >= 5);
const fdef = (name, params, body) => ({ starter: defStarter(name, params), sol: `def ${name}(${params.join(", ")}):\n${body.split("\n").map(l => "    " + l).join("\n")}` });
const FOR = T.uses("\\bfor\\b", "Tu utilises une boucle for");
const WHILE = T.uses("\\bwhile\\b", "Tu utilises une boucle while");
const sum = l => l.reduce((a, b) => a + b, 0);

/* ═══════════ NIVEAU 5 ═══════════ */
const TIER_CTX = [["frais_port", "poids", "kg", "un colis"], ["tarif_parking", "duree", "heures", "un stationnement"], ["prix_bus", "distance", "km", "un trajet en bus"], ["tarif_piscine", "age", "ans", "une entrée à la piscine"], ["cout_sms", "longueur", "caractères", "un SMS"], ["prix_photocopie", "pages", "pages", "des photocopies"], ["tarif_taxi", "distance", "km", "une course en taxi"], ["amende", "exces", "km/h d'excès", "une amende"], ["prix_cantine", "revenu", "centaines d'euros de revenu", "un repas à la cantine"], ["cout_energie", "consommation", "kWh", "une facture d'énergie"], ["prix_billet", "distance", "centaines de km", "un billet de train"]];
G(5, "tiers3", 130, r => {
  const [f, p, u, th] = r.pick(TIER_CTX), t1 = r.int(2, 20), t2 = t1 + r.int(3, 30), a = r.int(1, 9), b = a + r.int(1, 9), c = b + r.int(1, 9);
  const g = v => v < t1 ? a : v < t2 ? b : c;
  return { title: "Tarif par paliers", q: `Pour ${th}, le prix dépend de \`${p}\` (en ${u}) : **${a} €** si \`${p}\` < ${t1}, **${b} €** si \`${p}\` < ${t2}, **${c} €** sinon. Écris \`${f}(${p})\`.`, hint: "Teste les seuils du plus petit au plus grand avec `if` / `elif` / `else`.", starter: defStarter(f, [p]), sol: `def ${f}(${p}):\n    if ${p} < ${t1}:\n        return ${a}\n    elif ${p} < ${t2}:\n        return ${b}\n    return ${c}`, tests: T.fn(f, [0, t1 - 1, t1, t2 - 1, t2, t2 + 50].map(v => [[v], g(v)])) };
});
G(5, "fizz_perso", 110, r => {
  const k1 = r.int(2, 6), k2 = r.int(3, 9); if (k1 === k2) return null;
  const [w1, w2] = r.pick([["Tic", "Tac"], ["Ping", "Pong"], ["Zig", "Zag"], ["Bip", "Bop"], ["Hop", "Hey"], ["Fizz", "Buzz"], ["Cro", "Coa"]]);
  const f = n => (n % k1 === 0 && n % k2 === 0) ? w1 + w2 : n % k1 === 0 ? w1 : n % k2 === 0 ? w2 : n;
  const vs = [k1, k2, k1 * k2, 1, 2 * k1 * k2, k1 + 1, k2 + 1, r.int(1, 99)];
  return { title: "Jeu à la FizzBuzz", q: `Écris \`jeu(n)\` : renvoie \`"${w1 + w2}"\` si \`n\` est multiple de **${k1} et ${k2}**, \`"${w1}"\` s'il est multiple de ${k1} seulement, \`"${w2}"\` s'il est multiple de ${k2} seulement, sinon \`n\` lui-même.`, hint: "Teste d'abord le cas « les deux ».", ...fdef("jeu", ["n"], `if n % ${k1} == 0 and n % ${k2} == 0:\n    return ${py(w1 + w2)}\nif n % ${k1} == 0:\n    return ${py(w1)}\nif n % ${k2} == 0:\n    return ${py(w2)}\nreturn n`), tests: T.fn("jeu", vs.map(n => [[n], f(n)])) };
});
G(5, "signe_affine", 60, r => {
  const a = r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), x0 = r.int(-9, 9), b = -a * x0, labs = r.pick([["positif", "négatif", "nul"], ["+", "-", "0"], ["plus", "moins", "zéro"], ["haut", "bas", "milieu"]]);
  const f = n => { const v = a * n + b; return v > 0 ? labs[0] : v < 0 ? labs[1] : labs[2]; };
  return { title: "Signe d'une expression", q: `Écris \`etat(n)\` qui calcule \`v = ${a} * n + (${b})\` puis renvoie \`${py(labs[0])}\` si \`v\` > 0, \`${py(labs[1])}\` si \`v\` < 0 et \`${py(labs[2])}\` si \`v\` = 0.`, hint: "Calcule `v` d'abord, puis teste-le.", ...fdef("etat", ["n"], `v = ${a} * n + (${b})\nif v > 0:\n    return ${py(labs[0])}\nelif v < 0:\n    return ${py(labs[1])}\nreturn ${py(labs[2])}`), tests: T.fn("etat", [x0, x0 - 1, x0 + 1, 0, 20, -20].map(n => [[n], f(n)])) };
});
G(5, "zone3", 90, r => {
  const a = r.int(-10, 20), b = a + r.int(3, 30), labs = r.pick([["bas", "moyen", "haut"], ["froid", "tempéré", "chaud"], ["faible", "normal", "élevé"], ["court", "moyen", "long"], ["petit", "moyen", "grand"], ["lent", "correct", "rapide"]]);
  const f = x => x < a ? labs[0] : x <= b ? labs[1] : labs[2];
  return { title: "Classer une valeur", q: `Écris \`niveau(x)\` : \`${py(labs[0])}\` si \`x\` < ${a}, \`${py(labs[1])}\` si ${a} ≤ \`x\` ≤ ${b}, \`${py(labs[2])}\` si \`x\` > ${b}.`, hint: "Attention aux bornes : `<` ou `<=` ?", ...fdef("niveau", ["x"], `if x < ${a}:\n    return ${py(labs[0])}\nif x <= ${b}:\n    return ${py(labs[1])}\nreturn ${py(labs[2])}`), tests: T.fn("niveau", [a - 1, a, a + 1, b - 1, b, b + 1, 1000].map(x => [[x], f(x)])) };
});

/* ═══════════ NIVEAU 6 ═══════════ */
G(6, "dans_zone", 110, r => {
  const a = r.int(-20, 10), b = a + r.int(2, 10), c = b + r.int(2, 10), d = c + r.int(2, 12);
  const f = x => (x >= a && x <= b) || (x >= c && x <= d);
  return { title: "Deux intervalles", q: `Écris \`dans_zone(x)\` qui renvoie \`True\` si \`x\` est dans l'intervalle **[${a}, ${b}]** **ou** dans l'intervalle **[${c}, ${d}]** (bornes incluses).`, hint: "Deux comparaisons chaînées reliées par `or`.", ...fdef("dans_zone", ["x"], `return ${a} <= x <= ${b} or ${c} <= x <= ${d}`), tests: T.fn("dans_zone", [a - 1, a, b, b + 1, c - 1, c, d, d + 1, Math.floor((a + b) / 2)].map(x => [[x], f(x)])) };
});
G(6, "formule3", 130, r => {
  const X = r.int(1, 9), Y = r.int(1, 9), K = r.int(2, 5), S = r.int(5, 15), Z = r.int(0, 9);
  const P = r.pick([
    [`a > ${X} ET b > ${Y}`, (a, b, c) => a > X && b > Y, `a > ${X} and b > ${Y}`],
    [`a > ${X} OU b > ${Y}`, (a, b, c) => a > X || b > Y, `a > ${X} or b > ${Y}`],
    [`a est multiple de ${K} ET b n'est PAS multiple de ${K}`, (a, b, c) => a % K === 0 && b % K !== 0, `a % ${K} == 0 and b % ${K} != 0`],
    [`a == b OU a + b == ${S}`, (a, b, c) => a === b || a + b === S, `a == b or a + b == ${S}`],
    [`(a > ${X} ET b > ${Y}) OU c == ${Z}`, (a, b, c) => (a > X && b > Y) || c === Z, `(a > ${X} and b > ${Y}) or c == ${Z}`],
    [`PAS (a > ${X}) ET (b > ${Y} OU c > ${Y})`, (a, b, c) => !(a > X) && (b > Y || c > Y), `not (a > ${X}) and (b > ${Y} or c > ${Y})`],
    [`a < b < c`, (a, b, c) => a < b && b < c, `a < b < c`],
    [`a + b > c ET b + c > a ET a + c > b`, (a, b, c) => a + b > c && b + c > a && a + c > b, `a + b > c and b + c > a and a + c > b`],
    [`exactement deux des trois nombres sont supérieurs à ${X}`, (a, b, c) => [a, b, c].filter(v => v > X).length === 2, `[a, b, c].count(True) == 2` ]
  ]);
  if (P[0].startsWith("exactement")) return null;
  const cases = Array.from({ length: 9 }, () => [r.int(0, 12), r.int(0, 12), r.int(0, 12)]); cases.push([X + 1, Y + 1, Z], [X, Y, Z], [K, K + 1, S]);
  return { title: "Condition composée", q: `Écris \`condition(a, b, c)\` qui renvoie \`True\` quand : **${P[0]}**. (ET = \`and\`, OU = \`or\`, PAS = \`not\`.)`, hint: "Traduis la phrase en une seule expression avec `and`, `or`, `not` et des parenthèses si besoin.", ...fdef("condition", ["a", "b", "c"], `return ${P[2]}`), tests: T.fn("condition", cases.map(c => [c, !!P[1](...c)])) };
});
G(6, "parc", 90, r => {
  const T1 = r.int(110, 150), A1 = r.int(10, 16), mode = r.int(0, 2);
  const f = (age, taille, acc) => mode === 0 ? (taille >= T1 || (age >= A1 && acc)) : mode === 1 ? (taille >= T1 && age >= A1) : (taille >= T1 || age >= A1);
  const txt = ["la taille est au moins **" + T1 + " cm**, **ou** l'âge est au moins **" + A1 + " ans** et le visiteur est accompagné", "la taille est au moins **" + T1 + " cm** **et** l'âge est au moins **" + A1 + " ans**", "la taille est au moins **" + T1 + " cm** **ou** l'âge est au moins **" + A1 + " ans**"][mode];
  const py_ = ["taille >= " + T1 + " or (age >= " + A1 + " and accompagne)", "taille >= " + T1 + " and age >= " + A1, "taille >= " + T1 + " or age >= " + A1][mode];
  const cs = [[A1, T1, true], [A1 - 1, T1 - 1, true], [A1, T1 - 1, false], [A1 - 2, T1, false], [30, 100, false], [8, 180, true], [A1 + 3, T1 - 5, true]];
  return { title: "Règles d'une attraction", q: `Dans un parc d'attractions, un visiteur peut monter si ${txt}. Écris \`peut_monter(age, taille, accompagne)\` (\`accompagne\` est un booléen).`, hint: "Traduis chaque « et » par `and` et chaque « ou » par `or`.", ...fdef("peut_monter", ["age", "taille", "accompagne"], `return ${py_}`), tests: T.fn("peut_monter", cs.map(([a, t, c]) => [[a, t, c], !!f(a, t, c)])) };
});
G(6, "char_class", 40, r => {
  const labs = r.pick([["voyelle", "consonne", "chiffre", "autre"], ["V", "C", "N", "?"], ["a", "b", "c", "d"], ["lettre voyelle", "lettre consonne", "nombre", "symbole"]]);
  const cl = ch => "aeiouy".includes(ch) ? labs[0] : (/[a-z]/.test(ch) ? labs[1] : (/[0-9]/.test(ch) ? labs[2] : labs[3]));
  return { title: "Classer un caractère", q: `Écris \`categorie(c)\` pour un caractère \`c\` : \`${py(labs[0])}\` si c'est une voyelle minuscule (\`aeiouy\`), \`${py(labs[1])}\` si c'est une autre lettre minuscule non accentuée, \`${py(labs[2])}\` si c'est un chiffre, \`${py(labs[3])}\` sinon.`, hint: "Utilise `c in \"aeiouy\"` et des comparaisons du type `\"a\" <= c <= \"z\"`.", ...fdef("categorie", ["c"], `if c in "aeiouy":\n    return ${py(labs[0])}\nif "a" <= c <= "z":\n    return ${py(labs[1])}\nif "0" <= c <= "9":\n    return ${py(labs[2])}\nreturn ${py(labs[3])}`), tests: T.fn("categorie", [..."aebz09 -Z!y"].map(c => [[c], cl(c)])) };
});

/* ═══════════ NIVEAU 7 ═══════════ */
G(7, "multiples_range", 110, r => {
  const k = r.int(2, 12), a = r.int(0, 30), b = a + r.int(2 * k, 8 * k); const arr = []; for (let i = a; i <= b; i++) if (i % k === 0) arr.push(String(i)); if (arr.length < 2) return null;
  return { title: "Multiples dans une plage", q: `Affiche tous les **multiples de ${k}** compris entre **${a}** et **${b}** (inclus), un par ligne, dans l'ordre croissant.`, hint: `Parcours \`range(${a}, ${b + 1})\` et teste \`i % ${k} == 0\`.`, starter: "", sol: `for i in range(${a}, ${b + 1}):\n    if i % ${k} == 0:\n        print(i)`, tests: [...T.out(arr), ...FOR] };
});
G(7, "somme_mult", 90, r => {
  const k = r.int(2, 11);
  return { title: "Somme de multiples", q: `Écris \`somme_multiples(n)\` qui renvoie la somme de tous les **multiples de ${k}** entre 1 et \`n\` (inclus).`, hint: `Accumulateur + \`if i % ${k} == 0\`.`, ...fdef("somme_multiples", ["n"], `total = 0\nfor i in range(1, n + 1):\n    if i % ${k} == 0:\n        total += i\nreturn total`), tests: [...T.fn("somme_multiples", [0, k, 2 * k + 1, 50, 100, r.int(10, 400)].map(n => [[n], (() => { let s = 0; for (let i = 1; i <= n; i++) if (i % k === 0) s += i; return s; })()])), ...FOR] };
});
G(7, "somme_puiss", 40, r => {
  const p = r.int(2, 4), q = r.pick(["i", "x", "k"]);
  return { title: "Somme de puissances", q: `Écris \`somme_puissances(n)\` qui renvoie la somme des **puissances ${p}** des entiers de 1 à \`n\` : 1^${p} + 2^${p} + … + n^${p}.`, hint: `\`total += i ** ${p}\``, ...fdef("somme_puissances", ["n"], `total = 0\nfor i in range(1, n + 1):\n    total += i ** ${p}\nreturn total`), tests: [...T.fn("somme_puissances", [0, 1, 3, 5, 10, r.int(11, 30)].map(n => [[n], (() => { let s = 0; for (let i = 1; i <= n; i++) s += i ** p; return s; })()])), ...FOR] };
});
G(7, "suite_print", 70, r => {
  const u0 = r.int(1, 9), q = r.int(2, 4), a = r.int(0, 6), n = r.int(4, 9); const arr = []; let u = u0; for (let i = 0; i < n; i++) { arr.push(String(u)); u = u * q + a; }
  return { title: "Afficher une suite", q: `Une suite commence à **${u0}** et chaque terme vaut le précédent multiplié par **${q}**, plus **${a}**. Affiche ses **${n} premiers termes** (en commençant par ${u0}), un par ligne.`, hint: "Une variable `u` mise à jour à chaque tour : `u = u * q + a`.", starter: "", sol: `u = ${u0}\nfor _ in range(${n}):\n    print(u)\n    u = u * ${q} + ${a}`, tests: [...T.out(arr), ...FOR] };
});
G(7, "lettres_parmi", 60, r => {
  const set = r.sample([..."abcdefghijklmnopqrstuvwxyz"], r.int(3, 6)).join(""); const ts = [r.pick(SW), r.pick(SW), r.pick(SW), "", set];
  return { title: "Compter des lettres choisies", q: `Écris \`compter_parmi(texte)\` qui renvoie combien de lettres du texte (en minuscules) appartiennent à l'ensemble **${code(set)}**.`, hint: `\`for c in texte.lower():\` puis \`if c in ${py(set)}:\`.`, ...fdef("compter_parmi", ["texte"], `n = 0\nfor c in texte.lower():\n    if c in ${py(set)}:\n        n += 1\nreturn n`), tests: [...T.fn("compter_parmi", ts.map(t => [[t], [...t.toLowerCase()].filter(c => set.includes(c)).length])), ...FOR] };
});
G(7, "rect_etoiles", 40, r => {
  const h = r.int(2, 7), w = r.int(3, 12), c = r.pick(["*", "#", "+", "o"]);
  return { title: "Rectangle de symboles", q: `Affiche un rectangle de **${h} lignes** et **${w} colonnes** rempli du symbole \`${c}\`.`, hint: `Répète ${h} fois \`print(${py(c)} * ${w})\`.`, starter: "", sol: `for _ in range(${h}):\n    print(${py(c)} * ${w})`, tests: [...T.out(Array(h).fill(c.repeat(w))), ...FOR] };
});

/* ═══════════ NIVEAU 8 ═══════════ */
G(8, "premier_mult", 70, r => {
  const k = r.int(3, 17), f = n => (Math.floor(n / k) + 1) * k;
  return { title: "Premier multiple supérieur", q: `Écris \`prochain(n)\` qui renvoie le **plus petit multiple de ${k} strictement supérieur à \`n\`** (n ≥ 0). Utilise une boucle \`while\`.`, hint: "Pars de `n + 1` et avance tant que ce n'est pas un multiple.", ...fdef("prochain", ["n"], `m = n + 1\nwhile m % ${k} != 0:\n    m += 1\nreturn m`), tests: [...T.fn("prochain", [0, k - 1, k, k + 1, 10 * k, r.int(1, 300)].map(n => [[n], f(n)])), ...WHILE] };
});
G(8, "puiss_base", 50, r => {
  const b = r.int(3, 9), f = n => { let e = 0, p = 1; while (p <= n) { p *= b; e++; } return e; };
  return { title: "Première puissance qui dépasse", q: `Écris \`exposant(n)\` qui renvoie le plus petit entier \`e ≥ 0\` tel que **${b}^e > n**. Utilise \`while\`.`, hint: "Multiplie par la base à chaque tour et compte.", ...fdef("exposant", ["n"], `e = 0\np = 1\nwhile p <= n:\n    p *= ${b}\n    e += 1\nreturn e`), tests: [...T.fn("exposant", [0, 1, b - 1, b, 100, 5000, r.int(1, 99999)].map(n => [[n], f(n)])), ...WHILE] };
});
G(8, "fois_divisible", 50, r => {
  const k = r.int(2, 9), f = n => { let c = 0; while (n % k === 0) { n /= k; c++; } return c; };
  return { title: "Diviser par k", q: `Écris \`fois(n)\` qui renvoie combien de fois on peut diviser l'entier \`n > 0\` par **${k}** en restant entier (ex. avec k = 2 : 40 → 3).`, hint: `\`while n % ${k} == 0:\` divise et compte.`, ...fdef("fois", ["n"], `c = 0\nwhile n % ${k} == 0:\n    n //= ${k}\n    c += 1\nreturn c`), tests: [...T.fn("fois", [1, k, k * k, k ** 3, 7, 2 * k ** 4, r.int(1, 999)].map(n => [[n], f(n)])), ...WHILE] };
});
G(8, "saisie_agg", 140, r => {
  const sent = r.pick([0, -1, 999]), ns = Array.from({ length: r.int(2, 7) }, () => r.int(1, 60)), agg = r.pick(["somme", "nombre", "maximum", "minimum", "somme des carrés", "moyenne entière"]);
  const val = { "somme": sum(ns), "nombre": ns.length, "maximum": Math.max(...ns), "minimum": Math.min(...ns), "somme des carrés": ns.reduce((a, b) => a + b * b, 0), "moyenne entière": Math.floor(sum(ns) / ns.length) }[agg];
  const body = { "somme": "res = 0\nwhile n != SENT:\n    res += n\n    n = int(input())\nprint(res)", "nombre": "res = 0\nwhile n != SENT:\n    res += 1\n    n = int(input())\nprint(res)", "maximum": "res = n\nwhile n != SENT:\n    if n > res:\n        res = n\n    n = int(input())\nprint(res)", "minimum": "res = n\nwhile n != SENT:\n    if n < res:\n        res = n\n    n = int(input())\nprint(res)", "somme des carrés": "res = 0\nwhile n != SENT:\n    res += n * n\n    n = int(input())\nprint(res)", "moyenne entière": "total = 0\ncompte = 0\nwhile n != SENT:\n    total += n\n    compte += 1\n    n = int(input())\nprint(total // compte)" }[agg].replace(/SENT/g, String(sent));
  return { title: "Lire jusqu'à un signal", q: `Le programme lit des entiers avec \`input()\` **jusqu'à ce que la valeur ${sent} soit saisie** (ce signal d'arrêt n'est pas pris en compte), puis affiche la **${agg}** des nombres lus. Saisies utilisées pour tester : \`${[...ns, sent].join(", ")}\`.`, hint: "Lis un premier nombre avant la boucle, puis relis à la fin de chaque tour.", inputs: [...ns, sent].map(String), starter: "", sol: "n = int(input())\n" + body, tests: [["La bonne valeur est affichée en dernière ligne", `assert __stdout__.strip().split('\\n')[-1].strip() == ${py(String(val))}, "Dernière ligne : " + repr(__stdout__.strip().split('\\n')[-1])`], ...WHILE] };
});
G(8, "suite_depasse", 90, r => {
  const u0 = r.int(1, 6), q = r.int(2, 3), a = r.int(0, 5);
  const f = L => { let u = u0, k = 0; while (u <= L) { u = u * q + a; k++; } return k; };
  return { title: "Une suite qui dépasse une limite", q: `Une suite démarre à **${u0}** et chaque terme vaut le précédent × **${q}** + **${a}**. Écris \`etapes(limite)\` qui renvoie le nombre d'étapes nécessaires pour que le terme **dépasse strictement** \`limite\` (0 si le premier terme la dépasse déjà).`, hint: "Boucle `while u <= limite:` et compteur.", ...fdef("etapes", ["limite"], `u = ${u0}\nk = 0\nwhile u <= limite:\n    u = u * ${q} + ${a}\n    k += 1\nreturn k`), tests: [...T.fn("etapes", [0, u0, u0 + 1, 50, 1000, r.int(100, 100000)].map(L => [[L], f(L)])), ...WHILE] };
});
G(8, "chiffre_apparait", 40, r => {
  const d = r.int(1, 9), f = n => String(n).split("").filter(c => +c === d).length;
  return { title: "Compter un chiffre", q: `Écris \`occurrences(n)\` qui renvoie combien de fois le chiffre **${d}** apparaît dans l'écriture de l'entier \`n ≥ 0\` — sans convertir en texte, avec \`% 10\`, \`// 10\` et \`while\`.`, hint: "Examine le dernier chiffre puis supprime-le.", ...fdef("occurrences", ["n"], `c = 0\nwhile n > 0:\n    if n % 10 == ${d}:\n        c += 1\n    n //= 10\nreturn c`), tests: [...T.fn("occurrences", [0, d, d * 11, 1234567, 90909, 5050505, r.int(10, 99999)].map(n => [[n], f(n)])), ...WHILE] };
});

/* ═══════════ NIVEAU 9 ═══════════ */
G(9, "filtre_seuil", 110, r => {
  const s = r.int(3, 40), op = r.pick([">", ">=", "<", "<="]), nm = r.pick(["garder", "filtrer", "selection", "retenir", "tri_valeurs"]), cmp = { ">": (x) => x > s, ">=": (x) => x >= s, "<": (x) => x < s, "<=": (x) => x <= s }[op];
  const ls = [randList(r, 5, 10, 0, 60), [], [s], [s - 1, s, s + 1]];
  return { title: "Filtrer selon un seuil", q: `Écris \`${nm}(liste)\` qui renvoie une **nouvelle liste** des éléments \`x\` tels que \`x ${op} ${s}\`, dans le même ordre.`, hint: "Crée une liste vide, parcours et `append`.", ...fdef(nm, ["liste"], `res = []\nfor x in liste:\n    if x ${op} ${s}:\n        res.append(x)\nreturn res`), tests: T.fn(nm, ls.map(l => [[l], l.filter(cmp)])) };
});
G(9, "filtre_mult", 50, r => {
  const k = r.int(2, 9), ls = [randList(r, 6, 12, 0, 60), [], [k], [k * 2, k * 2 + 1]];
  return { title: "Garder les multiples", q: `Écris \`multiples_de_k(liste)\` qui renvoie la liste des éléments qui sont **multiples de ${k}**.`, hint: `\`x % ${k} == 0\``, ...fdef("multiples_de_k", ["liste"], `return [x for x in liste if x % ${k} == 0]`), tests: T.fn("multiples_de_k", ls.map(l => [[l], l.filter(x => x % k === 0)])) };
});
G(9, "affine", 60, r => {
  const a = r.int(2, 9), b = r.int(-9, 15), ls = [randList(r, 3, 8, -9, 30), [], [0], [1, 2, 3]];
  return { title: "Transformer chaque élément", q: `Écris \`transformer(liste)\` qui renvoie une nouvelle liste où chaque élément \`x\` est remplacé par \`${a} * x + (${b})\`.`, hint: "Boucle avec `append`.", ...fdef("transformer", ["liste"], `res = []\nfor x in liste:\n    res.append(${a} * x + (${b}))\nreturn res`), tests: T.fn("transformer", ls.map(l => [[l], l.map(x => a * x + b)])) };
});
G(9, "entre_bornes", 50, r => {
  const a = r.int(0, 20), b = a + r.int(5, 30), ls = [randList(r, 6, 12, 0, 60), [], [a], [b], [a - 1, b + 1]];
  return { title: "Compter entre deux bornes", q: `Écris \`combien_entre(liste)\` qui renvoie combien d'éléments sont **compris entre ${a} et ${b}** (bornes incluses).`, hint: "Un compteur et `a <= x <= b`.", ...fdef("combien_entre", ["liste"], `c = 0\nfor x in liste:\n    if ${a} <= x <= ${b}:\n        c += 1\nreturn c`), tests: T.fn("combien_entre", ls.map(l => [[l], l.filter(x => x >= a && x <= b).length])) };
});
G(9, "somme_si", 60, r => {
  const mode = r.pick(["pairs", "impairs", "seuil", "negatifs"]), s = r.int(5, 40);
  const cond = { pairs: x => x % 2 === 0, impairs: x => x % 2 !== 0, seuil: x => x > s, negatifs: x => x < 0 }[mode];
  const txt = { pairs: "des éléments **pairs**", impairs: "des éléments **impairs**", seuil: `des éléments **supérieurs à ${s}**`, negatifs: "des éléments **négatifs**" }[mode];
  const pc = { pairs: "x % 2 == 0", impairs: "x % 2 != 0", seuil: `x > ${s}`, negatifs: "x < 0" }[mode];
  const ls = [randList(r, 5, 10, -20, 60), [], [7], [2, 4, 6]];
  return { title: "Somme conditionnelle", q: `Écris \`somme_si(liste)\` qui renvoie la somme ${txt} de la liste (0 si aucun).`, hint: "Accumulateur + `if` dans la boucle.", ...fdef("somme_si", ["liste"], `total = 0\nfor x in liste:\n    if ${pc}:\n        total += x\nreturn total`), tests: T.fn("somme_si", ls.map(l => [[l], sum(l.filter(cond))])) };
});
G(9, "tranche", 60, r => {
  const mode = r.pick(["debut", "fin", "sans_bords"]), n = r.int(1, 4), ls = [randList(r, 6, 10, 0, 50), randList(r, n + 2, n + 4, 0, 9), [1], []];
  const txt = { debut: `les **${n} premiers** éléments`, fin: `les **${n} derniers** éléments`, sans_bords: `la liste **sans ses ${n} premiers ni ses ${n} derniers** éléments` }[mode];
  const e = { debut: `liste[:${n}]`, fin: `liste[-${n}:]`, sans_bords: `liste[${n}:-${n}]` }[mode];
  const f = l => mode === "debut" ? l.slice(0, n) : mode === "fin" ? l.slice(-n) : l.slice(n, l.length - n);
  return { title: "Découper une liste", q: `Écris \`extrait(liste)\` qui renvoie ${txt} (avec le slicing).`, hint: `\`${e}\``, ...fdef("extrait", ["liste"], `return ${e}`), tests: T.fn("extrait", ls.map(l => [[l], f(l)])) };
});
G(9, "positions", 40, r => {
  const x = r.int(1, 5), ls = [randList(r, 6, 12, 1, 5), [], [x], [x, 9, x, 9, x]];
  return { title: "Toutes les positions", q: `Écris \`positions(liste)\` qui renvoie la liste des **indices** où la valeur **${x}** apparaît.`, hint: "`for i in range(len(liste))` et `append(i)`.", ...fdef("positions", ["liste"], `res = []\nfor i in range(len(liste)):\n    if liste[i] == ${x}:\n        res.append(i)\nreturn res`), tests: T.fn("positions", ls.map(l => [[l], l.map((v, i) => v === x ? i : -1).filter(i => i >= 0)])) };
});
G(9, "sans_extremes", 40, r => {
  const ls = [[1, 5, 9], [10, 20, 30, 40], randList(r, 4, 8, 0, 50), [2, 2, 2]];
  const f = l => { const m = [...l]; m.splice(m.indexOf(Math.min(...m)), 1); m.splice(m.indexOf(Math.max(...m)), 1); return sum(m) / m.length; };
  return { title: "Moyenne sans extrêmes", q: "Écris `moyenne_sans_extremes(liste)` (au moins 3 éléments) qui renvoie la moyenne **en retirant un exemplaire du plus petit et un exemplaire du plus grand** élément.", hint: "`(sum(liste) - min(liste) - max(liste)) / (len(liste) - 2)`", ...fdef("moyenne_sans_extremes", ["liste"], "return (sum(liste) - min(liste) - max(liste)) / (len(liste) - 2)"), tests: T.fn("moyenne_sans_extremes", ls.map(l => [[l], f(l)]), true) };
});

/* ═══════════ NIVEAU 10 ═══════════ */
const FN_NAMES = ["f", "g", "h", "calcul", "transforme", "evalue", "formule", "image"];
G(10, "lin", 80, r => {
  const a = r.pick([-4, -3, -2, 2, 3, 4, 5, 6, 7]), b = r.int(-9, 20), nm = r.pick(FN_NAMES);
  return { title: "Une fonction affine", q: `Écris \`${nm}(x)\` qui renvoie la valeur de **${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}**.`, hint: `\`return ${a} * x + (${b})\``, ...fdef(nm, ["x"], `return ${a} * x + (${b})`), tests: T.fn(nm, [0, 1, -1, 5, 10, r.int(-30, 30)].map(x => [[x], a * x + b])) };
});
G(10, "unites", 60, r => {
  const u = r.pick([["km_en_m", "kilomètres", "mètres", 1000], ["h_en_min", "heures", "minutes", 60], ["kg_en_g", "kilogrammes", "grammes", 1000], ["m_en_cm", "mètres", "centimètres", 100], ["jours_en_h", "jours", "heures", 24], ["min_en_s", "minutes", "secondes", 60], ["semaines_en_jours", "semaines", "jours", 7]]);
  const down = r.chance(); const nm = down ? u[0] : u[0].split("_en_").reverse().join("_en_");
  if (down) return { title: "Conversion d'unités", q: `Écris \`${nm}(x)\` qui convertit \`x\` ${u[1]} en ${u[2]} (×${u[3]}).`, hint: `\`return x * ${u[3]}\``, ...fdef(nm, ["x"], `return x * ${u[3]}`), tests: T.fn(nm, [0, 1, 3, 10, r.int(11, 99)].map(x => [[x], x * u[3]])) };
  return { title: "Conversion d'unités", q: `Écris \`${nm}(x)\` qui convertit \`x\` ${u[2]} en ${u[1]} **entiers** (division entière par ${u[3]}).`, hint: `\`return x // ${u[3]}\``, ...fdef(nm, ["x"], `return x // ${u[3]}`), tests: T.fn(nm, [0, u[3], u[3] - 1, 5 * u[3] + 1, r.int(1, 99999)].map(x => [[x], Math.floor(x / u[3])])) };
});
G(10, "ttc", 50, r => {
  const t = r.pick([5.5, 10, 20, 7, 19.6, 8.5]), nm = r.pick(["prix_ttc", "avec_taxe", "total_taxe"]);
  return { title: "Prix avec taxe", q: `Écris \`${nm}(ht, taux=${t})\` qui renvoie le prix TTC : \`ht * (100 + taux) / 100\`. Si on ne donne pas \`taux\`, il vaut **${t}**.`, hint: "Un paramètre par défaut s'écrit `taux=...`.", starter: `def ${nm}(ht, taux=${t}):\n    pass\n`, sol: `def ${nm}(ht, taux=${t}):\n    return ht * (100 + taux) / 100`, tests: [...T.fn(nm, [[[100], 100 * (100 + t) / 100], [[0], 0], [[r.int(10, 99)], null]].slice(0, 2), true), ...T.fn(nm, [[[200, 10], 220], [[50, 0], 50]], true)] };
});
G(10, "terme_suite", 70, r => {
  const u0 = r.int(1, 9), q = r.int(2, 4), a = r.int(0, 7);
  const f = n => { let u = u0; for (let i = 0; i < n; i++) u = u * q + a; return u; };
  return { title: "Terme d'une suite", q: `Une suite vérifie **u(0) = ${u0}** et **u(k+1) = u(k) × ${q} + ${a}**. Écris \`terme(n)\` qui renvoie **u(n)**.`, hint: "Boucle `n` fois en mettant à jour `u`.", ...fdef("terme", ["n"], `u = ${u0}\nfor _ in range(n):\n    u = u * ${q} + ${a}\nreturn u`), tests: T.fn("terme", [0, 1, 2, 5, 8, r.int(9, 14)].map(n => [[n], f(n)])) };
});
G(10, "somme_ou", 60, r => {
  const a = r.int(2, 6), b = r.int(7, 13);
  return { title: "Somme de multiples de a ou b", q: `Écris \`somme_ab(n)\` qui renvoie la somme des entiers de 1 à \`n\` qui sont multiples de **${a}** **ou** de **${b}**.`, hint: "Un seul `if` avec `or`.", ...fdef("somme_ab", ["n"], `total = 0\nfor i in range(1, n + 1):\n    if i % ${a} == 0 or i % ${b} == 0:\n        total += i\nreturn total`), tests: T.fn("somme_ab", [0, a, b, 30, 100, r.int(31, 300)].map(n => [[n], (() => { let s = 0; for (let i = 1; i <= n; i++) if (i % a === 0 || i % b === 0) s += i; return s; })()])) };
});
G(10, "tronquer", 50, r => {
  const n = r.int(3, 12), suf = r.pick(["...", "…", " [...]", "~"]);
  const ts = [r.pick(SW), "ok", "x".repeat(n), "y".repeat(n + 1), "Une phrase beaucoup trop longue pour tenir"];
  const f = t => [...t].length > n ? [...t].slice(0, n).join("") + suf : t;
  return { title: "Tronquer un texte", q: `Écris \`tronquer(texte)\` : si le texte fait plus de **${n}** caractères, renvoie ses ${n} premiers caractères suivis de \`${suf}\` ; sinon renvoie-le tel quel.`, hint: `\`texte[:${n}] + ...\` dans un \`if len(texte) > ${n}\`.`, ...fdef("tronquer", ["texte"], `if len(texte) > ${n}:\n    return texte[:${n}] + ${py(suf)}\nreturn texte`), tests: T.fn("tronquer", ts.map(t => [[t], f(t)])) };
});
G(10, "distance_pts", 50, r => {
  const mode = r.pick(["manhattan", "tchebychev", "carre"]), nm = r.pick(["distance", "ecart", "eloignement"]);
  const f = (a, b, c, d) => mode === "manhattan" ? Math.abs(a - c) + Math.abs(b - d) : mode === "tchebychev" ? Math.max(Math.abs(a - c), Math.abs(b - d)) : (a - c) ** 2 + (b - d) ** 2;
  const e = { manhattan: "abs(x1 - x2) + abs(y1 - y2)", tchebychev: "max(abs(x1 - x2), abs(y1 - y2))", carre: "(x1 - x2) ** 2 + (y1 - y2) ** 2" }[mode];
  const txt = { manhattan: "la distance de Manhattan `|x1 − x2| + |y1 − y2|`", tchebychev: "la plus grande des deux différences en valeur absolue `max(|x1 − x2|, |y1 − y2|)`", carre: "le **carré** de la distance euclidienne `(x1 − x2)² + (y1 − y2)²`" }[mode];
  const cs = [[0, 0, 3, 4], [1, 1, 1, 1], [-2, 5, 4, -1], [r.int(-9, 9), r.int(-9, 9), r.int(-9, 9), r.int(-9, 9)]];
  return { title: "Distance entre deux points", q: `Écris \`${nm}(x1, y1, x2, y2)\` qui renvoie ${txt}.`, hint: `\`return ${e}\``, ...fdef(nm, ["x1", "y1", "x2", "y2"], `return ${e}`), tests: T.fn(nm, cs.map(c => [c, f(...c)])) };
});
