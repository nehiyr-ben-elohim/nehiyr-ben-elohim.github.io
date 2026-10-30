import { prefersReducedMotion } from './motion'
import type { Cleanup } from './types'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const timing = (duration: number, delay: number): KeyframeAnimationOptions => ({ duration, easing: EASE, fill: 'both', delay })
const up = (y: number): Keyframe[] => [{ opacity: 0, transform: `translateY(${y}px)` }, { opacity: 1, transform: 'none' }]

// [data-anim] name → one settle played once on page load (fade with a short rise)
const ENTRANCES: Record<string, [Keyframe[], KeyframeAnimationOptions]> = {
  kicker: [up(8), timing(420, 0)],
  title: [up(8), timing(480, 60)],
  lead: [up(8), timing(480, 120)],
  shot: [up(8), timing(480, 180)],
  // the hello keeps its slight tilt while it settles
  hello: [[{ opacity: 0, transform: 'translateY(8px) rotate(-2deg)' }, { opacity: 1, transform: 'rotate(-2deg)' }], timing(480, 0)],
  code: [up(8), timing(480, 120)],
}

// Hidden states are set from JS only: without JS (or with reduced motion) everything stays visible.
export const initEntrance = (): Cleanup => {
  if (prefersReducedMotion()) return () => {}

  document.querySelectorAll<HTMLElement>('[data-anim]').forEach(el => {
    const entrance = ENTRANCES[el.dataset.anim ?? '']
    if (entrance) el.animate(...entrance)
  })
  // figures: settle and count up once visible
  const frames: number[] = []
  const countUp = (el: HTMLElement, delay: number) => {
    const to = Number(el.dataset.count)
    const t0 = performance.now() + delay
    const step = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / 1200))
      el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) frames.push(requestAnimationFrame(step))
    }
    el.textContent = '0'
    frames.push(requestAnimationFrame(step))
  }
  const factObserver = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        factObserver.unobserve(el)
        const siblings = [...(el.parentElement?.children ?? [])]
        const delay = (Math.max(0, siblings.indexOf(el)) % 4) * 60
        el.animate(up(8), { duration: 420, easing: EASE, delay, fill: 'backwards' })
        el.querySelectorAll<HTMLElement>('[data-count]').forEach(c => countUp(c, delay))
      }
    },
    { threshold: 0.2 },
  )
  document.querySelectorAll('[data-fact]').forEach(el => factObserver.observe(el))

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
        const delay = (Math.max(0, siblings.indexOf(el)) % 4) * 50
        el.animate(up(8), timing(420, delay))
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

  return () => {
    observer.disconnect()
    factObserver.disconnect()
    frames.forEach(f => cancelAnimationFrame(f))
  }
}
