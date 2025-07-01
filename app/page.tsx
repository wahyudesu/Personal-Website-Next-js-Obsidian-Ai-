"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer";
import { allBlogs } from "contentlayer/generated";
import ListLayoutSimple from "@/layouts/BlogComponent";
import TechStack from "@/components/TechStack";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import Typewriter from "typewriter-effect";
import { Button } from "@/components/ui/button";
import CommunityCTA from "@/components/CTACommunity";

const MAX_POSTS = 3; // Batasi jumlah postingan yang ditampilkan

export default function Page() {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    // Mulai animasi segera setelah komponen dimuat
    setStartAnimation(true);
  }, []);

  // Ambil dan urutkan postingan
  const posts = allCoreContent(sortPosts(allBlogs));
  const displayedPosts = posts.slice(0, MAX_POSTS); // Ambil 3 postingan terbaru

  return (
    <div>
      {/* Bagian Hero */}
      <div className="h-[calc(100vh-14rem)] flex flex-col justify-center items-center">
        <Button variant="outline" className="rounded-full mb-6">
          <Link href="/chat-me">
          Chat with My AI Assistant
          </Link>
        </Button>
        <h1 className="cursor-default mb-2 text-5xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-center">
          I help growing{' '}
          <span className="relative underline decoration-blue-500 decoration-6 underline-offset-4 hover:text-blue-500 transition-colors duration-300">
            companies
          </span>
          <br />
          implement <span className="text-blue-500 font-black">AI/ML</span> so they can
        </h1>
        {startAnimation && (
          <div className="text-center py-4 mb-4">
            <Typewriter
              options={{
                strings: [
                  "Reduce cost",
                  "Automate repetitive work",
                  "Improve decision makings",
                  "Build solution that actually works!",
                ],
                autoStart: true,
                loop: true,
                wrapperClassName: "cursor-default text-xl sm:text-2xl lg:text-4xl font-medium ",
                cursorClassName: "text-blue-500 dark:text-blue-500 sm:text-2xl lg:text-4xl",
                delay: 50, // Kecepatan pengetikan
                deleteSpeed: 15, // Kecepatan penghapusan
              }}
            />
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 lg:gap-6 justify-center">
          <PulsatingButton>
            <Link href="https://cal.com/wahyuikbal_m">Book free consultation</Link>
          </PulsatingButton>
          <Button variant="outline">
            <Link href="https://contra.com/wahyuikbal_m">See my work</Link>
          </Button>
        </div>
      </div>

      {/* Bagian Tech Stack dan Blog */}
      <div className="mt-6 lg:mt-19">
        <h2 className="text-2xl lg:text-3xl font-semibold tracking-tighter text-center sm:text-left">
          Tech Stack
        </h2>
        <TechStack />
        <h2 className="text-2xl lg:text-3xl font-semibold tracking-tighter text-center sm:text-left mt-8">
          Latest Blog Posts
        </h2>
        <ListLayoutSimple posts={displayedPosts} title="" />
      </div>
      <div><CommunityCTA/></div>
    </div>
  );
}