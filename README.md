# Afrogoût - POC Angular (boutique de luxe, grossiste, SAV, administration, FR/EN)

Aucune base de données : tout vient de fichiers JSON dans `public/assets/data/` et `public/assets/i18n/`.
Le panier, les commandes et les modifications d'administration restent en mémoire (le panier et la langue sont aussi dans le localStorage).

## Installation
1. `ng new afrogout --style=css --routing=false --ssr=false` puis `cd afrogout`.
2. Supprimer les fichiers générés dans `src/app` (app.ts, app.html, app.css, app.spec.ts, app.routes.ts, app.config.ts).
3. Copier dans le projet : le dossier `src/` de cette archive (main.ts, index.html, styles.css, app/) et le dossier `public/`.
   - Angular 17 ou moins : placer `assets/` dans `src/` au lieu de `public/`.
4. `ng serve`, puis http://localhost:4200

## Vidéos (culture locale)
Les vidéos se lisent depuis `public/assets/video/` : `hero.mp4`, `terroir.mp4`, `artisanat.mp4`, `marche.mp4` (et `cuisine.mp4`, réservé).
Déposez vos fichiers MP4 avec ces noms (ou changez les chemins dans `public/assets/data/media.json`).
Tant qu'un fichier est absent, un fond animé aux couleurs de la marque s'affiche à la place.
Sources de vidéos libres de droits : Pexels, Mixkit, Coverr (vérifiez la licence). Recherchez par exemple : "Cameroon", "African market", "cocoa harvest", "spices", "basket weaving".
Conseil performance : vidéos de 10 à 20 s, 1080p, moins de 5 Mo, sans son.

## Pages
Boutique : `/` · `/boutique` · `/produit/1` · `/commande` · `/suivi` (AG-2026-0141) · `/pro` · `/sav`
Admin : `/admin` · `/admin/commandes` · `/admin/produits` · `/admin/utilisateurs` · `/admin/sav` · `/admin/langues`

Langues : FR / EN (bouton en haut). Les textes sont dans `public/assets/i18n/fr.json` et `en.json`, modifiables aussi depuis `/admin/langues`.
Prérequis : Angular 17 ou plus.
