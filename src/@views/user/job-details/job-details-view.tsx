'use client';
import { JobResultUtils } from '@/@handles/job/job-utils';
import { ResumeUtils } from '@/@handles/resume/resume.utils';
import { Job } from '@/configs/graphql/generated';
import { FallbackImage } from '@/constants/common';
import { Button } from '@/libraries/common';
import { ModalApplyResume } from '@/libraries/common/modal/modal-apply';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type JobDetailViewProps = {
  job: Job;
};

const JobDetailsView: React.FC<JobDetailViewProps> = ({ job }) => {
  const {
    isOpenApplyModal,
    openApplyModal,
    onCloseApplyModal,
    data,
    onApplyJob,
    loadingApply,
    resumeApply,
    onCloseConfirmApply,
    confirmApplyJob
  } = ResumeUtils();
  const { mapSalaryRangeToLabel, mapJobTypeToLabel, mapJobLevelToLabel } = JobResultUtils();
  const t = useTranslations();
  return (
    <div className="flex gap-6">
      <div className="w-8/12">
        <h2 className="font-bold">{job?.jobTitle?.name}</h2>
        <div
          className="w-10/12 mt-10"
          dangerouslySetInnerHTML={{ __html: job?.description || '' }}
        />
      </div>
      <div>
        <div className="bg-gray-200 p-4 rounded-2xl w-full">
          <div className="flex gap-5 w-full items-center">
            <Link href="/" className="w-fit h-fit block">
              <Image
                width={56}
                height={56}
                alt="post-author"
                src={job.company?.avatar?.url ?? FallbackImage.avatarUrl}
                className="rounded-full"
              />
            </Link>
            <h2 className="text-sm font-bold">{job.company?.name}</h2>
          </div>
          <div className="flex gap-2 mt-4">
            <h2 className="font-medium text-sm">Location: {job.address?.name}</h2>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              className="w-full !justify-center"
              styleType="neon"
              type="submit"
              label="Apply"
              onClick={openApplyModal}
            />
          </div>
        </div>
        <div className="bg-gray-200 p-4 rounded-2xl w-full mt-10">
          <h2 className="font-bold mt-4">
            {t('common.jobCategory')}: {job.jobCategory?.name}
          </h2>
          <div className="mt-4">
            Address: {job.addressDetail} - {job.address?.name} - {job.address?.countryName}
          </div>
          <div className="mt-4">
            {t('common.level')}: {mapJobLevelToLabel(job.level)}
          </div>
          <div className="mt-4">
            {t('common.numberOfRecruits')}: {job.numberOfRecruits}
          </div>

          <div className="mt-4 flex-1 flex ">
            <div>{mapSalaryRangeToLabel(job.salary)}</div>
            {job.salary === 'range' && `: ${job.minSalary} - ${job.maxSalary}`}
            {job.salary === 'peak' && `: ${job.maxSalary}`}
            {job.salary === 'begin' && `: ${job.minSalary}`}
          </div>
          <div className="mt-4">
            {t('common.jobType')}: {mapJobTypeToLabel(job.type)}
          </div>
        </div>
      </div>

      <ModalApplyResume
        isOpen={isOpenApplyModal}
        onClose={onCloseApplyModal}
        resume={data}
        job={job}
        onApplyJob={onApplyJob}
        isLoading={loadingApply}
        resumeApply={resumeApply}
        confirmApplyJob={confirmApplyJob}
        onCloseConfirmApply={onCloseConfirmApply}
      />
    </div>
  );
};

export default JobDetailsView;
