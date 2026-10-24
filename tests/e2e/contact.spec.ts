import { test, expect, type Page } from '@playwright/test'

const FORMSPREE = '**/formspree.io/**'

const fill = async (page: Page) => {
  await page.goto('/projects')
  const form = page.locator('[data-contact-form]')
  await form.evaluate(el => el.scrollIntoView({ block: 'center' }))
  await form.locator('input[name=name]').fill('Ada')
  await form.locator('input[name=email]').fill('ada@example.com')
  await form.locator('textarea[name=message]').fill('Bonjour')
  return form
}

test('success: shows sent message and clears fields', async ({ page }) => {
  await page.route(FORMSPREE, r => r.fulfill({ status: 200, json: { ok: true } }))
  const form = await fill(page)
  await form.locator('button[type=submit]').click()
  await expect(form.locator('.message-sent')).toBeVisible()
  await expect(form.locator('.message-error')).toBeHidden()
  await expect(form.locator('input[name=name]')).toHaveValue('')
})

for (const [name, handler] of [
  ['HTTP 500', (r: import('@playwright/test').Route) => r.fulfill({ status: 500, json: { error: 'boom' } })],
  ['network failure', (r: import('@playwright/test').Route) => r.abort('failed')],
] as const) {
  test(`${name}: error message, button re-enabled, input kept`, async ({ page }) => {
    await page.route(FORMSPREE, handler)
    const form = await fill(page)
    await form.locator('button[type=submit]').click()
    await expect(form.locator('.message-error')).toBeVisible()
    await expect(form.locator('.message-sent')).toBeHidden()
    await expect(form.locator('button[type=submit]')).toBeEnabled()
    await expect(form.locator('input[name=name]')).toHaveValue('Ada')
  })
}

test('form posts to Formspree with JSON accept header', async ({ page }) => {
  let accept = ''
  await page.route(FORMSPREE, r => {
    accept = r.request().headers()['accept'] ?? ''
    return r.fulfill({ status: 200, json: { ok: true } })
  })
  const form = await fill(page)
  await expect(form).toHaveAttribute('action', 'https://formspree.io/f/test')
  await form.locator('button[type=submit]').click()
  await expect(form.locator('.message-sent')).toBeVisible()
  expect(accept).toContain('application/json')
})
