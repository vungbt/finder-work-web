'use client';
import { toastError, toastSuccess } from '@/configs/toast';
import Banner from '@/libraries/banner';
import {
  Button,
  CheckboxGroup,
  DatePicker,
  DateRangePicker,
  InputForm,
  RadioGroup,
  SelectAsync,
  SelectForm,
  Switch
} from '@/libraries/common';
import { useApiClient } from '@/libraries/providers/graphql';
import { upload } from '@/utils/upload';
import { Field, Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useEffect } from 'react';
import * as Yup from 'yup';

export default function EmployeePage() {
  const t = useTranslations();
  const { apiClient } = useApiClient();
  useEffect(() => {
    initFetching();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' }
  ];

  const optionsGroup = [
    { label: 'All', value: 'all' },
    {
      label: 'Group 1',
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'orange', label: 'Orange' }
      ]
    }
  ];

  const validationSchema = Yup.object({
    selectedOption: Yup.object().shape({
      value: Yup.string().required('Please select an option'),
      label: Yup.string().required('Please select an option')
    }),
    input: Yup.string().required('Input required'),
    radio: Yup.string().required('Input required'),
    checkbox: Yup.array()
      .of(Yup.string().required('Please select an option'))
      .min(1, 'Please select at least one option'),
    datepicker: Yup.date().required('Date picker required'),
    switch: Yup.boolean().optional(),
    dateRangePicker: Yup.array()
      // .of(Yup.date().required('Start and end must be is date.'))
      .min(2, 'Pls select start date and end date.')
      .test('is-non-null', 'Date is required', (value) => {
        if (!value) {
          return false;
        }
        return value.every((date) => date !== null);
      })
  });

  const initialValues = {
    selectedOption: { value: 'apple', label: 'Apple' },
    selectedAsync: null,
    input: '',
    radio: '',
    checkbox: [],
    datepicker: new Date(),
    switch: true,
    dateRangePicker: [null, null]
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (values: any) => {
    // Handle form submission logic here
    console.log('Form values:', values);
    // setSubmitting(false);
  };

  const filterOptions = (searchValue?: string) => {
    console.log('searchValue====>', searchValue);
  };

  const initFetching = async () => {
    const res = await apiClient.companyCommon();
    console.log('res=====>', res);
  };

  const onHandleCHange = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target?.files ?? [];
      if (!files || files.length <= 0) return toastError('File invalid');
      const file = files[0];
      console.log('file=====>', file);
      const formData = upload.imgFormData(file);
      const res = await upload.uploadFile(file.name, formData);
      console.log('res=====>', res);
      // api_key: '283742229642811';
      // asset_id: '1d0d9ff447242bf8ed824e9f4151cca2';
      // bytes: 751441;
      // created_at: '2024-01-28T05:27:32Z';
      // etag: '6e30cd44abc5fa3209651694367f8bbb';
      // folder: 'temp';
      // format: 'png';
      // height: 2160;
      // original_filename: 'file';
      // placeholder: false;
      // public_id: 'temp/20240128122729-screenshot-2023-05-10-at-143231png';
      // resource_type: 'image';
      // secure_url: 'https://res.cloudinary.com/dx66fumod/image/upload/v1706419652/temp/20240128122729-screenshot-2023-05-10-at-143231png.png';
      // signature: 'e53ffb12a9a446fe921ae43d3b0a743e7e38ecd5';
      // tags: [];
      // type: 'upload';
      // url: 'http://res.cloudinary.com/dx66fumod/image/upload/v1706419652/temp/20240128122729-screenshot-2023-05-10-at-143231png.png';
      // version: 1706419652;
      // version_id: 'aed48bbb21b8492a907fb018bd337fb2';
      // width: 3456;

      if (res.data && Object.keys(res.data).length > 0)
        return toastSuccess('Upload file successfully.');
      toastError('Upload failed');
    } catch (error) {
      toastError('Upload failed');
    }
  };

  return (
    <div>
      <Banner
        type="employee"
        title={t('banner.stepIntoSuccess')}
        tags={['UI/UX Designer', 'Netflix', 'IT', '', 'Sale', 'Marketing']}
      />

      <input type="file" placeholder="test" onChange={onHandleCHange} />
      <Switch size="large" />
      <Switch size="middle" />
      <Switch size="small" />

      <div className="container">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {() => {
            return (
              <Form>
                <Field
                  label="Select Option:"
                  isRequired={true}
                  name="selectedOption"
                  component={SelectForm}
                  options={options}
                  isMulti={false}
                />
                <Field
                  label="Select Async Option:"
                  isRequired={true}
                  name="selectedAsync"
                  component={SelectAsync}
                  filterOptions={filterOptions}
                />
                <Field
                  label="Input 1:"
                  isRequired={true}
                  name="input"
                  component={InputForm}
                  options={optionsGroup}
                  placeholder="Enter...."
                  iconRight="sms"
                />
                <Field name="radio" component={RadioGroup} options={options} layout="vertical" />
                <Field
                  name="checkbox"
                  component={CheckboxGroup}
                  options={options}
                  layout="vertical"
                />
                <Field
                  name="datepicker"
                  component={DatePicker}
                  layout="vertical"
                  label="Datepicker"
                  placeholder="Enter...."
                  isRequired={true}
                  isClearable
                />
                <Field
                  name="dateRangePicker"
                  component={DateRangePicker}
                  layout="vertical"
                  label="Datepicker"
                  placeholder="Enter...."
                  isRequired={true}
                  isClearable
                />
                <Field name="switch" component={Switch} label="Switch" layout="vertical" />
                <Button type="submit" label="Submit" styleType="neon" className="mt-5" />
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
