"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { X } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { badgeVariants } from '@/components/components/ui/badge';
import { Button } from "@/components/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/components/card"
import { Badge } from "@/components/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/components/ui/dialog"
import { ScrollArea } from "@/components/components/ui/scroll-area"
import Link from "next/link"
import siteMetadata from "@/data/siteMetadata"
import projectsData from '@/data/projects'
import { Separator } from "@/components/components/ui/separator"
import Schedulewidget from "@/components/meeting"
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

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  
  const projects = projectsData

  return (
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
      <div className="pt-6">
        <ProjectGrid projects={projects} onSelectProject={setSelectedProject} />

        {selectedProject && (
          <ProjectDialog
            project={selectedProject}
            open={!!selectedProject}
            onOpenChange={(open) => {
              if (!open) setSelectedProject(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

interface ProjectGridProps {
  projects: Project[]
  onSelectProject: (project: Project) => void
}

function ProjectGrid({ projects, onSelectProject }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {projects.map((project, index) => (
        <ProjectCard key={index} project={project} index={index} onClick={() => onSelectProject(project)} />
      ))}
    </div>
  )
}

interface ProjectCardProps {
  project: Project
  index: number
  onClick: () => void
}

function ProjectCard({ project, index, onClick }: ProjectCardProps) {
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
            // objectFit="cover"
            quality={50}
            // width={14}
            // height={14}
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


interface ProjectDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ProjectDialog({ project, open, onOpenChange }: ProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex sm:max-h-[min(640px,80vh)] sm:max-w-lg lg:max-w-4xl lg:max-h-lvh p-0 overflow-hidden">
        <ScrollArea className="max-h-[calc(90vh-56px)]">
          <DialogHeader className="px-6 pt-6 space-y-0 text-left">
            <DialogTitle className="text-2xl sm:text-2xl md:text-3xl font-bold">
              Project Overview
              {/* {project.name} */}
            </DialogTitle>
            {/* <DialogDescription className="text-md">
              {project.description}
            </DialogDescription> */}
          </DialogHeader>
          <div className="p-4 md:p-6 lg:p-10">
            {project.image && (
              <div className="mb-6 sm:mb-8">
                <Image
                  src={project.image}
                  alt={project.name}
                  width={1600}
                  height={200}
                  className="w-full h-48 md:h-96 object-cover rounded-lg mb-4 md:mb-6"
                />
              </div>
            )}
            <div className="prose prose-sm sm:prose-base lg:prose-md dark:prose-invert max-w-none">
              <ReactMarkdown>{project.content}</ReactMarkdown>
            </div>
            <Separator className="my-4"/>
            <div className="mb-4">
              <h2 className="text-lg font-semibold my-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {project.tag.map((tech, i) => (
                  <span key={i} className={badgeVariants({ variant: 'outline' })}>{tech}</span>
                  ))}
              </div>
              <h2 className="text-lg font-semibold my-4">Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span key={i} className={badgeVariants({ variant: 'outline' })}>{tech}</span>
                  ))}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.url && (
                <Button asChild variant="outline" className="border-2 border-primary-500 dark:border-primary-500 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white">
                  <Link href={project.url} target="_blank">
                    Go To Website
                  </Link>
                </Button>
              )}
              {project.code && (
                <Button asChild variant="outline" className="border-2 border-primary-500 dark:border-primary-500 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white">
                  <Link href={project.code} target="_blank">
                    Source Code
                  </Link>
                </Button>
              )}
              {project.paper && (
                <Button asChild variant="outline" className="border-2 border-primary-500 dark:border-primary-500 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white">
                  <Link href={project.paper} target="_blank">
                    View Paper
                  </Link>
                </Button>
              )}
            </div>
            <div className="bg-primary-100 dark:bg-primary-900/20 border-2 border-primary-500 p-10 my-8 rounded-lg">
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden">
                  <Image 
                    src="/avatar.png" 
                    width={14}
                    height={14}
                    alt="Profile Picture" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-base font-semibold mb-2">Need a Custom Project?</h3>
                  <p className="text-muted-foreground mb-4 text-base">
                    I'm open for freelance projects and collaborations. Let's work together to bring your ideas to life.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600">
                      <Link href="/contact">
                        Get in Touch
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="dark:bg-slate-50 dark:text-black dark:hover:bg-neutral-300 dark:hover:text-black">
                      <Link href="https://cal.com/wahyuikbal_m/" target="_blank">
                        Request a Quote
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* <DialogFooter className="py-4">
              <DialogClose asChild>
                <Button type="button">Close</Button>
              </DialogClose>
            </DialogFooter> */}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
