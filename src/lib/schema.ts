import { z } from 'astro/zod'

const unixDate = z
  .string()
  .regex(/^\d+$/)
  .transform(s => new Date(Number(s) * 1000))

const optionalString = z
  .string()
  .optional()
  .transform(v => v || undefined)

export const activitySchema = z
  .object({
    key: z.string(),
    show: z.boolean(),
    featured: z.boolean().default(false),
    activityType: z.enum(['PROJECT', 'BLOG']),
    title: z.string(),
    type: z.string(),
    description: z.string(),
    concept: z.string().default(''),
    resolve: optionalString,
    mediaURL: z.string(),
    clientLogo: optionalString,
    techs: z.array(z.string()).default([]),
    metas: z.array(z.object({ title: z.string(), value: z.string() })).default([]),
    report: z.object({ title: z.string(), description: z.string() }),
    layout: z.object({ x: z.number() }).default({ x: 50 }),
    shoots: z.array(z.object({ description: z.string(), mediaURL: z.string() })).default([]),
    startedAt: unixDate,
    // 'TODAY' = ongoing, resolved at build time
    finishedAt: z.union([z.literal('TODAY').transform(() => new Date()), unixDate]),
  })
  .superRefine((a, ctx) => {
    if (a.finishedAt < a.startedAt) {
      ctx.addIssue({ code: 'custom', message: `${a.key}: finishedAt is before startedAt` })
    }
  })

export type ActivityData = z.output<typeof activitySchema>
