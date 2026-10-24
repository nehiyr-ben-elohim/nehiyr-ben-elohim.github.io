import { z } from 'astro/zod'

// files in public/img/devicons/
export const DEVICONS = [
  'symfony', 'nuxtjs', 'php', 'postgresql', 'docker', 'typescript', 'python', 'react', 'express', 'javascript',
  'java', 'csharp', 'go', 'go-wordmark', 'laravel', 'django', 'vuejs', 'flutter', 'android',
  'mysql', 'sqlserver', 'mongodb', 'neo4j', 'scikitlearn', 'tensorflow', 'pandas',
] as const

export const iconSchema = z.object({ name: z.string(), icon: z.enum(DEVICONS) })

export const deviconSrc = (icon: string): string => `/img/devicons/${icon}.svg`
