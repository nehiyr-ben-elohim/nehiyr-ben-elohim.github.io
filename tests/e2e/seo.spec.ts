import { test, expect } from '@playwright/test'

const SITE = 'https://nehiyr-ben-elohim.github.io'

test('home canonical is the site root', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `${SITE}/`)
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', 'Justin Potchona')
})

test('case study has its own title, description and canonical', async ({ page }) => {
  await page.goto('/projets/wiin')
  await expect(page).toHaveTitle('WIIN — Justin Potchona')
  await expect(page.locator('meta[name=description]')).toHaveAttribute('content', /dématérialisation/)
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `${SITE}/projets/wiin`)
})

test('sitemap lists home and every case study, no trailing slash', async ({ request }) => {
  const xml = await (await request.get('/sitemap-0.xml')).text()
  expect(xml).toContain(`<loc>${SITE}/</loc>`)
  expect(xml).toContain(`<loc>${SITE}/projets/plateforme-audit</loc>`)
  expect(xml).not.toMatch(/<loc>https:\/\/[^/]+\/[^<]+\/<\/loc>/)
  expect(xml).not.toContain('/404')
})

test('robots.txt points to the sitemap', async ({ request }) => {
  const txt = await (await request.get('/robots.txt')).text()
  expect(txt).toContain(`Sitemap: ${SITE}/sitemap-index.xml`)
})
