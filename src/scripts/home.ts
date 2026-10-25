import { applyFilter, type FilterId } from '../lib/project-filter'
import { railTop } from '../lib/rail'
import { runCommand } from '../lib/terminal'
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
      label.style.top = railTop(index, sections.length)
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

const initExperience = (): Cleanup => {
  const toggles = [...document.querySelectorAll<HTMLElement>('[data-exp-toggle]')]
  const all = document.querySelector<HTMLElement>('[data-exp-all]')
  if (!toggles.length) return () => {}

  const isOpen = (t: HTMLElement) => t.getAttribute('aria-expanded') === 'true'
  const set = (t: HTMLElement, open: boolean) => {
    const body = document.getElementById(t.getAttribute('aria-controls') ?? '')
    t.setAttribute('aria-expanded', String(open))
    const label = t.querySelector('.toggle-label')
    if (label) label.textContent = open ? 'réduire' : 'détails'
    if (!body || body.hidden === !open) return
    body.hidden = !open
    if (open && !prefersReducedMotion()) {
      body.animate([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 350, easing: 'cubic-bezier(.2,.8,.2,1)' })
    }
  }
  const syncAll = () => {
    if (all) all.textContent = toggles.every(isOpen) ? 'tout réduire ↑' : 'tout déplier ↓'
  }
  const onToggle = (e: Event) => {
    const t = e.currentTarget as HTMLElement
    set(t, !isOpen(t))
    syncAll()
  }
  const onAll = () => {
    const open = !toggles.every(isOpen)
    toggles.forEach(t => set(t, open))
    syncAll()
  }

  syncAll()
  toggles.forEach(t => t.addEventListener('click', onToggle))
  all?.addEventListener('click', onAll)
  return () => {
    toggles.forEach(t => t.removeEventListener('click', onToggle))
    all?.removeEventListener('click', onAll)
  }
}

const initSkillsMore = (): Cleanup => {
  const button = document.querySelector<HTMLElement>('[data-skills-more]')
  const section = document.querySelector<HTMLElement>('[data-skills]')
  if (!button || !section) return () => {}
  const onClick = () => section.setAttribute('data-all', '')
  button.addEventListener('click', onClick)
  return () => button.removeEventListener('click', onClick)
}

// "j'ai un projet" / "je recrute": CSS shows .for-client / .for-rec from [data-audience]
const initAudience = (): Cleanup => {
  const root = document.querySelector<HTMLElement>('[data-audience]')
  const buttons = [...document.querySelectorAll<HTMLElement>('[data-aud]')]
  if (!root || !buttons.length) return () => {}

  const onClick = (e: Event) => {
    const button = e.currentTarget as HTMLElement
    buttons.forEach(b => b.setAttribute('aria-checked', String(b === button)))
    root.dataset.audience = button.dataset.aud
    // preselect the request type unless the visitor already chose one
    const form = document.querySelector('[data-contact-form]')
    if (form && !form.hasAttribute('data-type-picked')) {
      const request = button.dataset.request ?? ''
      form.querySelectorAll('[data-request]').forEach(b => b.setAttribute('aria-checked', String(b.getAttribute('data-request') === request)))
      const input = form.querySelector<HTMLInputElement>('[data-request-type]')
      if (input) input.value = request
    }
  }

  buttons.forEach(b => b.addEventListener('click', onClick))
  return () => buttons.forEach(b => b.removeEventListener('click', onClick))
}

const initTerminal = (): Cleanup => {
  const input = document.querySelector<HTMLInputElement>('[data-term]')
  const log = document.querySelector<HTMLElement>('[data-term-log]')
  if (!input || !log) return () => {}

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Enter' || !input.value.trim()) return
    const raw = input.value
    input.value = ''
    const res = runCommand(raw, { hasCv: input.hasAttribute('data-has-cv') })
    if (res.clear) {
      log.replaceChildren()
      return
    }
    const entry = document.createElement('div')
    const cmd = document.createElement('span')
    cmd.className = 'term-cmd'
    cmd.textContent = `› ${raw.trim()}`
    const out = document.createElement('span')
    out.className = 'term-out'
    out.textContent = res.out
    entry.append(cmd, out)
    log.append(entry)
    while (log.children.length > 6) log.firstElementChild?.remove()
    log.scrollTop = log.scrollHeight
    if (res.scrollTo) window.setTimeout(() => document.getElementById(res.scrollTo!)?.scrollIntoView(), 350)
    if (res.open) window.open(res.open, '_blank', 'noopener')
  }

  input.addEventListener('keydown', onKey)
  return () => input.removeEventListener('keydown', onKey)
}

const initCopyEmail = (): Cleanup => {
  const buttons = [...document.querySelectorAll<HTMLElement>('[data-copy-email]')]
  let timer = 0
  const onClick = async (e: Event) => {
    const button = e.currentTarget as HTMLElement
    try {
      await navigator.clipboard.writeText(button.dataset.copyEmail ?? '')
    } catch {
      // clipboard refused: the mailto link stays available
    }
    button.textContent = 'copié !'
    button.setAttribute('data-copied', '')
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      button.textContent = 'copier l’email'
      button.removeAttribute('data-copied')
    }, 2000)
  }
  buttons.forEach(b => b.addEventListener('click', onClick))
  return () => {
    window.clearTimeout(timer)
    buttons.forEach(b => b.removeEventListener('click', onClick))
  }
}

// mobile call-to-action bar: once past the hero, never over the open menu
const initMobileBar = (): Cleanup => {
  const bar = document.querySelector<HTMLElement>('[data-mobile-bar]')
  if (!bar) return () => {}
  let frame = 0
  const update = () => {
    frame = 0
    const menuOpen = document.querySelector<HTMLElement>('[data-nav-panel]')?.hidden === false
    bar.hidden = !(window.scrollY > window.innerHeight * 0.8) || menuOpen
  }
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }
  update()
  window.addEventListener('scroll', schedule, { passive: true })
  document.addEventListener('click', schedule)
  return () => {
    window.removeEventListener('scroll', schedule)
    document.removeEventListener('click', schedule)
    cancelAnimationFrame(frame)
  }
}

export const initHome = (): Cleanup => {
  const cleanups = [
    initActiveSection(), initMenu(), initFilters(), initInterests(), initExperience(), initSkillsMore(),
    initAudience(), initTerminal(), initCopyEmail(), initMobileBar(),
  ]
  return () => cleanups.forEach(c => c())
}
