import Banner from '@/libraries/banner';
import { useTranslations } from 'next-intl';
import React, { Fragment } from 'react';

export default function EmployeePage() {
  const t = useTranslations();
  return (
    <div>
      <Banner
        type="employee"
        title={t('banner.stepIntoSuccess')}
        tags={['UI/UX Designer', 'Netflix', 'IT', '', 'Sale', 'Marketing']}
      />
    </div>
  );
}
