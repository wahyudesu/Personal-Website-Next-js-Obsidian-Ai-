"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/lib/utils";

interface TypingAnimationProps {
  texts: string[];
  duration?: number;
  className?: string;
  loop?: boolean;
}

export function TypingAnimation({
  texts,
  duration = 200,
  className,
  loop = true,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
  const [i, setI] = useState<number>(0);

  useEffect(() => {
    const typingEffect = setInterval(() => {
      if (i < texts[currentTextIndex].length) {
        setDisplayedText(texts[currentTextIndex].substring(0, i + 1));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
        setTimeout(() => {
          if (currentTextIndex < texts.length - 1) {
            setCurrentTextIndex(currentTextIndex + 1);
          } else if (loop) {
            setCurrentTextIndex(0);
          }
          setI(0);
        }, 1000); // Delay sebelum mulai mengetik kalimat berikutnya
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [duration, i, currentTextIndex, texts, loop]);

  return (
    <h1
      className={cn(
        "font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm",
        className,
      )}
    >
      {displayedText ? displayedText : texts[currentTextIndex]}
    </h1>
  );
}