import ProjectsClient from "./ProjectsClient"
import { getProjects } from "@/data/getProjects"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return <ProjectsClient projects={projects} />
}
