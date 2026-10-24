import { z } from 'astro/zod'
import raw from '../data/profile.json'
import { iconSchema } from './devicons'

const pair = z.object({ k: z.string(), v: z.string() })

export const profileSchema = z.object({
  facts: z.array(pair),
  skills: z.array(z.object({ cat: z.string(), items: z.array(iconSchema).min(1) })),
  experience: z.array(z.object({
    from: z.string(),
    to: z.string(),
    company: z.string(),
    current: z.boolean().default(false),
    role: z.string(),
    desc: z.string(),
    tags: z.array(z.string()),
  })),
  // photo: '/img/...' resolved via resolveImage; text-only card when absent
  interests: z.array(pair.extend({ photo: z.string().optional() })).min(1),
})

export type Profile = z.output<typeof profileSchema>

export const getProfile = (): Profile => profileSchema.parse(raw)
