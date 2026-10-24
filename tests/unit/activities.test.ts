import { test, expect } from 'vitest'
import raw from '../../src/data/activities.json'
import { slugify } from '../../src/lib/slugify'
import {
  toActivity, sortByFinished, featured, adjacent, resolveMetas,
  groupByYear, groupByMonth, formatDate, type ActivityData,
} from '../../src/lib/activities'

const make = (over: Partial<ActivityData> & { key: string; finishedAt: Date }): ActivityData => ({
  show: true,
  featured: false,
  activityType: 'PROJECT',
  title: over.key,
  type: 'Site vitrine',
  description: '',
  concept: '',
  mediaURL: '/img/x.png',
  techs: ['Vue', 'Sass'],
  metas: [],
  report: { title: '', description: '' },
  shoots: [],
  startedAt: new Date(0),
  ...over,
})

const d = (iso: string) => new Date(`${iso}T00:00:00Z`)

test('toActivity builds slug and href by type', () => {
  expect(toActivity(make({ key: 'a', title: 'Ushuaia Beauté', finishedAt: d('2018-01-01') })))
    .toMatchObject({ slug: 'ushuaia-beaute', href: '/projects/ushuaia-beaute' })
  expect(toActivity(make({ key: 'b', title: 'Mon Post', activityType: 'BLOG', finishedAt: d('2018-01-01') })).href)
    .toBe('/blog/mon-post')
})

test('sortByFinished: most recent first, input untouched', () => {
  const list = [d('2016-01-01'), d('2018-01-01'), d('2017-01-01')]
    .map((f, i) => toActivity(make({ key: `k${i}`, finishedAt: f })))
  const sorted = sortByFinished(list)
  expect(sorted.map(a => a.key)).toEqual(['k1', 'k2', 'k0'])
  expect(list.map(a => a.key)).toEqual(['k0', 'k1', 'k2'])
})

test('featured: keeps featured only, cut at max', () => {
  const list = Array.from({ length: 8 }, (_, i) =>
    toActivity(make({ key: `k${i}`, featured: i !== 3, finishedAt: d(`201${i}-01-01`) })))
  const out = featured(list, 6)
  expect(out).toHaveLength(6)
  expect(out.every(a => a.featured)).toBe(true)
  expect(out[0].key).toBe('k7')
  expect(featured(list).length).toBe(6)
})

test('adjacent: first has no prev, last has no next, empty gives {}', () => {
  const list = ['a', 'b', 'c'].map((k, i) => toActivity(make({ key: k, finishedAt: d(`201${i}-01-01`) })))
  // sorted: c, b, a
  expect(adjacent(list, 'c').prev).toBeUndefined()
  expect(adjacent(list, 'c').next?.key).toBe('b')
  expect(adjacent(list, 'a').next).toBeUndefined()
  expect(adjacent(list, 'a').prev?.key).toBe('b')
  expect(adjacent([], 'x')).toEqual({})
})

test('resolveMetas: __FUNCTION__ Tools and Scope resolved, others untouched', () => {
  const a = toActivity(make({
    key: 'a', finishedAt: d('2018-01-01'), type: 'E-commerce',
    metas: [
      { title: 'Client', value: 'Yoko' },
      { title: 'Tools', value: '__FUNCTION__' },
      { title: 'Scope', value: '__FUNCTION__' },
    ],
  }))
  expect(resolveMetas(a)).toEqual([
    { title: 'Client', value: 'Yoko' },
    { title: 'Tools', value: 'Vue, Sass' },
    { title: 'Scope', value: 'E-commerce' },
  ])
})

test('groupByYear: years desc, entries desc', () => {
  const list = [d('2017-03-01'), d('2018-05-01'), d('2017-09-01')]
    .map((f, i) => toActivity(make({ key: `k${i}`, finishedAt: f })))
  const groups = groupByYear(list)
  expect(groups.map(g => g.year)).toEqual([2018, 2017])
  expect(groups[1].entries.map(a => a.key)).toEqual(['k2', 'k0'])
})

test('groupByMonth: months desc', () => {
  const list = [d('2017-03-01'), d('2017-09-01'), d('2017-03-20')]
    .map((f, i) => toActivity(make({ key: `k${i}`, finishedAt: f })))
  const groups = groupByMonth(list)
  expect(groups.map(g => g.month)).toEqual([8, 2])
  expect(groups[1].entries.map(a => a.key)).toEqual(['k2', 'k0'])
})

test('formatDate in French, UTC', () => {
  expect(formatDate(d('2018-08-07'))).toBe('7 août 2018')
})

const visibleSlugs = (raw as Array<{ show: boolean; title: string }>)
  .filter(a => a.show)
  .map(a => slugify(a.title))

test('activities.json: visible slugs are unique', () => {
  expect(new Set(visibleSlugs).size).toBe(visibleSlugs.length)
})

test('activities.json: historical slugs unchanged', () => {
  expect(visibleSlugs).toEqual(expect.arrayContaining([
    'groupe-carrere', 'liebherr', 'touki-saint-louis', 'ushuaia-beaute',
    '1-to-1-services', 'wola-group', 'mailar', 'followad', 'fast-foud',
  ]))
})
