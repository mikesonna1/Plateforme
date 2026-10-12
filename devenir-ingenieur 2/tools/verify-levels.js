// Vérifie TOUS les exercices des niveaux : la solution doit passer tous les tests,
// le code de départ ne doit pas les réussir tous.   node tools/verify-levels.js
const fs = require("fs"), path = require("path"), vm = require("vm"), cp = require("child_process");
const dirs = [path.join(__dirname, "..", "js", "levels"), path.join(__dirname, "..", "js", "challenges")];
const { PY_HARNESS } = require(path.join(__dirname, "..", "js", "harness.js"));
const all = [];
const ctx = { registerLevel: (n, items) => items.forEach(e => all.push(e)), registerChallenge: (n, items) => items.forEach(e => all.push(e)) };
vm.createContext(ctx);
for (const dir of dirs) for (const f of fs.readdirSync(dir).sort()) vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), ctx);
const jobs = [];
for (const e of all) { jobs.push({ id: e.id, kind: "sol", code: e.a, tests: e.k, inputs: e.i || [] }); jobs.push({ id: e.id, kind: "starter", code: e.s || "", tests: e.k, inputs: e.i || [] }); }
fs.writeFileSync("/tmp/verify-levels.json", JSON.stringify({ harness: PY_HARNESS, jobs }));
const py = `
import json,sys,collections
d=json.load(open('/tmp/verify-levels.json')); ns={}; exec(d['harness'],ns)
bad=collections.Counter(); shown=0; n=0
for j in d['jobs']:
    r=json.loads(ns['__run'](j['code'], [tuple(t) for t in j['tests']], j['inputs'])); n+=1
    fails=[t for t in r['tests'] if not t[1]]
    msg=None
    if j['kind']=='sol':
        if r['error']: msg='erreur '+str(r['error'])
        elif not r['tests']: msg='aucun test'
        elif fails: msg='tests KO '+str(fails[:2])
    else:
        if not r['error'] and r['tests'] and not fails: msg='le code de départ réussit déjà !'
    if msg:
        bad[j['id'].split('-')[0]]+=1
        if shown<25: print('✗',j['kind'],j['id'],msg); shown+=1
print(n//2,'exercices vérifiés ;',sum(bad.values()),'problème(s)', dict(bad))
sys.exit(1 if bad else 0)
`;
const r = cp.spawnSync("python3", ["-I", "-c", py], { encoding: "utf8", maxBuffer: 1 << 26 });
process.stdout.write(r.stdout + r.stderr);
process.exit(r.status);
