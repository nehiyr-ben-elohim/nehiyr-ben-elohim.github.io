import { test, expect } from '@playwright/test'

test('project page has unique title, description, canonical and og:image', async ({ page }) => {
  await page.goto('/projects/groupe-carrere')
  await expect(page).toHaveTitle('Groupe Carrere — Jean-jacques AKAKPO')
  const description = await page.locator('meta[name=description]').getAttribute('content')
  expect(description).toBeTruthy()
  expect(description).not.toContain('Portfolio, réalisations et contact')
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://jeanjacquesakakpo.me/projects/groupe-carrere')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\/jeanjacquesakakpo\.me\/.+\.jpg$/)
})

test('canonical URL is served directly, without redirect', async ({ request }) => {
  const res = await request.get('/projects/groupe-carrere', { maxRedirects: 0 })
  expect(res.status()).toBe(200)
})

test('home canonical is the site root', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://jeanjacquesakakpo.me/')
})

test('sitemap lists every project URL', async ({ request }) => {
  const xml = await (await request.get('/sitemap-0.xml')).text()
  expect(xml).toContain('<loc>https://jeanjacquesakakpo.me/projects/groupe-carrere</loc>')
  expect(xml).toContain('<loc>https://jeanjacquesakakpo.me/blog</loc>')
  expect(xml).not.toMatch(/<loc>https:\/\/[^/]+\/[^<]+\/<\/loc>/)
})

test('robots.txt points to the sitemap', async ({ request }) => {
  const txt = await (await request.get('/robots.txt')).text()
  expect(txt).toContain('Sitemap: https://jeanjacquesakakpo.me/sitemap-index.xml')
})
