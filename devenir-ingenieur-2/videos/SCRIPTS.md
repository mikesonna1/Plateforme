# Scripts des vidéos

Un script par cours. Chaque vidéo suit la même structure : accroche → démonstration → à retenir → conclusion.
Copie la partie « Narration » dans ton outil de vidéo IA (voix + avatar) et utilise « À l'écran » comme consigne visuelle.
Nomme ensuite le fichier `videos/<identifiant>.mp4` et déclare-le dans `js/data-videos.js`.

---

## Cours 1 · Premiers pas : afficher du texte  (`l1`)

**Titre de la vidéo :** Ton premier programme Python  
**Durée visée :** 3 min

### 1. Accroche
**Narration :** Dans cette vidéo, tu vas écrire ton tout premier programme en moins de trois minutes, sans rien installer.

**À l'écran :** titre animé « Premiers pas : afficher du texte ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Écris print avec des parenthèses et un texte entre guillemets, exécute, puis provoque volontairement une erreur de guillemet pour montrer comment lire le message. Utilise un éditeur de code, avec par exemple :

```python
print("Bonjour le monde !")
```

### 3. À retenir
**Narration :** Pour résumer. print() affiche du texte ou des valeurs. Le texte s'écrit entre guillemets. # commence un commentaire. Python lit le code de haut en bas.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 2 · Les variables et les types  (`l2`)

**Titre de la vidéo :** Les variables, des boîtes pour tes données  
**Durée visée :** 4 min

### 1. Accroche
**Narration :** Une variable, c'est une boîte avec une étiquette. Et tu vas voir qu'on peut y mettre bien plus que des nombres.

**À l'écran :** titre animé « Les variables et les types ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Crée prenom et age, affiche-les, change la valeur de score, puis montre type() sur chaque sorte de valeur et termine par une f-string. Utilise un éditeur de code, avec par exemple :

```python
prenom = "Alex"
age = 16
print(prenom)
print(age)
```

### 3. À retenir
**Narration :** Pour résumer. = range une valeur dans une variable. Types de base : int, float, str, bool. type() donne le type d'une valeur. f"...{variable}..." insère des variables dans un texte.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 3 · Calculer avec Python  (`l3`)

**Titre de la vidéo :** Python, ta calculatrice surpuissante  
**Durée visée :** 4 min

### 1. Accroche
**Narration :** Tu savais que le reste d'une division permet de savoir si un nombre est pair ? Découvre le modulo.

**À l'écran :** titre animé « Calculer avec Python ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Fais défiler les sept opérateurs avec 7 et 2, montre la priorité avec 2 + 3 * 4, puis le raccourci += sur une variable points. Utilise un éditeur de code, avec par exemple :

```python
print(7 + 2)
print(7 / 2)
print(7 // 2)
print(7 % 2)
print(2 ** 10)
```

### 3. À retenir
**Narration :** Pour résumer. / donne un décimal, // le quotient, % le reste.  élève à une puissance. Les parenthèses lèvent toute ambiguïté. +=, -=, *= modifient une variable en place.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 4 · Dialoguer : saisie et conversion  (`l4`)

**Titre de la vidéo :** Faire parler ton programme  
**Durée visée :** 4 min

### 1. Accroche
**Narration :** Jusqu'ici ton programme parlait tout seul. Aujourd'hui il va t'écouter.

**À l'écran :** titre animé « Dialoguer : saisie et conversion ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Utilise input pour demander un prénom, montre le piège de l'âge reçu sous forme de texte, puis corrige avec int(). Utilise un éditeur de code, avec par exemple :

```python
prenom = input("Ton prénom : ")
print("Salut", prenom)
```

### 3. À retenir
**Narration :** Pour résumer. input() lit du texte au clavier. int() et float() convertissent en nombre. str() convertit en texte. On ne peut pas additionner un texte et un nombre.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 5 · Maîtriser les chaînes de caractères  (`l5`)

**Titre de la vidéo :** Le texte n'aura plus de secrets pour toi  
**Durée visée :** 5 min

### 1. Accroche
**Narration :** Découper, inverser, nettoyer : en cinq minutes tu vas manipuler du texte comme un pro.

**À l'écran :** titre animé « Maîtriser les chaînes de caractères ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Montre les indices sur le mot Python avec des flèches, puis le slicing avec a deux-points b, et enfin split et join. Utilise un éditeur de code, avec par exemple :

```python
mot = "Python"
print(len(mot))
print(mot[0])
print(mot[-1])
print(mot[1:4])
```

### 3. À retenir
**Narration :** Pour résumer. Les indices commencent à 0 ; -1 désigne le dernier. [a:b] découpe, [::-1] inverse. upper, lower, strip, replace, split, join sont à connaître. in teste si un texte en contient un autre.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 6 · Les conditions : if, elif, else  (`l6`)

**Titre de la vidéo :** Fais prendre des décisions à ton code  
**Durée visée :** 5 min

### 1. Accroche
**Narration :** Un programme qui fait toujours la même chose est ennuyeux. Avec if, il va enfin réagir.

**À l'écran :** titre animé « Les conditions : if, elif, else ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Écris la condition d'âge, souligne l'indentation en couleur, ajoute elif pour les mentions et montre pourquoi l'ordre des tests compte. Utilise un éditeur de code, avec par exemple :

```python
age = 16
if age >= 18:
    print("Majeur")
else:
    print("Mineur")
```

### 3. À retenir
**Narration :** Pour résumer. if, elif, else choisissent un chemin. == compare, = affecte. L'indentation délimite les blocs. Les conditions sont testées dans l'ordre.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 7 · Opérateurs logiques et booléens  (`l7`)

**Titre de la vidéo :** Et, ou, non : la logique du code  
**Durée visée :** 4 min

### 1. Accroche
**Narration :** Pour décider vraiment, une seule condition ne suffit pas. Voici comment en combiner plusieurs.

**À l'écran :** titre animé « Opérateurs logiques et booléens ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Présente la table de vérité de and et or avec des interrupteurs animés, puis un exemple avec age et permis. Utilise un éditeur de code, avec par exemple :

```python
age = 20
permis = True
if age >= 18 and permis:
    print("Peut conduire")

print(not permis)
print(True or False)
print(True and False)
```

### 3. À retenir
**Narration :** Pour résumer. and, or, not combinent les conditions. 0 <= x < 10 est valide. in teste l'appartenance. Valeurs vides ou nulles = faux.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 8 · La boucle for  (`l8`)

**Titre de la vidéo :** Répéter sans se fatiguer : la boucle for  
**Durée visée :** 5 min

### 1. Accroche
**Narration :** Écrire mille lignes ? Non merci. Avec une boucle for, trois lignes suffisent.

**À l'écran :** titre animé « La boucle for ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Anime range(1, 6) avec les nombres qui défilent, puis calcule la somme de 1 à 100 avec un accumulateur. Utilise un éditeur de code, avec par exemple :

```python
for i in range(1, 6):
    print(i)
```

### 3. À retenir
**Narration :** Pour résumer. for ... in ... répète pour chaque élément. range(début, fin, pas) : la fin est exclue. Accumulateur : total += valeur. break arrête, continue passe au suivant.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 9 · La boucle while  (`l9`)

**Titre de la vidéo :** While : répéter jusqu'à ce que ça marche  
**Durée visée :** 4 min

### 1. Accroche
**Narration :** Combien de fois faut-il réessayer ? Tant que ce n'est pas bon, on recommence : c'est la boucle while.

**À l'écran :** titre animé « La boucle while ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Montre la boucle de compteur, provoque une boucle infinie en oubliant n += 1, puis la validation de saisie d'âge. Utilise un éditeur de code, avec par exemple :

```python
n = 0
while n < 3:
    print(n)
    n += 1
print("Fini")
```

### 3. À retenir
**Narration :** Pour résumer. while condition: répète tant que la condition est vraie. Il faut modifier quelque chose dans la boucle pour qu'elle s'arrête. while True + break : boucle de menu ou de saisie. for si on connaît le nombre de tours, while sinon.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 10 · Les listes  (`l10`)

**Titre de la vidéo :** Les listes, ton premier tableau de données  
**Durée visée :** 6 min

### 1. Accroche
**Narration :** Stocker mille notes dans mille variables ? Impossible. Les listes sont là pour ça.

**À l'écran :** titre animé « Les listes ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Construis une liste de notes, ajoute, retire, trie, puis montre le piège de la copie avec deux étiquettes pointant vers la même boîte. Utilise un éditeur de code, avec par exemple :

```python
langages = ["Python", "Java", "C++"]
print(langages[0])
print(langages[-1])
print(len(langages))
```

### 3. À retenir
**Narration :** Pour résumer. Une liste : [a, b, c], indices à partir de 0. append, insert, remove, pop modifient la liste. sum, min, max, sorted, len s'appliquent aux listes. b = a ne copie pas : utilise .copy().

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 11 · Tuples et ensembles  (`l11`)

**Titre de la vidéo :** Tuples et sets en 3 minutes  
**Durée visée :** 3 min

### 1. Accroche
**Narration :** Une liste qui ne bouge plus, et un sac qui refuse les doublons : voici tuples et ensembles.

**À l'écran :** titre animé « Tuples et ensembles ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Crée un point (3, 4), déballe-le dans x et y, puis transforme une liste avec doublons en set. Utilise un éditeur de code, avec par exemple :

```python
point = (3, 4)
print(point[0])
x, y = point        # déballage (unpacking)
print(x, y)
print(len(point))
```

### 3. À retenir
**Narration :** Pour résumer. Tuple (a, b) : ordonné et non modifiable. Set {a, b} : unique, sans ordre. & intersection, | union, - différence. set(liste) supprime les doublons.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 12 · Les dictionnaires  (`l12`)

**Titre de la vidéo :** Les dictionnaires : des données qui ont du sens  
**Durée visée :** 5 min

### 1. Accroche
**Narration :** Plutôt que de te souvenir que l'âge est à l'indice 1, donne-lui simplement un nom.

**À l'écran :** titre animé « Les dictionnaires ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Construis la fiche d'un élève, montre get, puis compte les lettres d'un mot avec un dictionnaire. Utilise un éditeur de code, avec par exemple :

```python
eleve = {"nom": "Alex", "age": 16, "classe": "2nde"}
print(eleve["nom"])
eleve["age"] = 17          # modifier
eleve["ville"] = "Lyon"   # ajouter
print(eleve)
```

### 3. À retenir
**Narration :** Pour résumer. {clé: valeur} associe des informations. d[clé] lit, d[clé] = v écrit. get évite l'erreur si la clé manque. items() parcourt clés et valeurs ensemble.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 13 · Les compréhensions de listes  (`l13`)

**Titre de la vidéo :** Une liste en une ligne  
**Durée visée :** 3 min

### 1. Accroche
**Narration :** Cinq lignes qui deviennent une seule, sans perdre en clarté : voici les compréhensions.

**À l'écran :** titre animé « Les compréhensions de listes ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Affiche côte à côte la boucle classique et la compréhension, puis ajoute un filtre sur les nombres pairs. Utilise un éditeur de code, avec par exemple :

```python
# Version classique
carres = []
for n in range(1, 6):
    carres.append(n * n)
print(carres)

# Version compréhension
print([n * n for n in range(1, 6)])
```

### 3. À retenir
**Narration :** Pour résumer. [expr for x in seq] construit une liste. if à la fin filtre les éléments. Même idée pour les dictionnaires {k: v for ...}. Lisibilité d'abord.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 14 · Créer ses propres fonctions  (`l14`)

**Titre de la vidéo :** Les fonctions : tes briques Lego  
**Durée visée :** 6 min

### 1. Accroche
**Narration :** Si tu recopies deux fois le même code, c'est qu'il te faut une fonction.

**À l'écran :** titre animé « Créer ses propres fonctions ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Crée dire_bonjour, puis carre avec return, et explique la différence entre print et return avec une boîte à entrée et sortie. Utilise un éditeur de code, avec par exemple :

```python
def dire_bonjour():
    print("Bonjour !")

dire_bonjour()
dire_bonjour()
```

### 3. À retenir
**Narration :** Pour résumer. def nom(paramètres): définit une fonction. return renvoie un résultat, print affiche. Les paramètres peuvent avoir une valeur par défaut. Une fonction = une tâche, un nom clair.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 15 · Portée des variables et paramètres avancés  (`l15`)

**Titre de la vidéo :** Où vivent tes variables ?  
**Durée visée :** 4 min

### 1. Accroche
**Narration :** Pourquoi Python dit que ta variable n'existe pas alors que tu viens de la créer ? C'est une histoire de portée.

**À l'écran :** titre animé « Portée des variables et paramètres avancés ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Dessine deux pièces, l'une dans l'autre, pour illustrer l'espace local de la fonction et l'espace global, puis déclenche le NameError. Utilise un éditeur de code, avec par exemple :

```python
def compter():
    total = 10
    return total

compter()
print(total)
```

### 3. À retenir
**Narration :** Pour résumer. Les variables d'une fonction sont locales. Passe les données par paramètres, rends le résultat par return. On peut renvoyer plusieurs valeurs (tuple). Jamais de liste vide en valeur par défaut.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 16 · La récursivité  (`l16`)

**Titre de la vidéo :** La récursivité expliquée avec des poupées russes  
**Durée visée :** 5 min

### 1. Accroche
**Narration :** Ouvre une poupée russe, il y en a une plus petite dedans, et ainsi de suite jusqu'à la dernière : c'est exactement la récursivité.

**À l'écran :** titre animé « La récursivité ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Anime les appels empilés de factorielle(3) qui se déroulent puis se résolvent en remontant. Utilise un éditeur de code, avec par exemple :

```python
def factorielle(n):
    if n <= 1:          # cas de base
        return 1
    return n * factorielle(n - 1)   # appel récursif

print(factorielle(5))
```

### 3. À retenir
**Narration :** Pour résumer. Cas de base + appel plus petit. Chaque appel est empilé en mémoire. Pas de cas de base = RecursionError. Élégant, mais pas toujours le plus rapide.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 17 · Gérer les erreurs et les fichiers  (`l17`)

**Titre de la vidéo :** Les erreurs sont tes amies  
**Durée visée :** 6 min

### 1. Accroche
**Narration :** Un bon programme ne plante pas quand l'utilisateur tape n'importe quoi. Voici comment l'en empêcher.

**À l'écran :** titre animé « Gérer les erreurs et les fichiers ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Provoque une ValueError avec int("abc"), puis protège le code avec try/except et termine par l'écriture d'un fichier texte. Utilise un éditeur de code, avec par exemple :

```python
try:
    age = int(input("Ton âge : "))
    print("Dans 10 ans :", age + 10)
except ValueError:
    print("Ce n'est pas un nombre !")
```

### 3. À retenir
**Narration :** Pour résumer. try/except évite le plantage. Précise le type d'erreur attendu. raise signale un problème volontairement. with open(...) lit et écrit proprement.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 18 · Modules et bibliothèques  (`l18`)

**Titre de la vidéo :** Importer des super-pouvoirs  
**Durée visée :** 4 min

### 1. Accroche
**Narration :** Pourquoi tout coder soi-même quand quelqu'un a déjà écrit, testé et publié exactement ce dont tu as besoin ?

**À l'écran :** titre animé « Modules et bibliothèques ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Importe math, calcule une racine, lance un dé avec random et compte des lettres avec Counter. Utilise un éditeur de code, avec par exemple :

```python
import math

print(math.sqrt(16))
print(math.pi)
print(math.floor(3.7), math.ceil(3.2))
```

### 3. À retenir
**Narration :** Pour résumer. import module puis module.fonction(). from module import nom évite le préfixe. La bibliothèque standard est énorme : cherche avant de réinventer. pip install ajoute des bibliothèques externes.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 19 · Programmation orientée objet  (`l19`)

**Titre de la vidéo :** Les classes et les objets, avec un chien  
**Durée visée :** 7 min

### 1. Accroche
**Narration :** Les jeux vidéo, les applis mobiles, les sites web : presque tout est fait d'objets. Voici comment en fabriquer.

**À l'écran :** titre animé « Programmation orientée objet ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Dessine le plan d'un chien (classe) puis fabrique Rex et Fido (objets), et montre aboyer() et __init__ ligne par ligne. Utilise un éditeur de code, avec par exemple :

```python
class Chien:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age

    def aboyer(self):
        return f"{self.nom} dit : Ouaf !"

rex = Chien("Rex", 3)
print(rex.nom)
print(rex.aboyer())
```

### 3. À retenir
**Narration :** Pour résumer. Classe = plan, objet = exemplaire. __init__ initialise les attributs avec self. Les méthodes sont des fonctions de la classe. L'héritage réutilise et spécialise une classe.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 20 · Algorithmique : rechercher, trier, mesurer  (`l20`)

**Titre de la vidéo :** Pourquoi certains programmes sont-ils plus rapides ?  
**Durée visée :** 7 min

### 1. Accroche
**Narration :** Trouver un nom dans un annuaire d'un million de pages : tu ne lis pas tout, tu ouvres au milieu. Voilà l'idée de la dichotomie.

**À l'écran :** titre animé « Algorithmique : rechercher, trier, mesurer ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Compare deux barres animées : la recherche linéaire qui avance case par case et la dichotomie qui coupe en deux à chaque étape. Utilise un éditeur de code, avec par exemple :

```python
def recherche(liste, x):
    for i, v in enumerate(liste):
        if v == x:
            return i
    return -1

print(recherche([4, 8, 15, 16, 23], 15))
print(recherche([4, 8, 15], 99))
```

### 3. À retenir
**Narration :** Pour résumer. Un algorithme = une méthode étape par étape. Dichotomie : diviser par deux, mais liste triée obligatoire. Complexité : O(1) < O(log n) < O(n) < O(n²). Mesure et compare avant d'optimiser.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

---

## Cours 21 · Projet : le jeu du nombre mystère  (`l21`)

**Titre de la vidéo :** On code un jeu ensemble, de zéro  
**Durée visée :** 10 min

### 1. Accroche
**Narration :** Dix minutes, un fichier, et à la fin un vrai jeu auquel tu peux faire jouer tes amis.

**À l'écran :** titre animé « Projet : le jeu du nombre mystère ».

### 2. Démonstration
**Narration :** Regarde bien : je te montre ça en direct, pas à pas. (Commente chaque ligne à voix haute.)

**À l'écran :** Code le jeu en direct : d'abord la version simple avec while, puis découpe en fonctions et ajoute le try/except pour les saisies invalides. Utilise un éditeur de code, avec par exemple :

```python
import random

secret = random.randint(1, 100)
print("Un nombre a été choisi !")
```

### 3. À retenir
**Narration :** Pour résumer. Un projet réunit toutes les notions du cours. Découpe en fonctions : saisie, logique, boucle de jeu. try/except protège contre les saisies invalides. Teste avec des valeurs prévisibles avant d'utiliser le hasard.

### 4. Conclusion
**Narration :** À toi de jouer ! Rends-toi dans la section Exercices pour t'entraîner.

