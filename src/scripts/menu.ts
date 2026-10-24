import { prefersReducedMotion } from './motion'
import type { Cleanup } from './types'

export const initMenu = (): Cleanup => {
  const wrapper = document.querySelector<HTMLElement>('[data-menu]')
  const content = document.getElementById('js--menuContent')

  const setOpen = (open: boolean) => {
    wrapper?.classList.toggle('menu-opened', open)
    document.querySelectorAll('.menu-toggler').forEach(t => {
      t.classList.toggle('menu-opened', open)
      t.setAttribute('aria-expanded', String(open))
    })
  }

  const onClick = (e: MouseEvent) => {
    const target = e.target as Element
    if (target.closest('[data-menu-toggle]')) {
      e.preventDefault()
      setOpen(!wrapper?.classList.contains('menu-opened'))
    } else if (target.closest('[data-menu-link]')) {
      setOpen(false)
    } else if (target.closest('[data-latest-open]')) {
      e.preventDefault()
      content?.classList.add('open-latest-activities')
    } else if (target.closest('[data-latest-close]')) {
      e.preventDefault()
      content?.classList.remove('open-latest-activities')
    } else if (target.closest('[data-goto-top]')) {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    }
  }

  // capture phase: preventDefault before ClientRouter treats href="#" as a navigation
  document.addEventListener('click', onClick, true)
  return () => document.removeEventListener('click', onClick, true)
}
