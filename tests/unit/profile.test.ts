import { test, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { getProfile, monogram, profileSchema } from '../../src/lib/profile'
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

test('company logos: files exist for TheCodingMachine and WIIN, monogram for the others', () => {
  const jobs = getProfile().experience
  expect(jobs.map(x => x.logo)).toEqual(['/img/companies/thecodingmachine.png', '/img/companies/wiin.png', undefined, undefined])
  for (const x of jobs) if (x.logo) expect(existsSync(`public${x.logo}`), x.logo).toBe(true)
  expect(jobs.map(x => monogram(x.company))).toEqual(['T', 'W', 'D', 'M'])
})

test('logo must be a local /img/companies path', () => {
  const bad = structuredClone(raw) as { experience: Array<{ logo?: string }> }
  bad.experience[0].logo = 'https://evil.example/logo.png'
  expect(() => profileSchema.parse(bad)).toThrow()
})
