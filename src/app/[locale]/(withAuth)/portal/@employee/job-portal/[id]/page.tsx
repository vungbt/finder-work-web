import JobDetailsView from '@/@views/user/job-details/job-details-view';
import { Job } from '@/configs/graphql/generated';
import { getDetailJob } from '@/utils/server-transfers';
import { notFound } from 'next/navigation';

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
  if (!params.id || params.id.length <= 0) return notFound();

  const jobDetails = await getDetailJob({ where: { id: { equals: params.id } } });
  if (!jobDetails) return notFound();
  return <JobDetailsView job={jobDetails as Job} />;
}
