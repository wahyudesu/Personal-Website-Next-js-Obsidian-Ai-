"use client"

import siteMetadata from '@/data/siteMetadata';
// import headerNavLinks from '@/data/headerNavLinks';
import Link from '../Link';
import MobileNav from '@/components/navigation/MobileNav';
import ThemeSwitch from '@/components/navigation/ThemeSwitch';
import SearchButton from '@/components/navigation/SearchButton';
import VaulDrawer from '@/components/navigation/DrawerNav';
import { usePathname } from 'next/navigation';
import { TextAnimate } from "@/components/ui/text-animate"

const headerNavLinks = [
  { href: '/', title: 'Home' },
  { href: '/about', title: 'Resume' },
  { href: '/projects', title: 'Showcase' },
  { href: '/blog', title: 'Blog' },
  { href: '/resources', title: 'Resources' },
  { href: '/chat-me', title: 'AI_Chat' },
  { href: '/games', title: 'Games' },
  // { href: '/contact', title: 'Contact Me' },
]

const Header = () => {
  const pathname = usePathname();
  const headerClass = `
    flex items-center justify-between w-full py-6 
    bg-white dark:bg-gray-950 
    ${siteMetadata.stickyNav ? 'sticky top-0 z-50' : ''}
  `;

  return (
    <header className={headerClass.trim()}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center space-x-3">
          <TextAnimate by="word" className='text-2xl font-semibold h-6'>
            Why
          </TextAnimate>  
        </div>
      </Link>
      <div className="flex items-center space-x-3 sm:space-x-6">
        <nav className="hidden sm:flex space-x-4 overflow-x-auto no-scrollbar">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link, index) => (
              <Link
                key={link.title}
                href={link.href}
                className={`block font-medium ${pathname === link.href
                  ? 'text-primary-500 underline decoration-2 underline-offset-4 dark:text-primary-500'
                  : 'text-gray-900 dark:text-gray-100 hover:text-primary-500 dark:hover:text-primary-400'
                  } hover:underline decoration-2 underline-offset-4`}
              >
                <TextAnimate
                  by="word"
                  className="font-semibold"
                  delay={(index + 1) * 0.1}
                >
                  {link.title}
                </TextAnimate>
              </Link>
            ))}
        </nav>
        <SearchButton />
        <ThemeSwitch />
        {/* <MobileNav /> */}
        <VaulDrawer />
      </div>
    </header>
  );
};

export default Header;