import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { Button } from '@/components/components/ui/button'
import NumberTicker from "@/components/components/ui/number-ticker";
import { badgeVariants } from '@/components/components/ui/badge'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
        <h3 className="font-bold text-xl">My Skill</h3>
        <div className="flex gap-2 mt-4">
          <span className={badgeVariants({ variant: "outline" })}>Artificial Intelligence</span>
          <span className={badgeVariants({ variant: "outline" })}>Data analysis</span>
          <span className={badgeVariants({ variant: "outline" })}>UI/UX</span>
        </div>
        <div className="flex items-start content-around gap-2 flex-wrap mt-2">
          <span className={badgeVariants({ variant: "outline" })}>Problem Solving</span>
          <span className={badgeVariants({ variant: "outline" })}>Management</span>
          <span className={badgeVariants({ variant: "outline" })}>Teamwork</span>
          <span className={badgeVariants({ variant: "outline" })}>Project Management</span>
        </div>
      <div>
        <h2 className="font-semibold text-3xl md:text-2xl mb-8">
          <NumberTicker value={10} />+ Project
        </h2>
        <h2 className="font-semibold text-3xl md:text-2xl mb-8">
          <NumberTicker value={50} />+ Certificate
        </h2>
        <h2 className="font-semibold text-3xl md:text-2xl mb-8">
          <NumberTicker value={10} />+ Experience
        </h2>
        <h2 className="font-semibold text-3xl md:text-2xl mb-8">
          <NumberTicker value={3} />+ Volunteer
        </h2>
      </div>
        <div className='space-x-2'>
          <Button>Download CV</Button>
          <Button>Download Resume</Button>
        </div>
      </AuthorLayout>
    </>
  )
}
