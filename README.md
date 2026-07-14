# Eco-Stock

Eco-Stock est une application Vue 3 de gestion logistique. Elle permet de suivre les entrepots, les produits stockes, les details de chaque produit et les journaux d'audit.

## Fonctionnalites

- Tableau de bord avec indicateurs de stock et capacite.
- Sidebar reusable dans `src/components/AppSidebar.vue`.
- Gestion des entrepots avec page liste et page detail.
- Liste des produits avec page detail produit.
- Page d'audit pour suivre les actions importantes.
- Page de connexion simple redirigeant vers le tableau de bord.
- Donnees centralisees dans `src/data/inventory.js`.

## Stack technique

- Vue 3 avec Composition API en JavaScript.
- Vue Router pour les routes.
- Vite pour le serveur de developpement et le build.
- Tailwind CSS pour le style.

## Installation

```bash
npm install
```

## Lancer le projet

```bash
npm run dev
```

Vite affiche ensuite l'URL locale, generalement `http://localhost:5173`.

## Build de production

```bash
npm run build
```

## Structure

```text
src/
  components/        Composants partages: layout, sidebar, topbar, cartes statistiques
  data/              Donnees JS utilisees par les pages
  router/            Configuration des routes
  views/             Pages principales de l'application
```

## Routes principales

- `/login` connexion
- `/dashboard` tableau de bord
- `/warehouses` liste des entrepots
- `/warehouses/:id` detail d'un entrepot
- `/products` liste des produits
- `/products/:id` detail d'un produit
- `/audit` journal d'audit

## Notes de developpement

Le projet a ete converti de TypeScript vers JavaScript. Les fichiers d'entree sont `src/main.js`, `src/router/index.js` et `vite.config.js`.
