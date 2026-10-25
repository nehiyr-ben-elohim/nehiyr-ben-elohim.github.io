// hero terminal: pure command parser, the DOM side lives in scripts/terminal.ts
export const CV_PATH = '/cv/Resume-Justin-Potchona.pdf'

export type TermResult = { out: string; scrollTo?: string; open?: string; clear?: boolean }

const SECTIONS: Record<string, [string, string]> = {
  projets: ['projets', '→ direction les projets…'],
  parcours: ['parcours', '→ direction le parcours…'],
  competences: ['competences', '→ direction les compétences…'],
  methode: ['methode', '→ comment on travaille ensemble…'],
  notes: ['notes', '→ les notes techniques…'],
  contact: ['contact', '→ on se donne rendez-vous ?'],
}

const TEXT: Record<string, string> = {
  help: 'commandes : whoami · projets · parcours · competences · methode · contact · cv · clear',
  whoami: 'Justin Potchona, backend & ML, Lomé (GMT+0). Dispo pour des missions.',
  hello: 'hello world!',
  ls: 'projets/  parcours/  competences/  methode/  notes/  contact/',
  sudo: 'bien essayé 😉',
  'python justin.py': 'hello world!',
}

export const runCommand = (raw: string, { hasCv }: { hasCv: boolean }): TermResult => {
  const c = raw.trim().toLowerCase().replace(/\s+/g, ' ')
  if (c === 'clear') return { out: '', clear: true }
  if (c === 'cv') return hasCv ? { out: '→ ouverture du CV…', open: CV_PATH } : { out: 'CV bientôt disponible, écris-moi en attendant.' }
  if (c in TEXT) return { out: TEXT[c] }
  const section = SECTIONS[c.replace(/^cd /, '')]
  if (section) return { out: section[1], scrollTo: section[0] }
  return { out: `commande inconnue : ${raw.trim()} (tape help)` }
}
