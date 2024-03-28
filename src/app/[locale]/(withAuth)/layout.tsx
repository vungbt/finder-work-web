import { RouterPath } from '@/constants/router-path';
import { HydrateWrapper } from '@/libraries/common';
import PortalInit from '@/libraries/portal-init';
import { redirect } from '@/utils/navigation';
import { getSessionSS } from '@/utils/session';
import React, { ReactNode } from 'react';

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const session = await getSessionSS();
  if (!session || !session?.token) return redirect(RouterPath.Login);
  return (
    <HydrateWrapper>
      <PortalInit />
      {children}
    </HydrateWrapper>
  );
}
