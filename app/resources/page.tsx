"use client"

import ResourceGrid from 'app/resources/ResourceGrid'
import resources from '@/data/resources'

export default function ResourcesPage() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
          Resources
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Useful resources and tools for development and productivity.
        </p>
      </div>
      <div className="pt-6">
        <ResourceGrid resources={resources} />
      </div>
    </div>
  )
}
