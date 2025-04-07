import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/components/ui/button'

export default function ProjectCTA() {
  return (
    <div className="bg-primary-100 dark:bg-primary-900/20 border-2 border-primary-500 p-10 my-8 rounded-lg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden">
          <Image 
            src="/avatar.png" 
            width={14}
            height={14}
            alt="Profile Picture" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center">
          <h3 className="text-base font-semibold mb-2">Need a Custom Project?</h3>
          <p className="text-muted-foreground mb-4 text-base">
            I'm open for freelance projects and collaborations. Let's work together to bring your ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600">
              <Link href="/contact">
                Get in Touch
              </Link>
            </Button>
            <Button variant="outline" asChild className="dark:bg-slate-50 dark:hover:bg-slate-300">
              <Link href="https://cal.com/wahyuikbal_m/" target="_blank">
                Request a Quote
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}