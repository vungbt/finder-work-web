import { BackButton, Button } from '@/libraries/common';
import { useTranslations } from 'next-intl';
import { useJob } from '../providers';
import { useApiClient } from '@/libraries/providers/graphql';
import { JobLevel, JobType } from '@/configs/graphql/generated';
import { toastError, toastSuccess } from '@/configs/toast';

export default function JobSubmit() {
  const t = useTranslations();
  const {
    actions,
    state: { formData }
  } = useJob();
  const { apiClient } = useApiClient();

  const submitJob = async () => {
    try {
      const res = await apiClient.createJob({
        data: {
          jobTitleName: formData.jobInformation?.jobTitleOpt?.label as string,
          tags: {
            connectOrCreate: formData.descriptionSkill?.tags?.map((tag) => ({
              where: { name: tag.label as string },
              create: { name: tag.label as string }
            }))
          },
          skillIds: formData.descriptionSkill?.skill.map((skill) => skill.value) as string[],
          address: {
            connect: { id: Number(formData.jobInformation?.address?.value) }
          },
          jobCategory: {
            connect: { id: formData.jobInformation?.jobCategory?.value as string }
          },
          company: {
            connect: {
              id: formData.company?.value as string
            }
          },
          addressDetail: formData.jobInformation?.addressDetail as string,
          description: formData.descriptionSkill?.description as string,
          level: formData.jobInformation?.level?.value as JobLevel,
          type: formData.jobInformation?.type?.value as JobType,
          salaryMetadata: {
            type: formData.jobInformation?.salary?.value,
            currencyUnit: formData.jobInformation?.currencyUnit?.value,
            min: Number(formData.jobInformation?.fromStartRange),
            max: Number(formData.jobInformation?.toEndRange)
          }
        }
      });
      if (res) {
        toastSuccess(t('noti.createSuccess'));
        actions.resetFormData();
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toastError((error as any)?.message);
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="flex flex-1 justify-between my-10">
        <BackButton onClick={() => actions.previousStep(formData)} />
        <Button
          className="w-fit min-w-48 !justify-center"
          type="submit"
          styleType="info"
          label={t('common.post')}
          onClick={submitJob}
        />
      </div>
    </div>
  );
}
