import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH

const Image = ({ src, alt, ...rest }: ImageProps) => {
  // Ekstrak nama file dari src
  const fileName = src?.toString().split('/').pop()?.split('.')[0] || ''

  return (
    <div style={{ textAlign: 'center' }}>
      <NextImage
        src={`${basePath || ''}${src}`}
        alt={alt || fileName}
        className='mb-0'
        {...rest} 
      />
      <p className="mt-2 text-gray-500 text-xs">
        {alt}
      </p>
    </div>
  )
}

export default Image