# Dossier des vidéos

Chaque cours a sa partie **vidéo**. Les scripts sont déjà écrits dans `SCRIPTS.md` (accroche, démonstration, résumé, conclusion).

## Comment ajouter une vidéo

1. Crée la vidéo (voir ci-dessous) et enregistre-la ici, par exemple `videos/l1.mp4` (l'identifiant `l1` à `l21` est indiqué dans `SCRIPTS.md`).
2. Ouvre `js/data-videos.js` et ajoute une ligne : `l1: "videos/l1.mp4",`
   Tu peux aussi mettre un lien YouTube ou Vimeo : `l1: "https://youtu.be/XXXXXXXXXXX",`
3. Recharge le site : l'onglet « Vidéo » du cours affiche le lecteur à la place de « Vidéo en préparation ». Le script reste disponible en transcription.

## Comment fabriquer les vidéos

- **Avatar ou voix générée par IA** : colle la partie « Narration » de `SCRIPTS.md` dans un outil de vidéo IA (de type avatar parlant ou synthèse vocale), puis ajoute des captures d'écran du code.
- **Capture d'écran commentée** (souvent la plus claire pour apprendre à programmer) : enregistre ton écran pendant que tu exécutes les exemples du cours, avec une voix réelle ou synthétique.
- Garde les vidéos courtes (3 à 7 minutes), un seul sujet par vidéo, et vérifie que les droits d'utilisation de l'outil permettent la publication.
- Format conseillé : MP4 (H.264), 1280×720, moins de 50 Mo par vidéo. Au-delà, préfère YouTube (liens « non répertorié ») pour ne pas alourdir ton hébergement.
