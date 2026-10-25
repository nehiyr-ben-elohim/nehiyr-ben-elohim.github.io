import { test, expect } from '@playwright/test'

test('hero: title, hello, facts', async ({ page }) => {
  const res = await page.goto('/')
  expect(res?.status()).toBe(200)
  await expect(page).toHaveTitle('Justin Potchona — Développeur backend & machine learning')
  await expect(page.locator('h1')).toHaveText('Hello world!')
  const facts = page.locator('.facts a[data-fact]')
  await expect(facts).toHaveCount(3)
  await expect(facts.nth(0)).toHaveAttribute('href', '#parcours')
  await expect(facts.nth(0).locator('dd')).toHaveText('6 ans')
  await expect(facts.nth(2).locator('dd')).toHaveText('Backend & ML')
})

test('sections in design order, numbered kickers, nav follows', async ({ page }) => {
  await page.goto('/')
  const ids = await page.locator('main > section[id]').evaluateAll(els => els.map(e => e.id))
  expect(ids).toEqual(['top', 'projets', 'parcours', 'competences', 'apropos', 'contact'])
  await expect(page.locator('#projets .kicker-label')).toHaveText('› 01 — mes réalisations')
  await expect(page.locator('#contact .kicker-label')).toHaveText('› 05 — un rendez-vous ?')
  await expect(page.locator('.desk-nav a[data-nav]')).toHaveText(['projets', 'parcours', 'compétences', 'à propos'])
})

test('marquee bands are decorative, quick contact links to contact', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.bands')).toHaveAttribute('aria-hidden', 'true')
  await expect(page.locator('.bands')).toContainText('machine learning')
  const quick = page.locator('section[aria-label="Contact rapide"]')
  await expect(quick).toContainText('Un projet en tête ?')
  await expect(quick.locator('a[href="#contact"]')).toBeVisible()
  await expect(quick.locator('a[href^="mailto:"]')).toBeVisible()
})

test('projects: featured block + grid, links to case studies', async ({ page }) => {
  await page.goto('/')
  const feat = page.locator('[data-project-featured]')
  await expect(feat).toBeVisible()
  await expect(feat.locator('h3')).toHaveText('Plateforme d’audit')
  await expect(feat.locator('a[href="/projets/plateforme-audit"]').first()).toBeVisible()
  await expect(page.locator('[data-project-card]:visible')).toHaveCount(3)
  await expect(page.locator('[data-filter] .count')).toHaveText(['04', '03', '01'])
  await expect(page.getByText('code ↗')).toHaveCount(0)
})

test('filters: category hides featured block and puts it back in the grid', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-filter="perso"]').click()
  await expect(page.locator('[data-filter="perso"]')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('[data-filter="all"]')).toHaveAttribute('aria-pressed', 'false')
  await expect(page.locator('[data-project-featured]')).toBeHidden()
  await expect(page.locator('[data-project-card]:visible h3')).toHaveText(['2Aud.io'])
  await page.locator('[data-filter="client"]').click()
  await expect(page.locator('[data-project-card]:visible h3')).toHaveText(['Plateforme d’audit', 'Plateforme e-learning', 'WIIN'])
  await page.locator('[data-filter="all"]').click()
  await expect(page.locator('[data-project-featured]')).toBeVisible()
  await expect(page.locator('[data-project-card]:visible')).toHaveCount(3)
})

test('skills, experience', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.skill-group')).toHaveCount(6)
  await expect(page.locator('.skill-group').first().locator('.count')).toHaveText('07')
  await expect(page.locator('.skill-group img').first()).toHaveAttribute('src', '/img/devicons/python.svg')
  await expect(page.locator('.timeline > li')).toHaveCount(4)
  await expect(page.locator('.timeline .current')).toHaveCount(1)
  await expect(page.locator('.exp-count')).toHaveText('04')
})

test('experience cards: first open, toggle one, expand all', async ({ page }) => {
  await page.goto('/')
  const toggles = page.locator('[data-exp-toggle]')
  const bodies = page.locator('[data-exp-body]')
  await expect(toggles.nth(0)).toHaveAttribute('aria-expanded', 'true')
  await expect(bodies.nth(0)).toBeVisible()
  await expect(bodies.nth(1)).toBeHidden()
  await expect(bodies.nth(0).locator('a[href="/projets/plateforme-audit"]')).toBeVisible()
  await toggles.nth(1).click()
  await expect(toggles.nth(1)).toHaveAttribute('aria-expanded', 'true')
  await expect(bodies.nth(1)).toBeVisible()
  await expect(bodies.nth(1)).toContainText('écrans intégrés en 3 mois')
  await toggles.nth(0).click()
  await expect(bodies.nth(0)).toBeHidden()
  const all = page.locator('[data-exp-all]')
  await expect(all).toHaveText('tout déplier ↓')
  await all.click()
  await expect(bodies.filter({ visible: true })).toHaveCount(4)
  await expect(all).toHaveText('tout réduire ↑')
  await all.click()
  await expect(bodies.filter({ visible: true })).toHaveCount(0)
})

test('experience shows company logos, monogram when missing', async ({ page }) => {
  await page.goto('/')
  const logos = page.locator('.timeline .company-logo')
  await expect(logos).toHaveCount(4)
  await expect(logos.nth(0).locator('img')).toHaveAttribute('src', '/img/companies/thecodingmachine.png')
  await expect(logos.nth(1).locator('img')).toHaveAttribute('src', '/img/companies/wiin.png')
  await expect(logos.nth(2)).toHaveText('DM')
  await expect(logos.nth(3)).toHaveText('MG')
  await expect(logos.nth(0)).toHaveAttribute('href', 'https://thecodingmachine.com')
  await expect(logos.nth(3)).not.toHaveAttribute('href', /.*/)
  expect(await logos.nth(0).locator('img').evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
})

test('interests switcher', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-fav-panel="musics"]')).toBeVisible()
  await page.locator('[data-fav="games"]').click()
  await expect(page.locator('[data-fav="games"]')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('[data-fav-panel="games"]')).toContainText('fps · foot · open world')
  await expect(page.locator('[data-fav-panel="musics"]')).toBeHidden()
})

test('desktop nav highlights the section in view, rail follows', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')
  await expect(page.locator('[data-nav-toggle]')).toBeHidden()
  await page.locator('.desk-nav a[href="#competences"]').click()
  await expect(page.locator('.desk-nav a[href="#competences"]')).toHaveAttribute('aria-current', 'true')
  await expect(page.locator('[data-rail-label]')).toHaveText('compétences')
  await expect(page.locator('[data-skills-more]')).toBeHidden()
  await expect(page.locator('.skill-group:visible')).toHaveCount(6)
})

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })
  test('menu opens, closes on link, no horizontal scroll', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.desk-nav')).toBeHidden()
    await expect(page.locator('.rail')).toBeHidden()
    const toggle = page.locator('[data-nav-toggle]')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('[data-nav-panel]')).toBeVisible()
    await page.locator('[data-nav-panel] a[href="#parcours"]').click()
    await expect(page.locator('[data-nav-panel]')).toBeHidden()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })

  test('skills: 3 groups, then all on demand', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.skill-group:visible')).toHaveCount(3)
    await page.locator('[data-skills-more]').click()
    await expect(page.locator('.skill-group:visible')).toHaveCount(6)
    await expect(page.locator('[data-skills-more]')).toBeHidden()
  })
})

test.describe('no JS', () => {
  test.use({ javaScriptEnabled: false })
  test('every project and first interest visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-project-featured]')).toBeVisible()
    await expect(page.locator('[data-project-card]:visible')).toHaveCount(3)
    await expect(page.locator('[data-fav-panel="musics"]')).toBeVisible()
    await expect(page.locator('#contact h2')).toBeVisible()
    await expect(page.locator('[data-exp-body]').filter({ visible: true })).toHaveCount(4)
    await expect(page.locator('[data-exp-all], [data-exp-toggle]').filter({ visible: true })).toHaveCount(0)
  })
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })
  test('content visible immediately', async ({ page }) => {
    await page.goto('/')
    expect(await page.locator('[data-anim="hello"]').evaluate(el => getComputedStyle(el).opacity)).toBe('1')
    expect(await page.locator('.timeline > li').last().evaluate(el => getComputedStyle(el).opacity)).toBe('1')
  })
})

test('revealed blocks end visible after scrolling', async ({ page }) => {
  await page.goto('/')
  const last = page.locator('.timeline > li').last()
  await last.scrollIntoViewIfNeeded()
  await expect.poll(() => last.evaluate(el => getComputedStyle(el).opacity)).toBe('1')
})

test('unknown URL → 404 page with link home', async ({ page }) => {
  const res = await page.goto('/n-existe-pas')
  expect(res?.status()).toBe(404)
  await expect(page.locator('main a[href="/"]')).toBeVisible()
})
