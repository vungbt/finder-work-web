'use client';
import { RouterPath } from '@/constants/router-path';
import useViewRole from '@/hooks/redux/view-role/useViewRole';
import { Button, Logo } from '@/libraries/common';
import { Link } from '@/utils/navigation';
import { DrawerMenu, NavigationMain } from './navigation';
import useScreen from '@/hooks/themes/useScreen';
import { useMemo } from 'react';
import { UserRole } from '@/configs/graphql/generated';

export type NavigationItem = { title: string; url: string; isLine?: boolean; showInLg?: boolean };
type HeaderMainLayoutProps = {
  navigation: NavigationItem[];
  labelButton: string;
};

export function HeaderMainLayout({ navigation, labelButton }: HeaderMainLayoutProps) {
  const { setViewRole, viewRole } = useViewRole();
  const { sizes } = useScreen();
  const navItems = useMemo(() => {
    const newNavigationItem = [...navigation];
    if (sizes.md && !sizes.xl) return newNavigationItem.filter((nav) => nav.showInLg);
    return newNavigationItem;
  }, [sizes, navigation]);
  const navDrawer = useMemo(() => {
    const newNavigationItem = [...navigation];
    if (sizes.md && !sizes.xl) return newNavigationItem.filter((nav) => !nav.showInLg);
    return newNavigationItem;
  }, [sizes, navigation]);

  return (
    <div
      suppressHydrationWarning
      className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between px-8 py-4 md:px-12 md:py-6">
      <Link href={RouterPath.Home} className="z-[51]">
        <Logo type={sizes.sm ? 'default' : 'square'} />
      </Link>

      {/** shadow navigation */}
      <input hidden type="checkbox" id="navigation-checkbox" className="lg:hidden" />

      <div className="navbar flex items-center gap-6">
        <NavigationMain items={navItems} />
        <DrawerMenu items={navDrawer} />
        <label
          htmlFor="navigation-checkbox"
          className="overlay invisible fixed bottom-0 left-0 right-0 top-0 z-[40] h-screen bg-dark opacity-0 transition-all ease-linear xl:hidden"></label>
        <Button
          onClick={() =>
            setViewRole(viewRole === UserRole.Employee ? UserRole.Employer : UserRole.Employee)
          }
          label={labelButton}
          styleType="neon"
          iconRight="arrow-right"
          className="z-[51] hidden sm:flex"
        />
      </div>
    </div>
  );
}
