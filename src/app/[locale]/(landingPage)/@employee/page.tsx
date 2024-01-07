'use client';
import Banner from '@/libraries/banner';
import {
  Button,
  CheckboxGroup,
  DatePicker,
  InputForm,
  RadioGroup,
  SelectForm,
  Switch
} from '@/libraries/common';
import { Field, Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import * as Yup from 'yup';

export default function EmployeePage() {
  const t = useTranslations();

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
    switch: Yup.boolean().optional()
  });

  const initialValues = {
    selectedOption: { value: 'apple', label: 'Apple' },
    input: '',
    radio: '',
    checkbox: [],
    datepicker: new Date(),
    switch: true
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (values: any) => {
    // Handle form submission logic here
    console.log('Form values:', values);
    // setSubmitting(false);
  };

  return (
    <div>
      <Banner
        type="employee"
        title={t('banner.stepIntoSuccess')}
        tags={['UI/UX Designer', 'Netflix', 'IT', '', 'Sale', 'Marketing']}
      />
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
                  isClearable
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
