'use client';
import useViewRole from '@/hooks/redux/view-role/useViewRole';
import { ERole } from '@/types';
import { Fragment, ReactNode } from 'react';
import { FooterMainLayout, HeaderMainLayout, NavigationItem } from '.';
import { useTranslations } from 'next-intl';

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

  const pageView = viewRole === ERole.EMPLOYEE ? employee : employer;
  const labelButton =
    viewRole === ERole.EMPLOYEE
      ? t('for', { label: t('jobSeekers') })
      : t('for', { label: t('employers') });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = (header.navigation as any)[`${viewRole}`];

  return (
    <Fragment>
      <HeaderMainLayout navigation={navigation} labelButton={labelButton} />
      {pageView}
      <FooterMainLayout />
    </Fragment>
  );
}
