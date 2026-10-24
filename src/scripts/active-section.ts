import type { Cleanup } from './types'

const ACTIVE_LINK = ['dashed-text', 'prefixed-text']

// A section is current when it crosses the line at 55% of the viewport.
export const initActiveSection = (): Cleanup => {
  const items = [...document.querySelectorAll<HTMLElement>('.nav-item[data-nav-target^="#"]')]
  const sections = items
    .map(item => document.querySelector<HTMLElement>(item.dataset.navTarget!))
    .filter((s): s is HTMLElement => !!s)
  if (!sections.length) return () => {}

  const activate = (id: string) => {
    for (const item of items) {
      const on = item.dataset.navTarget === `#${id}`
      item.classList.toggle('active', on)
      item.querySelector('a')?.classList.toggle(ACTIVE_LINK[0], on)
      item.querySelector('a')?.classList.toggle(ACTIVE_LINK[1], on)
    }
  }

  const observer = new IntersectionObserver(
    entries => entries.filter(e => e.isIntersecting).forEach(e => activate(e.target.id)),
    { rootMargin: '-55% 0px -45% 0px' },
  )
  sections.forEach(s => observer.observe(s))
  return () => observer.disconnect()
}
