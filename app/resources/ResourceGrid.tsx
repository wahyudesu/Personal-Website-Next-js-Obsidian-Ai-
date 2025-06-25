import { Card, CardContent, CardHeader } from "@/components/Card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export interface Resource {
  name: string
  description: string
  image: string
  url: string
  badge?: string // badge label
  bgColor?: string // background color, e.g. '#F5C443' or 'bg-yellow-400'
}

interface ResourceGridProps {
  resources: Resource[]
}

export default function ResourceGrid({ resources }: ResourceGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {resources.map((resource, idx) => (
        <ResourceCard key={idx} resource={resource} />
      ))}
    </div>
  )
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div
      className="flex justify-center items-center"
      onClick={() => window.open(resource.url, "_blank")}
    >
      <Card
        className={`overflow-hidden w-full group relative flex flex-col rounded-2xl p-0 ${
          resource.bgColor ? resource.bgColor : "bg-white dark:bg-slate-950"
        } outline outline-0 hover:outline-4 hover:outline-primary-500 border-none`}
      >
        <div className="relative w-full aspect-[2/1]">
          {resource.image && (resource.image.endsWith('.svg') || resource.image.endsWith('.gif')) ? (
            <img
              src={resource.image}
              alt={resource.name}
              className="object-cover w-full h-full transition-transform duration-300 rounded-2xl absolute inset-0"
              style={{ background: "transparent" }}
            />
          ) : (
            <Image
              src={resource.image || "/placeholder.png"}
              alt={resource.name}
              fill={true}
              quality={50}
              className="object-cover w-full h-full transition-transform duration-300 rounded-2xl"
              style={{ background: "transparent" }}
            />
          )}
          {resource.badge && (
            <span className="absolute top-3 left-3 bg-white text-xs font-bold px-3 py-1 rounded-md shadow z-20">
              {resource.badge}
            </span>
          )}
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30"
          >
            <Button size="lg" className="hover:bg-primary-700 text-xl rounded-full">
              Get the Resource
            </Button>
          </a>
        </div>
        <CardHeader className="p-4 pb-2">
          <span className="text-primary-500 text-sm font-bold">
            Customer Story
          </span>
          <h3 className="text-lg sm:text-xl font-bold mt-1">{resource.name}</h3>
        </CardHeader>
        {/* <CardContent className="px-4 pt-0">
          <p className="text-sm sm:text-base mb-4 font-medium">
            {resource.description}
          </p>
        </CardContent> */}
      </Card>
    </div>
  )
}
