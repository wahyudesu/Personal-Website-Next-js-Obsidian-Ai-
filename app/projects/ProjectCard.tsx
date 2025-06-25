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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden h-full border-2 border-solid dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 group dark:bg-slate-950">
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <Image 
            src={project.image || "/placeholder.svg"} 
            alt={project.name}
            fill={true}
            quality={50}
            className="w-full h-full object-cover transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <h3 className="text-white text-sm font-bold p-4">
              <Badge className="whitespace-nowrap bg-primary-500"># {project.role}</Badge>
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
