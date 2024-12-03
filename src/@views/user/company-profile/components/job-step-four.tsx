import { AdminSkillManagementUtils } from '@/@handles/skill/skill.utils';
import {
  BackButton,
  Button,
  InputForm,
  SelectAsyncCreatable,
  SelectForm,
  Steps
} from '@/libraries/common';
import { Field, FieldArray, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Collapse } from '../../../../libraries/common/collapse/collapse';
import { CreateResume, ICreateResumeDataForm } from '../providers';
import { JobResultUtils } from '@/@handles/job/job-utils';

export default function ProfileForm() {
  const t = useTranslations();
  const {
    actions,
    state: { stepIndex, formData }
  } = CreateResume();

  const { jobTagOptions, filterTags } = JobResultUtils();

  const initialValues: ICreateResumeDataForm = {
    ...formData,
    skills: formData.skills || [],
    projects: formData?.projects || [
      {
        projectName: '',
        description: ''
      }
    ],
    socials: formData.socials || {
      website: '',
      linkedIn: ''
    },
    languages: formData?.languages || [
      {
        language: '',
        proficiency: ''
      }
    ],
    personalDetail: formData.personalDetail || {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  };

  const onHandleSubmit = async (values: ICreateResumeDataForm) => {
    actions.nextStep(values);
    actions.setWorkExperiences(values);
  };

  return (
    <div className="w-3/4 ms-6">
      {' '}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0, 0.71, 0.2, 1.01]
        }}
      >
        {/** step active */}
        <Steps
          steps={5}
          excludeSteps={[4]}
          className="my-10"
          active={stepIndex}
          onChangeStep={(stepActive) => actions.changeStep(stepActive)}
        />
        <Formik initialValues={initialValues} onSubmit={onHandleSubmit}>
          {({ values }) => (
            <Form>
              <Field
                label={t('common.careerTags')}
                isRequired={true}
                name="tags"
                component={SelectAsyncCreatable}
                defaultOptions={jobTagOptions}
                filterOptions={filterTags}
                isMulti={true}
                isNumber={true}
              />
              <Field
                label={t('form.numberOfRecruits')}
                name="numberOfRecruits"
                placeholder={t('form.numberOfRecruits')}
                component={InputForm}
              />

              <div className="flex flex-1 justify-between my-10">
                <BackButton
                  onClick={() => {
                    actions.previousStep(values);
                  }}
                />
                <Button
                  onClick={() => {
                    // handleOpenSelectTemplate();
                    actions.nextStep(values);
                  }}
                  styleType="info"
                  label={t('common.next')}
                />
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
      {/* <ModalWrap
        isOpen={isOpenSelectTemplate}
        onClose={handleCloseSelectTemplate}
        className="min-w-[1000px]">
        <div className="flex flex-col">
          <div className="flex flex-1 pb-1 items-center justify-between">
            <div className="flex items-center">
              <IconViewSize isLoading={loading} size="middle" />
            </div>
            <div className="flex justify-end">
              <button onClick={handleCloseSelectTemplate}>
                <RenderIcon className="!w-5 !h-5 text-text-secondary" name="close" />
              </button>
            </div>
          </div>

          <div className="w-full flex items-center flex-col justify-center">
            <div className="grid grid-cols-5 gap-4">
              {templates.map(
                (template: { id: number; name: string; src: string; templateName: string }) => (
                  <div key={template.id} className="max-w-56 grid-item">
                    <TemplateCard
                      name={template.name}
                      image={template.src}
                      handlePreview={() => handlePreview(formData, template.templateName, false)}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </ModalWrap>
      <ModalWrap
        isOpen={isOpenPreview}
        onClose={handleCloseSelectTemplate}
        className="min-w-[1000px]">
        <div className="flex flex-col">
          <div className="w-full flex justify-end pb-1">
            <button onClick={handleCloseSelectTemplate}>
              <RenderIcon className="!w-5 !h-5 text-text-secondary" name="close" />
            </button>
          </div>
          <div className="flex items-center">
            <Image src={previewUrl} alt={`preview`} width={500} height={1000} />
          </div>
          <div className="flex items-end justify-end mt-10">
            <Button
              label="Download"
              styleType="info"
              onClick={() => {
                handlePreview(formData, templateName, true);
              }}
            />
          </div>
        </div>
      </ModalWrap> */}
    </div>
  );
}
