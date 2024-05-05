import { UserRole } from '@/configs/graphql/generated';
import { RouterPath } from '@/constants/router-path';
import { PortalAdminLayout } from '@/libraries/layouts/portal';
import { redirect } from '@/utils/navigation';
import { getPortalLayoutSetting } from '@/utils/server-transfers';
import { getSessionSS } from '@/utils/session';
import { ReactNode } from 'react';

export default async function PortalAdminPageLayout({ children }: { children: ReactNode }) {
  const session = await getSessionSS();
  if (session?.userRole !== UserRole.Admin && session?.userRole !== UserRole.SuperAdmin)
    redirect(RouterPath.Home);

  const setting = await getPortalLayoutSetting();
  return <PortalAdminLayout menus={setting.menus}>{children}</PortalAdminLayout>;
}
