import { z } from 'astro/zod'
import raw from '../data/case-studies.json'
import { iconSchema } from './devicons'

const text = z.string().min(1)

export const caseStudySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  title: z.string(),
  kind: z.string(),
  cat: z.enum(['client', 'perso']),
  featured: z.boolean().default(false),
  color: z.string().regex(/^#[0-9a-f]{6}$/i),
  period: z.string(),
  // client code under NDA: badge instead of "voir le code"
  nda: z.boolean(),
  // shown in the screenshot frame; only real, owned URLs
  url: z.url({ protocol: /^https$/ }).optional(),
  lead: z.string(),
  tldr: z.object({ problem: text, solution: text, result: text }),
  metrics: z.array(z.object({ pre: z.string().default(''), n: z.number().int(), suf: z.string().default(''), k: text })).length(3),
  // home card
  summary: z.string(),
  role: z.string(),
  metric: z.object({ v: z.string(), k: z.string() }),
  tags: z.array(z.string()),
  code: z.url({ protocol: /^https$/ }).optional(),
  // '/img/...' resolved via resolveImage; placeholder when absent
  shot: z.string().optional(),
  meta: z.array(z.object({ k: z.string(), v: z.string() })),
  // icon optional: concepts like ASR or LLM have no devicon
  stack: z.array(iconSchema.extend({ icon: iconSchema.shape.icon.optional(), role: text })),
  sections: z.array(z.object({
    n: z.string(),
    title: z.string(),
    body: z.string(),
    list: z.array(z.string()).default([]),
  })).min(1),
  archi: z.object({
    note: text,
    layers: z.array(z.object({
      layer: text,
      nodes: z.array(z.object({ t: text, s: text, hi: z.boolean().default(false) })).min(1),
    })).min(2),
  }),
  // illustrative code, always labelled as such
  snippet: z.object({ file: text, code: text }),
  // shown only once at least one screenshot exists
  gallery: z.array(z.object({ cap: text, src: z.string().optional() })).default([]),
  // real testimonials only: the section is hidden without one
  quote: z.object({ text, who: text, role: text, ini: z.string().min(1).max(3) }).optional(),
})

export type CaseStudy = z.output<typeof caseStudySchema>

export const neighbors = <T>(list: T[], i: number): { prev: T; next: T } => ({
  prev: list[(i + list.length - 1) % list.length],
  next: list[(i + 1) % list.length],
})

const pad = (n: number) => String(n).padStart(2, '0')
export const counter = (i: number, total: number): string => `${pad(i + 1)} / ${pad(total)}`

export const sectionId = (n: string): string => `s${n}`

// JSON order = display order (counter, prev/next)
export const getCaseStudies = (): CaseStudy[] => raw.map(s => caseStudySchema.parse(s))

export const hasGallery = (p: CaseStudy): boolean => p.gallery.some(g => g.src)

type Chapter = { id: string; n: string; label: string }

// numbered page chapters; optional ones are skipped without leaving gaps
export const chapters = (p: CaseStudy): Chapter[] =>
  [
    { id: 'etude', label: 'étude de cas', on: true },
    { id: 'archi', label: 'architecture', on: true },
    { id: 'galerie', label: 'galerie', on: hasGallery(p) },
    { id: 'avis', label: 'témoignage', on: !!p.quote },
    { id: 'suite', label: 'un projet similaire ?', on: true },
  ]
    .filter(c => c.on)
    .map((c, i) => ({ id: c.id, n: pad(i + 1), label: c.label }))

type TocEntry = { id: string; n: string; title: string }

export const toc = (p: CaseStudy): TocEntry[] => [
  ...p.sections.map(s => ({ id: sectionId(s.n), n: s.n, title: s.title })),
  { id: 'archi', n: 'A', title: 'Architecture' },
  ...(hasGallery(p) ? [{ id: 'galerie', n: 'G', title: 'Galerie' }] : []),
  ...(p.quote ? [{ id: 'avis', n: 'T', title: 'Témoignage' }] : []),
]
