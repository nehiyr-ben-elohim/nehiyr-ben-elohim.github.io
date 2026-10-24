import { test, expect } from 'vitest'
import { slugify } from '../../src/lib/slugify'

test.each([
  ['Groupe Carrere', 'groupe-carrere'],
  ['Ushuaia Beauté', 'ushuaia-beaute'],
  ['Fast Foud', 'fast-foud'],
  ['Été éternel', 'ete-eternel'],
  ['  1 To 1 Services ', '1-to-1-services'],
])('slugify(%s) = %s', (input, output) => {
  expect(slugify(input)).toBe(output)
})
