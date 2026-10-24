import { test, expect } from 'vitest'
import { applyFilter, filterCounts, FILTERS } from '../../src/lib/project-filter'

const list = [
  { slug: 'a', cat: 'client', featured: true },
  { slug: 'b', cat: 'client', featured: false },
  { slug: 'c', cat: 'perso', featured: false },
  { slug: 'd', cat: 'client', featured: false },
] as const

test('all: featured shown apart, grid holds the others', () => {
  expect(applyFilter([...list], 'all')).toEqual({ featured: 'a', grid: ['b', 'c', 'd'] })
})

test('category: no featured block, featured project goes back into the grid', () => {
  expect(applyFilter([...list], 'client')).toEqual({ featured: undefined, grid: ['a', 'b', 'd'] })
  expect(applyFilter([...list], 'perso')).toEqual({ featured: undefined, grid: ['c'] })
})

test('all without any featured project: everything in the grid', () => {
  expect(applyFilter(list.map(p => ({ ...p, featured: false })), 'all')).toEqual({ featured: undefined, grid: ['a', 'b', 'c', 'd'] })
})

test('counts are zero-padded per filter', () => {
  expect(filterCounts([...list])).toEqual({ all: '04', client: '03', perso: '01' })
  expect(FILTERS.map(f => f.id)).toEqual(['all', 'client', 'perso'])
})
