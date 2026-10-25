import { test, expect } from 'vitest'
import raw from '../../src/data/case-studies.json'
import { caseStudySchema, neighbors, counter, sectionId, chapters, toc, hasGallery } from '../../src/lib/case-studies'

const studies = raw.map(s => caseStudySchema.parse(s))

test('every case study in data parses, slugs are unique', () => {
  expect(studies).toHaveLength(5)
  expect(new Set(studies.map(s => s.slug)).size).toBe(5)
  expect(studies.map(s => s.slug)).toEqual(['plateforme-audit', 'traducteur-vocal', 'e-learning', '2audio', 'wiin'])
})

test('schema: list defaults to [], shot optional', () => {
  const s = studies[0]
  expect(s.sections[0].list).toEqual([])
  expect(s.sections[1].list.length).toBeGreaterThan(0)
  expect(s.shot).toBeUndefined()
})

test('case study v2 fields: tldr, 3 metrics, stack roles, archi, snippet', () => {
  for (const s of studies) {
    expect(Object.keys(s.tldr)).toEqual(['problem', 'solution', 'result'])
    expect(s.metrics).toHaveLength(3)
    expect(s.stack.every(t => t.role)).toBe(true)
    expect(s.archi.layers.length).toBeGreaterThanOrEqual(3)
    expect(s.snippet.code).toContain('\n')
  }
  expect(studies[0].metrics[1]).toEqual({ pre: '-', n: 35, suf: ' %', k: 'sur le temps moyen de résolution des incidents' })
  expect(studies[0].archi.layers.map(l => l.layer)).toEqual(['utilisateurs', 'front', 'back', 'données & services'])
})

test('no fabricated content shipped: no quote, no gallery image, no unverified url or code', () => {
  for (const s of studies) {
    expect(s.quote).toBeUndefined()
    expect(hasGallery(s)).toBe(false)
    expect(s.url).toBeUndefined()
    expect(s.code).toBeUndefined()
  }
  expect(studies.map(s => s.nda)).toEqual([true, false, true, false, true])
})

test('chapters: numbered in order, gallery and testimonial only when present', () => {
  const s = studies[0]
  expect(chapters(s)).toEqual([
    { id: 'etude', n: '01', label: 'étude de cas' },
    { id: 'archi', n: '02', label: 'architecture' },
    { id: 'suite', n: '03', label: 'un projet similaire ?' },
  ])
  const full = caseStudySchema.parse({
    ...raw[0],
    quote: { text: 'Top', who: 'A B', role: 'Lead', ini: 'AB' },
    gallery: [{ cap: 'Écran', src: '/img/x.png' }],
  })
  expect(chapters(full).map(c => `${c.n} ${c.id}`)).toEqual(['01 etude', '02 archi', '03 galerie', '04 avis', '05 suite'])
})

test('toc: case study sections then architecture; gallery/testimonial only when present', () => {
  expect(toc(studies[0]).map(t => `${t.n} ${t.id}`)).toEqual(['01 s01', '02 s02', '03 s03', '04 s04', 'A archi'])
  const full = caseStudySchema.parse({ ...raw[2], quote: { text: 'Top', who: 'A B', role: 'Lead', ini: 'AB' } })
  expect(toc(full).map(t => t.id)).toEqual(['s01', 's02', 's03', 'archi', 'avis'])
})

test('schema rejects non-hex color and unknown stack icon', () => {
  expect(() => caseStudySchema.parse({ ...raw[0], color: 'red' })).toThrow()
  expect(() => caseStudySchema.parse({ ...raw[0], stack: [{ name: 'X', icon: 'cobol' }] })).toThrow()
})

test('neighbors wraps around both ends', () => {
  const list = ['a', 'b', 'c']
  expect(neighbors(list, 0)).toEqual({ prev: 'c', next: 'b' })
  expect(neighbors(list, 2)).toEqual({ prev: 'b', next: 'a' })
  expect(neighbors(['a'], 0)).toEqual({ prev: 'a', next: 'a' })
})

test('counter pads to two digits', () => {
  expect(counter(0, 4)).toBe('01 / 04')
  expect(counter(10, 12)).toBe('11 / 12')
})

test('sectionId from section number', () => {
  expect(sectionId('03')).toBe('s03')
})

test('home card fields: one featured, cat client|perso, metric and tags', () => {
  expect(studies.filter(s => s.featured).map(s => s.slug)).toEqual(['plateforme-audit'])
  expect(studies.map(s => s.cat)).toEqual(['client', 'perso', 'client', 'perso', 'client'])
  expect(studies[4]).toMatchObject({ featured: false, metric: { v: '4 mois' }, tags: ['nuxt.js', 'express'] })
  expect(studies.every(s => s.code === undefined)).toBe(true)
})

test('schema rejects unknown cat and non-https code url', () => {
  expect(() => caseStudySchema.parse({ ...raw[0], cat: 'other' })).toThrow()
  expect(() => caseStudySchema.parse({ ...raw[0], code: 'http://x.dev' })).toThrow()
  expect(caseStudySchema.parse({ ...raw[0], code: 'https://github.com/a/b' }).code).toBe('https://github.com/a/b')
})
