import { genPageMetadata } from 'app/seo'
import ProjectTabs from '@/components/ProjectTabs'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            Projects
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Here's an overview of the projects I've contributed to. These include a
            mix of personal initiatives and my work at Hiyield. All these projects are live and available for you to explore. Any in-development personal work can be found open-sourced on my
          </p>
        </div>
      </div>
      <ProjectTabs/>
    </>
  )
}
