import CompanyProfileDetailView from '@/@views/user/company/company-view';
import { Company } from '@/configs/graphql/generated';
import { getDetailCompany } from '@/utils/server-transfers/company';
import { notFound } from 'next/navigation';

export default async function CompanyAdd({ params }: { params: { id: string } }) {
  if (!params.id || params.id.length <= 0) return notFound();
  const companyDetail = await getDetailCompany({ where: { id: { equals: params.id } } });
  if (!companyDetail) return notFound();
  return <CompanyProfileDetailView data={companyDetail as Company} />;
}
