"use client"

import { Card, CardContent, CardHeader } from "@/components/Card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"

export interface Resource {
  name: string
  description: string
  image: string
  type: string
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
        <ResourceCard key={idx} resource={resource} idx={idx} />
      ))}
    </div>
  )
}

function stringToHslColor(str: string, s = 60, l = 70) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h = Math.abs(hash) % 360
  return `hsl(${h}, ${s}%, ${l}%)`
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function ResourceCard({ resource, idx }: { resource: Resource; idx: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const needsPlaceholder = !resource.image
  const placeholderBg = needsPlaceholder
    ? stringToHslColor(resource.name || resource.url || String(idx))
    : undefined
  return (
    <div
      className="flex justify-center items-center"
      onClick={() => window.open(resource.url, "_blank")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`overflow-hidden w-full group relative flex flex-col rounded-2xl p-0 ${
          resource.bgColor ? resource.bgColor : "bg-white dark:bg-slate-950"
        } outline outline-primary-500 outline-0 hover:outline-4 hover:outline-primary-500 border-none transition-all duration-300`}
      >
        {/* Overlay biru yang slide dari atas */}
        <motion.div
          className="absolute inset-0 bg-primary-500 rounded-2xl z-0"
          initial={{ y: "-100%" }}
          animate={isHovered ? { y: 0 } : { y: "-100%" }}
          transition={{
                    type: "spring",
                    visualDuration: 0.2,
                    bounce: 0.2,
                }}
        />

        <div className="relative w-full aspect-[2/1] z-10">
          {resource.image ? (
            (resource.image.endsWith(".svg") || resource.image.endsWith(".gif")) ? (
              <Image
                src={resource.image}
                alt={resource.name}
                className="object-cover w-full h-full transition-transform duration-300 rounded-2xl absolute inset-0"
                style={{ background: "transparent" }}
                loading="lazy"
              />
            ) : (
              <Image
                src={resource.image}
                alt={resource.name}
                fill={true}
                quality={75}
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover w-full h-full transition-transform duration-300 rounded-2xl"
                style={{ background: "transparent" }}
              />
            )
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 rounded-2xl flex items-center justify-center"
              style={{ background: placeholderBg }}
            >
              <span className="text-white font-bold text-3xl">
                {getInitials(resource.name)}
              </span>
            </div>
          )}
          {resource.badge && (
            <span className="absolute top-3 left-3 bg-white text-xs font-bold px-3 py-1 rounded-md shadow z-20">
              {resource.badge}
            </span>
          )}
          <motion.a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Button size="lg" className="hover:bg-primary-700 text-xl rounded-full">
              Get the Resource
            </Button>
          </motion.a>
        </div>
        <CardHeader className="p-4 pb-2 relative z-10">
          <motion.span
            className="text-sm font-bold"
            initial={{ color: "rgb(99, 102, 241)" }}
            animate={isHovered ? { color: "rgb(255, 255, 255)" } : { color: "rgb(99, 102, 241)" }}
            transition={{ duration: 0.3 }}
          >
            {resource.type}
          </motion.span>
          <h3 className="text-lg sm:text-xl font-bold mt-1">{resource.name}</h3>
        </CardHeader>
        {/* <CardContent className="px-4 pt-0">
          <p className="text-sm sm:text-base mb-4 font-medium">
            {resource.description}
          </p>
        </CardContent> */}
      </div>
    </div>
  )
}
