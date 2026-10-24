export const SITE_NAME = 'jeanjacquesakakpo.me'
export const SITE_URL = 'https://jeanjacquesakakpo.me'
export const SHARE_TEXT = 'Check out this awesome project. '

export type Section = { href: string; title: string; inNavBar: boolean }

export const SECTIONS = {
  LANDING: { href: '#hi', title: 'hello', inNavBar: true },
  HOMEPAGE: { href: '/', title: '', inNavBar: false },
  ABOUTME: { href: '#about', title: 'à propos de moi', inNavBar: true },
  WORKS: { href: '#works', title: 'mes réalisations', inNavBar: true },
  ALL_WORKS: { href: '/projects', title: 'mes réalisations', inNavBar: false },
  SKILLS: { href: '#skills', title: 'compétences', inNavBar: true },
  CONTACT: { href: '#contact', title: 'un rendez-vous ?', inNavBar: true },
  BLOG: { href: '/blog', title: 'un mini blog', inNavBar: true },
} satisfies Record<string, Section>

export const NAV_SECTIONS: Section[] = Object.values(SECTIONS).filter(s => s.inNavBar)
