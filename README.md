# nehiyr-ben-elohim.github.io

Portfolio de Justin Potchona, site statique généré avec [Astro](https://astro.build).

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

- Projets / études de cas : `src/data/case-studies.json` (schéma `src/lib/case-studies.ts`). L'ordre du fichier = ordre d'affichage.
- Profil (chiffres clés, compétences, parcours, centres d'intérêt) : `src/data/profile.json` (schéma `src/lib/profile.ts`).
- Captures et photos : champs optionnels `shot`, `shot2` (projets) et `photo` (centres d'intérêt), chemins `/img/...` vers `src/assets/img/`. Absent = bloc de remplacement ; chemin introuvable = build en échec.
- Lien `code ↗` d'un projet : champ optionnel `code` (URL https), masqué sinon.
- Icônes : `public/img/devicons/` ([devicon](https://devicon.dev) v2.16.0), liste dans `src/lib/devicons.ts`.

## Formulaire de contact

Le formulaire envoie vers [Formspree](https://formspree.io). Créer un formulaire, puis définir
`PUBLIC_FORMSPREE_ENDPOINT` (ex. `https://formspree.io/f/xxxxxxx`) dans `.env` ou dans les variables
d'environnement de l'hébergeur. Sans cette variable, le build de production échoue (pour ne jamais publier un formulaire qui n'envoie rien).

## Déploiement

Le site est 100 % statique : publier le dossier `dist/` sur n'importe quel hébergeur statique
(GitHub Pages pour `nehiyr-ben-elohim.github.io`). Commande de build : `npm run build`.
