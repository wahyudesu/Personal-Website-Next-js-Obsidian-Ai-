import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH

const Image = ({
  src,
  alt,
  loading = 'lazy',
  placeholder = 'blur',
  blurDataURL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4=',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  ...rest
}: ImageProps) => {
  // Ekstrak nama file dari src
  const fileName = src?.toString().split('/').pop()?.split('.')[0] || ''

  // For external images or SVG, don't use blur placeholder
  const isExternalOrSvg = typeof src === 'string' && (src.startsWith('http') || src.endsWith('.svg'))
  const imagePlaceholder = isExternalOrSvg ? 'empty' : placeholder

  return (
    <div style={{ textAlign: 'center' }}>
      <NextImage
        src={`${basePath || ''}${src}`}
        alt={alt || fileName}
        className='mb-0'
        loading={loading}
        placeholder={imagePlaceholder}
        blurDataURL={imagePlaceholder === 'blur' ? blurDataURL : undefined}
        sizes={sizes}
        quality={quality}
        {...rest}
      />
      <p className="mt-2 text-gray-500 text-xs">
        {alt}
      </p>
    </div>
  )
}

export default Image