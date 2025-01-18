import siteMetadata from '@/data/siteMetadata';
import headerNavLinks from '@/data/headerNavLinks';
import Link from './Link';
import MobileNav from './MobileNav';
import ThemeSwitch from './ThemeSwitch';
import SearchButton from './SearchButton';
import VaulDrawer from './DrawerNav';

const Header = () => {
  const headerClass = `
    flex items-center justify-between w-full py-6 
    bg-white dark:bg-gray-950 
    ${siteMetadata.stickyNav ? 'sticky top-0 z-50' : ''}
  `;

  return (
    <header className={headerClass.trim()}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center space-x-3">
          {/* Uncomment the line below to use the logo */}
          {/* <Logo /> */}
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="text-2xl font-semibold h-6">{siteMetadata.headerTitle}</div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-3 sm:space-x-6">
        <nav className="hidden sm:flex space-x-3 overflow-x-auto no-scrollbar">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="block font-medium text-gray-900 dark:text-gray-100 hover:text-primary-500 dark:hover:text-primary-400"
              >
                {link.title}
              </Link>
            ))}
        </nav>
        <SearchButton />
        <ThemeSwitch />
        {/* <MobileNav /> */}
        <VaulDrawer/>
      </div>
    </header>
  );
};

export default Header;
