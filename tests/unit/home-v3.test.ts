import { test, expect } from 'vitest'
import { getProfile } from '../../src/lib/profile'
import { getCaseStudies } from '../../src/lib/case-studies'
import { runCommand } from '../../src/lib/terminal'
import { validateContact } from '../../src/lib/contact-validation'
import { railTop } from '../../src/lib/rail'
import { HOME_SECTIONS, kicker, BOOKING_URL } from '../../src/lib/site'

const profile = getProfile()

test('home sections in design order with numbered kickers', () => {
  expect(HOME_SECTIONS.map(s => s.id)).toEqual(['top', 'projets', 'parcours', 'competences', 'methode', 'notes', 'apropos', 'contact'])
  expect(HOME_SECTIONS.filter(s => s.nav).map(s => s.id)).toEqual(['projets', 'parcours', 'methode', 'apropos'])
  expect(kicker('methode', 'travailler ensemble')).toBe('› 04 — travailler ensemble')
  expect(kicker('contact', 'un rendez-vous ?')).toBe('› 07 — un rendez-vous ?')
})

test('no placeholder booking link shipped', () => {
  expect(BOOKING_URL).toBeUndefined()
})

test('profile v3: audiences, trust, method, notes, about', () => {
  expect(profile.audiences.map(a => a.id)).toEqual(['client', 'rec'])
  expect(profile.trust.map(t => t.name)).toEqual(['TheCodingMachine', 'WIIN', 'Dreammore', 'Magmatel', 'Black Planteur'])
  expect(profile.method.steps).toHaveLength(4)
  expect(profile.method.formats.map(f => f.title)).toEqual(['Régie / TJM', 'Forfait', 'Renfort ponctuel'])
  expect(profile.notes).toHaveLength(3)
  expect(profile.notes.every(n => n.soon)).toBe(true)
  expect(profile.about.principles).toHaveLength(3)
  expect(profile.experience[2]).toMatchObject({ company: 'Dreammore', url: 'https://www.facebook.com/Dreammoreapp/' })
})

test('traducteur vocal case study: second, no fabricated quote/url/code, text-only stack items', () => {
  const studies = getCaseStudies()
  expect(studies.map(s => s.slug)).toEqual(['plateforme-audit', 'traducteur-vocal', 'e-learning', '2audio', 'wiin'])
  const t = studies[1]
  expect(t).toMatchObject({ cat: 'perso', nda: false })
  expect(t.quote).toBeUndefined()
  expect(t.url).toBeUndefined()
  expect(t.code).toBeUndefined()
  expect(t.stack.filter(s => !s.icon).map(s => s.name)).toEqual(['ASR', 'TTS', 'LLM'])
})

test('terminal: help, navigation, clear, unknown, cv only when available', () => {
  expect(runCommand('help', { hasCv: false }).out).toContain('commandes :')
  expect(runCommand('  Projets ', { hasCv: false })).toMatchObject({ scrollTo: 'projets' })
  expect(runCommand('cd parcours', { hasCv: false })).toMatchObject({ scrollTo: 'parcours' })
  expect(runCommand('clear', { hasCv: false })).toEqual({ out: '', clear: true })
  expect(runCommand('rm -rf', { hasCv: false }).out).toBe('commande inconnue : rm -rf (tape help)')
  expect(runCommand('cv', { hasCv: false }).open).toBeUndefined()
  expect(runCommand('cv', { hasCv: true }).open).toBe('/cv/Resume-Justin-Potchona.pdf')
  expect(runCommand('python justin.py', { hasCv: false }).out).toBe('hello world!')
})

test('contact validation: name, email format, 20-char message', () => {
  expect(validateContact({ name: '', email: 'x', message: 'court' })).toEqual({ name: true, email: true, message: true })
  expect(validateContact({ name: 'Ada', email: 'ada@ex.com', message: 'Un projet de vingt caractères au moins' })).toEqual({ name: false, email: false, message: false })
  expect(validateContact({ name: '  ', email: 'a@b', message: ' '.repeat(30) })).toEqual({ name: true, email: true, message: true })
})

test('railTop spreads labels over the rail', () => {
  expect(railTop(0, 8)).toBe('4%')
  expect(railTop(7, 8)).toBe('88%')
  expect(railTop(5, 6)).toBe('79%')
})
