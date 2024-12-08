'use client';
import { CompanyUtils } from '@/@handles/company/company.ultis';
import { Company } from '@/configs/graphql/generated';
import useCompanies from '@/hooks/redux/company/list/useCompanies';
import { BackButton, Button, SelectAsync, Steps } from '@/libraries/common';
import { IOptItem } from '@/types';
import { Field, Form, Formik, FormikProps } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import CompanyForm from '../../company/component/company-form';
import { useJob } from '../providers';
import { useRef } from 'react';
import { CompanyFormValues } from '@/types/company';

export default function CreateResumeStepOne() {
  const t = useTranslations();

  const {
    actions,
    state: { formData, stepIndex }
  } = useJob();

  const formikRef = useRef<FormikProps<CompanyFormValues>>(null);

  const { options: companies, loading: companyLoading, myCompanies } = useCompanies();

  const { getDetailCompany, CompanyDetail, setCompanyDetail } = CompanyUtils();
  const handleCompanyChange = async (option?: IOptItem) => {
    if (!option) {
      return setCompanyDetail(undefined);
    }
    const companyDetail = getDetailCompany({ where: { id: { equals: option.value } } });
    return companyDetail;
  };
  const initialValues = {
    company: { value: CompanyDetail?.id, label: CompanyDetail?.name }
  };

  const onHandleSubmit = async () => {
    actions.nextStep({
      ...formData,
      company: CompanyDetail
        ? { value: CompanyDetail.id, label: CompanyDetail.name }
        : { value: '', label: '' }
    });
  };
  const filterCompanies = async (searchValue?: string) => {
    if (!searchValue || searchValue.length <= 0) return;
    const res = await myCompanies({
      searchValue: searchValue,
      pagination: { limit: 20, page: 1 }
    });
    const options = ((res?.my_company.data ?? []) as Company[]).map((item) => ({
      label: item.name,
      value: item.id
    }));
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
      className="w-3/4 ms-6"
    >
      {/** step active */}
      <Steps
        steps={5}
        excludeSteps={[3]}
        className="my-10"
        active={stepIndex}
        onChangeStep={(stepActive) => actions.changeStep(stepActive)}
      />

      <div>
        <Formik initialValues={initialValues} onSubmit={onHandleSubmit}>
          {({ setFieldValue }) => {
            return (
              <div className="w-full">
                <Form>
                  <Field
                    label={`${t('company')}:`}
                    isRequired
                    name="company"
                    component={SelectAsync}
                    defaultOptions={companies}
                    loading={companyLoading}
                    filterOptions={filterCompanies}
                    placeholder={t('placeholder.selectOrCreate', {
                      label: t('company').toLowerCase()
                    })}
                    onChange={async (option: IOptItem) => {
                      const companyDetail = await handleCompanyChange(option);
                      setFieldValue('company', companyDetail);
                    }}
                  />
                </Form>
              </div>
            );
          }}
        </Formik>
        <CompanyForm
          formikRef={formikRef}
          data={CompanyDetail}
          key={CompanyDetail?.id}
          isDisabled={true}
        />
      </div>
      <div className="flex flex-1 justify-between my-10">
        <BackButton onClick={() => actions.previousStep(formData)} />
        <Button onClick={onHandleSubmit} styleType="info" label={t('common.next')} type="submit" />
      </div>
    </motion.div>
  );
}
