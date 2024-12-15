'use client';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { validationCustoms } from '@/utils/helpers/validation';
import { Button, InputForm, SelectForm } from '../common';

const SearchBanner = ({ className }: { className?: string }) => {
  const t = useTranslations();

  const validationSchema = Yup.object({
    searchKey: Yup.string(),
    categories: validationCustoms.selectMultiple(t, t('form.categories'))
  });

  const initialValues = {
    searchKey: '',
    categories: [],
    location: null
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSearch = (values: any) => console.log('values===>', values);

  return (
    <div
      className={clsx(
        'mx-auto mt-12 flex min-h-16 max-w-[90%] items-center gap-6 rounded-4xl bg-dark p-3.5',
        className
      )}
    >
      <Formik
        // innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSearch}
      >
        {() => {
          return (
            <Form className="flex items-end gap-6 w-full">
              <Field
                label={t('common.keyword')}
                isRequired
                name="searchKey"
                component={InputForm}
                placeholder={t('placeholder.enter', {
                  label: t('common.keyword').toLowerCase()
                })}
              />

              <Field
                label={t('common.categories')}
                isRequired={true}
                name="categories"
                component={SelectForm}
                options={[]}
                isMulti={true}
              />

              <Field
                label={t('common.location')}
                isRequired={true}
                name="location"
                component={SelectForm}
                options={[]}
              />

              <Button
                type="submit"
                styleType="neon"
                className="w-fit h-fit"
                label={t('common.search')}
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default SearchBanner;
