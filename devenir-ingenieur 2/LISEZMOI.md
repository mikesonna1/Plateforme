# Devenir Ingénieur 🚀

Plateforme d'apprentissage de Python en français.

## Contenu

- **21 cours** en 6 modules (bases, conditions et boucles, structures de données, fonctions, aller plus loin, projet final), chacun avec une partie **texte** (exemples exécutables) et une partie **vidéo** (+ script).
- **Parcours Python en 100 niveaux** : les niveaux 1 à 10 (4 755 exercices corrigés automatiquement) et le **défi 1** (10 problèmes) sont disponibles. Les niveaux 11 à 100, les défis 2 à 10 et les 5 grands projets finaux sont planifiés dans `js/curriculum.js` et apparaissent « bientôt » sur la carte.
- **40 exercices liés aux cours** sur 5 niveaux, avec un éditeur Python intégré et une **correction automatique** (tests) : le code s'exécute dans le navigateur grâce à Pyodide, sans rien installer.
- **60 questions de quiz** sur 7 thèmes, avec explications.
- **Professeur IA** (nécessite le serveur et une clé API) qui connaît l'exercice ou le cours en cours.
- XP, niveaux, série de jours, 13 badges, thème clair/sombre, export/import de la progression, affichage mobile.
- Guide de **82 métiers** de l'informatique et parcours d'études.

## Lancer en local

1. Installe Node.js 18 ou plus récent.
2. Dans ce dossier : `npm install`
3. (Facultatif, pour le professeur IA) définis ta clé API, sans jamais la mettre dans un fichier du site :
   - macOS/Linux : `export OPENAI_API_KEY="ta_cle"`
   - PowerShell : `$env:OPENAI_API_KEY="ta_cle"`
4. `npm start` puis ouvre http://localhost:3000

Sans le serveur, tu peux aussi ouvrir `index.html` directement : cours, exercices, quiz et métiers fonctionnent (Python se charge depuis internet à la première exécution). Seul le professeur IA demande le serveur.

Variables facultatives : `OPENAI_MODEL`, `PORT`, `AI_MAX_PER_10MIN` (20 questions par IP et par 10 minutes), `AI_DAILY_LIMIT` (1000 questions par jour pour tout le site), `TRUST_PROXY` (mets `1` derrière un hébergeur qui utilise un proxy). L'usage de l'API peut être facturé.

## Mise en ligne

Il faut un hébergement qui exécute Node.js (le site statique seul ne peut pas faire fonctionner l'IA). Configure `OPENAI_API_KEY` dans les variables secrètes de l'hébergeur. Le serveur ne publie que `index.html`, `css/`, `js/` et `videos/`.

## Ajouter ou modifier du contenu

| Je veux… | Fichier |
|---|---|
| Modifier / ajouter un cours | `js/lessons-1.js`, `lessons-2.js`, `lessons-3.js` (types de blocs expliqués en haut de `js/data-courses.js`) |
| Modifier / ajouter un exercice de cours | `js/data-exercises.js` (énoncé, code de départ, solution, tests) |
| Ajouter des exercices au parcours | `tools/gen/levels-*.js` (modèles + variantes), puis `node tools/gen/build.js` |
| Ajouter / modifier un défi | `tools/gen/defis.py`, puis `python3 tools/gen/defis.py` ; déclare-le dans `DEFI_COUNTS` de `js/curriculum.js` |
| Changer le programme des 100 niveaux | `js/curriculum.js` |
| Modifier / ajouter une question de quiz | `js/data-quiz.js` |
| Ajouter une vidéo | `js/data-videos.js` + dossier `videos/` (voir `videos/README.md`) |
| Modifier les métiers | `js/data-careers.js` |

Après toute modification de contenu, lance `npm run verify` (cours, exercices du cours, quiz) et `node tools/verify-levels.js` (parcours et défis) : le script exécute **tout le Python** du site (solutions des exercices, exemples des cours, quiz « que s'affiche-t-il ? ») et signale la moindre erreur ou incohérence. Pour régénérer les scripts vidéo : `node tools/export-scripts.js`.

## Structure

```
index.html        page unique
css/style.css     styles (thème sombre/clair, mobile)
js/app.js         interface, progression, badges, quiz, IA
js/editor.js      exécution de Python (Pyodide dans un Web Worker, arrêt après 8 s)
js/harness.js     code Python qui lance et teste les programmes des élèves
js/data-*.js      contenus ; js/lessons-*.js : cours
js/curriculum.js  programme des 100 niveaux, défis et grands projets
js/levels/        exercices du parcours, un fichier par niveau (chargés à la demande)
js/challenges/    défis
server.js         serveur + route sécurisée /api/ai-tutor (limitation de débit)
tools/            vérification du contenu, export des scripts vidéo
videos/           tes vidéos + SCRIPTS.md
```
