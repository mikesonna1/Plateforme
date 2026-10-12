// Appliqué avant l'affichage pour éviter un flash de thème
try { var t = localStorage.getItem("devenirIngenieurTheme"); if (t) document.documentElement.dataset.theme = t; } catch (e) {}
