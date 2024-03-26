import { UserRole } from '@/configs/graphql/generated';
import { RouterPath } from '@/constants/router-path';
import { redirect } from '@/utils/navigation';
import { getSessionSS } from '@/utils/session';
import { ReactNode } from 'react';

export default async function PortalAdminLayout({ children }: { children: ReactNode }) {
  const session = await getSessionSS();
  if (session?.userRole !== UserRole.Admin) redirect(RouterPath.Home);
  return <div>{children}</div>;
}
