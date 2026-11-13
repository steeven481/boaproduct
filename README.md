# BoaProduct - POC Angular (site client + admin, sans base de données)

Toutes les données viennent de fichiers JSON (`public/assets/data/`) et d'images SVG simulées (`public/assets/img/`).
Aucun backend : panier, commandes et modifications admin restent en mémoire (le panier est aussi dans le localStorage).

## Installation
1. `npm i -g @angular/cli` puis `ng new boaproduct --style=css --routing=false --ssr=false`, puis `cd boaproduct`.
2. Supprimer `src/app/app.ts` (ou app.component.*), `app.html`, `app.css`, `app.spec.ts` et `app.routes.ts` / `app.config.ts` générés.
3. Copier dans votre projet : le dossier `src/` de cette archive (écrase `main.ts`, `styles.css`, `app/`) et le dossier `public/`.
   - Angular 17 ou moins : placer `assets/` dans `src/` au lieu de `public/` (et vérifier `assets` dans angular.json).
4. `ng serve` puis ouvrir http://localhost:4200

## Pages
Client : `/` accueil · `/catalogue` · `/produit/1` · `/commande` (paiement simulé) · `/suivi` (essayez BP-2026-0141)
Admin : `/admin` tableau de bord · `/admin/commandes` · `/admin/produits`

Prérequis : Angular 17 ou plus (composants standalone, @if / @for).
