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
import { Effect } from "@/components/animate-ui/primitives/effects/effect";
import { TextAnimate } from "@/components/ui/text-animate";

const MAX_POSTS = 3; // Batasi jumlah postingan yang ditampilkan

export default function Page() {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    // Mulai animasi setelah jeda singkat
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Ambil dan urutkan postingan
  const posts = allCoreContent(sortPosts(allBlogs));
  const displayedPosts = posts.slice(0, MAX_POSTS); // Ambil 3 postingan terbaru

  return (
    <div>
      {/* Bagian Hero */}
      <div className="h-[calc(100vh-14rem)] flex flex-col justify-center items-center">
        <Effect zoom fade delay={1000}>
          <Button asChild variant="outline" className="rounded-full mb-6 ">
            <Link href="/chat-me">
              Chat with My AI Assistant
            </Link>
          </Button>
        </Effect>
        <h1 className="cursor-default mb-2 text-5xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-center">
          <TextAnimate as="span" animation="blurInUp" by="word" delay={1}>
            I help growing
          </TextAnimate>{" "}
          <span className="relative underline decoration-blue-500 decoration-6 underline-offset-4 hover:text-blue-500 transition-colors duration-300">
            <TextAnimate as="span" animation="blurInUp" by="word" delay={1}>
              companies
            </TextAnimate>
          </span>
          <br />
          <TextAnimate as="span" animation="blurInUp" by="word" delay={1}>
            implement
          </TextAnimate>{" "}
          <span className="text-blue-500 font-black">
            <TextAnimate as="span" animation="blurInUp" by="word" delay={1}>
              AI/ML
            </TextAnimate>
          </span>{" "}
          <TextAnimate as="span" animation="blurInUp" by="word" delay={1}>
            so they can
          </TextAnimate>
        </h1>
        {startAnimation && (
          <div className="text-center py-4 mb-4">
            {/* <Typewriter onInit={} */}
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
          <Effect fade slide delay={2000}>
            <PulsatingButton asChild>
              <Link href="https://cal.com/wahyuikbal_m">Book free consultation</Link>
            </PulsatingButton>
          </Effect>
          <Effect fade slide delay={2400}>
            <Button asChild variant="outline">
              <Link href="https://contra.com/wahyuikbal_m">See my work</Link>
            </Button>
          </Effect>
        </div>
      </div>

      {/* Bagian Tech Stack dan Blog */}
      <div className="mt-6 lg:mt-19">
        <TextAnimate
          as="h2"
          by="word"
          className="text-2xl lg:text-3xl font-semibold tracking-tighter text-center sm:text-left"
        >
          Tech Stack
        </TextAnimate>
        <TechStack />
        <h2 className="text-2xl lg:text-3xl font-semibold tracking-tighter text-center sm:text-left mt-8">
          Latest Blog Posts
        </h2>
        <ListLayoutSimple posts={displayedPosts} title="" />
      </div>
      <div><CommunityCTA /></div>
    </div>
  );
}