import { genPageMetadata } from 'app/seo'
import ProjectTabs from '@/components/ProjectTabs'
import { Badge } from '@/components/components/ui/badge'
import Link from 'next/link'
import siteMetadata from '@/data/siteMetadata'
export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <div className='flex justify-between'>
            <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
              Projects
            </h1>
            <Badge variant="outline" className='px-4 rounded-lg'>
              <Link href={siteMetadata.github}>
              View Github
              </Link>
            </Badge>
          </div>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            A collection of projects I've worked on
          </p>
        </div>
      </div>
      <ProjectTabs/>
    </>
  )
}
