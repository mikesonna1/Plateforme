// Catalogue des métiers de l'informatique
const careerGroups = [
    ["Développement logiciel", [
        ["Développeur logiciel", "Conçoit, teste et maintient des logiciels."],
        ["Développeur front-end", "Crée les interfaces visibles des sites et applications."],
        ["Développeur back-end", "Développe les serveurs, API et accès aux données."],
        ["Développeur full-stack", "Travaille sur le front-end et le back-end."],
        ["Développeur web", "Crée des sites et applications web."],
        ["Développeur mobile", "Crée des applications mobiles."],
        ["Ingénieur logiciel", "Conçoit des logiciels fiables et évolutifs."],
        ["Architecte logiciel", "Définit la structure technique d'un logiciel."],
        ["Développeur API", "Permet aux logiciels de communiquer via des API."],
        ["Programmeur système", "Développe des composants proches du système d'exploitation."]
    ]],
    ["Jeux vidéo, 3D et médias interactifs", [
        ["Programmeur gameplay", "Développe les mécaniques de jeu."],
        ["Programmeur moteur de jeu", "Travaille sur les fondations techniques d'un moteur de jeu."],
        ["Développeur Unity", "Crée des jeux et expériences avec Unity."],
        ["Développeur Unreal Engine", "Crée des expériences interactives avec Unreal Engine."],
        ["Artiste technique", "Fait le lien entre art, graphismes et programmation."],
        ["Développeur réalité virtuelle", "Crée des expériences immersives en VR."],
        ["Développeur réalité augmentée", "Superpose des contenus numériques au monde réel."],
        ["Développeur outils 3D", "Crée des outils pour les équipes de création."]
    ]],
    ["Intelligence artificielle et données", [
        ["Ingénieur IA", "Conçoit et déploie des systèmes d'intelligence artificielle."],
        ["Ingénieur machine learning", "Entraîne et déploie des modèles d'apprentissage automatique."],
        ["Data scientist", "Analyse les données et construit des modèles statistiques."],
        ["Data analyst", "Transforme les données en indicateurs utiles."],
        ["Data engineer", "Construit les pipelines et plateformes de données."],
        ["Ingénieur MLOps", "Automatise le déploiement et le suivi des modèles IA."],
        ["Ingénieur vision par ordinateur", "Développe des systèmes qui analysent les images."],
        ["Spécialiste traitement du langage", "Travaille sur la compréhension et la génération de texte."]
    ]],
    ["Cybersécurité", [
        ["Analyste cybersécurité", "Surveille les alertes et recherche les menaces."],
        ["Ingénieur sécurité", "Conçoit des systèmes informatiques sécurisés."],
        ["Pentester", "Teste la sécurité avec une autorisation explicite."],
        ["Analyste SOC", "Surveille les événements de sécurité."],
        ["Spécialiste réponse à incident", "Aide à analyser et contenir les incidents."],
        ["Ingénieur sécurité cloud", "Protège les infrastructures cloud."],
        ["Cryptographe", "Étudie et conçoit des méthodes cryptographiques."],
        ["Auditeur sécurité", "Évalue les risques et les mesures de sécurité."]
    ]],
    ["Systèmes, réseaux et cloud", [
        ["Administrateur systèmes", "Maintient les serveurs et systèmes d'exploitation."],
        ["Ingénieur réseau", "Conçoit et dépanne les réseaux."],
        ["Ingénieur cloud", "Conçoit des infrastructures cloud."],
        ["Ingénieur DevOps", "Automatise les tests et déploiements."],
        ["Ingénieur SRE", "Améliore la fiabilité des services."],
        ["Administrateur Linux", "Gère les systèmes Linux."],
        ["Architecte cloud", "Définit l'architecture des services cloud."],
        ["Ingénieur plateforme", "Crée les plateformes internes des équipes techniques."]
    ]],
    ["Électronique, embarqué, robotique et IoT", [
        ["Ingénieur logiciel embarqué", "Programme des appareils aux ressources limitées."],
        ["Développeur firmware", "Développe le logiciel bas niveau d'un appareil."],
        ["Ingénieur robotique", "Conçoit des systèmes robotiques."],
        ["Ingénieur systèmes autonomes", "Développe des systèmes capables d'agir automatiquement."],
        ["Ingénieur IoT", "Connecte des objets physiques à des services numériques."],
        ["Ingénieur électronique numérique", "Conçoit des circuits logiques numériques."],
        ["Ingénieur FPGA", "Développe des circuits logiques reconfigurables."]
    ]],
    ["Tests, qualité et fiabilité", [
        ["Ingénieur QA", "Améliore la qualité des logiciels."],
        ["Ingénieur automatisation de tests", "Automatise les tests logiciels."],
        ["Testeur logiciel", "Vérifie qu'une application fonctionne comme prévu."],
        ["Ingénieur performance", "Mesure et améliore les performances."],
        ["Ingénieur fiabilité", "Analyse les pannes et renforce la robustesse."]
    ]],
    ["Produit, design et expérience utilisateur", [
        ["UX designer", "Améliore l'expérience d'utilisation d'un produit."],
        ["UI designer", "Conçoit l'apparence d'une interface."],
        ["Product designer", "Travaille sur l'expérience et la conception d'un produit."],
        ["Product manager", "Définit les objectifs et priorités d'un produit."],
        ["UX researcher", "Étudie les besoins des utilisateurs."],
        ["Spécialiste accessibilité numérique", "Rend les services numériques plus accessibles."]
    ]],
    ["Gestion, conseil et opérations IT", [
        ["Chef de projet informatique", "Organise le calendrier, les tâches et les risques."],
        ["Consultant informatique", "Aide les organisations à choisir des solutions techniques."],
        ["Directeur des systèmes d'information", "Pilote la stratégie informatique."],
        ["Scrum master", "Aide une équipe à appliquer ses pratiques agiles."],
        ["Ingénieur avant-vente", "Adapte les solutions techniques aux besoins des clients."],
        ["Responsable support informatique", "Organise l'assistance aux utilisateurs."]
    ]],
    ["Recherche, enseignement et informatique scientifique", [
        ["Chercheur en informatique", "Étudie de nouveaux problèmes et méthodes informatiques."],
        ["Ingénieur de recherche", "Développe des solutions techniques de recherche."],
        ["Enseignant en informatique", "Enseigne les concepts et pratiques informatiques."],
        ["Ingénieur calcul scientifique", "Utilise programmation et mathématiques pour simuler des phénomènes."],
        ["Ingénieur HPC", "Optimise les calculs de haute performance."]
    ]],
    ["Web, commerce numérique et contenus", [
        ["Développeur e-commerce", "Crée et maintient des boutiques en ligne."],
        ["Intégrateur web", "Met en forme des pages avec HTML et CSS."],
        ["Spécialiste SEO technique", "Améliore les aspects techniques du référencement."],
        ["Développeur CMS", "Personnalise des systèmes de gestion de contenu."],
        ["Analyste web", "Mesure les usages et parcours sur un site."]
    ]],
    ["Métiers émergents et spécialisés", [
        ["Ingénieur blockchain", "Conçoit des applications avec des registres distribués."],
        ["Ingénieur informatique quantique", "Travaille sur des logiciels ou systèmes de calcul quantique."],
        ["Ingénieur FinOps", "Aide à maîtriser les coûts du cloud."],
        ["Ingénieur confidentialité", "Conçoit des solutions limitant l'exposition des données."],
        ["Spécialiste gouvernance des données", "Définit les règles de qualité et d'accès aux données."],
        ["Ingénieur jumeau numérique", "Crée des modèles numériques liés à des systèmes réels."]
    ]]
];
function getCareerInfo(group) {
    let x = {
        languages: "Python, SQL et outils spécialisés selon le poste",
        skills: "Logique, rigueur, résolution de problèmes, communication et apprentissage continu",
        salary: "Environ 30 000–45 000 € brut/an en début de carrière ; davantage avec l'expérience selon le poste",
        places: "Entreprises de tous secteurs, ESN, startups, éditeurs de logiciels et organismes publics"
    };
    if (group.includes("Développement")) {
        x.languages = "Python, JavaScript/TypeScript, Java, C# ou C++ selon le poste";
        x.skills = "Algorithmique, débogage, Git, tests et travail en équipe";
        x.salary = "Environ 32 000–42 000 € brut/an au début ; 42 000–60 000 € ou plus avec l'expérience";
        x.places = "Éditeurs logiciels, ESN, startups, banques et grandes entreprises";
    }
    if (group.includes("Intelligence")) {
        x.languages = "Python, SQL, parfois R, Java ou Scala";
        x.skills = "Mathématiques, statistiques, algorithmique, analyse et visualisation de données";
        x.salary = "Environ 35 000–45 000 € brut/an au début ; davantage selon l'expertise";
        x.places = "Équipes IA/data, industrie, banques, santé, laboratoires et startups";
    }
    if (group.includes("Cybersécurité")) {
        x.languages = "Python, Bash, PowerShell, SQL et bases des réseaux";
        x.skills = "Linux, réseaux, analyse de risques, investigation, rigueur et éthique";
        x.salary = "Environ 35 000–45 000 € brut/an au début ; variable selon la spécialisation";
        x.places = "Équipes sécurité, ESN spécialisées, opérateurs et grandes entreprises";
    }
    if (group.includes("réseaux et cloud")) {
        x.languages = "Bash, Python, PowerShell, YAML et outils cloud";
        x.skills = "Linux/Windows, réseaux, automatisation, supervision et sécurité";
        x.salary = "Environ 30 000–40 000 € brut/an au début ; davantage avec l'expérience";
        x.places = "DSI, hébergeurs, fournisseurs cloud, télécoms et datacenters";
    }
    if (group.includes("Jeux vidéo")) {
        x.languages = "C++, C#, Python ; Unity ou Unreal Engine selon le poste";
        x.skills = "Mathématiques 3D, créativité, optimisation, programmation et portfolio";
        x.salary = "Environ 28 000–38 000 € brut/an au début ; variable selon le studio";
        x.places = "Studios de jeux vidéo, animation, cinéma et réalité virtuelle";
    }
    if (group.includes("embarqué")) {
        x.languages = "C, C++, Python ; parfois Rust ou MATLAB";
        x.skills = "Mathématiques, physique, électronique, systèmes temps réel et tests";
        x.salary = "Environ 32 000–42 000 € brut/an au début ; variable selon le secteur";
        x.places = "Automobile, aéronautique, industrie, énergie, robotique et laboratoires";
    }
    return x;
}
