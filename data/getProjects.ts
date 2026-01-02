import { readFile } from 'fs/promises'
import path from 'path'
import { parse } from '@iarna/toml'

export interface Project {
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
}

export async function getProjects(): Promise<Project[]> {
  const filePath = path.join(process.cwd(), 'data', 'projects.toml')
  const raw = await readFile(filePath, 'utf8')
  const parsed = parse(raw) as any
  // TOML top-level has `project` array
  const rawProjects = parsed.project ?? []

  // Ensure we return only plain JSON-serializable objects (no Symbol or prototype properties)
  const projects = rawProjects.map((p: any) => ({
    name: p.name ? String(p.name) : "",
    description: p.description ? String(p.description) : "",
    role: p.role ? String(p.role) : "",
    technologies: Array.isArray(p.technologies) ? p.technologies.map((t: any) => String(t)) : [],
    tag: Array.isArray(p.tag) ? p.tag.map((t: any) => String(t)) : [],
    image: p.image ? String(p.image) : "",
    content: p.content !== undefined && p.content !== null ? String(p.content) : "",
    url: p.url ? String(p.url) : undefined,
    code: p.code ? String(p.code) : undefined,
    paper: p.paper ? String(p.paper) : undefined,
  }))

  return projects
}
