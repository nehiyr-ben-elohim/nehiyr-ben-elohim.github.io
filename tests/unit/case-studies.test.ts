import { test, expect } from 'vitest'
import raw from '../../src/data/case-studies.json'
import { caseStudySchema, neighbors, counter, sectionId } from '../../src/lib/case-studies'

const studies = raw.map(s => caseStudySchema.parse(s))

test('every case study in data parses, slugs are unique', () => {
  expect(studies).toHaveLength(4)
  expect(new Set(studies.map(s => s.slug)).size).toBe(4)
  expect(studies.map(s => s.slug)).toEqual(['plateforme-audit', 'e-learning', '2audio', 'wiin'])
})

test('schema: list defaults to [], shot optional', () => {
  const s = studies[0]
  expect(s.sections[0].list).toEqual([])
  expect(s.sections[1].list.length).toBeGreaterThan(0)
  expect(s.shot).toBeUndefined()
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
