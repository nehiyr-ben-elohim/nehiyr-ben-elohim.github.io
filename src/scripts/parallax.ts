import { prefersReducedMotion } from './motion'
import type { Cleanup } from './types'

const LIMIT = 450

export const initParallax = (): Cleanup => {
  const header = document.getElementById('js--parallax-header')
  const texts = [...document.querySelectorAll<HTMLElement>('#js--masked-text .landing-header-text')]
  if (prefersReducedMotion() || (!header && !texts.length)) return () => {}

  let frame = 0
  const update = () => {
    frame = 0
    const st = window.scrollY
    if (st >= LIMIT) return
    if (header) header.style.backgroundPosition = `50% ${st * 0.075}%`
    texts.forEach(t => (t.style.backgroundPosition = `50% ${st}%`))
  }
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  update()
  return () => {
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(frame)
  }
}
