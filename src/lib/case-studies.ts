import { z } from 'astro/zod'
import raw from '../data/case-studies.json'
import { iconSchema } from './devicons'


export const caseStudySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  title: z.string(),
  kind: z.string(),
  cat: z.enum(['client', 'perso']),
  featured: z.boolean().default(false),
  color: z.string().regex(/^#[0-9a-f]{6}$/i),
  period: z.string(),
  cta: z.string(),
  lead: z.string(),
  // home card
  summary: z.string(),
  role: z.string(),
  metric: z.object({ v: z.string(), k: z.string() }),
  tags: z.array(z.string()),
  code: z.url({ protocol: /^https$/ }).optional(),
  // '/img/...' resolved via resolveImage; placeholder when absent
  shot: z.string().optional(),
  shot2: z.string().optional(),
  meta: z.array(z.object({ k: z.string(), v: z.string() })),
  stack: z.array(iconSchema),
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
