'use client';

import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { AnimatedSubscribeButton } from "@/components/components/ui/animated-subscribe-button";

export default function AnimatedSubscribeButtonDemo({ label, url }: { label: string; url: string }) {
  const handleClick = () => {
    // Tambahkan jeda 1 detik (1000 milidetik) sebelum membuka jendela baru
    setTimeout(() => {
      window.open(url, '_blank');
    }, 800);
  };

  return (
    <AnimatedSubscribeButton className="w-fit my-4 bg-primary-500">
      <span className="group inline-flex items-center" onClick={handleClick}>
        {label} {/* Gunakan prop `label` untuk teks tombol */}
        <ChevronRightIcon className="ml-1 size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
      <span className="group inline-flex items-center">
        <CheckIcon className="mr-2 size-4" />
        Done
      </span>
    </AnimatedSubscribeButton>
  );
}