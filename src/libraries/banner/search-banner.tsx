'use client';
import { City } from '@/configs/graphql/generated';
import useAddress from '@/hooks/redux/address/useAddress';
import useJobCategories from '@/hooks/redux/job-category/useJobCategories';
import { validationCustoms } from '@/utils/helpers/validation';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import * as Yup from 'yup';
import { Button, InputForm, SelectAsync, SelectForm } from '../common';

const SearchBanner = ({ className }: { className?: string }) => {
  const t = useTranslations();
  const { options: jobCategories, loading: loadingJobCategories } = useJobCategories();
  const {
    options: addressOptions,
    loading: addressLoading,
    getAddress,
    convertToOptions
  } = useAddress();

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

  const filterAddress = async (searchValue?: string) => {
    if (!searchValue || searchValue.length <= 0) return;
    const res = await getAddress({
      searchValue: searchValue,
      pagination: { limit: 30, page: 1 }
    });
    const options = convertToOptions((res?.all_address.data ?? []) as City[]);
    return options;
  };

  return (
    <div
      className={clsx(
        'mx-auto mt-12 flex min-h-16 items-center gap-6 rounded-4xl p-3.5 bg-white',
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
            <Form className="flex items-center gap-6 w-full">
              <div className="flex-1">
                <Field
                  name="searchKey"
                  component={InputForm}
                  placeholder={t('placeholder.enter', {
                    label: t('common.keyword').toLowerCase()
                  })}
                  iconLeft="search"
                />
              </div>

              <div className="w-[1px] h-6 bg-gray-100" />

              <div className="w-[282px]">
                <Field
                  name="categories"
                  component={SelectForm}
                  loading={loadingJobCategories}
                  options={jobCategories}
                  isMulti={true}
                  placeholder="Job Category"
                />
              </div>

              <div className="w-[1px] h-6 bg-gray-100" />

              <div className="w-[282px]">
                <Field
                  name="location"
                  component={SelectAsync}
                  loading={addressLoading}
                  filterOptions={filterAddress}
                  defaultOptions={addressOptions}
                  placeholder="All locations"
                />
              </div>

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
