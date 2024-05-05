import { UserRole } from '@/configs/graphql/generated';
import { RouterPath } from '@/constants/router-path';
import { AuthSignLayout } from '@/libraries/layouts/auth-sign';
import { redirect } from '@/utils/navigation';
import { getSessionSS } from '@/utils/session';
import { ReactNode } from 'react';

export default async function AuthPageLayout(props: { employee: ReactNode; employer: ReactNode }) {
  const session = await getSessionSS();
  if (session && session?.token)
    return redirect(
      session.userRole === UserRole.Admin || session.userRole === UserRole.SuperAdmin
        ? RouterPath.PORTAL_ADMIN
        : RouterPath.PORTAL
    );
  return <AuthSignLayout {...props} />;
}
