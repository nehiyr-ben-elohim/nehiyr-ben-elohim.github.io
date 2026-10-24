import type { ImageMetadata } from 'astro'

const images = import.meta.glob<ImageMetadata>('/src/assets/img/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

// '/img/activities/x/0.png' (JSON path) → optimized asset
export const resolveImage = (publicPath: string): ImageMetadata => {
  const image = images[`/src/assets${publicPath}`]
  if (!image) throw new Error(`Image introuvable: ${publicPath}`)
  return image
}
