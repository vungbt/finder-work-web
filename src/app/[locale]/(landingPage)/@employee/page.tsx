'use client';
import { LandingPageEmployeeUtils } from '@/@handles/landing-page/employee.utils';
import Banner from '@/libraries/banner';
import { JobCard } from '@/libraries/common/cards/job.card';
import { useTranslations } from 'next-intl';

export default function EmployeePage() {
  const t = useTranslations();
  const { jobs } = LandingPageEmployeeUtils();
  console.log('jobs===>', jobs);
  return (
    <div>
      <Banner
        type="employee"
        title={t('banner.landYourDream')}
        subTitle={t('banner.builderYour')}
        tags={['UI/UX Designer', 'Netflix', 'IT', '', 'Sale', 'Marketing']}
      />

      {/* best job */}
      <div className="bg-gray-300">
        <div className="container">
          <h4 className="text-3xl font-tertiary capitalize leading-[48px] mt-5">
            {t('common.bestJobs')}
          </h4>

          {/* list hot job */}
          <div className="grid grid-cols-3 gap-5 mt-5">
            {jobs.map((item) => (
              <JobCard
                key={item.id}
                item={item}
                className="col-span-1"
                goToDetails={(item) => console.log('Go to detail==>', item)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
