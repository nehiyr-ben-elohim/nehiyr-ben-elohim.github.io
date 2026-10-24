import { applyFilter, type FilterId } from '../lib/project-filter'
import { prefersReducedMotion } from './motion'
import type { Cleanup } from './types'

const press = (buttons: HTMLElement[], active: HTMLElement) =>
  buttons.forEach(b => b.setAttribute('aria-pressed', String(b === active)))

const initActiveSection = (): Cleanup => {
  const sections = [...document.querySelectorAll<HTMLElement>('[data-section]')]
  const label = document.querySelector<HTMLElement>('[data-rail-label]')
  if (!sections.length) return () => {}
  const links = [...document.querySelectorAll<HTMLElement>('[data-nav]')]
  let frame = 0

  const update = () => {
    frame = 0
    let index = 0
    sections.forEach((s, i) => {
      if (s.getBoundingClientRect().top < window.innerHeight * 0.4) index = i
    })
    const active = sections[index]
    links.forEach(l => l.setAttribute('aria-current', String(l.dataset.nav === active.id)))
    if (label) {
      label.textContent = active.dataset.section ?? ''
      label.style.top = `${6 + index * 15}%`
    }
  }
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }

  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => {
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(frame)
  }
}

const initMenu = (): Cleanup => {
  const toggle = document.querySelector<HTMLElement>('[data-nav-toggle]')
  const panel = document.querySelector<HTMLElement>('[data-nav-panel]')
  if (!toggle || !panel) return () => {}

  const set = (open: boolean) => {
    panel.hidden = !open
    toggle.setAttribute('aria-expanded', String(open))
  }
  const onToggle = () => set(toggle.getAttribute('aria-expanded') !== 'true')
  const onPanelClick = (e: Event) => {
    if ((e.target as Element).closest('a')) set(false)
  }

  toggle.addEventListener('click', onToggle)
  panel.addEventListener('click', onPanelClick)
  return () => {
    toggle.removeEventListener('click', onToggle)
    panel.removeEventListener('click', onPanelClick)
  }
}

const initFilters = (): Cleanup => {
  const buttons = [...document.querySelectorAll<HTMLElement>('[data-filter]')]
  const featured = document.querySelector<HTMLElement>('[data-project-featured]')
  const cards = [...document.querySelectorAll<HTMLElement>('[data-project-card]')]
  if (!buttons.length) return () => {}
  const list = cards.map(c => ({ slug: c.dataset.slug ?? '', cat: c.dataset.cat ?? '', featured: c.hasAttribute('data-featured') }))

  const onClick = (e: Event) => {
    const button = e.currentTarget as HTMLElement
    const { featured: feat, grid } = applyFilter(list, button.dataset.filter as FilterId)
    press(buttons, button)
    if (featured) featured.hidden = !feat
    cards.forEach(c => (c.hidden = !grid.includes(c.dataset.slug ?? '')))
  }

  buttons.forEach(b => b.addEventListener('click', onClick))
  return () => buttons.forEach(b => b.removeEventListener('click', onClick))
}

const initInterests = (): Cleanup => {
  const buttons = [...document.querySelectorAll<HTMLElement>('[data-fav]')]
  const panels = [...document.querySelectorAll<HTMLElement>('[data-fav-panel]')]

  const onClick = (e: Event) => {
    const button = e.currentTarget as HTMLElement
    press(buttons, button)
    panels.forEach(p => {
      p.hidden = p.dataset.favPanel !== button.dataset.fav
      if (!p.hidden && !prefersReducedMotion()) {
        p.animate([{ opacity: 0, transform: 'translateX(24px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' })
      }
    })
  }

  buttons.forEach(b => b.addEventListener('click', onClick))
  return () => buttons.forEach(b => b.removeEventListener('click', onClick))
}

export const initHome = (): Cleanup => {
  const cleanups = [initActiveSection(), initMenu(), initFilters(), initInterests()]
  return () => cleanups.forEach(c => c())
}
