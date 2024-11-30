'use client';
import { RouterPath } from '@/constants/router-path';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

export default function CompanyLayout(props: { children: ReactNode }) {
  const t = useTranslations();
  const tabOptions = [
    { label: t('common.profile'), href: RouterPath.PORTAL_COMPANY_PROFILE },
    { label: t('common.jobs'), href: RouterPath.PORTAL_COMPANY_JOBS }
  ];
  const [tabActive, setTabActive] = useState(tabOptions[0]);

  return (
    <div>
      <div className="flex items-center gap-4 text-sm">
        {tabOptions.map((item) => (
          <Link
            key={item.href}
            onClick={() => setTabActive(item)}
            href={item.href}
            aria-label={item.label}
            className={clsx('tab', {
              tab__active: tabActive && item.href === tabActive.href
            })}
          >
            {item.label}
          </Link>
        ))}
      </div>
      {props.children}
    </div>
  );
}
