import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/Card"
import { Badge, badgeVariants } from '@/components/ui/badge';
import Image from "next/image"

interface Project {
  name: string
  description: string
  role: string
  technologies: string[]
  tag: string[]
  image: string
  content: string
  url?: string
  code?: string
  paper?: string
  document?: string
}

interface ProjectCardProps {
  project: Project
  index: number
  onClick: () => void
}

export function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  // Generate random solid color based on project name for consistency
  const getRandomColor = (name: string) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#A569BD',
      '#5DADE2', '#58D68D', '#F4D03F', '#EC7063', '#AF7AC5'
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden h-full border-2 border-solid dark:border-gray-900 hover:border-primary-500 dark:hover:border-primary-500 group dark:bg-slate-950">
        <div className="relative h-40 sm:h-48 overflow-hidden">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.name}
              fill={true}
              quality={75}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full h-full object-cover transition-transform duration-300"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-300"
              style={{ backgroundColor: getRandomColor(project.name) }}
            >
              <span className="text-white text-4xl font-bold opacity-80">
                {project.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <h3 className="text-white text-sm font-bold p-4">
              <Badge className="whitespace-nowrap bg-primary-500 italic">#{project.role}</Badge>
            </h3>
          </div>
        </div>
        <CardHeader className="p-4 pb-2">
          <h3 className="text-lg sm:text-xl font-bold">{project.name}</h3>
        </CardHeader>
        <CardContent className="px-4 pt-0">
          <p className="text-muted-foreground text-sm sm:text-base mb-4 line-clamp-2">
            {project.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-1.5">
          {project.technologies.map((tech, i) => (
            <span key={i} className={badgeVariants({ variant: 'outline' })}>{tech}</span>
          ))}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
