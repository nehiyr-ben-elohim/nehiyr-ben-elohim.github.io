import { initCaseStudy } from './case-study'
import { initContactForm } from './contact-form'
import { initEntrance } from './entrance'
import { initHome } from './home'
import type { Cleanup } from './types'

const inits: Array<() => Cleanup> = [initEntrance, initHome, initCaseStudy, initContactForm]
let cleanups: Cleanup[] = []

// Bundled scripts run once: (re)bind per page, unbind before the DOM swap.
document.addEventListener('astro:page-load', () => {
  cleanups.forEach(c => c())
  cleanups = inits.map(init => init())
})

document.addEventListener('astro:before-swap', () => {
  cleanups.forEach(c => c())
  cleanups = []
})
