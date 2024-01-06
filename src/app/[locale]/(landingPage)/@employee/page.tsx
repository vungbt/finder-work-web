'use client';
import Banner from '@/libraries/banner';
import { Button, InputForm, SelectForm } from '@/libraries/common';
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
    selectedOption1: Yup.array()
      .of(
        Yup.object().shape({
          value: Yup.string().required('Please select an option'),
          label: Yup.string().required('Please select an option')
        })
      )
      .min(1, 'Pls select one item'),
    selectedOption2: Yup.object().shape({
      value: Yup.string().required('Please select an option'),
      label: Yup.string().required('Please select an option')
    }),
    input1: Yup.string().required('Input required'),
    input2: Yup.string().required('Input required')
  });

  const initialValues = {
    selectedOption: { value: 'apple', label: 'Apple' },
    selectedOption1: [{ value: 'apple', label: 'Apple' }],
    selectedOption2: { value: 'apple', label: 'Apple' },
    input1: '',
    input2: ''
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
      <div className="container">
        <InputForm
          iconLeft="arrow-left"
          iconRight="arrow-right"
          label="Input:"
          size="large"
          placeholder="Input..."
          isRequired
        />
        <InputForm
          iconLeft="arrow-left"
          iconRight="arrow-right"
          label="Input:"
          size="middle"
          placeholder="Input..."
        />
        <InputForm
          iconLeft="arrow-left"
          iconRight="arrow-right"
          label="Input:"
          size="small"
          placeholder="Input..."
        />
        <SelectForm options={options} size="large" />
        <SelectForm options={options} size="middle" />
        <SelectForm options={options} size="small" />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => {
            console.log('errors', errors);
            console.log('touched', touched);
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
                  label="Select Option 1:"
                  isRequired={true}
                  name="selectedOption1"
                  component={SelectForm}
                  options={options}
                  isMulti={true}
                  layout="horizontal"
                />

                <Field
                  label="Select Option 123123:"
                  isRequired={true}
                  name="selectedOption2"
                  component={SelectForm}
                  options={optionsGroup}
                  isMulti={false}
                  layout="horizontal"
                />
                <Field
                  label="Input 1:"
                  isRequired={true}
                  name="input1"
                  component={InputForm}
                  options={optionsGroup}
                  layout="horizontal"
                  placeholder="Enter...."
                />
                <Field
                  label="Input 2:"
                  isRequired={true}
                  name="input2"
                  component={InputForm}
                  options={optionsGroup}
                  placeholder="Enter...."
                  iconRight="heart"
                />

                <Button type="submit" label="Submit" styleType="neon" className="mt-5" />
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
