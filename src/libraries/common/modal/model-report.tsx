import React, { ReactNode, useMemo } from 'react';
import { ModalWrap, ModalWrapProps } from './modal-wrap';
import { Button } from '../buttons';
import { IconName, RenderIcon } from '@/libraries/icons';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import { TextareaForm } from '../inputs';
import * as Yup from 'yup';
import { RadioGroup } from '../radio';
import { EReason, IOptItem } from '@/types';
import { PostReportReasons } from '@/constants/common';

type ModalReportProps = Omit<ModalWrapProps, 'children'> & {
  onCancel?: () => void;
  cancelLabel?: string;
  cancelIcon?: IconName;
  classNameCancel?: string;

  onSubmit: (values: { reason: string; message?: string }) => void;
  submitLabel?: string;
  submitIcon?: IconName;
  isLoading?: boolean;
  classNameSubmit?: string;

  message?: string;
  warning?: string;

  actions?: ReactNode;
  iconMain?: IconName;
  options?: IOptItem[];
};
export function ModalReport({
  onCancel,
  cancelIcon,
  cancelLabel,
  classNameCancel,
  onSubmit,
  submitIcon,
  submitLabel,
  classNameSubmit,
  onClose,
  actions,
  isLoading,
  isOpen,
  options = PostReportReasons
}: ModalReportProps) {
  const t = useTranslations();

  const validationSchema = Yup.object({
    reason: Yup.string().required(
      t('validation.select', { label: t('form.reason').toLowerCase() })
    ),
    message: Yup.string().when('reason', (reason, schema) => {
      const reasonValue = (reason ?? [])[0];
      return reasonValue === EReason.OTHER
        ? schema.required(t('validation.required', { label: t('form.message').toLowerCase() }))
        : schema;
    })
  });

  const initialValues = {
    reason: '',
    message: ''
  };

  const renderActions = useMemo(() => {
    if (actions) return actions;
    return (
      <div className="flex justify-center items-center gap-3 mt-5">
        <Button
          onClick={onCancel}
          label={cancelLabel ?? t('cancel')}
          iconLeft={cancelIcon}
          size="middle"
          type="button"
          className={classNameCancel}
        />
        <Button
          label={submitLabel ?? t('submit')}
          iconLeft={submitIcon}
          className={clsx(classNameSubmit)}
          styleType="danger"
          size="middle"
          type="submit"
          isLoading={isLoading}
        />
      </div>
    );
  }, [
    actions,
    t,
    isLoading,
    cancelIcon,
    cancelLabel,
    submitIcon,
    submitLabel,
    classNameCancel,
    classNameSubmit,
    onCancel
  ]);

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
        <div className="w-full flex items-center flex-col justify-center">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values }) => {
              return (
                <Form className="w-full">
                  <div className="flex flex-col gap-5">
                    <div>
                      <Field
                        name="reason"
                        component={RadioGroup}
                        options={options.map((item) => ({
                          label: t(item.label),
                          value: item.value
                        }))}
                        size="small"
                        layout="vertical"
                      />
                    </div>
                    <div>
                      <Field
                        isRequired={values.reason === EReason.OTHER}
                        label={`${t('form.message')}:`}
                        name="message"
                        component={TextareaForm}
                        placeholder={t('placeholder.enter', {
                          label: t('common.specify').toLowerCase()
                        })}
                        characters={150}
                      />
                    </div>
                  </div>

                  {/* actions */}
                  {renderActions}
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </ModalWrap>
  );
}
