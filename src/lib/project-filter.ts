export const FILTERS = [
  { id: 'all', label: 'tous' },
  { id: 'client', label: 'missions client' },
  { id: 'perso', label: 'projets perso' },
] as const

export type FilterId = (typeof FILTERS)[number]['id']
type Filterable = { slug: string; cat: string; featured: boolean }

// 'all' shows the featured project in its own block; a category puts it back in the grid
export const applyFilter = (list: Filterable[], filter: FilterId): { featured?: string; grid: string[] } => {
  const featured = filter === 'all' ? list.find(p => p.featured)?.slug : undefined
  const grid = list.filter(p => (filter === 'all' || p.cat === filter) && p.slug !== featured).map(p => p.slug)
  return { featured, grid }
}

const pad = (n: number) => String(n).padStart(2, '0')

export const filterCounts = (list: Filterable[]): Record<FilterId, string> => ({
  all: pad(list.length),
  client: pad(list.filter(p => p.cat === 'client').length),
  perso: pad(list.filter(p => p.cat === 'perso').length),
})
