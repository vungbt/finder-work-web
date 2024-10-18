'use client';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import * as Yup from 'yup';
import { RenderIcon } from '../icons';
import clsx from 'clsx';
import { FallbackImage } from '@/constants/common';

type CommentInputProps = {
  className?: string;
  id?: string;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  avatarUrl?: string;
  onSubmit: (
    values: { content: string },
    { resetForm }: FormikHelpers<{ content: string }>
  ) => void;
};

export function CommentInput({
  id,
  placeholder,
  onSubmit,
  loading,
  disabled,
  className,
  avatarUrl
}: CommentInputProps) {
  const t = useTranslations();
  const validationSchema = Yup.object({
    content: Yup.string()
      .required(t('validation.required', { label: t('form.verificationCode').toLowerCase() }))
      .trim()
  });

  const initialValues = {
    content: ''
  };

  // Handle keypress event for Enter and Shift + Enter functionality
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    submitForm: () => void
  ) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        // Allow newline if Shift + Enter
        return;
      } else {
        // Prevent default enter key action and submit the form
        event.preventDefault();
        submitForm(); // Call form submission
      }
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ submitForm, values, handleChange, handleBlur }) => (
        <Form>
          <div className={clsx('flex gap-[6px] items-start w-full', className)}>
            <Image
              width={36}
              height={36}
              className="w-9 h-9 rounded-full min-w-8 aspect-1 border border-solid shadow-sm"
              alt="avatar"
              src={avatarUrl ?? FallbackImage.avatarUrl}
            />
            <Field name="content">
              {({ field }: FieldProps) => (
                <div className="relative w-full">
                  <TextareaAutosize
                    {...field}
                    value={values.content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) =>
                      handleKeyDown(e, submitForm)
                    }
                    id={id}
                    disabled={disabled || loading}
                    className="w-full outline-none transition-all ease-linear bg-gray-100 rounded-2xl px-4 py-2 resize-none text-sm"
                    placeholder={
                      placeholder ??
                      t('placeholder.enter', { label: t('form.content').toLowerCase() })
                    }
                    minRows={2}
                  />

                  {/* loading */}
                  {loading && (
                    <RenderIcon name="loading" className="!w-3 !h-3 absolute bottom-2 right-2" />
                  )}
                </div>
              )}
            </Field>

            <button type="submit" hidden />
          </div>
        </Form>
      )}
    </Formik>
  );
}
