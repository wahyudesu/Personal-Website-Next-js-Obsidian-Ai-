'use client';

import { Drawer } from 'vaul';
import Link from './Link';
import headerNavLinks from '@/data/headerNavLinks';
import { AlignJustify, X } from 'lucide-react';
import { Button } from './components/ui/button';
import MusicPlayer from './music-player';
import { Separator } from './components/ui/separator';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import * as React from 'react';

export default function DrawerNav() {
  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger>
        <Button variant="outline" size="icon" className="sm:hidden w-9 h-9">
          <AlignJustify />
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content
          className="right-2 top-2 bottom-2 fixed z-10 outline-none w-[310px] flex"
          style={{ '--initial-transform': 'calc(100% + 8px)' } as React.CSSProperties}
        >
          <div className="bg-white dark:bg-zinc-900 h-full w-full pt-4 px-4 flex flex-col rounded-[16px]">
            <div className="flex justify-between items-center border-b pb-1">
              <span className="text-2xl pt-2 font-bold tracking-widest text-gray-900 dark:text-gray-100 justify-end">
                Menu
              </span>
              <Drawer.Close>
                <div className="py-2">
                  <X size={22} />
                </div>
              </Drawer.Close>
            </div>
            <nav className="mt-3 flex flex-col space-y-4 items-start">
              {headerNavLinks.map((link, index) => (
                <Drawer.Close key={link.title} asChild>
                  <div>
                    <LettersPullUp
                      text={link.title}
                      className="text-2xl font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                      delay={index * 0.05} // Delay untuk setiap baris link
                      href={link.href} // Teruskan href ke LettersPullUp
                    />
                  </div>
                </Drawer.Close>
              ))}
            </nav>
          </div>
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <Separator />
            <MusicPlayer />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function LettersPullUp({
  text,
  className = '',
  delay = 0,
  href, // Tambahkan prop href
}: {
  text: string;
  className?: string;
  delay?: number;
  href: string; // Terima prop href
}) {
  const splittedText = text.split('');

  const pullupVariant = {
    initial: { y: 8, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.01 + delay, // Percepat animasi dan tambahkan delay per baris
        duration: 0.3, // Percepat durasi animasi
      },
    }),
    exit: { y: 8, opacity: 0 }, // Animasi exit
  };

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <Link
      href={href}
      onClick={(e) => {
        e.stopPropagation(); // Mencegah event klik menyebar ke Drawer.Close
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); // Tutup drawer
      }}
      className={className}
    >
      <div className="flex">
        {splittedText.map((current, i) => (
          <motion.div
            key={i}
            ref={ref}
            variants={pullupVariant}
            initial="initial"
            animate={isInView ? 'animate' : ''}
            exit="exit" // Tambahkan animasi exit
            custom={i}
          >
            {current === ' ' ? <span>&nbsp;</span> : current}
          </motion.div>
        ))}
      </div>
    </Link>
  );
}