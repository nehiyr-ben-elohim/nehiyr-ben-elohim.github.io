import { test, expect } from '@playwright/test'

const HISTORICAL = [
  'groupe-carrere', 'liebherr', 'touki-saint-louis', 'ushuaia-beaute',
  '1-to-1-services', 'wola-group', 'mailar', 'followad', 'fast-foud',
]

test('direct load of /projects/groupe-carrere', async ({ page }) => {
  const res = await page.goto('/projects/groupe-carrere')
  expect(res?.status()).toBe(200)
  await expect(page.locator('h4.title', { hasText: 'Groupe Carrere' })).toBeVisible()
  await expect(page.locator('.metas-list')).toContainText('Tools')
})

test('every historical slug loads with 200', async ({ request }) => {
  for (const slug of HISTORICAL) {
    const res = await request.get(`/projects/${slug}`)
    expect(res.status(), slug).toBe(200)
  }
})

test('unknown slug → 404 page, not first project', async ({ page }) => {
  const res = await page.goto('/projects/n-existe-pas')
  expect(res?.status()).toBe(404)
  await expect(page.locator('body')).not.toContainText('Fast Foud')
  await expect(page.locator('a[href="/"]').first()).toBeVisible()
})

test('/projects lists all visible projects', async ({ page }) => {
  await page.goto('/projects')
  await expect(page.locator('.project-item')).toHaveCount(HISTORICAL.length)
})

test('adjacent links: most recent project has no prev control', async ({ page }) => {
  await page.goto('/projects/fast-foud')
  await expect(page.locator('.adjacents-control-prev')).toHaveCount(0)
  await expect(page.locator('.adjacents-control-next')).toHaveCount(1)
})
