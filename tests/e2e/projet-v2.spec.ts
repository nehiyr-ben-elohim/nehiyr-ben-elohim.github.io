import { test, expect } from '@playwright/test'

const SLUGS = ['plateforme-audit', 'e-learning', '2audio', 'wiin']

test('case study page renders header, metas, summary and stack', async ({ page }) => {
  const res = await page.goto('/projets/plateforme-audit')
  expect(res?.status()).toBe(200)
  await expect(page).toHaveTitle('Plateforme d’audit — Justin Potchona')
  await expect(page.locator('h1')).toHaveText('Plateforme d’audit')
  await expect(page.locator('[data-counter]')).toHaveText('01 / 04')
  await expect(page.locator('.cs-meta dt')).toHaveCount(4)
  await expect(page.locator('.cs-summary a')).toHaveCount(4)
  await expect(page.locator('.cs-summary a').first()).toHaveAttribute('href', '#s01')
  await expect(page.locator('.cs-stack li')).toHaveCount(5)
  await expect(page.locator('.cs-stack img').first()).toHaveAttribute('src', '/img/devicons/symfony.svg')
  await expect(page.locator('#s02 li')).toHaveCount(4)
  await expect(page.locator('#s01 ul')).toHaveCount(0)
  await expect(page.locator('.cs-visual')).toHaveCSS('background-color', 'rgb(33, 43, 106)')
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://jeanjacquesakakpo.me/projets/plateforme-audit')
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

test('external links open safely', async ({ page }) => {
  await page.goto('/projets/plateforme-audit')
  const gh = page.locator('a[href="https://github.com/nehiyr-ben-elohim"]')
  await expect(gh).toHaveAttribute('target', '_blank')
  await expect(gh).toHaveAttribute('rel', /noopener/)
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
