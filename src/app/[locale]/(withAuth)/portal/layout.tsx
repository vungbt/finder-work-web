import { UserRole } from '@/configs/graphql/generated';
import { RouterPath } from '@/constants/router-path';
import PortalLayout from '@/libraries/layouts/portal/portal.layout';
import { redirect } from '@/utils/navigation';
import { getSessionSS } from '@/utils/session';
import React, { ReactNode } from 'react';

export default async function PortalPageLayout(props: {
  employee: ReactNode;
  employer: ReactNode;
}) {
  const session = await getSessionSS();
  if (session?.userRole === UserRole.Admin) return redirect(RouterPath.Home);

  return (
    <PortalLayout
      pageView={session?.userRole === UserRole.Employee ? props.employee : props.employer}
    />
  );
}
