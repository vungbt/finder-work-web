'use client';
import { UserRole } from '@/configs/graphql/generated';
import useViewRole from '@/hooks/redux/view-role/useViewRole';
import { HydrateWrapper } from '@/libraries/common';
import { ReactNode } from 'react';
import { LeftContentSignAuth } from '.';

type MainLayoutProps = {
  employee: ReactNode;
  employer: ReactNode;
};

export function AuthSignLayout({ employee, employer }: MainLayoutProps) {
  const { viewRole } = useViewRole();
  const isEmployee = viewRole === UserRole.Employee;
  const pageView = isEmployee ? employee : employer;
  return (
    <HydrateWrapper>
      <div className="flex min-h-screen max-h-screen overflow-hidden">
        {pageView}
        <LeftContentSignAuth
          isEmployee={isEmployee}
          thumbUrl={isEmployee ? '/background/auth-employee.jpg' : '/background/auth-employer.webp'}
        />
      </div>
    </HydrateWrapper>
  );
}
