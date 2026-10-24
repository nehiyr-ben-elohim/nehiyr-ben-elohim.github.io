import type { Cleanup } from './types'

// Mirrors the year/month selector to the article crossing 55% of the viewport.
export const initBlogTimeline = (): Cleanup => {
  const content = document.getElementById('js--blog-content')
  const header = document.getElementById('js--blog-header')
  const yearsList = content?.querySelector<HTMLElement>('[data-years]')
  const monthsList = content?.querySelector<HTMLElement>('[data-months]')
  if (!content || !header || !yearsList || !monthsList) return () => {}

  const years: number[] = JSON.parse(yearsList.dataset.years ?? '[]')
  const items = [...content.querySelectorAll<HTMLElement>('[data-article-year]')]
  const headerTop = header.getBoundingClientRect().top + window.scrollY

  const select = (list: HTMLElement, index: number) => {
    list.style.transform = `translate(0, ${-20 * index}px)`
    list.querySelectorAll('li').forEach((li, i) => li.classList.toggle('active-param', i === index))
  }

  const onScroll = () => {
    content.classList.toggle('fix-blog-header', window.scrollY >= headerTop)
    const target = window.innerHeight * 0.55 + window.scrollY
    const current = items.filter(el => el.getBoundingClientRect().top + window.scrollY <= target).pop() ?? items[0]
    if (!current) return
    select(yearsList, years.indexOf(Number(current.dataset.articleYear)))
    select(monthsList, Number(current.dataset.articleMonth))
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  return () => window.removeEventListener('scroll', onScroll)
}
