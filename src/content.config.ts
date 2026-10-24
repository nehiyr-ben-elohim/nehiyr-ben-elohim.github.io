import { defineCollection } from 'astro:content'
import { file } from 'astro/loaders'
import { activitySchema } from './lib/schema'

const activities = defineCollection({
  loader: file('src/data/activities.json', {
    parser: text => JSON.parse(text).map((a: { key: string }) => ({ ...a, id: a.key })),
  }),
  schema: activitySchema,
})

export const collections = { activities }
