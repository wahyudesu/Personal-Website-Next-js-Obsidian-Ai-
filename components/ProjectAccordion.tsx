'use client';

import { Accordion, AccordionContent, AccordionItem } from "@/components/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { File, Github, Globe, Plus } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/components/ui/badge";
import Link from "next/link";

interface Project {
  slug: string;
  name: string;
  description: string;
  technologies: string[];
  paper?: string;
  publishedAt: string;
  code?: string;
  document?: string;
  url?: string;
  gambar?: string; // Properti gambar menjadi optional
}

export default function ProjectAccordion({ project }: { project: Project }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={project.slug} key={project.slug}>
        <AccordionPrimitive.Header className="flex">
          <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between py-2 text-left text-[15px] font-semibold leading-6 transition-all [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0 [&[data-state=open]>svg]:rotate-180">
            <div className="flex flex-col space-y-1">
              <span className="text-xl">
                {project.name}
              </span>
              {project.description && (
                <span className="text-sm font-normal opacity-80">
                  {project.description}
                </span>
              )}
              {/* Badge links di bawah deskripsi */}
              <div className="flex flex-row flex-wrap items-start gap-1 mt-2">
                {project.url && (
                  <Link href={project.url} target="_blank">
                    <Badge variant="outline" className="rounded-md flex gap-1.5 px-2 text-[11px]">
                      <Globe aria-hidden="true" size={14} />
                      Website
                    </Badge>
                  </Link>
                )}
                {project.code && (
                  <Link href={project.code} target="_blank">
                    <Badge variant="outline" className="rounded-md flex gap-1.5 px-2 text-[11px]">
                      <Github aria-hidden="true" size={14} />
                      Code
                    </Badge>
                  </Link>
                )}
                {project.document && (
                  <Link href={project.document} target="_blank">
                    <Badge variant="outline" className="rounded-md flex gap-1.5 px-2 text-[11px]">
                      <File aria-hidden="true" size={14} />
                      Paper
                    </Badge>
                  </Link>
                )}
              </div>
            </div>
            {/* Ikon Plus di sebelah kanan */}
            <Plus
              size={16}
              strokeWidth={2}
              className="shrink-0 opacity-60 transition-transform duration-200"
              aria-hidden="true"
            />
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Gambar di sebelah kiri (hanya ditampilkan jika ada) */}
            {project.gambar && (
              <div className="w-full md:w-1/2">
                <Image
                  src={project.gambar} // Gunakan properti gambar dari project
                  alt={project.name} // Alt text sesuai nama proyek
                  width={500} // Lebar gambar
                  height={300} // Tinggi gambar
                  className="rounded-lg object-cover"
                />
              </div>
            )}

            {/* Daftar teknologi sebagai Badge di sebelah kanan */}
            <div className={`w-full ${project.gambar ? 'md:w-1/2' : 'md:w-full'}`}>
              <h4 className="mb-2 text-primary-500 font-semibold">Tech stack:</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="outline" className="rounded-md text-primary-500">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}