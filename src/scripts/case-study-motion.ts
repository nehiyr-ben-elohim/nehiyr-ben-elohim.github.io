import { prefersReducedMotion } from './motion'
import type { Cleanup } from './types'

const EASE = 'cubic-bezier(.2,.8,.2,1)'

const up = (el: Element | null, delay: number, y = 24) =>
  el?.animate(
    [{ opacity: 0, transform: `translateY(${y}px)` }, { opacity: 1, transform: 'none' }],
    { duration: 700, easing: EASE, fill: 'both', delay },
  )

// Hidden states are set from JS only: without JS (or with reduced motion) everything stays visible.
export const initCaseStudyMotion = (): Cleanup => {
  const reveals = [...document.querySelectorAll<HTMLElement>('[data-reveal]')]
  if (!reveals.length || prefersReducedMotion()) return () => {}

  up(document.querySelector('[data-anim="kicker"]'), 60, 12)
  document.querySelector('[data-anim="title"]')?.animate(
    [
      { opacity: 0, transform: 'translateY(40px) skewY(3deg)', clipPath: 'inset(0 0 100% 0)' },
      { opacity: 1, transform: 'none', clipPath: 'inset(0 0 0 0)' },
    ],
    { duration: 850, easing: EASE, fill: 'both', delay: 140 },
  )
  up(document.querySelector('[data-anim="lead"]'), 320)
  document.querySelector('[data-anim="shot"]')?.animate(
    [{ opacity: 0, transform: 'translateY(60px) scale(.96)' }, { opacity: 1, transform: 'none' }],
    { duration: 900, easing: EASE, fill: 'both', delay: 420 },
  )

  const hidden = new Map<Element, Animation>()
  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target
        observer.unobserve(el)
        hidden.get(el)?.cancel()
        // stagger siblings, 4 per row
        const siblings = [...(el.parentElement?.children ?? [])].filter(x => x.hasAttribute('data-reveal'))
        up(el, (Math.max(0, siblings.indexOf(el)) % 4) * 90, 28)
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  )
  for (const el of reveals) {
    hidden.set(el, el.animate([{ opacity: 0 }, { opacity: 0 }], { duration: 1, fill: 'forwards' }))
    observer.observe(el)
  }

  return () => observer.disconnect()
}
