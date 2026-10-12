// Vérifie tout le contenu Python : node tools/verify.js   (nécessite python3)
// - chaque solution d'exercice passe tous ses tests ; le code de départ n'en passe pas la totalité
// - chaque extrait de cours s'exécute, et sa sortie correspond au bloc "out" qui suit
// - chaque question de quiz avec run:true a pour bonne réponse la vraie sortie du code
const fs = require("fs"), path = require("path"), vm = require("vm"), cp = require("child_process");
const root = path.join(__dirname, "..", "js");
const ctx = {}; vm.createContext(ctx);
for (const f of ["harness.js", "data-courses.js", "lessons-1.js", "lessons-2.js", "lessons-3.js", "data-exercises.js", "data-quiz.js", "data-careers.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8").replace(/^const /gm, "var "), ctx, { filename: f });
}
const jobs = [];
for (const e of ctx.EXERCISES) {
  jobs.push({ kind: "sol", id: e.id, code: e.sol, tests: e.tests, inputs: e.inputs || [] });
  jobs.push({ kind: "starter", id: e.id, code: e.starter, tests: e.tests, inputs: e.inputs || [] });
}
for (const l of ctx.LESSONS) {
  l.blocks.forEach((b, i) => {
    if (b[0] !== "code") return;
    const opt = b[2] || {};
    const next = l.blocks[i + 1];
    jobs.push({ kind: "lesson", id: l.id + "#" + i, code: b[1], tests: [], inputs: opt.inputs || [], expectErr: !!opt.err, skip: !!opt.skipRun,
      expectOut: next && next[0] === "out" ? next[1] : null });
  });
}
ctx.QUIZ.forEach((q, i) => { if (q.code) jobs.push({ kind: "quiz", id: "q" + i, code: q.code, tests: [], inputs: [], expectErr: !!q.err, expectOut: q.run ? q.o[q.a] : null }); });
fs.writeFileSync("/tmp/verify-jobs.json", JSON.stringify({ harness: ctx.PY_HARNESS, jobs }));
const py = `
import json,sys
d=json.load(open('/tmp/verify-jobs.json')); ns={}; exec(d['harness'],ns)
bad=0; n=0
for j in d['jobs']:
    if j.get('skip'): continue
    r=json.loads(ns['__run'](j['code'], [tuple(t) for t in j['tests']], j['inputs'])); n+=1
    k=j['kind']; msg=None
    if k=='sol':
        fails=[t for t in r['tests'] if not t[1]]
        if r['error']: msg='erreur '+str(r['error'])
        elif fails: msg='tests KO '+str(fails)
    elif k=='starter':
        if not r['error'] and r['tests'] and all(t[1] for t in r['tests']): msg='le code de départ réussit déjà tous les tests !'
    else:
        if j.get('expectErr'):
            if not r['error']: msg="aurait dû provoquer une erreur"
        elif r['error']: msg='erreur '+str(r['error'])
        eo=j.get('expectOut')
        if eo is not None and not msg:
            if r['stdout'].strip()!=eo.strip(): msg='sortie différente:\\n--obtenu--\\n'+r['stdout'].strip()+'\\n--attendu--\\n'+eo.strip()
    if msg: bad+=1; print('✗',k,j['id'],msg)
print(f'{n} vérifications, {bad} problème(s)')
sys.exit(1 if bad else 0)
`;
const r = cp.spawnSync("python3", ["-I", "-c", py], { encoding: "utf8" });
process.stdout.write(r.stdout + r.stderr);
console.log(`Contenu : ${ctx.LESSONS.length} cours, ${ctx.EXERCISES.length} exercices, ${ctx.QUIZ.length} questions, ${ctx.careerGroups.reduce((s, g) => s + g[1].length, 0)} métiers`);
process.exit(r.status);
