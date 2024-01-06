import { Link } from '@/utils/navigation';
import clsx from 'clsx';
import { HamburgerIcon, NavigationItem } from '..';

type NavigationMainProps = {
  items: NavigationItem[];
};
export function NavigationMain({ items }: NavigationMainProps) {
  return (
    <label
      htmlFor="navigation-checkbox"
      className={clsx('main-navigation z-[51] flex items-center gap-6')}>
      <HamburgerIcon className="xl:hidden" />
      <div className="hidden md:flex md:flex-1 md:items-center md:gap-6">
        {items.map((nav) => (
          <NavItem key={nav.url} {...nav} />
        ))}
      </div>
    </label>
  );
}

const NavItem = (item: NavigationItem) => {
  if (item.isLine) return <div className="h-4 w-[1px] bg-white"></div>;
  return (
    <Link
      className="line-hover nav-item px-4 py-3 font-semibold text-white"
      key={item.url}
      href={item.url}>
      {item.title}
    </Link>
  );
};
