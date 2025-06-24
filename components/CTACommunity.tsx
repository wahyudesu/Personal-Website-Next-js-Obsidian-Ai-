import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CommunityCTA() {
  return (
    <div className="flex justify-center">
      <div className="bg-primary-100 my-14 dark:bg-primary-900/20 border-2 border-primary-500 p-10 rounded-lg max-w-3xl w-full">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Join my AI Community</h3>
          <p className="text-muted-foreground mb-4 text-base text-center">
            Join a community focused on building AI agents that solve real problems,<br />not just using AI tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600">
            <Link href="https://cal.com/wahyuikbal_m/">
              Join Community
            </Link>
            </Button>
            <Button variant="outline" asChild className="dark:bg-slate-50 dark:hover:bg-slate-300">
            <Link href="https://cal.com/wahyuikbal_m/" target="_blank">
              Follow AI Update Tools
            </Link>
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}