import { Button } from '@/libraries/common';
import { useTranslations } from 'next-intl';
import { CreateResume } from '../providers/job-company.provider';

export default function ResumeMain() {
  const t = useTranslations();
  const {
    actions,
    state: { formData }
  } = CreateResume();

  return (
    <div className="w-full h-screen">
      <div className="flex justify-end w-full">
        <Button
          className="w-fit min-w-48 !justify-center  mr-10 mt-10"
          type="submit"
          styleType="info"
          label={t('common.createJob')}
          onClick={() => actions.nextStep(formData)}
        />
      </div>
    </div>
  );
}
