# Migration Nuxt 1.4 → Astro — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Réécrire le portfolio (Nuxt 1.4 SPA + jQuery) en site statique Astro, à design et URLs identiques, en corrigeant les défauts de l'audit du 2026-10-24.

**Architecture:** Sortie 100 % statique (`output: 'static'`). `activities.json` devient une Content Collection validée par Zod ; toute la logique métier (slug, tri, groupements, métas) vit dans des fonctions pures `src/lib/*.ts` testées par Vitest. Les composants Vue deviennent des `.astro` sans JS ; l'interactivité (menu, reveal, section active, parallaxe, formulaire) passe en petits modules TS natifs rebranchés à chaque navigation `ClientRouter`. L'animation d'élément partagé liste → projet passe par `transition:name` (View Transitions) et remplace le hack `localStorage`.

**Tech Stack:** Astro (dernière stable, ≥ 5, Content Layer `file()` loader), TypeScript strict, `sass` (Dart Sass), `astro:assets`, `@astrojs/sitemap`, Vitest, Playwright, Formspree (formulaire).

**Spec:** Pas de document séparé. La spec est l'audit et la recommandation Astro de la conversation du 2026-10-24, résumés dans **Global Constraints** ci-dessous.

## Global Constraints

- Prérequis hors code (manuel, AVANT tout merge) : révoquer/restreindre dans GCP les clés `AIzaSyAwLnA-…` (`firebase.project`) et `AIzaSyAYisMR…` (`illuminate/utils.js`). Les supprimer du code ne les retire pas de l'historique git.
- Travail sur la branche `feat/astro-migration`. Le code Nuxt est supprimé dans la Task 1 ; l'historique git le conserve.
- Node 22 LTS (`.nvmrc` = `22`, `engines.node` = `>=22`). Gestionnaire : npm uniquement (`yarn.lock` supprimé).
- Aucune dépendance jQuery, ScrollReveal, Vuex, localforage, ajv, Firebase, gh-pages, pm2.
- URLs conservées : `/`, `/projects`, `/projects/<slug>`, `/blog`, `/blog/<slug>`. Ancres conservées : `#hi`, `#about`, `#works`, `#skills`, `#contact`.
- Slugs identiques à l'ancien site pour tous les projets visibles (ex. `groupe-carrere`, `ushuaia-beaute`, `fast-foud`).
- `<html lang="fr">`. Textes repris tels quels des composants Vue (pas de réécriture de copy), sauf le message d'erreur du formulaire (Task 8).
- `site` = `https://jeanjacquesakakpo.me` (valeur `APP_URL` de `illuminate/config.js`). **À confirmer par le propriétaire** (le `package.json` cite `jeanjacques-akakpo.tk`).
- Aucun email ni destinataire dans le bundle client. Endpoint du formulaire via `PUBLIC_FORMSPREE_ENDPOINT`.
- Classes et attributs réutilisés tels quels pour ne pas toucher aux SCSS : `data-scrollbreak="<ms>"`, `scroll-breaked`, `menu-opened`, `open-latest-activities`, `reveal-title`, `loaded`.
- Hors périmètre : composants `Misc` et `VPlayer` (déjà désactivés ou morts dans l'ancien site), barre de recherche du blog (`v-if="false"`), Google Analytics (UA arrêté ; GA4 avec consentement = plan séparé).
- Commandes de vérification de référence : `npm run check` (astro check), `npm test` (Vitest), `npm run test:e2e` (Playwright sur `astro preview`), `npm run build`.

## Review Focus

1. **Lien direct ou refresh sur `/projects/<slug>` et sur les anciens slugs partagés** : la page doit répondre 200 avec son contenu. Un slug inconnu doit répondre 404, pas afficher le premier projet. → Task 5, `deep-links.spec.ts`.
2. **Navigation `ClientRouter` aller-retour** : les écouteurs ne doivent être ni perdus ni dupliqués (un clic sur le burger après accueil → projet → accueil ouvre le menu une seule fois). → Task 7, `navigation.spec.ts`.
3. **JS désactivé ou `prefers-reduced-motion`** : tout le contenu doit rester visible, sans animation bloquante en opacité 0. → Task 7, `reveal.spec.ts`.
4. **Formulaire en erreur** (HTTP 500, réseau coupé) : message d'erreur affiché, bouton réactivé, saisie conservée. → Task 8, `contact.spec.ts`.
5. **Image référencée dans le JSON mais absente du disque** : le build doit échouer avec le chemin fautif dans le message, au lieu de produire une image cassée. → Task 3, `images.test.ts`.

---

## File Structure

```
astro.config.mjs            site, sitemap, prefetch
package.json / tsconfig.json / .nvmrc / vitest.config.ts / playwright.config.ts
.env.example                PUBLIC_FORMSPREE_ENDPOINT=
src/
  content.config.ts         collection `activities` + schéma Zod
  data/activities.json      déplacé depuis static/data/
  lib/site.ts               SITE_NAME, SITE_URL, SECTIONS (ex-PATHS), SHARE_TEXT
  lib/slugify.ts            slugify()
  lib/activities.ts         fonctions pures : toActivity, sortByFinished, featured, adjacent, resolveMetas, groupByYear, groupByMonth, formatDate
  lib/collection.ts         getActivities(), getProjects(), getBlogPosts() (wrappers getCollection)
  lib/images.ts             resolveImage()
  assets/img/**             déplacé depuis static/img/ (activities, aboutme, logo)
  styles/**                 déplacé depuis assets/styles/ + assets/modules/
  layouts/BaseLayout.astro  <head> SEO, ClientRouter, styles globaux, scripts
  components/*.astro        portage 1-pour-1 des .vue (sauf Misc, VPlayer)
  scripts/reveal.ts | active-section.ts | menu.ts | parallax.ts | contact-form.ts | blog-timeline.ts | lifecycle.ts
  pages/index.astro | 404.astro | projects/index.astro | projects/[slug].astro | blog/index.astro | blog/[slug].astro
public/
  favicon.ico | robots.txt | img/brands/*.svg | img/bg/*.webp (fonds CSS)
tests/unit/*.test.ts        Vitest
tests/e2e/*.spec.ts         Playwright
.github/workflows/ci.yml
```

---

### Task 1: Squelette Astro et outillage

**Files:**
- Delete: `nuxt.config.js`, `layouts/`, `pages/`, `components/*.vue` (les déplacer d'abord vers `legacy/` pour avoir une référence pendant le portage ; `legacy/` est supprimé en Task 9), `store/`, `middleware/`, `plugins/`, `illuminate/` (→ `legacy/`), `firebase.project`, `deploy-on-github.js`, `.eslintrc.js`, `yarn.lock`, `package-lock.json`
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.nvmrc`, `vitest.config.ts`, `playwright.config.ts`, `src/pages/index.astro` (placeholder), `tests/e2e/smoke.spec.ts`
- Modify: `.gitignore` (+ `.astro/`, `dist/`, `test-results/`, `playwright-report/`, `.env`)

**Interfaces:**
- Produces: scripts npm `dev`, `build`, `preview`, `check`, `test`, `test:e2e` ; Playwright `webServer` = `npm run build && npm run preview -- --port 4321`, `baseURL` = `http://localhost:4321`.

- [ ] **Step 1:** `git switch -c feat/astro-migration`, puis `git mv components pages layouts store middleware plugins illuminate legacy/` et suppression des autres fichiers listés.
- [ ] **Step 2:** `npm create astro@latest . -- --template minimal --typescript strict --no-git --install`, puis `npm i -D sass vitest @playwright/test @astrojs/check typescript && npx playwright install chromium`.
- [ ] **Step 3:** Dans `astro.config.mjs`, fixer `site: 'https://jeanjacquesakakpo.me'`, `output: 'static'`, `trailingSlash: 'ignore'`. Dans `package.json`, mettre `"name": "jeanjacquesakakpo.me"`, `"version": "4.0.0"`, `"engines": { "node": ">=22" }`.
- [ ] **Step 4: Write the failing test** `tests/e2e/smoke.spec.ts`

```ts
test('home responds in French', async ({ page }) => {
  const res = await page.goto('/')
  expect(res?.status()).toBe(200)
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
})
```

- [ ] **Step 5:** `npm run test:e2e` → FAIL (`lang` absent du template minimal).
- [ ] **Step 6:** Ajouter `lang="fr"` dans le placeholder `src/pages/index.astro`.
- [ ] **Step 7:** `npm run test:e2e` → PASS ; `npm run check` → 0 erreur.
- [ ] **Step 8: Commit** `chore: replace Nuxt 1 scaffold with Astro + tooling`

---

### Task 2: Couche de données (collection + logique pure)

**Files:**
- Create: `src/data/activities.json` (`git mv static/data/activities.json`), `src/content.config.ts`, `src/lib/site.ts`, `src/lib/slugify.ts`, `src/lib/activities.ts`, `src/lib/collection.ts`
- Test: `tests/unit/slugify.test.ts`, `tests/unit/activities.test.ts`

**Interfaces:**
- Consumes: `legacy/illuminate/config.js` (valeurs `PATHS`, `APP_NAME`, `APP_URL`, `PROJECT_SHARE_STARTER`).
- Produces:
  - `slugify(input: string): string`
  - `type ActivityData` = sortie du schéma Zod (dates en `Date`, `resolve` et `clientLogo` en `string | undefined`)
  - `type Activity = ActivityData & { slug: string; href: string }`
  - `toActivity(data: ActivityData): Activity` (`href` = `/projects/<slug>` si `PROJECT`, `/blog/<slug>` si `BLOG`)
  - `sortByFinished(list: Activity[]): Activity[]` (récents d'abord, ne mute pas)
  - `featured(list: Activity[], max = 6): Activity[]`
  - `adjacent(list: Activity[], key: string): { prev?: Activity; next?: Activity }` (sur la liste triée)
  - `resolveMetas(a: Activity): { title: string; value: string }[]`
  - `groupByYear(list: Activity[]): { year: number; entries: Activity[] }[]` et `groupByMonth(list: Activity[]): { month: number; entries: Activity[] }[]`, groupes et entrées triés par date décroissante
  - `formatDate(d: Date): string`, via `Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })`
  - `getActivities(): Promise<Activity[]>` (visibles, triées), `getProjects()`, `getBlogPosts()`
  - `SECTIONS: Record<'LANDING'|'ABOUTME'|'WORKS'|'SKILLS'|'CONTACT'|'BLOG'|'ALL_WORKS'|'HOMEPAGE', { href: string; title: string; inNavBar: boolean }>`

- [ ] **Step 1: Write the failing tests**

```ts
// slugify.test.ts
test.each([
  ['Groupe Carrere', 'groupe-carrere'],
  ['Ushuaia Beauté', 'ushuaia-beaute'],
  ['Fast Foud', 'fast-foud'],
  ['Été éternel', 'ete-eternel'],          // toutes les occurrences, pas seulement la 1re
  ['  1 To 1 Services ', '1-to-1-services'],
])('slugify(%s) = %s', (i, o) => expect(slugify(i)).toBe(o))

// activities.test.ts — fixtures construites avec un helper make({key, finishedAt, ...})
test('sortByFinished: récents d’abord, entrée intacte')
test('featured: filtre featured=true, coupe à max')
test('adjacent: premier → pas de prev ; dernier → pas de next ; liste vide → {}')
test('resolveMetas: "__FUNCTION__" Tools → techs.join(", "), Scope → type ; autres inchangées')
test('groupByYear: années décroissantes, entrées décroissantes')
test('formatDate(new Date("2018-08-07T00:00:00Z")) === "7 août 2018"')
test('activities.json: slugs des items visibles uniques')       // importe le JSON brut + slugify
test('activities.json: slugs historiques inchangés', () => {
  expect(visibleSlugs).toEqual(expect.arrayContaining(['groupe-carrere','liebherr','touki-saint-louis','ushuaia-beaute','1-to-1-services','wola-group','mailar','followad','fast-foud']))
})
```

- [ ] **Step 2:** `npm test` → FAIL (modules absents).
- [ ] **Step 3:** Implémenter `slugify` : `normalize('NFD')`, retrait de `[̀-ͯ]`, puis les règles regex existantes (`legacy/illuminate/utils.js:slugify`).
- [ ] **Step 4:** Implémenter `src/content.config.ts` : `file('src/data/activities.json', { parser: t => JSON.parse(t).map(a => ({ ...a, id: a.key })) })`. Schéma :
  - `startedAt` : chaîne unix → `Date`
  - `finishedAt` : `'TODAY'` | chaîne unix → `Date` (`'TODAY'` = date du build)
  - `activityType: z.enum(['PROJECT','BLOG'])`
  - `resolve` et `clientLogo` : chaîne vide → `undefined`
  - `refine(finishedAt >= startedAt)`, avec un message qui cite `key`
  - champs `link`, `slug` et `layout` ignorés (strip)
- [ ] **Step 5:** Corriger les dates inversées de `pro_yokosushi` et `pro_228itlabo` (échanger `startedAt` et `finishedAt`). Sans ça, le `refine` fait échouer le build.
- [ ] **Step 6:** Implémenter `activities.ts`, `collection.ts` et `site.ts` selon les Interfaces.
- [ ] **Step 7:** `npm test` → PASS ; `npm run build` → PASS.
- [ ] **Step 8: Commit** `feat: activities content collection with validated schema`

---

### Task 3: Images, styles et layout de base

**Files:**
- Move: `static/img/{activities,aboutme}` et `static/img/logo.jpg` → `src/assets/img/` ; `static/img/brands/` → `public/img/brands/` ; `static/favicon.ico` → `public/`
- Create: `public/img/bg/{landing-mask,blog_bg,blog_footer_bg}.webp` (largeur max 2000 px, qualité 75 : `npx sharp-cli -i static/img/<f>.jpg -o public/img/bg/ -f webp -q 75 resize 2000`), `src/lib/images.ts`, `src/layouts/BaseLayout.astro`
- Move: `assets/styles/` → `src/styles/`, `assets/modules/` → `src/styles/modules/`
- Modify: `src/styles/components/landing.scss:41` (`url('/img/bg/landing-mask.webp')`) et toute autre référence aux 3 fonds
- Test: `tests/unit/images.test.ts`

**Interfaces:**
- Produces:
  - `resolveImage(publicPath: string): ImageMetadata` : prend un chemin du JSON (`/img/activities/...`) et le résout via `import.meta.glob('/src/assets/img/**/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })` ; lève `Error("Image introuvable: <publicPath>")` si le chemin n'existe pas.
  - `<BaseLayout title: string, description?: string, image?: ImageMetadata, bodyClass?: string>` : `lang="fr"`, `<title>`, meta description, canonical (`Astro.url` + `site`), Open Graph, `<ClientRouter />`, import de `src/styles/main.scss`, script inline `document.documentElement.classList.add('js')` dans `<head>`.

- [ ] **Step 1: Write the failing test**

```ts
test('resolveImage resolves a JSON media path', () => {
  expect(resolveImage('/img/activities/groupe-carrere/0.png').src).toBeTruthy()
})
test('resolveImage throws with the faulty path', () => {
  expect(() => resolveImage('/img/nope.png')).toThrow('/img/nope.png')
})
test('every mediaURL / shoots / clientLogo in activities.json resolves')
```

- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Faire les déplacements, implémenter `resolveImage` et `BaseLayout`. Passer les imports SCSS en chemins relatifs à `src/styles/` et corriger les `url()` des polices dans `fonts-loader.css`. Les avertissements de dépréciation Dart Sass (`@import`, `/`) sont tolérés ; ne pas migrer vers `@use` dans ce plan.
- [ ] **Step 4:** `npm test` → PASS ; `npm run build` → PASS, sans erreur Sass.
- [ ] **Step 5: Commit** `feat: optimized image pipeline, ported styles, base layout`

---

### Task 4: Composants partagés et page d'accueil

**Files:**
- Create: `src/components/{Menu,FloatingHeader,Landing,AboutMe,Projects,ProjectItem,Skills,Contact,Foot,SocialLinks,CurrentStep,Logo,LatestActivities,ActivityItem}.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: `getActivities`, `getProjects`, `featured`, `groupByYear`, `resolveImage`, `SECTIONS`, `BaseLayout`.
- Produces (props) :
  - `ProjectItem { item: Activity; mini?: boolean }` : lien `item.href`, `<Image src={resolveImage(item.mediaURL)}>` dans `.img-wrapper` avec `transition:name={\`media-${item.key}\`}`
  - `Projects { items: Activity[]; showAll?: boolean; stepIndicator?: boolean }`
  - `FloatingHeader { expanded?: { title: string; bg?: string; hints?: string[]; resolve?: string }; height?: 'big'|'small'; dashTitle?: boolean; restricted?: boolean; colorScheme?: 'light'|'dark'; mediaKey?: string }`. Le titre est rendu en `<span stroke?>` par mot (le préfixe `--` donne l'attribut `stroke`), sans `set:html`. Le burger porte `data-menu-toggle`.
  - `Contact { stepIndicator?: boolean; bg?: string }` : markup seul ici, le comportement vient en Task 8
  - `SocialLinks { size?: 'big'|'small'; shareLink?: string }`. Tous les liens `_blank` ont `rel="noopener noreferrer"` ; `shareVia` est supprimé.
  - `CurrentStep { text: string }`

- [ ] **Step 1: Write the failing test**

```ts
test('home renders the 5 anchored sections', async ({ page }) => {
  await page.goto('/')
  for (const id of ['hi','about','works','skills','contact']) await expect(page.locator(`#${id}`)).toHaveCount(1)
})
test('home shows at most 6 featured projects linking to /projects/<slug>', ...)
test('no target=_blank without rel=noopener', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('a[target=_blank]:not([rel~=noopener])')).toHaveCount(0)
})
test('no email address in served HTML/JS', ...) // body + scripts ne contiennent pas "@gmail.com"
```

- [ ] **Step 2:** `npm run test:e2e` → FAIL.
- [ ] **Step 3:** Porter chaque `legacy/components/<X>.vue` en `<X>.astro` : template à l'identique, `v-for` → `.map`, `getXxxText()` → texte en dur, styles via `<style lang="scss">@import '../styles/components/<x>.scss';</style>`. Garder les attributs `data-scrollbreak`. Ne pas porter `Misc`, `VPlayer` ni `initSkillsHover`.
- [ ] **Step 4:** `npm run test:e2e` → PASS. Comparer visuellement avec le site en production (l'ancienne version Nuxt ne s'installe plus sur Node 22).
- [ ] **Step 5: Commit** `feat: port shared components and homepage`

---

### Task 5: Pages projets et 404

**Files:**
- Create: `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/pages/404.astro`, `src/components/{AdjacentProjects,ProjectMetaItem}.astro`
- Test: `tests/e2e/deep-links.spec.ts`

**Interfaces:**
- Consumes: `getProjects`, `adjacent`, `resolveMetas`, `resolveImage`, `ProjectItem`, `FloatingHeader`, `Contact`, `Foot`.
- Produces:
  - `getStaticPaths()` : un chemin par projet visible, `params.slug = item.slug`, `props.item`
  - en-tête du projet : média avec `transition:name={\`media-${item.key}\`}`, identique à `ProjectItem`
  - `AdjacentProjects { center: Activity; list: Activity[] }`

- [ ] **Step 1: Write the failing test**

```ts
test('direct load of /projects/groupe-carrere', async ({ page }) => {
  const res = await page.goto('/projects/groupe-carrere')
  expect(res?.status()).toBe(200)
  await expect(page.getByRole('heading', { name: /Groupe Carrere/ })).toBeVisible()
  await expect(page.locator('.metas-list')).toContainText('Tools')
})
test('every historical slug loads with 200')                       // boucle sur la liste de la Task 2
test('unknown slug → 404 page, not first project', async ({ page }) => {
  const res = await page.goto('/projects/n-existe-pas')
  expect(res?.status()).toBe(404)
  await expect(page.locator('body')).not.toContainText('Fast Foud')
})
test('/projects lists all visible projects')
test('adjacent links: first project has no prev control')
```

- [ ] **Step 2:** `npm run test:e2e` → FAIL.
- [ ] **Step 3:** Implémenter les pages. `item.concept` est rendu avec `set:html` : seul `set:html` autorisé du projet, la source est le JSON du dépôt, compilé au build. Les shoots passent par `<Image>` avec `alt={shoot.description}`. Pour `404.astro`, utiliser `BaseLayout` et un lien `accueil` vers `/`.
- [ ] **Step 4:** `npm run test:e2e` → PASS.
- [ ] **Step 5: Commit** `feat: project pages with static paths and real 404`

---

### Task 6: Blog (frise des activités)

**Files:**
- Create: `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`, `src/components/{Blog,BlogArticleGroup,BlogArticle}.astro`, `src/scripts/blog-timeline.ts`
- Test: `tests/e2e/blog.spec.ts`

**Interfaces:**
- Consumes: `getActivities`, `getBlogPosts`, `groupByYear`, `groupByMonth`, `formatDate`.
- Produces:
  - `blog/[slug].astro` génère une page par activité `BLOG`. Aucune aujourd'hui, mais le schéma l'autorise. Bouton « Read on Medium » vers `item.resolve`.
  - `initBlogTimeline(): () => void` : `IntersectionObserver` sur `[data-article-year][data-article-month]`, met à jour le `transform` des listes année/mois (même calcul `-20 * index` px que `legacy/components/Blog.vue`) et la classe `fix-blog-header` ; retourne la fonction de nettoyage.

- [ ] **Step 1: Write the failing test**

```ts
test('/blog groups activities by year, most recent first', async ({ page }) => {
  await page.goto('/blog')
  const years = await page.locator('[data-group-year]').evaluateAll(els => els.map(e => Number(e.dataset.groupYear)))
  expect(years).toEqual([...years].sort((a, b) => b - a))
})
test('each blog entry links to its activity href')
```

- [ ] **Step 2:** `npm run test:e2e` → FAIL.
- [ ] **Step 3:** Implémenter les pages et `initBlogTimeline` (branchement en Task 7 via `lifecycle.ts` ; pour cette tâche, appel direct dans `blog/index.astro`).
- [ ] **Step 4:** `npm run test:e2e` → PASS.
- [ ] **Step 5: Commit** `feat: blog timeline`

---

### Task 7: Comportements client et View Transitions

**Files:**
- Create: `src/scripts/{lifecycle,reveal,active-section,menu,parallax}.ts`
- Modify: `src/layouts/BaseLayout.astro` (un seul `<script>` qui importe `lifecycle.ts`), `src/pages/blog/index.astro` (retirer l'appel direct), `src/styles/main.scss` (masquage initial limité à `html.js`, plus `@media (prefers-reduced-motion: reduce)`)
- Test: `tests/e2e/navigation.spec.ts`, `tests/e2e/reveal.spec.ts`

**Interfaces:**
- Produces:
  - `type Cleanup = () => void` ; chaque module exporte `init<Name>(): Cleanup`
  - `lifecycle.ts` : sur `astro:page-load`, appelle tous les `init*` et stocke leurs `Cleanup` ; sur `astro:before-swap`, les exécute tous. C'est le seul endroit où l'on ajoute des écouteurs globaux.
  - `initReveal` : `IntersectionObserver` sur `[data-scrollbreak]` ; à l'entrée, ajoute `scroll-breaked` après `Number(dataset.scrollbreak)` ms. Avec `prefers-reduced-motion: reduce`, la classe est ajoutée immédiatement, sans délai. Ajoute aussi `reveal-title` sur `.content-header-title` (850 ms, comme `revealBannerExpandedTitle`) et `loaded` sur `.project-item-row` (1000 ms).
  - `initActiveSection` : observe `#hi,#about,#works,#skills,#contact` (seuil = section qui couvre 55 % du viewport, comme `scroll-break.js`) ; met `active` sur le `.nav-item` et `dashed-text prefixed-text` sur son lien.
  - `initMenu` : un clic sur `[data-menu-toggle]` bascule `menu-opened` sur `.menu-wrapper` ; un clic sur un lien d'ancre du menu ferme le menu (le défilement est fait par CSS `scroll-behavior: smooth`, désactivé en reduced motion) ; « Latest activities » et « goto menu » basculent `open-latest-activities` sur `#js--menuContent`.
  - `initParallax` : écouteur `scroll` passif + `requestAnimationFrame` sur `#js--parallax-header` et le fond du landing, inactif au-delà de 450 px de défilement et en reduced motion.

- [ ] **Step 1: Write the failing tests**

```ts
// navigation.spec.ts
test('menu toggles exactly once after home → project → home', async ({ page }) => {
  await page.goto('/')
  await page.locator('a[href^="/projects/"]').first().click()
  await page.waitForURL(/\/projects\//)
  await page.goBack(); await page.waitForURL('/')
  await page.locator('[data-menu-toggle]').first().click()
  await expect(page.locator('.menu-wrapper')).toHaveClass(/menu-opened/)
})
test('nav item becomes active when #skills is scrolled into view')

// reveal.spec.ts
test('content visible with JS disabled', async ({ browser }) => {
  const page = await (await browser.newContext({ javaScriptEnabled: false })).newPage()
  await page.goto('/')
  await expect(page.locator('.landing-header-text--1')).toBeVisible()
  await expect(page.locator('.landing-header-text--1')).not.toHaveCSS('opacity', '0')
})
test('reduced motion: reveal targets get scroll-breaked without delay', async ({ browser }) => {
  const page = await (await browser.newContext({ reducedMotion: 'reduce' })).newPage()
  await page.goto('/')
  await expect(page.locator('#hi [data-scrollbreak]').first()).toHaveClass(/scroll-breaked/, { timeout: 200 })
})
```

- [ ] **Step 2:** `npm run test:e2e` → FAIL.
- [ ] **Step 3:** Implémenter les modules. Dans le SCSS, préfixer par `html.js` chaque règle qui cache un élément en attendant `scroll-breaked` (`landing.scss`, `aboutme.scss`, `skills.scss`, `contact.scss`).
- [ ] **Step 4:** `npm run test:e2e` → PASS. Vérifier à la main dans Chrome que l'image d'un projet s'anime de la carte vers l'en-tête au clic.
- [ ] **Step 5: Commit** `feat: native client behaviors and view transitions, drop jQuery`

---

### Task 8: Formulaire de contact (Formspree)

**Files:**
- Create: `src/scripts/contact-form.ts`, `.env.example`
- Modify: `src/components/Contact.astro`, `src/scripts/lifecycle.ts` (enregistre `initContactForm`)
- Test: `tests/e2e/contact.spec.ts`

**Interfaces:**
- Consumes: `import.meta.env.PUBLIC_FORMSPREE_ENDPOINT`.
- Produces:
  - `<form action={endpoint} method="POST">` : sans JS, l'envoi natif fonctionne. Champs `name`, `email`, `message`, plus le pot de miel `_gotcha` (masqué).
  - `initContactForm(): Cleanup` intercepte `submit` et fait un `fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })`. Pendant l'envoi : `.loading` sur le bouton et bouton `disabled`. Sur `ok` : affiche `.message-sent` et vide le formulaire. Sinon, ou si `fetch` lève : affiche `.message-error`, réactive le bouton, garde la saisie.
- Copy exacte :
  - succès (reprise) : `Et voilà le facteur est passé prendre l'enveloppe.`
  - erreur (nouvelle) : `Oups, l'enveloppe s'est perdue en route. Réessaie dans un instant.`

- [ ] **Step 1: Write the failing tests**

```ts
test('success: shows sent message and clears fields', async ({ page }) => {
  await page.route('**/formspree.io/**', r => r.fulfill({ status: 200, json: { ok: true } }))
  // remplir, envoyer → .message-sent visible, champs vides
})
test('HTTP 500: error message, button re-enabled, input kept')
test('network failure (route.abort): same as 500')
```

Lancer Playwright avec `PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/test` défini dans `playwright.config.ts` (`webServer.env`).

- [ ] **Step 2:** `npm run test:e2e` → FAIL.
- [ ] **Step 3:** Implémenter.
- [ ] **Step 4:** `npm run test:e2e` → PASS.
- [ ] **Step 5: Commit** `feat: contact form via Formspree with error handling`

---

### Task 9: SEO, nettoyage, CI

**Files:**
- Create: `public/robots.txt` (`Sitemap: https://jeanjacquesakakpo.me/sitemap-index.xml`), `.github/workflows/ci.yml`
- Modify: `astro.config.mjs` (+ `@astrojs/sitemap`), `README.md` (install, dev, build, variable d'env, déploiement statique de `dist/`), pages (titre et description par page : accueil = `Jean-jacques AKAKPO`, projet = `<title> — Jean-jacques AKAKPO` + `item.description`)
- Delete: `legacy/`, `static/` (doit être vide), `assets/`
- Test: `tests/e2e/seo.spec.ts`

**Interfaces:**
- Consumes: `BaseLayout` props `title`, `description`, `image`.

- [ ] **Step 1: Write the failing test**

```ts
test('project page has unique title, description, canonical and og:image', ...)
test('sitemap lists every project URL', async ({ request }) => {
  const xml = await (await request.get('/sitemap-0.xml')).text()
  expect(xml).toContain('/projects/groupe-carrere')
})
```

- [ ] **Step 2:** `npm run test:e2e` → FAIL.
- [ ] **Step 3:** Implémenter. CI (Node 22) : `npm ci` → `npm run check` → `npm test` → `npx playwright install --with-deps chromium` → `npm run test:e2e`.
- [ ] **Step 4:** Vérification finale : `npm run check && npm test && npm run test:e2e && npm run build` → tout PASS. Vérifier aussi `du -sh dist` (taille nettement inférieure aux 31 Mo de `static/`) et `grep -r "AIza\|gmail.com" dist src` (aucun résultat).
- [ ] **Step 5: Commit** `chore: SEO, sitemap, CI, remove legacy Nuxt sources`
