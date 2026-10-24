# jeanjacquesakakpo.me

Portfolio de Jean-jacques AKAKPO, site statique généré avec [Astro](https://astro.build).

## Prérequis

- Node `>= 22.23.4` (voir `.nvmrc`)
- npm

## Installation

```bash
npm install
cp .env.example .env   # puis renseigner PUBLIC_FORMSPREE_ENDPOINT
```

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | serveur de dev sur `http://localhost:4321` |
| `npm run build` | génère le site statique dans `dist/` |
| `npm run preview` | sert `dist/` en local |
| `npm run check` | vérification TypeScript / Astro |
| `npm test` | tests unitaires (Vitest) |
| `npm run test:e2e` | tests end-to-end (Playwright, build + preview) |

## Contenu

Les projets et activités sont dans `src/data/activities.json`, validés au build par le schéma de `src/lib/schema.ts`.
Les images référencées (`mediaURL`, `shoots`) doivent exister sous `src/assets/img/` : sinon le build échoue.

## Formulaire de contact

Le formulaire envoie vers [Formspree](https://formspree.io). Créer un formulaire, puis définir
`PUBLIC_FORMSPREE_ENDPOINT` (ex. `https://formspree.io/f/xxxxxxx`) dans `.env` ou dans les variables
d'environnement de l'hébergeur. Sans cette variable, le build affiche un avertissement et le formulaire n'envoie rien.

## Déploiement

Le site est 100 % statique : publier le dossier `dist/` sur n'importe quel hébergeur statique
(Cloudflare Pages, Netlify, GitHub Pages…). Commande de build : `npm run build`.

## Crédits

<a href="https://fr.freepik.com/photos-vecteurs-libre/infographie">Infographie de vecteur conçu par Eightonesix - Freepik.com</a>
<a href='https://fr.freepik.com/photos-libre/espace-de-travail-business-freelance-concept-vue-de-dessus-au-dessus-de-flat-lay-toning_1349476.htm'>Designed by Freepik</a>
<a href='https://fr.freepik.com/photos-libre/bureau-avec-un-ordinateur-portable-une-tasse-de-cafe-et-un-calendrier_878794.htm'>Designed by Freepik</a>
