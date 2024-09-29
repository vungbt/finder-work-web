/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';

const select = (t: any, label: string) => {
  const selectValidationSchema = Yup.object()
    .shape({
      value: Yup.string().required(t('validation.optionRequired')),
      label: Yup.string().required(t('validation.optionRequired'))
    })
    .nullable();

  const customSelectValidationSchema = Yup.lazy((value) => {
    if (value === null || typeof value === 'undefined') {
      return Yup.string().required(t('validation.select', { label: label.toLowerCase() }));
    } else {
      return selectValidationSchema;
    }
  });

  return customSelectValidationSchema;
};

const selectMultiple = (t: any, label: string, params?: { max?: number; min?: number }) => {
  const max = params?.max;
  const min = params?.min;
  let validationSchema = Yup.array().of(select(t, label));
  if (min && min > 0) {
    validationSchema = validationSchema.min(min, t('validation.selectMin', { label, number: min }));
  }
  if (max && max > 0) {
    validationSchema = validationSchema.max(max, t('validation.selectMax', { label, number: max }));
  }
  return validationSchema;
};

const upload = (t: any, label: string) => {
  const thumbnailSchema = Yup.object()
    .shape({
      id: Yup.string().required(t('validation.select', { label: label.toLowerCase() })),
      url: Yup.string().required(t('validation.select', { label: label.toLowerCase() }))
    })
    .nullable();

  const customThumbnailSchema = Yup.lazy((value) => {
    if (value === null || typeof value === 'undefined') {
      return Yup.string().required(t('validation.select', { label: label.toLowerCase() }));
    } else {
      return thumbnailSchema;
    }
  });

  return customThumbnailSchema;
};

const uploadMultiple = (t: any, label: string, params?: { max?: number; min?: number }) => {
  const max = params?.max;
  const min = params?.min;
  let validationSchema = Yup.array().of(upload(t, label));
  if (min && min > 0) {
    validationSchema = validationSchema.min(min, t('validation.fileMin', { label, number: min }));
  }
  if (max && max > 0) {
    validationSchema = validationSchema.max(max, t('validation.fileMax', { label, number: max }));
  }
  return validationSchema;
};

export const validationCustoms = {
  select,
  selectMultiple,
  upload,
  uploadMultiple
};
