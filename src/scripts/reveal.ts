import { prefersReducedMotion } from './motion'
import type { Cleanup } from './types'

export const initReveal = (): Cleanup => {
  const instant = prefersReducedMotion()
  const timers: number[] = []
  const later = (fn: () => void, ms: number) => (instant ? fn() : timers.push(window.setTimeout(fn, ms)))

  const observe = (selector: string, threshold: number, onEnter: (el: HTMLElement) => void) => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          observer.unobserve(entry.target)
          onEnter(entry.target as HTMLElement)
        }
      },
      { threshold },
    )
    document.querySelectorAll<HTMLElement>(selector).forEach(el => observer.observe(el))
    return observer
  }

  const observers = [
    observe('[data-scrollbreak]', 0, el => later(() => el.classList.add('scroll-breaked'), Number(el.dataset.scrollbreak) || 0)),
    observe('.project-item:not(.project-item-mini)', 0.4, el => el.classList.add('reveal')),
  ]

  document.querySelectorAll('.content-header-title').forEach(el => later(() => el.classList.add('reveal-title'), 850))
  document.querySelectorAll('.project-item-row').forEach(el => later(() => el.classList.add('loaded'), 1000))

  return () => {
    observers.forEach(o => o.disconnect())
    timers.forEach(t => window.clearTimeout(t))
  }
}
