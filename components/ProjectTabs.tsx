"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/components/ui/tabs";
import ProjectAccordion from "./ProjectAccordion";
import allProjects from "@/data/project.json";
import { useMemo } from "react";
import { motion } from "framer-motion";

export default function ProjectTabs() {
  // Kelompokkan proyek berdasarkan type dan buat daftar tab, termasuk "All"
  const { groupedProjects, tabTypes } = useMemo(() => {
    const grouped = allProjects.reduce((acc, project) => {
      const { type } = project;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(project);
      return acc;
    }, {});

    // Tambahkan kategori "All" dengan semua proyek
    return {
      groupedProjects: {
        All: allProjects,
        ...grouped,
      },
      tabTypes: ["All", ...Object.keys(grouped)], // "All" diurutkan pertama
    };
  }, []);

  return (
    <Tabs defaultValue="All" className="w-full">
      <div>
        <TabsList className="bg-transparent dark:bg-transparent border-b border-black/10 dark:border-white/10 h-auto rounded-none p-0 w-full justify-start">
          {tabTypes.map((type) => (
            <TabsTrigger
              key={type}
              value={type}
              className="text-black/80 dark:text-white/80 data-[state=active]:text-primary-500 border-b-2 rounded-none border-transparent data-[state=active]:border-sky-500 dark:data-[state=active]:text-primary-500"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {tabTypes.map((type) => (
        <TabsContent key={type} value={type} className="mt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {groupedProjects[type].map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }} // Animasi berjalan saat elemen terlihat
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: index * 0.1, // Delay animasi berdasarkan indeks
                }}
              >
                <ProjectAccordion project={project} />
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
