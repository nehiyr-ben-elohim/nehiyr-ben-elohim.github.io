import { validateContact, type ContactFields } from '../lib/contact-validation'
import type { Cleanup } from './types'

const show = (el: HTMLElement | null, visible: boolean) => {
  if (el) el.hidden = !visible
}

const field = (form: HTMLFormElement, name: string) =>
  form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`)

const setError = (form: HTMLFormElement, name: string, invalid: boolean) => {
  show(form.querySelector<HTMLElement>(`[data-error="${name}"]`), invalid)
  field(form, name)?.setAttribute('aria-invalid', String(invalid))
}

export const initContactForm = (): Cleanup => {
  const forms = [...document.querySelectorAll<HTMLFormElement>('[data-contact-form]')]

  const onSubmit = async (e: SubmitEvent) => {
    const form = e.currentTarget as HTMLFormElement
    e.preventDefault()
    const values: ContactFields = {
      name: field(form, 'name')?.value ?? '',
      email: field(form, 'email')?.value ?? '',
      message: field(form, 'message')?.value ?? '',
    }
    const errors = validateContact(values)
    Object.entries(errors).forEach(([name, invalid]) => setError(form, name, invalid))
    const firstInvalid = Object.keys(errors).find(k => errors[k as keyof ContactFields])
    if (firstInvalid) {
      field(form, firstInvalid)?.focus()
      return
    }

    const button = form.querySelector<HTMLButtonElement>('button[type=submit]')
    const label = form.querySelector<HTMLElement>('[data-submit-label]')
    const sent = form.querySelector<HTMLElement>('.message-sent')
    const error = form.querySelector<HTMLElement>('.message-error')
    if (button) button.disabled = true
    if (label) label.textContent = 'envoi…'
    show(error, false)

    try {
      if (!form.getAttribute('action')) throw new Error('No form endpoint')
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const name = form.querySelector('[data-sent-name]')
      if (name) name.textContent = values.name.trim()
      const type = field(form, 'type')?.value
      form.reset()
      // keep the chosen request type across messages
      const typeInput = field(form, 'type')
      if (typeInput && type) typeInput.value = type
      form.toggleAttribute('data-sent', true)
      show(sent, true)
    } catch {
      show(error, true)
    } finally {
      if (button) button.disabled = false
      if (label) label.textContent = 'hello'
    }
  }

  const onInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    const form = target.form
    if (form && target.getAttribute('aria-invalid') === 'true') setError(form, target.name, false)
  }

  const onClick = (e: MouseEvent) => {
    const target = e.target as Element
    const form = target.closest<HTMLFormElement>('[data-contact-form]')
    if (!form) return
    const request = target.closest<HTMLElement>('[data-request]')
    if (request) {
      form.querySelectorAll('[data-request]').forEach(b => b.setAttribute('aria-checked', String(b === request)))
      const input = field(form, 'type')
      if (input) input.value = request.dataset.request ?? ''
      form.setAttribute('data-type-picked', '')
    }
    if (target.closest('[data-contact-reset]')) {
      form.toggleAttribute('data-sent', false)
      show(form.querySelector<HTMLElement>('.message-sent'), false)
      field(form, 'name')?.focus()
    }
  }

  forms.forEach(f => {
    f.addEventListener('submit', onSubmit)
    f.addEventListener('input', onInput)
    f.addEventListener('click', onClick)
  })
  return () =>
    forms.forEach(f => {
      f.removeEventListener('submit', onSubmit)
      f.removeEventListener('input', onInput)
      f.removeEventListener('click', onClick)
    })
}
