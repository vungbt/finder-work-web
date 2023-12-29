import { RouterPath } from '@/constants/router-path';
import useViewRole from '@/hooks/redux/view-role/useViewRole';
import { Button } from '@/libraries/common';
import { ERole } from '@/types';
import { Link } from '@/utils/navigation';
import Image from 'next/image';

export type NavigationItem = { title: string; url: string };
type HeaderMainLayoutProps = {
  navigation: NavigationItem[];
  labelButton: string;
};

export function HeaderMainLayout({ navigation, labelButton }: HeaderMainLayoutProps) {
  const { setViewRole, viewRole } = useViewRole();
  return (
    <div className="flex items-center justify-between px-12 py-6">
      <Link href={RouterPath.Home}>
        <Image src="/assets/logo.png" alt="logo" width={168} height={48} />
      </Link>

      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-6">
          {navigation.map((nav) => (
            <Link className="px-4 py-3 font-semibold" key={nav.url} href={nav.url}>
              {nav.title}
            </Link>
          ))}
        </nav>
        <Button
          onClick={() => setViewRole(viewRole === ERole.EMPLOYEE ? ERole.EMPLOYER : ERole.EMPLOYEE)}
          label={labelButton}
        />
      </div>
    </div>
  );
}
