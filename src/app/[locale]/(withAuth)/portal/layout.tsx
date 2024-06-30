import { UserRole } from '@/configs/graphql/generated';
import { RouterPath } from '@/constants/router-path';
import { PortalLayout } from '@/libraries/layouts/portal';
import { redirect } from '@/utils/navigation';
import { getPortalLayoutSetting } from '@/utils/server-transfers';
import { getSessionSS } from '@/utils/session';
import React, { ReactNode } from 'react';

export default async function PortalPageLayout(props: {
  employee: ReactNode;
  employer: ReactNode;
}) {
  const session = await getSessionSS();
  if (session?.userRole === UserRole.Admin) return redirect(RouterPath.Home);

  const setting = await getPortalLayoutSetting();
  return (
    <PortalLayout
      menus={setting.menus}
      pageView={session?.userRole === UserRole.Employee ? props.employee : props.employer}
    />
  );
}
