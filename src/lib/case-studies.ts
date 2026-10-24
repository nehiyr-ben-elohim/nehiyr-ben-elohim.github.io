import { z } from 'astro/zod'
import raw from '../data/case-studies.json'

// files in public/img/devicons/
export const DEVICONS = [
  'symfony', 'nuxtjs', 'php', 'postgresql', 'docker',
  'typescript', 'python', 'react', 'express', 'javascript',
] as const

export const GITHUB_URL = 'https://github.com/nehiyr-ben-elohim'

export const caseStudySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  title: z.string(),
  kind: z.string(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i),
  period: z.string(),
  cta: z.string(),
  lead: z.string(),
  // '/img/...' resolved via resolveImage; placeholder when absent
  shot: z.string().optional(),
  shot2: z.string().optional(),
  meta: z.array(z.object({ k: z.string(), v: z.string() })),
  stack: z.array(z.object({ name: z.string(), icon: z.enum(DEVICONS) })),
  sections: z.array(z.object({
    n: z.string(),
    title: z.string(),
    body: z.string(),
    list: z.array(z.string()).default([]),
  })).min(1),
  caption: z.string(),
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
