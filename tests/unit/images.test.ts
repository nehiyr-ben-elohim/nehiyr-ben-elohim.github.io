import { test, expect } from 'vitest'
import { getCaseStudies } from '../../src/lib/case-studies'
import { findImage, resolveImage } from '../../src/lib/images'
import { getProfile } from '../../src/lib/profile'

test('resolveImage throws with the faulty path', () => {
  expect(() => resolveImage('/img/nope.png')).toThrow('/img/nope.png')
})

test('every image path in the data resolves', () => {
  const paths = [
    ...getCaseStudies().flatMap(s => [s.shot, ...s.gallery.map(g => g.src)]),
    ...getProfile().interests.map(i => i.photo),
  ].filter((p): p is string => !!p)
  for (const p of paths) expect(() => resolveImage(p), p).not.toThrow()
})

test('findImage: first existing candidate or undefined', () => {
  expect(findImage(['/img/nope.png', '/img/nope.jpg'])).toBeUndefined()
})
