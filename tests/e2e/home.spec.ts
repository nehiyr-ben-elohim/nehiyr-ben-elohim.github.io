import { test, expect } from '@playwright/test'

test('hero: title, hello, facts', async ({ page }) => {
  const res = await page.goto('/')
  expect(res?.status()).toBe(200)
  await expect(page).toHaveTitle('Justin Potchona — Développeur backend & machine learning')
  await expect(page.locator('h1')).toHaveText('Hello world!')
  await expect(page.locator('.facts dt')).toHaveCount(4)
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
})

test.describe('no JS', () => {
  test.use({ javaScriptEnabled: false })
  test('every project and first interest visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-project-featured]')).toBeVisible()
    await expect(page.locator('[data-project-card]:visible')).toHaveCount(3)
    await expect(page.locator('[data-fav-panel="musics"]')).toBeVisible()
    await expect(page.locator('#contact h2')).toBeVisible()
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
