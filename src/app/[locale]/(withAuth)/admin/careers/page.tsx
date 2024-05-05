'use client';
import { CareersView } from '@/@views/admin/careers';
import { Button, InputForm, SelectForm, Tab, TabItem } from '@/libraries/common';
import { useApiClient } from '@/libraries/providers/graphql';
import { Field, Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

export default function AdminCareersPage() {
  const t = useTranslations();
  const { apiClient } = useApiClient();
  const [tabActive, setTabActive] = useState<TabItem>({ label: 'New post', value: 'add' });

  useEffect(() => {
    fetchingPostCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    categories: Yup.array()
      .of(Yup.string().required('Please select an option'))
      .min(1, 'Please select at least one option'),
    jobTitle: Yup.string().required('Title is required'),
    content: Yup.string().required('Title is required'),
    tags: Yup.array()
      .of(Yup.string().required('Please select an option'))
      .min(1, 'Please select at least one option'),
    thumbnail: Yup.string().required('Title is required')
  });

  const initialValues = {
    title: '',
    categories: [],
    jobTitle: '',
    content: '',
    tags: [],
    thumbnail: ''
  };

  const fetchingPostCategory = async () => {
    const res = await apiClient.allPostCategory();
    console.log('res====>', res);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitVerifyCode = (values: any) => {
    console.log('values====>', values);
    // TODO: CALL API ACTIVE ACCOUNT
    // setTimeout(() => {
    //   actions.nextStep({ ...formData, verifyCode: Number(values.verificationCode) });
    // }, 1000);
  };

  return (
    <CareersView>
      AdminCareersPage
      <Tab
        options={[
          { label: 'New post', value: 'add' },
          { label: 'Share a link', value: 'link' }
        ]}
        active={tabActive}
        onChange={(item) => setTabActive(item)}
      />
      {/* form content */}
      <div className="bg-gray-200 p-6 rounded-2xl mt-5">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitVerifyCode}>
          {() => {
            return (
              <Form>
                <Field
                  label="Title"
                  isRequired
                  name="title"
                  component={InputForm}
                  placeholder={t('placeholder.enter', {
                    label: t('common.code').toLowerCase()
                  })}
                />

                <div>
                  <Field
                    label="Content Categories"
                    isRequired={true}
                    name="categories"
                    component={SelectForm}
                    options={[]}
                    isMulti={true}
                  />

                  <Field
                    label="Job category"
                    isRequired={true}
                    name="jobTitle"
                    component={SelectForm}
                    options={[]}
                    isMulti={false}
                  />
                </div>

                <Field
                  label="Career tags"
                  isRequired={true}
                  name="tags"
                  component={SelectForm}
                  options={[]}
                  isMulti={true}
                />

                <Button styleType="info" type="submit" label="Post" />
              </Form>
            );
          }}
        </Formik>
      </div>
    </CareersView>
  );
}
