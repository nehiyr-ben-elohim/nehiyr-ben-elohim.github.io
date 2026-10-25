export const OWNER = 'Justin Potchona'
export const GITHUB_URL = 'https://github.com/nehiyr-ben-elohim'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/justin-potchona/'
export const EMAIL = 'potchjust@gmail.com'

// home sections, in page order; label shown on the rail, n numbers the kicker
export const HOME_SECTIONS = [
  { id: 'top', label: 'bienvenue', nav: false, n: '' },
  { id: 'projets', label: 'projets', nav: true, n: '01' },
  { id: 'parcours', label: 'parcours', nav: true, n: '02' },
  { id: 'competences', label: 'compétences', nav: true, n: '03' },
  { id: 'apropos', label: 'à propos', nav: true, n: '04' },
  { id: 'contact', label: 'me contacter', nav: false, n: '05' },
] as const

export const kicker = (id: string, text: string): string => `› ${HOME_SECTIONS.find(s => s.id === id)?.n} — ${text}`
