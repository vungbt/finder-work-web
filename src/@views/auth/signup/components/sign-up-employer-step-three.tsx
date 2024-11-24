import useAddress from '@/hooks/redux/address/useAddress';
import useCompanyCommon from '@/hooks/redux/company/common/useCompanyCommon';
import useCompanies from '@/hooks/redux/company/list/useCompanies';
import useJobCategories from '@/hooks/redux/job-category/useJobCategories';
import {
  BackButton,
  Button,
  CheckboxGroup,
  SelectAsync,
  SelectAsyncCreatable,
  SelectForm,
  Steps,
  TextareaForm
} from '@/libraries/common';
import { validationCustoms } from '@/utils/helpers/validation';
import { Link } from '@/utils/navigation';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import * as Yup from 'yup';
import { IEmployerRegister, useSignUpEmployer } from '../providers';
import {
  AuthEmployerRegisterMutationVariables,
  City,
  Company,
  UserOnly,
  WorkPosition
} from '@/configs/graphql/generated';
import { RouterPath } from '@/constants/router-path';
import { useApiClient } from '@/libraries/providers/graphql';
import { toastSuccess } from '@/configs/toast';

export default function SignUpEmployerStepThree() {
  const t = useTranslations();
  const {
    actions,
    state: { stepIndex, formData }
  } = useSignUpEmployer();
  const [loading, setLoading] = useState(false);
  const { options: jobCategories, loading: loadingJobCategories } = useJobCategories();
  const { optCompanySizes, optCompanyTypes, loading: loadingCompanyCommon } = useCompanyCommon();
  const {
    options: addressOptions,
    loading: addressLoading,
    getAddress,
    convertToOptions
  } = useAddress();
  const { apiClient } = useApiClient();
  const { options: companies, loading: companyLoading, getCompanies } = useCompanies();
  const validationSchema = Yup.object({
    company: validationCustoms.select(t, 'company'),
    industries: validationCustoms.selectMultiple(t, t('common.industries'), { min: 1, max: 3 }),
    type: validationCustoms.select(t, 'type'),
    size: validationCustoms.select(t, 'size'),
    address: validationCustoms.select(t, 'address'),
    addressDetail: Yup.string().required(
      t('validation.required', { label: t('form.firstName').toLowerCase() })
    ),
    agreePolicy: Yup.array()
      .of(Yup.string().required(t('validation.required', { label: t('form.policy') })))
      .min(1, t('validation.required', { label: t('form.policy') }))
  });

  const initialValues = {
    company: formData.company,
    industries: formData.industries ?? [],
    type: formData.type ?? null,
    size: formData.size ?? null,
    address: formData.address ?? null,
    addressDetail: formData.addressDetail ?? '',
    agreePolicy: formData?.agreePolicy ?? []
  };

  // submit register new account
  const onHandleSubmit = async (values: IEmployerRegister) => {
    try {
      if (loading) return;
      setLoading(true);
      const company = values.company;
      const industries = values.industries ?? [];
      const addressValue = values.address;
      const params: AuthEmployerRegisterMutationVariables = {
        companyName: (company?.label as string) ?? '',
        companyId: !company?.__isNew__ ? company?.value : undefined,
        companySizeId: values.size?.value ?? '',
        companyTypeId: values.type?.value ?? '',
        industryIds: industries.map((item) => item.value),
        cityId: Number(addressValue?.value),
        addressDetail: values.addressDetail ?? '',
        firstName: formData?.firstName ?? '',
        lastName: formData?.lastName ?? '',
        workingPosition: formData.workingPosition?.value as WorkPosition,
        phoneNumber: formData.phoneNumber ?? '',
        email: formData.email ?? '',
        password: formData.password ?? ''
      };
      const res = await apiClient.authEmployerRegister(params);
      setLoading(false);
      actions.nextStep(values);
      const result = res?.auth_employer_register;
      if (result.id) {
        toastSuccess(t('noti.registerSuccess'));
        actions.setUserTemp(result as UserOnly);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const filterCompanies = async (searchValue?: string) => {
    if (!searchValue || searchValue.length <= 0) return;
    const res = await getCompanies({
      searchValue: searchValue,
      pagination: { limit: 20, page: 1 }
    });
    const options = ((res?.all_company.data ?? []) as Company[]).map((item) => ({
      label: item.name,
      value: item.id
    }));
    return options;
  };

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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.2,
        ease: [0, 0.71, 0.2, 1.01]
      }}
      className="mx-auto pb-10"
    >
      <BackButton onClick={() => actions.previousStep(formData)} />
      <h1 className="text-3xl font-bold mt-4">{t('companyInformation')}</h1>
      {/** step active */}
      <Steps
        steps={5}
        className="my-10"
        active={stepIndex}
        onChangeStep={(stepActive) => actions.changeStep(stepActive)}
      />

      {/** form content */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onHandleSubmit}
      >
        {() => {
          return (
            <Form>
              <div className="flex flex-col gap-6">
                {/* company */}
                <Field
                  label={`${t('company')}:`}
                  isRequired
                  name="company"
                  component={SelectAsyncCreatable}
                  defaultOptions={companies}
                  loading={companyLoading}
                  filterOptions={filterCompanies}
                  placeholder={t('placeholder.selectOrCreate', {
                    label: t('company').toLowerCase()
                  })}
                />
                {/* industry ( job category ) */}
                <Field
                  label={`${t('common.industries')}:`}
                  isRequired
                  name="industries"
                  component={SelectForm}
                  loading={loadingJobCategories}
                  options={jobCategories}
                  isMulti={true}
                  placeholder={t('placeholder.select', {
                    label: t('common.industries').toLowerCase()
                  })}
                />

                {/* company type */}
                <Field
                  label={`${t('common.companyType')}:`}
                  isRequired
                  name="type"
                  component={SelectForm}
                  options={optCompanyTypes}
                  loading={loadingCompanyCommon}
                  placeholder={t('placeholder.select', {
                    label: t('common.companyType').toLowerCase()
                  })}
                />

                {/* company size */}
                <Field
                  label={`${t('common.companySize')}:`}
                  isRequired
                  name="size"
                  component={SelectForm}
                  options={optCompanySizes}
                  loading={loadingCompanyCommon}
                  placeholder={t('placeholder.select', {
                    label: t('common.companySize').toLowerCase()
                  })}
                />

                {/* address */}
                <Field
                  label={`${t('common.headquarter')}:`}
                  isRequired
                  name="address"
                  component={SelectAsync}
                  loading={addressLoading}
                  filterOptions={filterAddress}
                  defaultOptions={addressOptions}
                  placeholder={t('placeholder.select', {
                    label: t('common.headquarter').toLowerCase()
                  })}
                />

                {/* address detail */}
                <Field
                  label={`${t('common.headquarterDetail')}:`}
                  isRequired
                  name="addressDetail"
                  component={TextareaForm}
                  placeholder={t('placeholder.enter', {
                    label: t('common.headquarterDetail').toLowerCase()
                  })}
                />
              </div>

              <div className="flex items-center justify-start mt-6">
                <Field
                  name="agreePolicy"
                  component={CheckboxGroup}
                  options={[
                    {
                      value: 'apple',
                      label: (
                        <div className="flex items-center text-sm md:text-base text-dark gap-[5px] cursor-pointer">
                          {t('common.agreeTo')}{' '}
                          <Link
                            href={RouterPath.TERM_OF_USE}
                            target="_blank"
                            className="underline transition-all ease-linear hover:text-info"
                          >
                            {t('common.termsOfUse')}
                          </Link>
                          <span>{t('common.and')}</span>
                          <Link
                            href={RouterPath.PRIVACY_POLICY}
                            target="_blank"
                            className="capitalize underline transition-all ease-linear hover:text-info"
                          >
                            {t('common.privacyPolicy')}
                          </Link>
                        </div>
                      )
                    }
                  ]}
                  layout="vertical"
                  size="middle"
                />
              </div>

              <Button
                className="mt-10"
                minWidth="full"
                type="submit"
                styleType="info"
                label={t('common.next')}
              />
            </Form>
          );
        }}
      </Formik>
    </motion.div>
  );
}
