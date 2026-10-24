import { test, expect } from '@playwright/test'

test('home renders the 5 anchored sections', async ({ page }) => {
  await page.goto('/')
  for (const id of ['hi', 'about', 'works', 'skills', 'contact']) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1)
  }
})

test('home shows at most 6 featured projects linking to /projects/<slug>', async ({ page }) => {
  await page.goto('/')
  const cards = page.locator('#works .project-item')
  const count = await cards.count()
  expect(count).toBeGreaterThan(0)
  expect(count).toBeLessThanOrEqual(6)
  for (const href of await cards.locator('a.project-item-link').evaluateAll(els => els.map(e => e.getAttribute('href')))) {
    expect(href).toMatch(/^\/projects\/[a-z0-9-]+$/)
  }
})

test('no target=_blank without rel=noopener', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('a[target=_blank]:not([rel~=noopener])')).toHaveCount(0)
})

test('no email address in served HTML/JS', async ({ page }) => {
  const bodies: string[] = []
  page.on('response', async r => {
    if (/html|javascript/.test(r.headers()['content-type'] ?? '')) bodies.push(await r.text())
  })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  expect(bodies.length).toBeGreaterThan(0)
  for (const b of bodies) expect(b).not.toContain('@gmail.com')
})
