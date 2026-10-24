import { test, expect } from '@playwright/test'

test('/blog groups activities by year, most recent first', async ({ page }) => {
  await page.goto('/blog')
  const years = await page.locator('[data-group-year]').evaluateAll(els => els.map(e => Number((e as HTMLElement).dataset.groupYear)))
  expect(years.length).toBeGreaterThan(1)
  expect(years).toEqual([...years].sort((a, b) => b - a))
})

test('each blog entry links to its activity href', async ({ page }) => {
  await page.goto('/blog')
  const hrefs = await page.locator('.blog-article-item a').evaluateAll(els => els.map(e => e.getAttribute('href')))
  expect(hrefs).toHaveLength(9)
  for (const href of hrefs) expect(href).toMatch(/^\/(projects|blog)\/[a-z0-9-]+$/)
})
