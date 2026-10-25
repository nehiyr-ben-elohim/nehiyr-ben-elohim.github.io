import { z } from 'astro/zod'
import raw from '../data/profile.json'
import { iconSchema } from './devicons'

const pair = z.object({ k: z.string(), v: z.string() })
const hex = z.string().regex(/^#[0-9a-f]{6}$/i)

const fact = z
  .object({ k: z.string(), href: z.string().startsWith('#'), n: z.number().int().optional(), suf: z.string().default(''), v: z.string().optional() })
  .refine(f => (f.n === undefined) !== (f.v === undefined), { message: 'a fact needs exactly one of n or v' })

export const profileSchema = z.object({
  facts: z.array(fact).min(1),
  marquee: z.object({ keywords: z.array(z.string()).min(1), tech: z.array(iconSchema).min(1) }),
  skills: z.array(z.object({ cat: z.string(), items: z.array(iconSchema).min(1) })),
  experience: z.array(z.object({
    company: z.string(),
    current: z.boolean().default(false),
    // file in public/img/companies/; monogram when absent
    logo: z.string().regex(/^\/img\/companies\/[\w-]+\.(png|svg|webp)$/).optional(),
    url: z.url({ protocol: /^https$/ }).optional(),
    mono: z.string().min(1).max(3),
    color: hex,
    year: z.string(),
    months: z.number().int().positive(),
    from: z.string(),
    to: z.string(),
    dur: z.string(),
    // case study slug
    project: z.string().optional(),
    stages: z.array(z.object({ role: z.string(), when: z.string() })).min(1),
    chips: z.array(z.string()),
    desc: z.string(),
    results: z.array(pair),
    tags: z.array(z.string()),
  })),
  // photo: '/img/...' resolved via resolveImage; text-only card when absent
  interests: z.array(pair.extend({ photo: z.string().optional() })).min(1),
})

export type Profile = z.output<typeof profileSchema>

export const getProfile = (): Profile => profileSchema.parse(raw)

// duration bar: share of the longest job, never thinner than 6%
export const barWidth = (months: number, max: number): string => `${Math.max(6, Math.round((months / max) * 100))}%`
