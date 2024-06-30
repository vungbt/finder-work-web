'use client';
import { Tab, TabItem } from '@/libraries/common';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

export default function CompaniesPage() {
  const t = useTranslations();
  const tabOptions = [
    { label: t('common.companies'), value: 'companies' },
    { label: t('common.jobs'), value: 'jobs' }
  ];
  const [tabActive, setTabActive] = useState<TabItem>(tabOptions[0]);

  return (
    <div>
      <Tab options={tabOptions} active={tabActive} onChange={(item) => setTabActive(item)} />
    </div>
  );
}
