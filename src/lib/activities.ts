import { slugify } from './slugify'
import type { ActivityData } from './schema'

export type { ActivityData }
export type Activity = ActivityData & { slug: string; href: string }
export type Meta = { title: string; value: string }

export const toActivity = (data: ActivityData): Activity => {
  const slug = slugify(data.title)
  const base = data.activityType === 'BLOG' ? '/blog' : '/projects'
  return { ...data, slug, href: `${base}/${slug}` }
}

export const sortByFinished = (list: Activity[]): Activity[] =>
  [...list].sort((a, b) => b.finishedAt.getTime() - a.finishedAt.getTime())

export const featured = (list: Activity[], max = 6): Activity[] =>
  sortByFinished(list.filter(a => a.featured)).slice(0, max)

export const adjacent = (list: Activity[], key: string): { prev?: Activity; next?: Activity } => {
  const sorted = sortByFinished(list)
  const i = sorted.findIndex(a => a.key === key)
  if (i === -1) return {}
  const out: { prev?: Activity; next?: Activity } = {}
  if (i > 0) out.prev = sorted[i - 1]
  if (i < sorted.length - 1) out.next = sorted[i + 1]
  return out
}

export const resolveMetas = (a: Activity): Meta[] =>
  a.metas.map(meta => {
    if (meta.value !== '__FUNCTION__') return meta
    if (meta.title === 'Tools') return { title: meta.title, value: a.techs.join(', ') }
    if (meta.title === 'Scope') return { title: meta.title, value: a.type }
    return meta
  })

const groupBy = <K extends 'year' | 'month'>(list: Activity[], attr: K, pick: (d: Date) => number) => {
  const groups = new Map<number, Activity[]>()
  for (const a of sortByFinished(list)) {
    const k = pick(a.finishedAt)
    groups.set(k, [...(groups.get(k) ?? []), a])
  }
  return [...groups.entries()]
    .sort(([a], [b]) => b - a)
    .map(([k, entries]) => ({ [attr]: k, entries }) as { [P in K]: number } & { entries: Activity[] })
}

export const groupByYear = (list: Activity[]) => groupBy(list, 'year', d => d.getUTCFullYear())

export const groupByMonth = (list: Activity[]) => groupBy(list, 'month', d => d.getUTCMonth())

const dateFormat = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export const formatDate = (d: Date): string => dateFormat.format(d)
