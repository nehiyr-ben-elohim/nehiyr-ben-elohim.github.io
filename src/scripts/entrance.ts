import { prefersReducedMotion } from './motion'
import type { Cleanup } from './types'

const EASE = 'cubic-bezier(.2,.8,.2,1)'
const timing = (duration: number, delay: number): KeyframeAnimationOptions => ({ duration, easing: EASE, fill: 'both', delay })
const up = (y: number): Keyframe[] => [{ opacity: 0, transform: `translateY(${y}px)` }, { opacity: 1, transform: 'none' }]

// [data-anim] name → entrance played once on page load
const ENTRANCES: Record<string, [Keyframe[], KeyframeAnimationOptions]> = {
  kicker: [up(12), timing(700, 60)],
  title: [
    [
      { opacity: 0, transform: 'translateY(40px) skewY(3deg)', clipPath: 'inset(0 0 100% 0)' },
      { opacity: 1, transform: 'none', clipPath: 'inset(0 0 0 0)' },
    ],
    timing(850, 140),
  ],
  lead: [up(24), timing(700, 320)],
  shot: [[{ opacity: 0, transform: 'translateY(60px) scale(.96)' }, { opacity: 1, transform: 'none' }], timing(900, 420)],
  hello: [
    [
      { transform: 'rotate(-14deg) scale(.6)', opacity: 0 },
      { transform: 'rotate(3deg) scale(1.06)', opacity: 1, offset: 0.7 },
      { transform: 'rotate(-2deg) scale(1)', opacity: 1 },
    ],
    timing(700, 120),
  ],
  code: [[{ transform: 'translate(40px,20px)', opacity: 0 }, { transform: 'none', opacity: 1 }], timing(800, 350)],
}

// Hidden states are set from JS only: without JS (or with reduced motion) everything stays visible.
export const initEntrance = (): Cleanup => {
  if (prefersReducedMotion()) return () => {}

  document.querySelectorAll<HTMLElement>('[data-anim]').forEach(el => {
    const entrance = ENTRANCES[el.dataset.anim ?? '']
    if (entrance) el.animate(...entrance)
  })
  document.querySelectorAll('[data-anim="cursor"]').forEach(el =>
    el.animate([{ opacity: 1 }, { opacity: 1, offset: 0.5 }, { opacity: 0, offset: 0.51 }, { opacity: 0 }], { duration: 1000, iterations: Infinity }),
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
        el.animate(up(28), timing(650, (Math.max(0, siblings.indexOf(el)) % 4) * 90))
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  )
  document.querySelectorAll('[data-reveal]').forEach(el => {
    // already on screen at load: leave as is
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return
    hidden.set(el, el.animate([{ opacity: 0 }, { opacity: 0 }], { duration: 1, fill: 'forwards' }))
    observer.observe(el)
  })

  return () => observer.disconnect()
}
