# Audit Hallmark: nehiyr-ben-elohim.github.io

Date : 2026-10-30 · branche `hallmark-audit` (depuis `origin/master`, ba0ad88) · genre déduit : editorial
Pages rendues : `/` et `/projets/plateforme-audit` (1280, 1440, 1920, 375). Captures dans `.hallmark/before/` et `.hallmark/shots/`, findings bruts dans `.hallmark/before.txt`.

Linter : **236 FAIL · 184 REFLEX · 15 WARN**. Le volume vient surtout de deux gates mécaniques (140× gate 48, couleurs hors tokens ; 167× gate 24b, espacements hors grille de 4px). Ce n'est pas un signe que le site est raté.

## Lecture

- **Rôle :** portfolio d'un dev backend/ML freelance. Visiteurs : CTO et lead dev qui recrutent. Action unique : *me contacter*.
- **Ce qui marche et reste :** un vrai parti pris (jaune, encre noire, ombres décalées, type Quicksand), le terminal interactif du hero, la timeline d'expérience avec ses chiffres, la section méthode/formats, l'étude de cas (TL;DR, sommaire, schéma d'architecture). Le contenu est dense et concret.
- **Ce qui fait « généré » :** des eyebrows numérotés (`› 01 — …`) au-dessus de chaque section, des labels en capitales espacées, des fenêtres dessinées avec les trois pastilles, des rotations décoratives partout, des placeholders rayés à la place des captures produit.
- **Ce qui est cassé :** le CTA du hero est sous la ligne de flottaison à 1280×800, les placeholders sont illisibles (contraste 1.31:1), `/projets/<slug>/` avec slash final renvoie un 404, et il n'y a aucun fallback `prefers-reduced-motion` sur les sections animées.

## Floor (non négociable)

| Gate | Constat | Où |
| --- | --- | --- |
| 12 fold | À 1280×800, *me contacter* n'est pas visible. Le paragraphe de bio pousse le bouton hors de l'écran. | `src/pages/index.astro:72-90` |
| 13 budget | Hero = toggle d'audience, statut, titre, phrase de 17 mots, paragraphe de 35 mots, 2 CTA, 3 cartes chiffres, bandeau de logos. Une section affiche 189 mots dans un seul écran (y≈6650, À propos). | `index.astro`, `AboutSection.astro` |
| 11 / 47a fenêtre dessinée | Pastilles « traffic lights » sur le terminal du hero, la galerie et le snippet d'architecture. | `index.astro:96`, `CaseStudyGallery.astro:29`, `CaseStudyArchi.astro:39` |
| 9 / 54 eyebrows | 15 eyebrows (`› 01 — mes réalisations`, `› 02 — parcours`…) au-dessus de titres qui disent déjà la même chose. | `index.astro:134`, `ExperienceSection.astro:23`, `SkillsSection.astro:18`, `MethodSection.astro:17`, `NotesSection.astro:17`, `AboutSection.astro:23`, `ContactSection.astro:17`, `[slug].astro:57,151,154` |
| 9 / 67 capitales espacées | 10 labels en uppercase + tracking : `EXPÉRIENCE`, `ILS M'ONT FAIT CONFIANCE`, `ÉCRIRE UN EMAIL`, `LANGUES`, `PROBLÈME`… | `HeroFacts.astro:51`, `index.astro:193`, `AboutSection.astro:125,191`, `ContactSection.astro:135`, `ExperienceSection.astro:115`, `[slug].astro:322,414,506`, `CaseStudyArchi.astro:59` |
| 10 / 63 ponctuation | Flèches collées aux liens (`étude de cas ›`, `voir mes projets ›`) ; pastille verte décorative « Disponible » ; méta à points médians (`Backend · API · Support prod`, `6 min · bientôt`). | `ProjectCard.astro:40`, `ExperienceSection.astro:86`, `index.astro:72,86,90` |
| 1 / 48 tokens | 140 couleurs littérales hors bloc de tokens (`#fff`, `#3a3a3a`, `#bdbdbd`, `#5a5a5a`…), et 56× blanc pur (7a). | tous les composants |
| 2 / 10a | `transition` sur `top`. | `Rail.astro:36` |
| 4 / 34 | Pas de `overflow-x: clip` sur `html` et `body`, alors que les bandeaux tournés débordent à `margin: 0 -5%`. | `SiteLayout.astro`, `Bands.astro:44` |
| 6 / 26a | Aucun `:focus-visible` dans plusieurs composants. | voir `before.txt` |
| 7 / 27 | Pas de bloc `prefers-reduced-motion` alors qu'il y a du mouvement. | `AboutSection.astro`, `[slug].astro` |
| 40 contraste | Texte des placeholders à 1.31:1 ; bord du champ terminal à 1.00:1. | `ProjectShot.astro:32`, `index.astro:113` |
| 73 | `div.metric` peint par-dessus le texte des cartes projet (Traducteur vocal, WIIN). | `ProjectCard.astro` |
| 39a | Bouton submit désactivé par opacité seule. | `ContactSection.astro:191` |
| 19 | Tiret cadratin dans le texte. | `ExperienceSection.astro:62` |

## Reflex (à corriger, ou à justifier par écrit)

- **66, texte décoratif :** label vertical « bienvenue » / « projet » (`Rail.astro:28`) ; titres, cartes, portrait et footer tournés de -2° à 3° (`index.astro:225`, `HeroFacts.astro:44`, `AboutSection.astro:99,121`, `SiteFooter.astro:47`) ; double marquee incliné (`Bands.astro:40,44`). Une rotation peut servir de signature, mais pas sept.
- **81 / 68, images vides :** les 5 projets et la galerie de l'étude de cas montrent une boîte rayée avec leur nom écrit dedans (`ProjectShot.astro:19`). La carte « fav. musics » est un dégradé vide. Le tout donne l'impression d'une maquette fil de fer. C'est le plus gros manque **de matière**.
- **Échos, « Hello world! » ×3 :** titre du hero, sortie du terminal et footer. Le H1 ne dit ni le métier ni l'offre ; c'est la phrase en dessous qui fait le travail.
- **38iii :** mot surligné à l'intérieur des titres (`SkillsSection.astro:65`, `[slug].astro:462`).
- **44c :** le hero dépasse 1440×900 (911px).
- **59 :** 11 sections (cible : 6 à 9) ; écart minimum entre sections de 104px.
- **77 :** contact et notes à 76% de largeur, sans masse.
- **39b :** boutons de 32px (filtres, toggle audience).
- **64 :** labels en mono (`.soon-badge`, `.pager-label`).
- **71 / 72 :** titres plus proches de ce qui précède que de leur contenu ; texte collé aux bords (`span.hello`, `step-tag`).
- **24b :** espacements hors de la grille de 4px (167 occurrences).

## Finish (à traiter, jamais bloquant)

F1 guillemets droits · F3 pas de `text-wrap: balance` (CaseStudyArchi, 404) · F6 chiffres d'affichage sans `tabular-nums` (`HeroFacts.astro:70`, `ExperienceSection.astro:116`) · F19 4 graisses (400 à 700) · F20 grille projets 3 + 1 orpheline · F26 titre de note qui finit sur un mot seul à 375 · 28a premières images en lazy · 29 header en verre dépoli (`SiteHeader.astro:54`) · 3 bordure latérale épaisse sur `.cs-summary`.

## Hors design

- `trailingSlash: 'never'` : `/projets/plateforme-audit/` renvoie 404. Un lien partagé avec un slash final casse. Il faut une redirection ou un `404.astro` qui la gère.
- Notes techniques : les 3 articles sont marqués « bientôt ». Le site promet du contenu qui n'existe pas encore.
- `// exemple illustratif` sur le snippet PHP : honnête, à garder.

## Chiffres à vérifier (46a)

Repris tels quels du site, à confirmer comme réels : 6 ans, 40+ features, -35 % de temps de résolution, PHPStan niv. 8, 3 → 8 développeurs, « l'un des 10 plus grands cabinets ». Logos « Ils m'ont fait confiance » : ce sont des employeurs/clients réels, d'accord pour qu'ils apparaissent ?

## Quelle profondeur pour régler quoi

- **polish** (le look et la mise en page restent) : tokens, focus, reduced-motion, overflow, contraste, eyebrows, capitales espacées, flèches et points médians, échos, 404 du slash final. Ça règle tout le Floor sauf 12 et 13.
- **full** (seul ce niveau le règle) : un hero sur un seul écran avec le CTA visible, ramener 11 sections à 8 ou 9, un budget de mots par écran, remplacer les fenêtres dessinées par de vraies captures.
- **Matière manquante, la plus utile :** de vraies captures (floutées si sous NDA) de la Plateforme d'audit, de 2Aud.io et du traducteur vocal, à la place des placeholders rayés.
