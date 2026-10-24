import { test, expect } from '@playwright/test'

test('content visible with JS disabled', async ({ browser }) => {
  const page = await (await browser.newContext({ javaScriptEnabled: false })).newPage()
  await page.goto('/')
  const title = page.locator('.landing-header-text--1')
  await expect(title).toBeVisible()
  await expect(title).not.toHaveCSS('opacity', '0')
  await expect(page.locator('#works .project-item').first()).not.toHaveCSS('opacity', '0')
})

test('reduced motion: reveal targets get scroll-breaked without delay', async ({ browser }) => {
  const page = await (await browser.newContext({ reducedMotion: 'reduce' })).newPage()
  await page.goto('/')
  await expect(page.locator('#hi [data-scrollbreak]').first()).toHaveClass(/scroll-breaked/, { timeout: 300 })
})

test('project page content visible with JS disabled', async ({ browser }) => {
  const page = await (await browser.newContext({ javaScriptEnabled: false })).newPage()
  await page.goto('/projects/fast-foud')
  for (const sel of ['.project-item-metas', '.the-concept', '.report']) {
    await expect(page.locator(sel)).not.toHaveCSS('opacity', '0')
  }
})
