import { initActiveSection } from './active-section'
import { initBlogTimeline } from './blog-timeline'
import { initCaseStudyMotion } from './case-study-motion'
import { initContactForm } from './contact-form'
import { initMenu } from './menu'
import { initParallax } from './parallax'
import { initReveal } from './reveal'
import type { Cleanup } from './types'

const inits: Array<() => Cleanup> = [initReveal, initActiveSection, initMenu, initParallax, initBlogTimeline, initContactForm, initCaseStudyMotion]
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

// ClientRouter replaces <html> attributes on swap
document.addEventListener('astro:after-swap', () => document.documentElement.classList.add('js'))
