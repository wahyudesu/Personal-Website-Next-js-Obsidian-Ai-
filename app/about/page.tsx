import { Authors, allAuthors } from 'contentlayer/generated';
import { MDXLayoutRenderer } from 'pliny/mdx-components';
import AuthorLayout from '@/layouts/AuthorLayout';
import { coreContent } from 'pliny/utils/contentlayer';
import { genPageMetadata } from 'app/seo';
import NumberTicker from '@/components/components/ui/number-ticker';
import { badgeVariants } from '@/components/components/ui/badge';
import DownloadButton from '@/components/buttonDownload';
import siteMetadata from '@/data/siteMetadata';

export const metadata = genPageMetadata({ title: 'About' });

const achievements = [
  { label: 'Project', value: 10 },
  { label: 'Certificate', value: 50 },
  { label: 'Experience', value: 10 },
  { label: 'Volunteer', value: 3 },
];

const AchievementItem = ({ label, value }: { label: string; value: number }) => (
  <h2 className="font-semibold text-3xl md:text-2xl my-8">
    <NumberTicker value={value} />+ {label}
  </h2>
);

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors;
  const mainContent = coreContent(author);

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
        <h3 className="font-bold text-xl">My Skill</h3>
        <div className="flex gap-2 mt-4">
          <span className={badgeVariants({ variant: 'outline' })}>Artificial Intelligence</span>
          <span className={badgeVariants({ variant: 'outline' })}>Data analysis</span>
          <span className={badgeVariants({ variant: 'outline' })}>UI/UX</span>
        </div>
       <div className="flex items-start content-around gap-2 flex-wrap mt-2">
          <span className={badgeVariants({ variant: 'outline' })}>Problem Solving</span>
          <span className={badgeVariants({ variant: 'outline' })}>Management</span>
          <span className={badgeVariants({ variant: 'outline' })}>Teamwork</span>
          <span className={badgeVariants({ variant: 'outline' })}>Project Management</span>
        </div>
        <div className='pt-2'>
          <h4 className="font-bold text-xl">Education</h4>
          <p>Politeknik Elektronika Negeri Surabaya <br/> Applied Data Science
          </p>
        </div>
        <div className="pt-1">
          {achievements.map((achievement, index) => (
            <AchievementItem key={index} label={achievement.label} value={achievement.value} />
          ))}
        </div>
        <div className="gap-2">
          <DownloadButton
            label="Download CV (3 pages)"
            url={siteMetadata.CVUrl}
          />
          <DownloadButton
            label="Download Resume (2 pages)"
            url={siteMetadata.CVUrl}
          />
        </div>
      </AuthorLayout>
    </>
  );
}