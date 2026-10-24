import { getCollection } from 'astro:content'
import { sortByFinished, toActivity, type Activity } from './activities'

export const getActivities = async (): Promise<Activity[]> => {
  const entries = await getCollection('activities', ({ data }) => data.show)
  return sortByFinished(entries.map(e => toActivity(e.data)))
}

export const getProjects = async (): Promise<Activity[]> =>
  (await getActivities()).filter(a => a.activityType === 'PROJECT')

export const getBlogPosts = async (): Promise<Activity[]> =>
  (await getActivities()).filter(a => a.activityType === 'BLOG')
