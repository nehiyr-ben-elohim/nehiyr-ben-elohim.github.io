import { test, expect, type Page } from '@playwright/test'

const scrollToFirstCard = (page: Page) =>
  page.evaluate(() => document.querySelector('#works .project-item')!.scrollIntoView({ block: 'center' }))

test('menu toggles exactly once after home → project → home', async ({ page }) => {
  await page.goto('/')
  await scrollToFirstCard(page)
  await page.locator('#works a.project-item-link').first().click()
  await page.waitForURL(/\/projects\//)
  await page.goBack()
  await page.waitForURL(url => url.pathname === '/')
  await page.locator('[data-menu-toggle].menu-toggler').click()
  await expect(page.locator('.menu-wrapper')).toHaveClass(/menu-opened/)
})

test('nav item becomes active when #skills is scrolled into view', async ({ page }) => {
  await page.goto('/')
  await page.locator('#skills').scrollIntoViewIfNeeded()
  await page.evaluate(() => document.getElementById('skills')!.scrollIntoView({ block: 'start' }))
  await expect(page.locator('.nav-item[data-nav-target="#skills"]')).toHaveClass(/active/)
})

test('project cards get revealed after client navigation', async ({ page }) => {
  await page.goto('/blog')
  await page.locator('.go-home-wrapper a').click()
  await page.waitForURL(url => url.pathname === '/')
  await scrollToFirstCard(page)
  await expect(page.locator('#works .project-item').first()).toHaveClass(/reveal/)
})
