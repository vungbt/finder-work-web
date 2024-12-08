'use client';
import { CompanyUtils } from '@/@handles/company/company.ultis';
import { Company } from '@/configs/graphql/generated';
import { RouterPath } from '@/constants/router-path';
import { BackButton } from '@/libraries/common';
import { useRouter } from '@/utils/navigation';
import CompanyForm from './component/company-form';

export default function CompanyProfileDetailView({ data: companyDetail }: { data?: Company }) {
  const router = useRouter();

  const { onSubmit, formikRef, loading } = CompanyUtils();

  const onBack = () => {
    router.push(`${RouterPath.COMPANY_PROFILES}`);
  };

  return (
    <div>
      <BackButton onClick={onBack} />
      <CompanyForm
        data={companyDetail}
        onSubmit={onSubmit}
        isCreate={true}
        formikRef={formikRef}
        loading={loading}
      />
    </div>
  );
}
