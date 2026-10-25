import { navigate } from 'astro:transitions/client'
import type { Cleanup } from './types'

const initProgressAndToc = (): Cleanup => {
  const bar = document.querySelector<HTMLElement>('[data-progress]')
  const spies = [...document.querySelectorAll<HTMLElement>('[data-spy]')]
  const links = [...document.querySelectorAll<HTMLElement>('.cs-summary a')]
  if (!bar && !spies.length) return () => {}
  let frame = 0

  const update = () => {
    frame = 0
    const h = document.documentElement
    if (bar) bar.style.width = `${Math.min(100, (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100)}%`
    let active = ''
    spies.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.35) active = el.id
    })
    links.forEach(l => l.setAttribute('aria-current', String(l.getAttribute('href') === `#${active}`)))
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

// ← / → between case studies; never while typing, with modifiers or in the zoom
const initKeyboard = (): Cleanup => {
  const prev = document.querySelector<HTMLAnchorElement>('[data-prev]')
  const next = document.querySelector<HTMLAnchorElement>('[data-next]')
  if (!prev || !next) return () => {}

  const onKey = (e: KeyboardEvent) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
    const target = e.target as HTMLElement
    if (target.closest('input, textarea, select, [contenteditable]') || document.querySelector('dialog[open]')) return
    if (e.key === 'ArrowLeft') navigate(prev.href)
    if (e.key === 'ArrowRight') navigate(next.href)
  }

  document.addEventListener('keydown', onKey)
  return () => document.removeEventListener('keydown', onKey)
}

// one shared <dialog>: Esc and backdrop clicks close it natively / below
const initZoom = (): Cleanup => {
  const dialog = document.querySelector<HTMLDialogElement>('[data-zoom-dialog]')
  const buttons = [...document.querySelectorAll<HTMLElement>('[data-zoom]')]
  if (!dialog || !buttons.length) return () => {}
  const img = dialog.querySelector('img')
  const cap = dialog.querySelector('[data-zoom-cap]')

  const open = (e: Event) => {
    const b = e.currentTarget as HTMLElement
    if (img) {
      img.src = b.dataset.zoom ?? ''
      img.alt = b.dataset.zoomCap ?? ''
    }
    if (cap) cap.textContent = b.dataset.zoomCap ?? ''
    dialog.showModal()
  }
  const onDialogClick = (e: MouseEvent) => {
    if (e.target === dialog || (e.target as Element).closest('[data-zoom-close]')) dialog.close()
  }

  buttons.forEach(b => b.addEventListener('click', open))
  dialog.addEventListener('click', onDialogClick)
  return () => {
    buttons.forEach(b => b.removeEventListener('click', open))
    dialog.removeEventListener('click', onDialogClick)
    if (dialog.open) dialog.close()
  }
}

export const initCaseStudy = (): Cleanup => {
  const cleanups = [initProgressAndToc(), initKeyboard(), initZoom()]
  return () => cleanups.forEach(c => c())
}
