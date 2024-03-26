'use client';
import useViewRole from '@/hooks/redux/view-role/useViewRole';
import { HydrateWrapper } from '@/libraries/common';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';
import { FooterMainLayout, HeaderMainLayout, NavigationItem } from '.';
import { UserRole } from '@/configs/graphql/generated';

type MainLayoutProps = {
  employee: ReactNode;
  employer: ReactNode;
  header: {
    navigation: {
      employee: NavigationItem[];
      employer: NavigationItem[];
    };
  };
};

export function MainLayout({ employee, employer, header }: MainLayoutProps) {
  const { viewRole } = useViewRole();
  const t = useTranslations();

  const pageView = viewRole === UserRole.Employee ? employee : employer;
  const labelButton =
    viewRole === UserRole.Employee
      ? t('for', { label: t('employers') })
      : t('for', { label: t('jobSeekers') });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = (header.navigation as any)[`${viewRole}`];

  return (
    <HydrateWrapper>
      <HeaderMainLayout navigation={navigation} labelButton={labelButton} />
      {pageView}
      <FooterMainLayout />
    </HydrateWrapper>
  );
}
