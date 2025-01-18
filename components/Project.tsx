import allProjects from "@/data/project.json";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/components/card";
import { Badge } from "@/components/components/ui/badge";
import Aos from "./aos";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";

export default function ProjectsShowcase() {
  return (
    <div className="container mx-auto">
      <Aos />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {allProjects.map((project, index) => (
          <div key={index} data-aos="fade-up">
            <Card className="flex flex-col overflow-hidden p-4 border transition-all duration-300 ease-out h-full shadow-md">
              {/* Card Content */}
              {/* <Image className="mb-4"
                width={500}
                height={100}
                quality={75}
                src={"/ogimage.png"}
                alt={""}>
              </Image> */}
              <div className="flex-grow space-y-2">
                <CardHeader>
                  <CardTitle className="mb-2 text-xl">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="prose max-w-full text-pretty text-sm text-muted-foreground dark:prose-invert">
                    {project.description}
                  </CardDescription>
                </CardHeader>
              </div>
              {/* Card Footer */}
              <CardFooter className="mt-auto">
                <div className="flex flex-col gap-2 w-full">
                  {/* Tags Section */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.technologies?.map((tag) => (
                      <Badge
                        className="px-1 py-0 text-[10px]"
                        variant="destructive"
                        key={tag}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {/* Link Section */}
                  <div className="flex flex-row flex-wrap items-start gap-1 mt-1">
                    {project.url && (
                      <Link href={project.url} target="_blank">
                        <Badge className="flex gap-1.5 px-2 text-[11px]">
                          <Avatar className="w-4 h-4">
                            <AvatarImage src="/icons/internet.svg" alt="Website" />
                            <AvatarFallback>ID</AvatarFallback>
                          </Avatar>
                          Website
                        </Badge>
                      </Link>
                    )}
                    {project.code && (
                      <Link href={project.code} target="_blank">
                        <Badge className="flex gap-1.5 px-2 text-[11px]">
                          <Avatar className="w-4 h-4">
                            <AvatarImage src="/icons/github_2.svg" alt="Code" />
                            <AvatarFallback>ID</AvatarFallback>
                          </Avatar>
                          Code
                        </Badge>
                      </Link>
                    )}
                    {project.document && (
                      <Link href={project.document} target="_blank">
                        <Badge className="flex gap-1.5 px-2 text-[11px]">
                          <Avatar className="w-4 h-4">
                            <AvatarImage src="/icons/internet.svg" alt="Paper" />
                            <AvatarFallback>ID</AvatarFallback>
                          </Avatar>
                          Paper
                        </Badge>
                      </Link>
                    )}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}