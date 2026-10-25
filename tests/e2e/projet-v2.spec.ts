import { test, expect } from '@playwright/test'

const SLUGS = ['plateforme-audit', 'e-learning', '2audio', 'wiin']

test('case study page renders header, metas, summary and stack', async ({ page }) => {
  const res = await page.goto('/projets/plateforme-audit')
  expect(res?.status()).toBe(200)
  await expect(page).toHaveTitle('Plateforme d’audit — Justin Potchona')
  await expect(page.locator('h1')).toHaveText('Plateforme d’audit')
  await expect(page.locator('[data-counter]')).toHaveText('01 / 04')
  await expect(page.locator('.cs-meta dt')).toHaveCount(4)
  await expect(page.locator('.cs-summary a')).toHaveCount(5)
  await expect(page.locator('.cs-summary a').first()).toHaveAttribute('href', '#s01')
  await expect(page.locator('.cs-summary a').last()).toHaveAttribute('href', '#archi')
  await expect(page.locator('.cs-stack li')).toHaveCount(5)
  await expect(page.locator('.cs-stack img').first()).toHaveAttribute('src', '/img/devicons/symfony.svg')
  await expect(page.locator('.cs-stack li').first()).toContainText('API, règles métier, back-office')
  await expect(page.locator('#s02 li')).toHaveCount(4)
  await expect(page.locator('#s01 ul')).toHaveCount(0)
  await expect(page.locator('.cs-visual')).toHaveCSS('background-color', 'rgb(33, 43, 106)')
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://nehiyr-ben-elohim.github.io/projets/plateforme-audit')
})

test('prev/next wrap around the list', async ({ page }) => {
  await page.goto('/projets/plateforme-audit')
  await expect(page.locator('[data-prev]')).toHaveAttribute('href', '/projets/wiin')
  await expect(page.locator('[data-next]')).toHaveAttribute('href', '/projets/e-learning')
  await page.goto('/projets/wiin')
  await expect(page.locator('[data-counter]')).toHaveText('04 / 04')
  await expect(page.locator('[data-next]')).toHaveAttribute('href', '/projets/plateforme-audit')
})

test('next link navigates to the next case study', async ({ page }) => {
  await page.goto('/projets/e-learning')
  await page.locator('[data-next]').click()
  await expect(page).toHaveURL(/\/projets\/2audio$/)
  await expect(page.locator('h1')).toHaveText('2Aud.io')
})

test('every case study slug loads, unknown slug is 404', async ({ request }) => {
  for (const slug of SLUGS) expect((await request.get(`/projets/${slug}`)).status(), slug).toBe(200)
  expect((await request.get('/projets/n-existe-pas')).status()).toBe(404)
})

test('NDA projects show a badge instead of a code link, no fake URL', async ({ page }) => {
  await page.goto('/projets/plateforme-audit')
  await expect(page.locator('[data-nda]')).toContainText('code client confidentiel · NDA')
  await expect(page.getByText('voir le code')).toHaveCount(0)
  await expect(page.locator('[data-shot-url]')).toHaveText('confidentiel')
  await page.goto('/projets/2audio')
  await expect(page.locator('[data-nda]')).toHaveCount(0)
  await expect(page.getByText('voir le code')).toHaveCount(0)
  await expect(page.locator('[data-shot-url]')).toHaveCount(0)
})

test('en bref: problem / solution / result and 3 metrics', async ({ page }) => {
  await page.goto('/projets/plateforme-audit')
  await expect(page.locator('.tldr dt')).toHaveText(['Problème', 'Solution', 'Résultat'])
  await expect(page.locator('.metrics [data-fact]')).toHaveCount(3)
  await expect(page.locator('.metrics [data-fact]').nth(1).locator('dd')).toHaveText('-35 %')
})

test('architecture diagram and illustrative snippet', async ({ page }) => {
  await page.goto('/projets/plateforme-audit')
  await expect(page.locator('#archi .kicker-label')).toHaveText('› 02 — architecture')
  await expect(page.locator('#archi .layer')).toHaveCount(4)
  await expect(page.locator('#archi .node.hi')).toHaveText(/API Symfony/)
  await expect(page.locator('#archi .snippet-file')).toHaveText('src/Audit/Handler/ValidateMissionHandler.php')
  await expect(page.locator('#archi .snippet-note')).toHaveText('// exemple illustratif')
})

test('no gallery, testimonial or zoom without real content', async ({ page }) => {
  await page.goto('/projets/plateforme-audit')
  await expect(page.locator('#galerie')).toHaveCount(0)
  await expect(page.locator('#avis')).toHaveCount(0)
  await expect(page.locator('[data-zoom]')).toHaveCount(0)
  await expect(page.locator('#suite .kicker-label')).toHaveText('› 03 — un projet similaire ?')
})

test('pager cards show the neighbour kind', async ({ page }) => {
  await page.goto('/projets/plateforme-audit')
  await expect(page.locator('[data-prev] .pager-kind')).toHaveText('mission client')
  await expect(page.locator('[data-next] .pager-kind')).toHaveText('full-stack')
})

test('arrow keys move between case studies', async ({ page }) => {
  await page.goto('/projets/plateforme-audit')
  await expect(page.locator('.crumbs')).toContainText('01 / 04 · ← → pour naviguer')
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/\/projets\/e-learning$/)
  await page.keyboard.press('ArrowLeft')
  await expect(page).toHaveURL(/\/projets\/plateforme-audit$/)
  await page.keyboard.press('Alt+ArrowRight')
  await expect(page).toHaveURL(/\/projets\/plateforme-audit$/)
})

test('desktop: progress bar, rail and table of contents follow the scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/projets/plateforme-audit')
  await expect(page.locator('.project-links a[href="/#projets"]')).toHaveAttribute('aria-current', 'true')
  await page.locator('#archi').scrollIntoViewIfNeeded()
  await page.mouse.wheel(0, 200)
  await expect(page.locator('.cs-summary a[href="#archi"]')).toHaveAttribute('aria-current', 'true')
  await expect(page.locator('[data-rail-label]')).toHaveText('architecture')
  await expect.poll(() => page.locator('[data-progress]').evaluate(el => parseFloat((el as HTMLElement).style.width))).toBeGreaterThan(30)
})

test('revealed blocks end visible after scrolling', async ({ page }) => {
  await page.goto('/projets/plateforme-audit')
  const last = page.locator('#s04')
  await last.scrollIntoViewIfNeeded()
  await expect.poll(() => last.evaluate(el => getComputedStyle(el).opacity)).toBe('1')
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })
  test('content visible immediately', async ({ page }) => {
    await page.goto('/projets/plateforme-audit')
    expect(await page.locator('h1').evaluate(el => getComputedStyle(el).opacity)).toBe('1')
    expect(await page.locator('#s04').evaluate(el => getComputedStyle(el).opacity)).toBe('1')
  })
})

test.describe('no JS', () => {
  test.use({ javaScriptEnabled: false })
  test('all sections visible', async ({ page }) => {
    await page.goto('/projets/plateforme-audit')
    await expect(page.locator('#s04 h2')).toBeVisible()
    await expect(page.locator('.cs-meta dd').first()).toBeVisible()
  })
})
