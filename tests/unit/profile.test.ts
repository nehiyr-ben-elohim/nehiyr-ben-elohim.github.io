import { test, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { barWidth, getProfile, profileSchema } from '../../src/lib/profile'
import { getCaseStudies } from '../../src/lib/case-studies'
import raw from '../../src/data/profile.json'

const profile = getProfile()

test('profile parses: 3 facts, 6 skill groups, 4 jobs, 4 interests, marquee', () => {
  expect(profile.facts.map(f => f.k)).toEqual(['Expérience', 'En production', 'Spécialité'])
  expect(profile.skills.map(g => g.cat)).toEqual(['Langages', 'Backend', 'Frontend', 'Mobile', 'Données', 'IA & ML'])
  expect(profile.experience).toHaveLength(4)
  expect(profile.interests.map(i => i.k)).toEqual(['musics', 'games', 'movies', 'places'])
  expect(profile.marquee.keywords).toContain('machine learning')
  expect(profile.marquee.tech.map(t => t.name)).toContain('Python')
})

test('facts: number facts carry n + suffix, text facts carry v', () => {
  expect(profile.facts[0]).toMatchObject({ n: 6, suf: ' ans', href: '#parcours' })
  expect(profile.facts[2]).toMatchObject({ v: 'Backend & ML', href: '#competences' })
})

test('a fact needs exactly one of n or v', () => {
  const bad = structuredClone(raw) as { facts: Array<Record<string, unknown>> }
  bad.facts[0] = { k: 'X', href: '#top' }
  expect(() => profileSchema.parse(bad)).toThrow()
})

test('only the first job is current', () => {
  expect(profile.experience.map(x => x.current)).toEqual([true, false, false, false])
})

test('company logos exist on disk, monograms for every job', () => {
  const jobs = profile.experience
  expect(jobs.map(x => x.logo)).toEqual(['/img/companies/thecodingmachine.png', '/img/companies/wiin.png', undefined, undefined])
  for (const x of jobs) if (x.logo) expect(existsSync(`public${x.logo}`), x.logo).toBe(true)
  expect(jobs.map(x => x.mono)).toEqual(['TCM', 'W', 'DM', 'MG'])
})

test('job project links point to existing case studies', () => {
  const slugs = getCaseStudies().map(s => s.slug)
  const projects = profile.experience.map(x => x.project).filter(Boolean)
  expect(projects).toEqual(['plateforme-audit', 'wiin'])
  for (const p of projects) expect(slugs).toContain(p)
})

test('logo must be a local /img/companies path, url must be https', () => {
  const badLogo = structuredClone(raw) as { experience: Array<{ logo?: string; url?: string }> }
  badLogo.experience[0].logo = 'https://evil.example/logo.png'
  expect(() => profileSchema.parse(badLogo)).toThrow()
  const badUrl = structuredClone(raw) as { experience: Array<{ logo?: string; url?: string }> }
  badUrl.experience[0].url = 'javascript:alert(1)'
  expect(() => profileSchema.parse(badUrl)).toThrow()
})

test('barWidth: share of the longest job, 6% floor', () => {
  expect(barWidth(55, 55)).toBe('100%')
  expect(barWidth(4, 55)).toBe('7%')
  expect(barWidth(1, 100)).toBe('6%')
})

test('unknown skill icon is rejected', () => {
  const bad = structuredClone(raw)
  bad.skills[0].items[0].icon = 'cobol'
  expect(() => profileSchema.parse(bad)).toThrow()
})
