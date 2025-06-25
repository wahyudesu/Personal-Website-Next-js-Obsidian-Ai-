import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/Card"
import Image from "next/image"
import Link from "next/link"

export interface Resource {
  name: string
  description: string
  image: string
  url: string
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
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => window.open(resource.url, "_blank")}
    >
      <Card className="overflow-hidden h-full border-2 border-solid dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 group dark:bg-slate-950 relative">
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <Image
            src={resource.image || "/placeholder.svg"}
            alt={resource.name}
            fill={true}
            quality={50}
            className="w-full h-full object-cover transition-transform duration-300"
          />
          {hovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity">
              <Button asChild variant="outline" className="z-10">
                <Link href={resource.url} target="_blank">
                  Visit Resource
                </Link>
              </Button>
            </div>
          )}
        </div>
        <CardHeader className="p-4 pb-2">
          <h3 className="text-lg sm:text-xl font-bold">{resource.name}</h3>
        </CardHeader>
        <CardContent className="px-4 pt-0">
          <p className="text-muted-foreground text-sm sm:text-base mb-4 line-clamp-2">
            {resource.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
