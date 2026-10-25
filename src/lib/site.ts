export const OWNER = 'Justin Potchona'
export const GITHUB_URL = 'https://github.com/nehiyr-ben-elohim'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/justin-potchona/'
export const EMAIL = 'potchjust@gmail.com'
// real booking page (cal.com…); booking CTAs stay hidden while undefined
export const BOOKING_URL: string | undefined = undefined

// home sections, in page order; label shown on the rail, n numbers the kicker
export const HOME_SECTIONS = [
  { id: 'top', label: 'bienvenue', nav: false, n: '' },
  { id: 'projets', label: 'projets', nav: true, n: '01' },
  { id: 'parcours', label: 'parcours', nav: true, n: '02' },
  { id: 'competences', label: 'compétences', nav: false, n: '03' },
  { id: 'methode', label: 'méthode', nav: true, n: '04' },
  { id: 'notes', label: 'notes', nav: false, n: '05' },
  { id: 'apropos', label: 'à propos', nav: true, n: '06' },
  { id: 'contact', label: 'me contacter', nav: false, n: '07' },
] as const

export const kicker = (id: string, text: string): string => `› ${HOME_SECTIONS.find(s => s.id === id)?.n} — ${text}`
