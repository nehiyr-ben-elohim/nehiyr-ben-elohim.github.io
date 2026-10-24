import { test, expect } from 'vitest'
import { getProfile, profileSchema } from '../../src/lib/profile'
import raw from '../../src/data/profile.json'

test('profile parses: 4 facts, 6 skill groups, 4 jobs, 4 interests', () => {
  const p = getProfile()
  expect(p.facts).toHaveLength(4)
  expect(p.skills.map(g => g.cat)).toEqual(['Langages', 'Backend', 'Frontend', 'Mobile', 'Données', 'IA & ML'])
  expect(p.experience).toHaveLength(4)
  expect(p.interests.map(i => i.k)).toEqual(['musics', 'games', 'movies', 'places'])
})

test('only the first job is current', () => {
  expect(getProfile().experience.map(x => x.current)).toEqual([true, false, false, false])
})

test('unknown skill icon is rejected', () => {
  const bad = structuredClone(raw)
  bad.skills[0].items[0].icon = 'cobol'
  expect(() => profileSchema.parse(bad)).toThrow()
})
