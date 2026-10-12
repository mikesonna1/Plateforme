"use strict";
/* ═════════════════ Utilitaires ═════════════════ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function el(tag, attrs, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === "spellcheck") { n.setAttribute("spellcheck", String(v)); continue; }
    if (v == null || v === false) continue;
    if (k === "class") n.className = v;
    else if (k === "text") n.textContent = v;
    else if (k === "on") for (const [ev, fn] of Object.entries(v)) n.addEventListener(ev, fn);
    else if (k === "dataset") Object.assign(n.dataset, v);
    else if (k in n && k !== "list") n[k] = v;
    else n.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat()) if (c != null && c !== false) n.append(c.nodeType ? c : document.createTextNode(c));
  return n;
}
/** Texte avec **gras** et `code` → fragment DOM (sans innerHTML : aucun risque d'injection) */
function inline(text) {
  const frag = document.createDocumentFragment();
  String(text).split(/(`[^`]+`|\*\*[^*]+\*\*)/).forEach(part => {
    if (!part) return;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) frag.append(el("code", { text: part.slice(1, -1) }));
    else if (part.startsWith("**") && part.endsWith("**") && part.length > 4) frag.append(el("strong", { text: part.slice(2, -2) }));
    else frag.append(part);
  });
  return frag;
}
/** Mini rendu Markdown (titres, listes, blocs de code) pour les réponses de l'IA */
function markdown(text) {
  const root = el("div");
  const lines = String(text).replace(/\r/g, "").split("\n");
  const isSpecial = l => /^```/.test(l) || /^\s*[-*]\s+/.test(l) || /^\s*\d+[.)]\s+/.test(l) || /^#{1,4}\s+/.test(l);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^```/.test(line)) {
      const buf = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      root.append(el("pre", {}, el("code", { text: buf.join("\n") })));
    } else if (/^\s*[-*]\s+/.test(line)) {
      const ul = el("ul");
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) ul.append(el("li", {}, inline(lines[i++].replace(/^\s*[-*]\s+/, ""))));
      root.append(ul);
    } else if (/^\s*\d+[.)]\s+/.test(line)) {
      const ol = el("ol");
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) ol.append(el("li", {}, inline(lines[i++].replace(/^\s*\d+[.)]\s+/, ""))));
      root.append(ol);
    } else if (/^#{1,4}\s+/.test(line)) {
      root.append(el("p", {}, el("strong", {}, inline(line.replace(/^#{1,4}\s+/, "")))));
      i++;
    } else if (!line.trim()) {
      i++;
    } else {
      const p = el("p"); let first = true;
      while (i < lines.length && lines[i].trim() && !isSpecial(lines[i])) {
        if (!first) p.append(el("br"));
        p.append(inline(lines[i++])); first = false;
      }
      root.append(p);
    }
  }
  return root;
}
const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const plural = (n, one, many) => n + " " + (n > 1 ? many : one);

/* ═════════════════ État et sauvegarde ═════════════════ */
const KEY = "devenirIngenieurV2";
const defaultState = () => ({ xp: {}, streak: 0, lastDay: "", bestStreak: 0, best: {}, drafts: {}, badges: {}, aiCount: 0, perfect: 0, freeMode: false, lastLevel: 1 });
let state = defaultState();
try { state = Object.assign(defaultState(), JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { }
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { } }

const dayStr = (d = new Date()) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
function touchDay() {
  const today = dayStr();
  if (state.lastDay === today) return;
  const y = new Date(); y.setDate(y.getDate() - 1);
  state.streak = state.lastDay === dayStr(y) ? state.streak + 1 : 1;
  state.bestStreak = Math.max(state.bestStreak || 0, state.streak);
  state.lastDay = today;
}
function currentStreak() {
  const y = new Date(); y.setDate(y.getDate() - 1);
  return state.lastDay === dayStr() || state.lastDay === dayStr(y) ? state.streak : 0;
}
const isDone = id => state.xp[id] != null;
const totalXp = () => Object.values(state.xp).reduce((s, x) => s + x, 0);
const countPrefix = p => Object.keys(state.xp).filter(k => k.startsWith(p)).length;
const LEVEL_XP = 150;
const LEVEL_NAMES = ["Curieux", "Débutant", "Apprenti", "Codeur", "Développeur", "Confirmé", "Expert", "Maître", "Architecte", "Ingénieur", "Légende"];
const levelInfo = xp => { const lvl = Math.floor(xp / LEVEL_XP) + 1; return { lvl, name: LEVEL_NAMES[Math.min(lvl - 1, LEVEL_NAMES.length - 1)], into: xp % LEVEL_XP, next: LEVEL_XP }; };
const EX_XP = { 1: 10, 2: 15, 3: 20, 4: 30, 5: 40 };
const LESSON_XP = 15, QUIZ_XP = 5;

const BADGES = [
  { id: "first", ico: "🌟", name: "Premier pas", desc: "Gagne tes premiers XP", test: s => s.xp > 0 },
  { id: "l5", ico: "📖", name: "Lecteur", desc: "Termine 5 cours", test: s => s.lessons >= 5 },
  { id: "lhalf", ico: "📚", name: "Studieux", desc: "Termine la moitié des cours", test: s => s.lessons >= Math.ceil(LESSONS.length / 2) },
  { id: "lall", ico: "🎓", name: "Diplômé", desc: "Termine tous les cours", test: s => s.lessons >= LESSONS.length },
  { id: "e5", ico: "🛠️", name: "Apprenti codeur", desc: "Réussis 5 exercices", test: s => s.ex >= 5 },
  { id: "e20", ico: "💪", name: "Codeur confirmé", desc: "Réussis 20 exercices", test: s => s.ex >= 20 },
  { id: "eall", ico: "🏆", name: "Maître Python", desc: "Réussis tous les exercices", test: s => s.ex >= EXERCISES.length },
  { id: "lvl5", ico: "🧗", name: "Défi relevé", desc: "Réussis un exercice de niveau 5", test: s => EXERCISES.some(e => e.level === 5 && isDone(e.id)) },
  { id: "q25", ico: "🧠", name: "Cerveau en feu", desc: "25 questions réussies au quiz", test: s => s.quiz >= 25 },
  { id: "perfect", ico: "💯", name: "Sans faute", desc: "Score parfait sur un quiz de 10 questions ou plus", test: () => state.perfect > 0 },
  { id: "s3", ico: "🔥", name: "En série", desc: "3 jours d'affilée", test: () => (state.bestStreak || 0) >= 3 },
  { id: "s7", ico: "🚀", name: "Régulier", desc: "7 jours d'affilée", test: () => (state.bestStreak || 0) >= 7 },
  { id: "ia", ico: "🤖", name: "Curieux", desc: "Pose une question au professeur IA", test: () => state.aiCount > 0 },
  { id: "p100", ico: "🏔️", name: "Randonneur", desc: "Réussis 100 exercices du parcours", test: s => s.path >= 100 },
  { id: "p1000", ico: "⛰️", name: "Alpiniste", desc: "Réussis 1 000 exercices du parcours", test: s => s.path >= 1000 },
  { id: "defi1", ico: "🏆", name: "Défi des fondations", desc: "Réussis entièrement le défi 1", test: () => isDone("bonus-defi1") }
];
const counts = () => ({ xp: totalXp(), lessons: countPrefix("l"), ex: countPrefix("e"), quiz: countPrefix("q"), path: countPrefix("L"), defis: countPrefix("D") });

function checkBadges() {
  const c = counts();
  BADGES.forEach(b => {
    if (!state.badges[b.id] && b.test(c)) { state.badges[b.id] = dayStr(); toast(`${b.ico} Badge débloqué : ${b.name}`); }
  });
}
function award(id, amount) {
  if (isDone(id)) return false;
  const before = levelInfo(totalXp()).lvl;
  state.xp[id] = amount;
  touchDay(); checkBadges(); save(); refreshChrome();
  const after = levelInfo(totalXp());
  toast(`+${amount} XP`);
  if (after.lvl > before) toast(`🎉 Niveau ${after.lvl} : ${after.name} !`);
  return true;
}
function toast(msg) {
  const t = el("div", { class: "toast", text: msg });
  $("#toasts").append(t);
  setTimeout(() => t.remove(), 3500);
}
function refreshChrome() {
  $("#xp").textContent = totalXp();
  $("#streak").textContent = currentStreak();
  const c = counts();
  $("#badgeCourses").textContent = c.lessons + "/" + LESSONS.length;
  $("#badgeEx").textContent = c.ex + "/" + EXERCISES.length;
  $("#badgePath").textContent = c.path;
  if ($("#home").classList.contains("active")) renderHome();
}

/* ═════════════════ Navigation ═════════════════ */
const TITLES = { home: "Accueil", courses: "Cours Python", exercises: "Exercices du cours", path: "Parcours 100 niveaux", quiz: "Quiz", ai: "Professeur IA", careers: "Métiers IT", roadmap: "Mon parcours", progress: "Mes résultats" };
function showPage(id, opts = {}) {
  if (!TITLES[id]) id = "home";
  $$(".page").forEach(p => p.classList.toggle("active", p.id === id));
  $$(".nav-button").forEach(b => b.classList.toggle("active", b.dataset.page === id));
  $("#pageTitle").textContent = TITLES[id];
  document.body.classList.remove("menu-open");
  if (history.replaceState && !opts.noHash) history.replaceState(null, "", "#" + id);
  if (id === "home") renderHome();
  if (id === "progress") renderProgress();
  if (id === "path" && !opts.keepPath) renderPath();
  if (id === "path") PyRunner.preload();
  if (id === "courses" && !opts.keepLesson) closeLesson();
  if (id === "exercises" || id === "courses") PyRunner.preload();
  if (!opts.noScroll) window.scrollTo({ top: 0 });
}
$$(".nav-button").forEach(b => b.addEventListener("click", () => showPage(b.dataset.page)));
$$("[data-go]").forEach(b => b.addEventListener("click", () => showPage(b.dataset.go)));
$("#menuBtn").addEventListener("click", () => document.body.classList.toggle("menu-open"));
$("#scrim").addEventListener("click", () => document.body.classList.remove("menu-open"));
$("#themeBtn").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("devenirIngenieurTheme", next); } catch (e) { }
});

/* ═════════════════ Accueil ═════════════════ */
function badgeGrid(container) {
  container.replaceChildren(...BADGES.map(b => el("div", { class: "badge" + (state.badges[b.id] ? " on" : ""), title: b.desc },
    el("span", { class: "ico", text: b.ico }),
    el("div", {}, el("strong", { text: b.name }), el("small", { text: b.desc })))));
}
function nextLesson() { return LESSONS.find(l => !isDone(l.id)); }
function renderHome() {
  const xp = totalXp(), li = levelInfo(xp), c = counts();
  $("#levelTag").textContent = "Niveau " + li.lvl;
  $("#levelName").textContent = li.name;
  $("#levelBar").style.width = Math.round(li.into / li.next * 100) + "%";
  $("#levelBarWrap").setAttribute("aria-valuenow", Math.round(li.into / li.next * 100));
  $("#levelText").textContent = `${li.into} / ${li.next} XP pour le niveau ${li.lvl + 1}`;
  const nl = nextLesson();
  const cb = $("#continueBtn");
  if (!c.lessons && !c.ex) { cb.textContent = "Commencer à apprendre →"; }
  else if (nl) { cb.textContent = "Continuer : " + nl.title + " →"; }
  else { cb.textContent = "Cours terminés ! Continue avec les exercices →"; }
  cb.onclick = () => nl ? openLesson(nl.id) : showPage("exercises");
  $("#homeStats").replaceChildren(
    stat(`${c.lessons}/${LESSONS.length}`, "cours terminés"),
    stat(`${c.ex}/${EXERCISES.length}`, "exercices réussis"),
    stat(`${c.quiz}/${QUIZ.length}`, "questions maîtrisées"),
    stat(`${c.path}`, "exercices du parcours"),
    stat(currentStreak() + " 🔥", "jours d'affilée"));
  badgeGrid($("#homeBadges"));
}
const stat = (value, label) => el("div", { class: "stat" }, el("b", { text: value }), el("span", { text: label }));

/* ═════════════════ Exécution de code (éditeur réutilisable) ═════════════════ */
function enableTab(ta, onRun) {
  ta.addEventListener("keydown", e => {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const s = ta.selectionStart, en = ta.selectionEnd;
      ta.setRangeText("    ", s, en, "end");
      ta.dispatchEvent(new Event("input"));
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); onRun && onRun(); }
  });
}
function showResult(con, r) {
  con.replaceChildren(); con.hidden = false;
  if (r.timeout) { con.append(el("span", { class: "err", text: "⏱️ Ton programme a tourné plus de 8 secondes : il a été arrêté. Y a-t-il une boucle infinie ?" })); return; }
  if (r.stdout) con.append(r.stdout);
  if (r.error) {
    if (r.stdout && !r.stdout.endsWith("\n")) con.append("\n");
    con.append(el("span", { class: "err", text: "❌ " + formatError(r.error) }));
    const help = ERROR_HELP[r.error.type];
    if (help) con.append(el("span", { class: "hint" }, "💡 ", inline(help)));
  } else if (!r.stdout) {
    con.append(el("span", { class: "info", text: "(rien n'a été affiché — utilise print() pour voir un résultat)" }));
  }
}
function sizeFor(code) { return Math.min(Math.max(code.split("\n").length, 2), 18); }

/** Bloc de code exécutable dans un cours */
function codeBlock(src, opt = {}) {
  const ta = el("textarea", { class: "code-area", rows: sizeFor(src), spellcheck: false, value: src, "aria-label": "Code Python modifiable" });
  const con = el("pre", { class: "console", hidden: true, "aria-live": "polite" });
  const needsInput = /input\s*\(/.test(src);
  const stdin = needsInput ? el("textarea", { rows: 2, placeholder: "Une réponse par ligne", spellcheck: false, "aria-label": "Saisies pour input()" }) : null;
  if (stdin && opt.inputs) stdin.value = opt.inputs.join("\n");
  const runBtn = el("button", { class: "btn small", type: "button", text: "▶ Exécuter" });
  async function run() {
    runBtn.disabled = true;
    con.hidden = false; con.textContent = "…";
    try {
      const inputs = stdin ? stdin.value.split("\n") : [];
      const r = await PyRunner.run(ta.value, { inputs, onStatus: m => { con.textContent = m; } });
      showResult(con, r);
    } catch (err) { con.replaceChildren(el("span", { class: "err", text: err.message })); }
    runBtn.disabled = false;
  }
  runBtn.addEventListener("click", run);
  enableTab(ta, run);
  const reset = el("button", { class: "btn ghost small", type: "button", text: "↺", title: "Revenir au code d'origine", "aria-label": "Revenir au code d'origine", on: { click: () => { ta.value = src; con.hidden = true; } } });
  const copy = el("button", { class: "btn ghost small", type: "button", text: "Copier", on: { click: async () => { try { await navigator.clipboard.writeText(ta.value); toast("Code copié"); } catch (e) { toast("Copie impossible"); } } } });
  return el("div", { class: "code-block" },
    el("div", { class: "bar-top" }, el("span", { text: "Python · modifiable" }), el("span", { class: "row" }, reset, copy, runBtn)),
    ta,
    stdin && el("div", { class: "stdin-wrap" }, el("label", {}, "Saisies (réponses à input()) :", stdin)),
    con);
}

/* ═════════════════ Cours ═════════════════ */
let currentLessonId = null;
function renderCourseList() {
  const list = $("#courseList"); list.replaceChildren();
  const done = LESSONS.filter(l => isDone(l.id)).length;
  $("#coursesBar").style.width = Math.round(done / LESSONS.length * 100) + "%";
  $("#coursesText").textContent = `${done} cours terminé${done > 1 ? "s" : ""} sur ${LESSONS.length}`;
  MODULES.forEach(m => {
    const ls = LESSONS.filter(l => l.module === m.id);
    if (!ls.length) return;
    const d = ls.filter(l => isDone(l.id)).length;
    const box = el("div", { class: "module" },
      el("div", { class: "module-head" }, el("span", { text: m.icon, style: "font-size:26px" }),
        el("div", {}, el("h3", { text: m.title }), el("span", { class: "muted", text: m.desc })),
        el("div", { class: "bar", title: d + "/" + ls.length }, el("i", { style: `width:${d / ls.length * 100}%` }))));
    ls.forEach(l => box.append(el("button", { class: "lesson-item" + (isDone(l.id) ? " done" : ""), type: "button", on: { click: () => openLesson(l.id) } },
      el("span", { class: "num", text: isDone(l.id) ? "✓" : String(LESSONS.indexOf(l) + 1) }),
      el("span", {}, el("strong", { text: l.title }), el("br"), el("span", { class: "muted", text: l.goal })),
      el("span", { class: "meta" }, el("span", { class: "tag", text: "⏱ " + l.time }), el("span", { class: "tag", text: "🎬 " + l.video.duration }), isDone(l.id) && el("span", { class: "tag done", text: "Terminé" })))));
    list.append(box);
  });
}
function closeLesson() {
  currentLessonId = null;
  $("#lessonView").hidden = true; $("#courseListView").hidden = false;
  renderCourseList();
}
function openLesson(id) {
  const l = LESSONS.find(x => x.id === id); if (!l) return;
  currentLessonId = id;
  showPage("courses", { keepLesson: true, noScroll: true });
  const view = $("#lessonView");
  const idx = LESSONS.indexOf(l), prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
  const mod = MODULES.find(m => m.id === l.module);

  const textPanel = el("div", { class: "lesson-body", id: "tab-text", role: "tabpanel" });
  l.blocks.forEach(b => textPanel.append(renderBlock(b)));
  textPanel.append(el("div", { class: "recap" }, el("h3", { text: "📝 À retenir" }), el("ul", {}, l.recap.map(r => el("li", {}, inline(r))))));
  if (l.ex && l.ex.length) {
    textPanel.append(el("h3", { text: "💻 Pour t'entraîner" }),
      el("div", { class: "row" }, l.ex.map(eid => { const e = EXERCISES.find(x => x.id === eid); return e && el("button", { class: "btn ghost small", type: "button", on: { click: () => openExercise(eid) } }, (isDone(eid) ? "✓ " : "") + e.title); })));
  }
  const doneBtn = el("button", { class: "btn good", type: "button" });
  const syncDone = () => { doneBtn.textContent = isDone(l.id) ? "✓ Cours terminé" : `✅ J'ai terminé ce cours (+${LESSON_XP} XP)`; doneBtn.disabled = isDone(l.id); };
  syncDone();
  doneBtn.addEventListener("click", () => { award(l.id, LESSON_XP); syncDone(); });
  const aiBtn = el("button", { class: "btn ghost", type: "button", text: "🤖 Poser une question à l'IA", on: { click: () => openAI(`J'ai une question sur le cours « ${l.title} » : `, { label: "Cours : " + l.title, text: `Leçon « ${l.title} ». Objectif : ${l.goal}`, send: false }) } });
  textPanel.append(el("div", { class: "row", style: "margin-top:22px" }, doneBtn, aiBtn));

  const videoPanel = renderVideo(l); videoPanel.id = "tab-video"; videoPanel.hidden = true; videoPanel.setAttribute("role", "tabpanel");

  const tabText = el("button", { class: "tab", role: "tab", type: "button", "aria-selected": "true", "aria-controls": "tab-text", text: "📖 Cours" });
  const tabVideo = el("button", { class: "tab", role: "tab", type: "button", "aria-selected": "false", "aria-controls": "tab-video", text: "🎬 Vidéo · " + l.video.duration });
  const select = which => {
    const t = which === "text";
    tabText.setAttribute("aria-selected", t); tabVideo.setAttribute("aria-selected", !t);
    textPanel.hidden = !t; videoPanel.hidden = t;
    const v = $("video", videoPanel); if (t && v) v.pause();
  };
  tabText.addEventListener("click", () => select("text")); tabVideo.addEventListener("click", () => select("video"));

  view.replaceChildren(
    el("button", { class: "btn ghost small", type: "button", text: "← Tous les cours", on: { click: closeLesson } }),
    el("p", { class: "muted", style: "margin:14px 0 2px" }, `${mod.icon} ${mod.title} · Cours ${idx + 1}/${LESSONS.length}`),
    el("h2", { text: l.title, style: "margin:0" }),
    el("p", { class: "muted", text: "🎯 " + l.goal }),
    el("div", { class: "tabs", role: "tablist" }, tabText, tabVideo),
    textPanel, videoPanel,
    el("div", { class: "lesson-nav" },
      prev ? el("button", { class: "btn ghost", type: "button", text: "← " + prev.title, on: { click: () => openLesson(prev.id) } }) : el("span"),
      next ? el("button", { class: "btn", type: "button", text: next.title + " →", on: { click: () => openLesson(next.id) } }) : el("span")));
  $("#courseListView").hidden = true; view.hidden = false;
  window.scrollTo({ top: 0 });
}
function renderBlock(b) {
  const [type, content, opt] = b;
  switch (type) {
    case "h": return el("h3", { text: content });
    case "p": return el("p", {}, inline(content));
    case "list": return el("ul", {}, content.map(i => el("li", {}, inline(i))));
    case "code": return codeBlock(content, opt);
    case "out": return el("pre", { class: "expected", text: content });
    case "tip": return el("div", { class: "callout tip" }, el("b", { class: "lbl", text: "💡 Astuce" }), inline(content));
    case "warn": return el("div", { class: "callout warn" }, el("b", { class: "lbl", text: "⚠️ Attention" }), inline(content));
  }
  return el("span");
}
function videoEmbed(src) {
  let m = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  if (m) return el("iframe", { src: "https://www.youtube-nocookie.com/embed/" + m[1], title: "Vidéo du cours", allow: "accelerometer; encrypted-media; picture-in-picture; fullscreen", allowFullscreen: true, loading: "lazy" });
  m = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return el("iframe", { src: "https://player.vimeo.com/video/" + m[1], title: "Vidéo du cours", allow: "fullscreen; picture-in-picture", allowFullscreen: true, loading: "lazy" });
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(src)) return el("video", { src, controls: true, preload: "metadata", playsInline: true });
  return null;
}
function renderVideo(l) {
  const v = l.video, box = el("div", { class: "video-box" });
  const src = (typeof VIDEO_SOURCES !== "undefined" && VIDEO_SOURCES[l.id]) || v.src;
  const embed = src ? videoEmbed(src) : null;
  box.append(el("h3", { text: "🎬 " + v.title }));
  if (embed) box.append(el("div", { class: "video-frame" }, embed));
  else box.append(el("div", { class: "video-soon" }, el("div", {}, el("div", { class: "big", text: "🎬" }), el("h3", { text: "Vidéo en préparation" }), el("p", { class: "muted" }, `Durée prévue : ${v.duration}. En attendant, lis le cours (onglet « Cours ») et consulte le script de la vidéo ci-dessous.`))));
  const scenes = [
    ["Accroche (0:00)", v.hook, "Titre animé de la leçon : « " + l.title + " »."],
    ["Démonstration", "Regarde bien : je te montre ça en direct, pas à pas.", v.demo],
    ["À retenir", "Pour résumer : " + l.recap.map(r => r.replace(/`/g, "")).join(" ; ") + ".", "Les points clés s'affichent un par un à l'écran."],
    ["Conclusion", "À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.", "Bouton « S'entraîner » et mascotte du site."]
  ];
  box.append(el("details", { open: !embed }, el("summary", { text: embed ? "📄 Voir le script / la transcription" : "📄 Script de la vidéo" }),
    el("ol", { class: "scenes" }, scenes.map(([t, say, show]) => el("li", {}, el("strong", { text: t }), el("p", { text: "🎙️ " + say, style: "margin:4px 0" }), el("span", { class: "show", text: "🖥️ À l'écran : " + show }))))));
  return box;
}

/* ═════════════════ Exercices ═════════════════ */
function renderExercises() {
  const level = $("#difficulty").value, status = $("#exStatus").value;
  const list = $("#exerciseList"); list.replaceChildren();
  const items = EXERCISES.filter(e => (level === "all" || String(e.level) === level) && (status === "all" || (status === "done") === isDone(e.id)));
  $("#exCount").textContent = plural(items.length, "exercice", "exercices");
  items.forEach(e => list.append(exerciseCard(e)));
  if (!items.length) list.append(el("p", { class: "muted", text: "Aucun exercice ne correspond à ces filtres." }));
}
function exerciseCard(e) {
  const tagDone = el("span", { class: "tag done", text: "Réussi ✓", hidden: !isDone(e.id) });
  const det = el("details", { class: "ex", id: "ex-" + e.id },
    el("summary", {}, el("span", { class: "t", text: (e.num ? e.num + ". " : "") + e.title }),
      el("span", { class: "meta" }, el("span", { class: "tag level-" + (e.level <= 5 ? e.level : 5), text: e.label || "Niveau " + e.level }), el("span", { class: "tag", text: "+" + (e.xp ?? EX_XP[e.level]) + " XP" }), tagDone)));
  let built = false;
  det.addEventListener("toggle", () => { if (det.open && !built) { built = true; det.append(exerciseBody(e, tagDone)); } });
  return det;
}
function exerciseBody(e, tagDone) {
  const draft = state.drafts[e.id];
  const ta = el("textarea", { class: "code-area", rows: Math.max(sizeFor(draft ?? e.starter), 6), spellcheck: false, value: draft ?? e.starter, "aria-label": "Ton code" });
  const con = el("pre", { class: "console", hidden: true, "aria-live": "polite" });
  const testsBox = el("ul", { class: "tests", hidden: true });
  const verdict = el("div", { class: "callout", hidden: true });
  const solBox = el("div", { hidden: true }, el("p", { class: "muted", text: "Une solution possible (il en existe souvent plusieurs) :" }), el("pre", { class: "console", text: e.sol }));
  let t;
  ta.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => { state.drafts[e.id] = ta.value; save(); }, 400); });
  const runBtn = el("button", { class: "btn ghost", type: "button", text: "▶ Exécuter" });
  const checkBtn = el("button", { class: "btn", type: "button", text: "✔ Vérifier" });
  const busy = b => { runBtn.disabled = checkBtn.disabled = b; };
  async function go(check) {
    busy(true); con.hidden = false; con.textContent = "…"; testsBox.hidden = true; verdict.hidden = true;
    try {
      const r = await PyRunner.run(ta.value, { tests: check ? e.tests : [], inputs: e.inputs || [], onStatus: m => { con.textContent = m; } });
      showResult(con, r);
      if (check && !r.error && !r.timeout) {
        testsBox.replaceChildren(...r.tests.map(([d, ok, msg]) => el("li", { class: ok ? "ok" : "ko" }, ok ? "✅" : "❌", el("span", {}, d, !ok && msg && el("small", { text: msg })))));
        testsBox.hidden = false;
        const all = r.tests.length && r.tests.every(x => x[1]);
        verdict.hidden = false; verdict.className = "callout " + (all ? "tip" : "warn");
        if (all) {
          const xp = e.xp ?? EX_XP[e.level];
          const first = award(e.id, xp);
          verdict.replaceChildren(el("b", { class: "lbl", text: "🎉 Bravo !" }), first ? `Tous les tests passent. +${xp} XP.` : "Tous les tests passent (exercice déjà validé).");
          tagDone.hidden = false;
          if (e.onSolved) e.onSolved();
        } else {
          const bad = r.tests.filter(x => !x[1]).length;
          verdict.replaceChildren(el("b", { class: "lbl", text: "Pas encore" }), `${plural(bad, "test échoue", "tests échouent")}. Lis les messages ci-dessus, relis l'énoncé ou ouvre l'indice.`);
        }
      }
    } catch (err) { con.replaceChildren(el("span", { class: "err", text: err.message })); }
    busy(false);
  }
  runBtn.addEventListener("click", () => go(false));
  checkBtn.addEventListener("click", () => go(true));
  enableTab(ta, () => go(false));
  const solBtn = el("button", { class: "btn ghost", type: "button", text: "👁 Solution", on: { click: () => { if (solBox.hidden && !isDone(e.id) && !confirm("Essaie encore un peu avant de regarder la solution ! Tu veux vraiment la voir ?")) return; solBox.hidden = !solBox.hidden; } } });
  const resetBtn = el("button", { class: "btn ghost", type: "button", text: "↺ Recommencer", on: { click: () => { if (confirm("Revenir au code de départ ?")) { ta.value = e.starter; delete state.drafts[e.id]; save(); } } } });
  const aiBtn = el("button", { class: "btn ghost", type: "button", text: "🤖 Demander de l'aide", on: { click: () => openAI("Aide-moi sur cet exercice, donne-moi d'abord un indice sans la solution complète.", { label: "Exercice : " + e.title, text: `Exercice « ${e.title} » : ${e.q}\nCode actuel de l'élève :\n${ta.value.slice(0, 1500)}`, send: true }) } });
  return el("div", { class: "ex-body" },
    el("p", {}, inline(e.q)),
    e.inputs && el("p", { class: "muted" }, "Saisies utilisées pour tester : ", el("code", { text: e.inputs.join(" · ") })),
    el("details", {}, el("summary", { text: "💡 Voir l'indice" }), el("p", {}, inline(e.hint))),
    el("div", { class: "code-block", style: "margin-top:12px" }, ta, con, testsBox),
    verdict,
    el("div", { class: "row", style: "margin-top:12px" }, runBtn, checkBtn, solBtn, resetBtn, aiBtn),
    solBox);
}
function openExercise(id) {
  $("#difficulty").value = "all"; $("#exStatus").value = "all"; renderExercises();
  showPage("exercises", { noScroll: true });
  const d = $("#ex-" + id); if (!d) return;
  d.open = true;
  d.scrollIntoView({ behavior: "smooth", block: "start" });
}
$("#difficulty").addEventListener("change", renderExercises);
$("#exStatus").addEventListener("change", renderExercises);

/* ═════════════════ Quiz ═════════════════ */
let quizRun = null;
function initQuiz() {
  const sel = $("#quizTheme");
  sel.replaceChildren(el("option", { value: "all", text: "Tous les thèmes (" + QUIZ.length + ")" }),
    ...QUIZ_THEMES.map(t => el("option", { value: t, text: `${t} (${QUIZ.filter(q => q.t === t).length})` })));
  $("#quizStart").addEventListener("click", startQuiz);
  sel.addEventListener("change", showQuizBest);
  showQuizBest();
}
function showQuizBest() {
  const b = state.best[$("#quizTheme").value];
  $("#quizBest").textContent = b != null ? `Ton meilleur score sur ce thème : ${b} %` : "";
}
function startQuiz() {
  const theme = $("#quizTheme").value, n = parseInt($("#quizCount").value, 10);
  const pool = QUIZ.map((q, i) => ({ q, i })).filter(x => theme === "all" || x.q.t === theme);
  quizRun = { theme, items: shuffle(pool).slice(0, n), pos: 0, right: 0, wrong: [] };
  $("#quizSetup").hidden = true; $("#quizRun").hidden = false;
  renderQuestion();
}
function renderQuestion() {
  const box = $("#quizRun"), { items, pos } = quizRun;
  const { q, i } = items[pos];
  const order = shuffle(q.o.map((text, k) => ({ text, ok: k === q.a })));
  const explain = el("div", { class: "explain", hidden: true });
  const nextBtn = el("button", { class: "btn", type: "button", hidden: true, text: pos + 1 < items.length ? "Question suivante →" : "Voir mon score →", on: { click: () => { quizRun.pos++; quizRun.pos < items.length ? renderQuestion() : endQuiz(); } } });
  const buttons = order.map(o => el("button", { class: "answer", type: "button", text: o.text }));
  buttons.forEach((b, k) => b.addEventListener("click", () => {
    buttons.forEach((x, j) => { x.disabled = true; if (order[j].ok) x.classList.add("right"); });
    const good = order[k].ok;
    if (!good) b.classList.add("wrong");
    if (good) { quizRun.right++; award("q" + i, QUIZ_XP); } else quizRun.wrong.push({ q, chosen: order[k].text });
    explain.hidden = false;
    explain.replaceChildren(el("strong", { text: good ? "✅ Bonne réponse ! " : "❌ Pas tout à fait. " }), inline(q.why));
    nextBtn.hidden = false; nextBtn.focus();
  }));
  box.replaceChildren(
    el("div", { class: "quiz-progress" }, el("span", { class: "tag", text: q.t }), el("div", { class: "bar" }, el("i", { style: `width:${pos / items.length * 100}%` })), el("span", { class: "muted", text: `${pos + 1}/${items.length}` })),
    el("p", { class: "q-text" }, inline(q.q)),
    q.code && el("pre", { class: "console", text: q.code, style: "margin-bottom:12px;border:1px solid var(--line);border-radius:10px" }),
    el("div", { class: "q-options" }, buttons), explain, el("div", { style: "margin-top:14px" }, nextBtn));
}
function endQuiz() {
  const { items, right, wrong, theme } = quizRun, n = items.length, pct = Math.round(right / n * 100);
  if ((state.best[theme] ?? -1) < pct) state.best[theme] = pct;
  if (right === n && n >= 10) state.perfect++;
  touchDay(); checkBadges(); save(); refreshChrome();
  const msg = pct === 100 ? "Parfait ! 🏆" : pct >= 70 ? "Très bien ! 👏" : pct >= 50 ? "Pas mal, continue ! 💪" : "Relis les cours et réessaie, tu vas y arriver ! 📚";
  $("#quizRun").replaceChildren(
    el("p", { class: "score-big", text: `${right}/${n}` }),
    el("h3", { text: msg }), el("p", { class: "muted", text: `Score : ${pct} %. Les bonnes réponses obtenues pour la première fois ont rapporté de l'XP.` }),
    wrong.length ? el("h3", { text: "À revoir" }) : null,
    ...wrong.map(w => el("div", { class: "review-item" }, el("strong", {}, inline(w.q.q)), w.q.code && el("pre", { class: "console", text: w.q.code, style: "margin:6px 0;border-radius:8px" }),
      el("div", { class: "muted" }, "Ta réponse : ", w.chosen), el("div", {}, "✅ ", w.q.o[w.q.a]), el("div", { class: "muted" }, inline(w.q.why)))),
    el("div", { class: "row", style: "margin-top:16px" },
      el("button", { class: "btn", type: "button", text: "Rejouer", on: { click: startQuiz } }),
      el("button", { class: "btn ghost", type: "button", text: "Changer de thème", on: { click: () => { $("#quizRun").hidden = true; $("#quizSetup").hidden = false; showQuizBest(); } } })));
}

/* ═════════════════ Métiers ═════════════════ */
function renderCareers() {
  const list = $("#careerList"); list.replaceChildren();
  const term = $("#careerSearch").value.toLowerCase().trim();
  let count = 0;
  careerGroups.forEach(([group, jobs]) => {
    const filtered = jobs.filter(([n, d]) => (n + " " + d + " " + group).toLowerCase().includes(term));
    if (!filtered.length) return;
    count += filtered.length;
    const cat = el("details", { class: "cat", open: !!term }, el("summary", { text: `${group} (${filtered.length})` }));
    const info = getCareerInfo(group);
    filtered.forEach(([name, desc]) => {
      const panel = el("div", { class: "job-detail", hidden: true });
      [["📖 Description", desc],
        ["💶 Salaire indicatif en France", info.salary + " (brut annuel, estimation large, non garantie)."],
        ["🏢 Où exercer ?", info.places + "."],
        ["💻 Langages et outils", info.languages + "."],
        ["🧠 Compétences nécessaires", info.skills + "."],
        ["🎓 Études possibles", "BUT informatique, licence informatique, école d'ingénieurs, master ou formation spécialisée selon le métier. Vérifie les conditions d'admission."],
        ["🚀 Comment commencer ?", "Apprends Python, réalise de petits projets et constitue un portfolio. Les compétences exactes varient selon l'employeur."]
      ].forEach(([h, t]) => panel.append(el("h4", { text: h }), el("p", { text: t })));
      const btn = el("button", { class: "job-button", type: "button", "aria-expanded": "false", text: "＋  " + name });
      btn.addEventListener("click", () => { panel.hidden = !panel.hidden; btn.setAttribute("aria-expanded", !panel.hidden); btn.textContent = (panel.hidden ? "＋  " : "−  ") + name; });
      cat.append(el("div", {}, btn, panel));
    });
    list.append(cat);
  });
  list.prepend(el("p", { class: "muted", text: `${plural(count, "métier affiché", "métiers affichés")}. Ce catalogue est une sélection, pas la totalité des intitulés existants.` }));
}
$("#careerSearch").addEventListener("input", renderCareers);

/* ═════════════════ Professeur IA ═════════════════ */
const aiHistory = [];
let aiContext = null, aiBusy = false;
const AI_WELCOME = "Salut ! Je suis ton professeur IA. Nous allons progresser étape par étape. Tu débutes en Python ? Parfait ! Pose-moi une question ou choisis une activité ci-dessus pour commencer.";
function addIAMessage(role, text) {
  const body = role === "user" ? el("p", { text }) : markdown(text);
  const item = el("div", { class: "ai-message " + (role === "user" ? "user" : "assistant") }, el("strong", { text: role === "user" ? "Toi" : "🤖 Ton professeur" }), body);
  $("#aiMessages").append(item);
  $("#aiMessages").scrollTop = $("#aiMessages").scrollHeight;
  return item;
}
function setAIContext(ctx) {
  aiContext = ctx;
  $("#aiContext").hidden = !ctx;
  if (ctx) $("#aiContextText").textContent = "📎 Contexte partagé avec le professeur : " + ctx.label;
}
function openAI(prompt, ctx) {
  showPage("ai", { noScroll: true });
  setAIContext(ctx ? { label: ctx.label, text: ctx.text } : null);
  if (ctx && ctx.send === false) { $("#aiInput").value = prompt; $("#aiInput").focus(); window.scrollTo({ top: 0 }); return; }
  askIA(prompt);
}
async function askIA(prompt) {
  const question = String(prompt || "").trim();
  if (!question || aiBusy) return;
  aiBusy = true;
  const err = $("#aiError"); err.hidden = true;
  addIAMessage("user", question);
  aiHistory.push({ role: "user", content: question });
  $("#aiInput").value = "";
  $("#aiSend").disabled = true; $("#aiSend").textContent = "Réflexion…";
  const typing = el("div", { class: "ai-message assistant typing", "aria-label": "Le professeur écrit" }, el("span"), el("span"), el("span"));
  $("#aiMessages").append(typing); $("#aiMessages").scrollTop = $("#aiMessages").scrollHeight;
  try {
    const res = await fetch("/api/ai-tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: aiHistory.slice(-12), context: aiContext ? aiContext.text.slice(0, 2500) : "" }) });
    const data = await res.json().catch(() => ({}));
    if (res.status === 404 || res.status === 405) throw new Error("Le professeur IA nécessite le serveur : lance « node server.js » (voir le fichier LISEZMOI).");
    if (!res.ok) throw new Error(data.error || "Le professeur IA est momentanément indisponible.");
    if (!data.reply) throw new Error("Le serveur n'a pas renvoyé de réponse.");
    typing.remove();
    aiHistory.push({ role: "assistant", content: data.reply });
    addIAMessage("assistant", data.reply);
    $("#aiStatus").textContent = "● Assistant prêt"; $("#aiStatus").style.color = "";
    state.aiCount++; checkBadges(); save();
  } catch (e) {
    typing.remove(); aiHistory.pop();
    const offline = e instanceof TypeError;
    err.textContent = offline ? "Impossible de contacter le professeur IA. Vérifie que le serveur est lancé (node server.js)." : e.message;
    err.hidden = false;
    if (offline) { $("#aiStatus").textContent = "○ Hors ligne"; $("#aiStatus").style.color = "var(--red)"; }
  } finally {
    aiBusy = false; $("#aiSend").disabled = false; $("#aiSend").textContent = "Envoyer ↗";
    $("#aiInput").focus({ preventScroll: true });
  }
}
function clearIA() {
  aiHistory.length = 0; $("#aiMessages").replaceChildren(); $("#aiError").hidden = true; setAIContext(null);
  addIAMessage("assistant", AI_WELCOME);
}
$("#aiForm").addEventListener("submit", e => { e.preventDefault(); askIA($("#aiInput").value); });
$("#aiInput").addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); $("#aiForm").requestSubmit(); } });
$("#aiClear").addEventListener("click", clearIA);
$("#aiContextClear").addEventListener("click", () => setAIContext(null));
$$("[data-ask]").forEach(b => b.addEventListener("click", () => askIA(b.dataset.ask)));

/* ═════════════════ Résultats ═════════════════ */
function renderProgress() {
  const c = counts(), li = levelInfo(c.xp);
  $("#progressStats").replaceChildren(
    stat(c.xp, "XP au total"), stat(`${li.lvl} · ${li.name}`, "niveau"),
    stat(currentStreak() + " 🔥", "série en cours"), stat(state.bestStreak || 0, "meilleure série (jours)"),
    stat(Object.keys(state.badges).length + "/" + BADGES.length, "badges"));
  const rows = [];
  const barRow = (label, done, total) => el("div", { style: "margin:10px 0" }, el("div", { class: "row", style: "justify-content:space-between" }, el("span", { text: label }), el("span", { class: "muted", text: `${done}/${total}` })), el("div", { class: "bar" }, el("i", { style: `width:${total ? done / total * 100 : 0}%` })));
  rows.push(el("h4", { text: "Cours par module" }));
  MODULES.forEach(m => { const ls = LESSONS.filter(l => l.module === m.id); if (ls.length) rows.push(barRow(`${m.icon} ${m.title}`, ls.filter(l => isDone(l.id)).length, ls.length)); });
  rows.push(el("h4", { text: "Exercices par niveau" }));
  [1, 2, 3, 4, 5].forEach(n => { const es = EXERCISES.filter(e => e.level === n); rows.push(barRow("Niveau " + n, es.filter(e => isDone(e.id)).length, es.length)); });
  rows.push(el("h4", { text: "Parcours 100 niveaux (exercices réussis)" }));
  Object.keys(LEVEL_COUNTS).forEach(k => rows.push(barRow("Niveau " + k + " · " + LEVELS[k - 1].title, solvedIn(levelPrefix(k)), LEVEL_COUNTS[k])));
  Object.keys(DEFI_COUNTS).forEach(k => rows.push(barRow("🏆 Défi " + k, solvedIn(defiPrefix(k)), DEFI_COUNTS[k])));
  rows.push(el("h4", { text: "Quiz par thème (questions maîtrisées)" }));
  QUIZ_THEMES.forEach(t => { const qs = QUIZ.map((q, i) => ({ q, i })).filter(x => x.q.t === t); rows.push(barRow(t, qs.filter(x => isDone("q" + x.i)).length, qs.length)); });
  $("#progressDetail").replaceChildren(...rows);
  badgeGrid($("#allBadges"));
}
$("#resetProgress").addEventListener("click", () => {
  if (confirm("Effacer toute la progression sur cet appareil ? Cette action est définitive.")) {
    state = defaultState(); save(); refreshChrome(); renderProgress(); renderCourseList(); renderExercises();
  }
});
$("#exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ app: "devenir-ingenieur", version: 2, state }, null, 2)], { type: "application/json" });
  const a = el("a", { href: URL.createObjectURL(blob), download: "progression-devenir-ingenieur.json" });
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});
$("#importFile").addEventListener("change", async e => {
  const f = e.target.files[0]; if (!f) return;
  try {
    const data = JSON.parse(await f.text());
    if (data.app !== "devenir-ingenieur" || typeof data.state !== "object" || typeof data.state.xp !== "object") throw new Error("format");
    state = Object.assign(defaultState(), data.state); save(); refreshChrome(); renderProgress(); renderCourseList(); renderExercises();
    toast("Progression importée ✔");
  } catch (err) { toast("Fichier non valide"); }
  e.target.value = "";
});

/* ═════════════════ Parcours 100 niveaux ═════════════════ */
const pad = (n, w) => String(n).padStart(w, "0");
const levelPrefix = n => "L" + pad(n, 3) + "-";
const defiPrefix = k => "D" + pad(k, 2) + "-";
const solvedIn = prefix => Object.keys(state.xp).filter(k => k.startsWith(prefix)).length;
const TOTAL_PATH = () => Object.values(LEVEL_COUNTS).reduce((a, b) => a + b, 0);
const hasLevel = n => !!LEVEL_COUNTS[n];
const hasDefi = k => !!DEFI_COUNTS[k];
const needFor = n => Math.min(UNLOCK_MIN, LEVEL_COUNTS[n] || UNLOCK_MIN);
const levelUnlocked = n => n === 1 || state.freeMode || (hasLevel(n - 1) && solvedIn(levelPrefix(n - 1)) >= needFor(n - 1));
const defiUnlocked = k => state.freeMode || (hasLevel(k * 10) && solvedIn(levelPrefix(k * 10)) >= needFor(k * 10));

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = el("script", { src });
    s.onload = resolve; s.onerror = () => reject(new Error("Impossible de charger " + src));
    document.head.append(s);
  });
}
const NORM = {};
async function loadLevel(n) {
  if (!NORM["L" + n]) {
    if (!LEVEL_DATA[n]) await loadScript(`js/levels/level-${pad(n, 3)}.js`);
    NORM["L" + n] = LEVEL_DATA[n].map((x, i) => ({ id: x.id, num: i + 1, level: n, label: "Niveau " + n, title: x.t, q: x.q, hint: x.h, starter: x.s || "", sol: x.a, tests: x.k, inputs: x.i, xp: 1 + Math.floor(n / 10) }));
  }
  return NORM["L" + n];
}
async function loadDefi(k) {
  if (!NORM["D" + k]) {
    if (!CHALLENGE_DATA[k]) await loadScript(`js/challenges/defi-${pad(k, 3)}.js`);
    NORM["D" + k] = CHALLENGE_DATA[k].map((x, i) => ({ id: x.id, level: 5, label: "Défi " + k, title: x.t, q: x.q, hint: x.h, starter: x.s || "", sol: x.a, tests: x.k, inputs: x.i, xp: DEFI_XP }));
  }
  return NORM["D" + k];
}

let pathLevel = null, pathPage = 0;
function pathShow(which) { $("#pathMap").hidden = which !== "map"; $("#pathLevel").hidden = which !== "level"; $("#pathDefi").hidden = which !== "defi"; }

function renderPath() {
  pathShow("map");
  const solvedAll = countPrefix("L");
  const next = (() => { for (let n = 1; n <= 100; n++) if (hasLevel(n) && levelUnlocked(n) && solvedIn(levelPrefix(n)) < LEVEL_COUNTS[n]) return n; return null; })();
  const free = el("input", { type: "checkbox", id: "freeMode", checked: !!state.freeMode });
  free.addEventListener("change", () => { state.freeMode = free.checked; save(); renderPath(); });
  const head = el("div", { class: "panel" },
    el("h2", { text: "🏔️ Parcours Python : 100 niveaux" }),
    el("p", { class: "muted" }, `Du tout premier \`print\` jusqu'aux projets d'ingénieur. Chaque niveau contient des centaines d'exercices corrigés automatiquement. Réussis ${UNLOCK_MIN} exercices d'un niveau pour débloquer le suivant ; un 🏆 défi t'attend tous les 10 niveaux.`),
    el("div", { class: "row" },
      el("span", { class: "tag", text: `${solvedAll} / ${TOTAL_PATH()} exercices disponibles réussis` }),
      next && el("button", { class: "btn", type: "button", text: `Continuer : niveau ${next} →`, on: { click: () => openLevel(next) } }),
      el("label", { class: "muted", style: "margin-left:auto" }, free, " Tout débloquer (mode libre)")));
  const box = $("#pathMap"); box.replaceChildren(head);
  PALIERS.forEach(p => {
    const first = (p.n - 1) * 10 + 1, last = p.n * 10;
    const total = Object.entries(LEVEL_COUNTS).filter(([k]) => k >= first && k <= last).reduce((a, [, v]) => a + v, 0);
    let done = 0; for (let n = first; n <= last; n++) done += solvedIn(levelPrefix(n));
    const grid = el("div", { class: "level-grid" });
    for (let n = first; n <= last; n++) {
      const L = LEVELS[n - 1], avail = hasLevel(n), unlocked = avail && levelUnlocked(n);
      const solved = avail ? solvedIn(levelPrefix(n)) : 0, tot = LEVEL_COUNTS[n] || 0;
      const cls = "level-tile" + (!avail ? " soon" : !unlocked ? " locked" : solved >= tot && tot ? " done" : solved ? " started" : "");
      const t = el("button", { class: cls, type: "button", title: L.title }, el("b", { text: String(n) }), el("span", { text: L.title }),
        avail ? el("small", { text: unlocked ? `${solved}/${tot}` : `🔒 ${needFor(n - 1)} réussis au niveau ${n - 1}` }) : el("small", { text: "bientôt" }),
        avail && unlocked && el("div", { class: "bar" }, el("i", { style: `width:${tot ? solved / tot * 100 : 0}%` })));
      t.addEventListener("click", () => {
        if (!avail) return toast("Ce niveau arrive bientôt : il est déjà planifié dans le programme.");
        if (!unlocked) return toast(`Réussis ${needFor(n - 1)} exercices du niveau ${n - 1} pour débloquer ce niveau.`);
        openLevel(n);
      });
      grid.append(t);
    }
    const dk = p.n, dAvail = hasDefi(dk), dUnlocked = dAvail && defiUnlocked(dk), dSolved = dAvail ? solvedIn(defiPrefix(dk)) : 0;
    const defiBtn = el("button", { class: "defi-tile" + (!dAvail ? " soon" : !dUnlocked ? " locked" : isDone("bonus-defi" + dk) ? " done" : ""), type: "button" },
      el("span", { class: "ico", text: "🏆" }),
      el("span", {}, el("b", { text: `Défi ${dk} · ${p.defi.title}` }), el("br"), el("small", { text: dAvail ? (dUnlocked ? `${dSolved}/${DEFI_COUNTS[dk]} réussis · ${p.defi.skills}` : `🔒 Réussis ${needFor(last)} exercices du niveau ${last} pour l'ouvrir`) : `Bientôt · ${p.defi.skills}` })));
    defiBtn.addEventListener("click", () => {
      if (!dAvail && dk !== 10) return toast("Ce défi arrive bientôt : il est déjà planifié dans le programme.");
      if (dAvail && !dUnlocked) return toast(`Réussis ${needFor(last)} exercices du niveau ${last} pour ouvrir ce défi.`);
      openDefi(dk);
    });
    box.append(el("div", { class: "panel palier" },
      el("div", { class: "module-head" }, el("span", { text: p.icon, style: "font-size:26px" }),
        el("div", {}, el("h3", { text: `Niveaux ${first} à ${last} · ${p.title}` }), el("span", { class: "muted", text: total ? `${done} / ${total} exercices réussis` : "À venir" })),
        el("div", { class: "bar", title: `${done}/${total}` }, el("i", { style: `width:${total ? done / total * 100 : 0}%` }))),
      grid, defiBtn));
  });
  box.append(capstonePanel());
}
function capstonePanel() {
  return el("div", { class: "panel" },
    el("h3", { text: "🎓 Au niveau 100 : les 5 plus grosses réalisations en Python" }),
    el("p", { class: "muted", text: "Le parcours vise ces cinq projets d'ingénieur. Chaque palier te donne les compétences nécessaires pour les mener à bien. Ils seront proposés comme projets guidés au fil des prochains niveaux." }),
    el("div", { class: "grid" }, CAPSTONES.map(c => el("div", { class: "card" }, el("h4", { text: c.icon + " " + c.title, style: "margin-top:0" }), el("p", { class: "muted", text: c.desc })))));
}

async function openLevel(n, page) {
  if (!hasLevel(n)) return;
  state.lastLevel = n; save();
  showPage("path", { keepPath: true, noScroll: true }); pathShow("level");
  const view = $("#pathLevel");
  view.replaceChildren(el("p", { class: "muted", text: "Chargement du niveau…" }));
  let items;
  try { items = await loadLevel(n); } catch (e) { view.replaceChildren(el("p", { class: "ai-error", text: e.message })); return; }
  const L = LEVELS[n - 1], pages = Math.ceil(items.length / PAGE_SIZE);
  if (page == null) { const i = items.findIndex(x => !isDone(x.id)); page = i < 0 ? 0 : Math.floor(i / PAGE_SIZE); }
  pathLevel = n; pathPage = Math.max(0, Math.min(page, pages - 1));
  const solved = () => solvedIn(levelPrefix(n));
  const barFill = el("i"), info = el("span", { class: "muted" });
  const refresh = () => { const s = solved(); barFill.style.width = (s / items.length * 100) + "%"; info.textContent = `${s} / ${items.length} exercices réussis` + (n < 100 && hasLevel(n + 1) && s >= needFor(n) ? ` · niveau ${n + 1} débloqué ✔` : ""); };
  items.forEach(it => { it.onSolved = refresh; });
  refresh();
  const pager = () => el("div", { class: "pager" },
    el("button", { class: "btn ghost small", type: "button", text: "← Série précédente", disabled: pathPage === 0, on: { click: () => openLevel(n, pathPage - 1) } }),
    (() => { const sel = el("select", { "aria-label": "Choisir une série" }, Array.from({ length: pages }, (_, i) => { const from = i * PAGE_SIZE; const d = items.slice(from, from + PAGE_SIZE).filter(x => isDone(x.id)).length; return el("option", { value: i, selected: i === pathPage, text: `Série ${i + 1}/${pages}${d === Math.min(PAGE_SIZE, items.length - from) ? " ✓" : d ? ` (${d})` : ""}` }); })); sel.addEventListener("change", () => openLevel(n, +sel.value)); return sel; })(),
    el("button", { class: "btn ghost small", type: "button", text: "Série suivante →", disabled: pathPage >= pages - 1, on: { click: () => openLevel(n, pathPage + 1) } }));
  const list = el("div");
  items.slice(pathPage * PAGE_SIZE, (pathPage + 1) * PAGE_SIZE).forEach(it => list.append(exerciseCard(it)));
  const nextUnsolved = items.findIndex(x => !isDone(x.id));
  view.replaceChildren(
    el("button", { class: "btn ghost small", type: "button", text: "← Carte des niveaux", on: { click: () => renderPath() } }),
    el("p", { class: "muted", style: "margin:14px 0 2px", text: `Palier ${L.palier} · ${PALIERS[L.palier - 1].title}` }),
    el("h2", { text: `Niveau ${n} · ${L.title}`, style: "margin:0 0 8px" }),
    el("div", { class: "bar" }, barFill), info,
    el("div", { class: "row", style: "margin:12px 0" }, pager(), nextUnsolved >= 0 && el("button", { class: "btn small", type: "button", text: "Aller au premier exercice à faire", on: { click: () => openLevel(n, Math.floor(nextUnsolved / PAGE_SIZE)) } })),
    list, pager());
  window.scrollTo({ top: 0 });
}

async function checkDefiBonus(k) {
  const items = await loadDefi(k);
  if (items.every(x => isDone(x.id)) && award("bonus-defi" + k, DEFI_BONUS)) toast(`🏆 Défi ${k} réussi : +${DEFI_BONUS} XP de bonus !`);
}
async function openDefi(k) {
  showPage("path", { keepPath: true, noScroll: true }); pathShow("defi");
  const view = $("#pathDefi"), p = PALIERS[k - 1];
  const back = el("button", { class: "btn ghost small", type: "button", text: "← Carte des niveaux", on: { click: () => renderPath() } });
  const title = el("h2", { text: `🏆 Défi ${k} · ${p.defi.title}`, style: "margin:14px 0 6px" });
  const intro = el("p", {}, `Ce défi réunit les compétences des niveaux ${(k - 1) * 10 + 1} à ${k * 10} : `, p.defi.skills, ".");
  if (!hasDefi(k)) {
    view.replaceChildren(back, title, intro, el("div", { class: "callout warn" }, el("b", { class: "lbl", text: "À venir" }), "Ce défi est déjà planifié dans le programme, mais pas encore écrit."), k === 10 ? capstonePanel() : null);
    return;
  }
  view.replaceChildren(back, title, el("p", { class: "muted", text: "Chargement…" }));
  let items; try { items = await loadDefi(k); } catch (e) { view.replaceChildren(back, el("p", { class: "ai-error", text: e.message })); return; }
  const fill = el("i"), info = el("span", { class: "muted" });
  const refresh = () => { const s = items.filter(x => isDone(x.id)).length; fill.style.width = (s / items.length * 100) + "%"; info.textContent = `${s} / ${items.length} réussis` + (isDone("bonus-defi" + k) ? ` · 🏆 Défi réussi ! (+${DEFI_BONUS} XP de bonus obtenus)` : ` · bonus de ${DEFI_BONUS} XP quand tout est réussi`); };
  items.forEach(it => { it.onSolved = () => { refresh(); checkDefiBonus(k).then(refresh); }; });
  refresh();
  view.replaceChildren(back, title, intro, el("p", { class: "muted", text: `Chaque exercice rapporte ${DEFI_XP} XP. Ils sont plus longs que ceux des niveaux : prends ton temps, relis l'énoncé et teste ton code avant de vérifier.` }),
    el("div", { class: "bar" }, fill), info, el("div", { style: "margin-top:14px" }, items.map(it => exerciseCard(it))));
  window.scrollTo({ top: 0 });
}

/* ═════════════════ Démarrage ═════════════════ */
initQuiz(); renderExercises(); renderCareers(); renderCourseList(); clearIA(); refreshChrome();
const startPage = (location.hash || "").slice(1);
showPage(TITLES[startPage] ? startPage : "home", { noScroll: true });
