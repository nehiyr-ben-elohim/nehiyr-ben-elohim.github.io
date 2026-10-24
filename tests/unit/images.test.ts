import { test, expect } from 'vitest'
import raw from '../../src/data/activities.json'
import { resolveImage } from '../../src/lib/images'

test('resolveImage resolves a JSON media path', () => {
  expect(resolveImage('/img/activities/groupe-carrere/0.png').src).toBeTruthy()
})

test('resolveImage throws with the faulty path', () => {
  expect(() => resolveImage('/img/nope.png')).toThrow('/img/nope.png')
})

test('every mediaURL / shoots / clientLogo in activities.json resolves', () => {
  const paths = (raw as Array<{ mediaURL: string; clientLogo?: string; shoots?: { mediaURL: string }[] }>)
    .flatMap(a => [a.mediaURL, a.clientLogo, ...(a.shoots ?? []).map(s => s.mediaURL)])
    .filter((p): p is string => !!p && p.startsWith('/'))
  for (const p of paths) expect(() => resolveImage(p), p).not.toThrow()
})
