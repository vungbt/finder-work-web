'use client';
import { IconName, RenderIcon } from '@/libraries/icons';
import { Link, usePathname } from '@/utils/navigation';
import clsx from 'clsx';
import { ReactNode, useEffect, useMemo, useState } from 'react';

export type SidebarMenu = {
  label: string;
  items: MenuItem[];
};

export type MenuItem = {
  label: string;
  href: string;
  icon?: IconName;
  child?: MenuItem[];
  isFavorite?: boolean;
  parent?: MenuItem;
};

export function SideBar({ menus, className }: { menus: SidebarMenu[]; className?: string }) {
  const pathname = usePathname();
  const activeMenuItem = useMemo(() => {
    const newList: MenuItem[] = [];
    menus.forEach((menuItem) => {
      const menu = menuItem.items ?? [];
      menu.forEach((item) => {
        const child = item.child ?? [];
        if (pathname.startsWith(item.href) && pathname.includes(item.href) && !item.isFavorite) {
          newList.push(item);
        }
        if (child && child.length > 0) {
          child.forEach((cItem) => {
            if (
              pathname.startsWith(item.href) &&
              pathname.includes(cItem.href) &&
              !item.isFavorite
            ) {
              newList.push({ ...cItem, parent: item });
            }
          });
        }
      });
    });
    return (newList ?? []).filter(Boolean).reduce((acc: MenuItem | null, curr) => {
      if (!acc || (curr.href && curr.href.length > acc.href.length)) {
        return curr;
      }
      return acc;
    }, null);
  }, [pathname, menus]);

  return (
    <div className={clsx('mt-3 flex flex-col gap-5', className)}>
      {menus.map((menu, index) => {
        const items = menu.items ?? [];
        return (
          <div key={index}>
            <p className="p-2 text-dark opacity-45 text-sm">{menu.label}</p>
            <Menu active={activeMenuItem} menu={items} />
          </div>
        );
      })}
    </div>
  );
}

const Menu = ({
  menu,
  active,
  className
}: {
  menu: MenuItem[];
  active?: MenuItem | null;
  isSubMenu?: boolean;
  className?: string;
}) => {
  const [menuActive, setMenuActive] = useState<string[]>([]);
  const pathname = usePathname();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setMenuActiveByPathname(pathname, active), [pathname, active]);

  const onShowMenu = (item: MenuItem) => {
    const newMenuActive = [...menuActive];
    const indexItemValid = newMenuActive.findIndex((menu) => menu === item.label);
    if (indexItemValid !== -1) {
      newMenuActive.splice(indexItemValid, 1);
    } else {
      newMenuActive.push(item.label);
    }
    setMenuActive(newMenuActive);
  };

  const setMenuActiveByPathname = (pathname: string, active?: MenuItem | null) => {
    const subMenu = menu.filter((item) => {
      const child = item.child ?? [];
      const pathnameInChild = child.findIndex((childItem) => childItem.href === pathname);
      if (pathnameInChild !== -1) return item;
    });
    const newMenuActive = subMenu.map((item) => item.label);
    if (active && active.parent) {
      newMenuActive.push(active?.parent?.label);
    }
    setMenuActive((items) => mergeArrays(items, newMenuActive));
  };

  const mergeArrays = (oldArray: string[], newArray: string[]) => {
    const validItems = oldArray.filter(
      (item) => item !== null && item !== undefined && !newArray.includes(item)
    );
    return validItems.concat(newArray);
  };

  return (
    <div className={clsx('mt-1 flex flex-col gap-1', className)}>
      {menu.map((item, index) => {
        const child = item.child ?? [];
        return (
          <div key={index}>
            <div
              className={clsx('ease-linear transition-colors p-2', {
                'bg-neon rounded-xl':
                  (pathname === item.href || active?.href === item.href) && !item.isFavorite
              })}
            >
              <MenuItem
                item={item}
                child={child}
                menuActive={menuActive}
                onClick={() => onShowMenu(item)}
              />
            </div>
            {/* submenu */}
            {child && child.length > 0 ? (
              <Menu
                menu={child}
                isSubMenu
                active={active}
                className={clsx('transition-all ease-linear', {
                  hidden: !menuActive.includes(item.label)
                })}
              />
            ) : (
              ''
            )}
          </div>
        );
      })}
    </div>
  );
};

const MenuItem = ({
  item,
  child,
  menuActive,
  onClick
}: {
  item: MenuItem;
  child: MenuItem[];
  menuActive: string[];
  onClick: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): any => {
  return (
    <MenuItemWrap href={item.href} haveChild={child && child.length > 0} onClick={onClick}>
      {/* dist */}
      {item.isFavorite && (
        <div className="flex items-center justify-center w-4 h-4">
          <span className="w-[6px] h-[6px] bg-dark opacity-25 rounded-full"></span>
        </div>
      )}

      {/* icon view */}
      {!item.isFavorite && (
        <div className="flex items-center gap-[2px]">
          {/* arrow */}
          <div className="w-4 h-4">
            {child && child.length > 0 && (
              <RenderIcon
                strokeWidth={2}
                className={clsx('!w-4 !h-4 text-dark opacity-25 transition-all ease-linear', {
                  'rotate-90': menuActive.includes(item.label)
                })}
                name="chevron-right"
              />
            )}
          </div>

          {/* main icon */}
          <div className="w-5 h-5">
            {item.icon && <RenderIcon className="!w-5 !h-5" name={item.icon} />}
          </div>
        </div>
      )}

      <span>{item.label}</span>
    </MenuItemWrap>
  );
};

const MenuItemWrap = ({
  children,
  haveChild,
  href,
  onClick
}: {
  children: ReactNode;
  haveChild: boolean;
  href?: string;
  onClick?: () => void;
}) => {
  if (haveChild)
    return (
      <div onClick={onClick} className="flex items-center gap-2 text-sm cursor-pointer">
        {children}
      </div>
    );
  return (
    <Link href={href} className="flex items-center gap-2 text-sm cursor-pointer">
      {children}
    </Link>
  );
};
