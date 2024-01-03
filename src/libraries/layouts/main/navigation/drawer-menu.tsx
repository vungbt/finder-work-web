import { Link } from '@/utils/navigation';
import { NavigationItem } from '..';

type DrawerMenuProps = {
  items: NavigationItem[];
};
export function DrawerMenu({ items }: DrawerMenuProps) {
  return (
    <div className="drawer fixed left-0 right-0 top-0 z-[50] w-full -translate-x-full bg-white px-8 py-4 opacity-0 shadow-md transition-all ease-linear md:-translate-y-full md:translate-x-0 md:px-12 md:py-6 xl:hidden">
      <div className="h-12"></div>
      <nav className="flex w-full flex-col items-center justify-center gap-6 md:flex-row">
        {items.map((item) => (
          <NavItem key={item.url} {...item} />
        ))}
      </nav>
    </div>
  );
}

const NavItem = (item: NavigationItem) => {
  const onHandleClickNavMobile = () => {
    if (!document) return;
    const inputShadow = document.getElementById('navigation-checkbox') as HTMLInputElement | null;
    if (!inputShadow) return;
    inputShadow.checked = false;
  };

  if (item.isLine) return <div className="h-[1px] w-full bg-white md:hidden"></div>;
  return (
    <Link
      onClick={onHandleClickNavMobile}
      className="px-4 py-3 font-semibold"
      key={item.url}
      href={item.url}>
      {item.title}
    </Link>
  );
};
