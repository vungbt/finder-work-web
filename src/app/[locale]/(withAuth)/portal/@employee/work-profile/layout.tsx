'use client';
import { RouterPath } from '@/constants/router-path';
import { TabItem } from '@/libraries/common';
import { Link, usePathname } from '@/utils/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

export default function WorkProfileLayout({ children }: { children: ReactNode }) {
  const t = useTranslations();
  const menus: TabItem[] = [
    { label: t('common.profile'), value: RouterPath.PORTAL_WORK_PROFILE },
    { label: t('common.resumes'), value: RouterPath.PORTAL_WORK_PROFILE_RESUMES },
    { label: t('common.experiences'), value: RouterPath.PORTAL_WORK_PROFILE_EXPERIENCES },
    { label: t('common.projects'), value: RouterPath.PORTAL_WORK_PROFILE_PROJECTS },
    { label: t('common.skills'), value: RouterPath.PORTAL_WORK_PROFILE_SKILLS }
  ];
  const pathname = usePathname();
  return (
    <>
      <div className="flex items-center gap-4 text-sm">
        {menus.map((item) => {
          return (
            <span
              key={item.value}
              className={clsx('tab', {
                tab__active: pathname === item.value
              })}
            >
              <Link href={item.value}>{item.label}</Link>
            </span>
          );
        })}
      </div>
      <div className="bg-gray-200 p-6 rounded-2xl mt-5">{children}</div>
    </>
  );
}
