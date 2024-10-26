import { WorkingSkillForm } from '@/@handles/skill';
import { Skill, SkillCreateInput } from '@/configs/graphql/generated';
import { Button, InputForm, ModalWrap, ModalWrapProps } from '@/libraries/common';
import { IconName, RenderIcon } from '@/libraries/icons';
import { Field, Form, Formik, FormikProps } from 'formik';
import { useTranslations } from 'next-intl';
import { RefObject } from 'react';
import * as Yup from 'yup';

type SkillModelProps = Omit<ModalWrapProps, 'children'> & {
  onCancel?: () => void;
  onSubmit: (values: SkillCreateInput) => void;
  cancelIcon?: IconName;
  isOpen: boolean;
  data?: Skill;
  formikRef: RefObject<FormikProps<WorkingSkillForm>>;
  loading: boolean;
};
export function ModalSKill({
  onClose,
  isOpen,
  onSubmit,
  data,
  formikRef,
  loading
}: SkillModelProps) {
  const t = useTranslations();
  const initialValues = {
    content: data?.content ?? ''
  };

  const validationSchema = Yup.object({
    content: Yup.string().required(
      t('validation.required', { label: t('form.content').toLowerCase() })
    )
  });

  return (
    <ModalWrap isOpen={isOpen} onClose={onClose} className="max-w-[500px]">
      <div className="flex flex-col">
        {/* header */}
        <div className="w-full flex justify-end pb-1">
          <button onClick={onClose}>
            <RenderIcon className="!w-5 !h-5 text-text-secondary" name="close" />
          </button>
        </div>
        {/* main content */}
        <div className="w-full flex flex-col justify-start">
          <div className="mb-5 font-bold">
            {data ? t('header.updateSkill') : t('header.addNewSkill')}
          </div>
        </div>
        <div>
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {() => {
              return (
                <Form>
                  <Field
                    isRequired
                    name="content"
                    component={InputForm}
                    placeholder={t('form.contentInput')}
                  />
                  <div>
                    <div className="flex justify-center items-center gap-3 mt-5">
                      <Button
                        className="mt-5 w-fit min-w-48 !justify-center"
                        styleType="danger"
                        onClick={onClose}
                        label={t('cancel')}
                      />
                      <Button
                        className="mt-5 w-fit min-w-48 !justify-center"
                        styleType="default"
                        type="submit"
                        label={data ? t('common.update') : t('common.create')}
                        isLoading={loading}
                      />
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </ModalWrap>
  );
}
