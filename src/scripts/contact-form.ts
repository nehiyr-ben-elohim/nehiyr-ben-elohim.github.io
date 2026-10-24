import type { Cleanup } from './types'

const show = (el: HTMLElement | null, visible: boolean) => {
  if (el) el.hidden = !visible
}

export const initContactForm = (): Cleanup => {
  const forms = [...document.querySelectorAll<HTMLFormElement>('[data-contact-form]')]

  const onSubmit = async (e: SubmitEvent) => {
    const form = e.currentTarget as HTMLFormElement
    e.preventDefault()
    const button = form.querySelector<HTMLButtonElement>('button[type=submit]')
    const sent = form.querySelector<HTMLElement>('.message-sent')
    const error = form.querySelector<HTMLElement>('.message-error')

    button?.classList.add('loading')
    if (button) button.disabled = true
    show(sent, false)
    show(error, false)

    try {
      if (!form.getAttribute('action')) throw new Error('No form endpoint')
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      form.reset()
      show(sent, true)
    } catch {
      show(error, true)
    } finally {
      button?.classList.remove('loading')
      if (button) button.disabled = false
    }
  }

  forms.forEach(f => f.addEventListener('submit', onSubmit))
  return () => forms.forEach(f => f.removeEventListener('submit', onSubmit))
}
