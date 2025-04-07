import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/components/ui/button'

export default function CommunityCTA() {
  return (
    <div className="bg-primary-100 dark:bg-primary-900/20 border-2 border-primary-500 p-10 my-8 rounded-lg">
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <h3 className="text-base font-semibold mb-2">Join my AI Community</h3>
          <p className="text-muted-foreground mb-4 text-base">
            I'm currently building a community not just use ai tools but can build a ai agent that really solve the problem.
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
  )
}