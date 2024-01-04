'use client';
import Banner from '@/libraries/banner';
import { Switch, SelectForm, Button } from '@/libraries/common';
import { useTranslations } from 'next-intl';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { RenderIcon } from '@/libraries/icons';

export default function EmployeePage() {
  const t = useTranslations();

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' }
  ];

  const validationSchema = Yup.object({
    selectedOption: Yup.object().shape({
      value: Yup.string().required('Please select an option'),
      label: Yup.string().required('Please select an option')
    })
  });

  const initialValues = {
    selectedOption: null
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
        <br />
        <Switch size="large" loading />
        <Switch size="middle" />
        <Switch size="small" />
        <RenderIcon name="close" />
        <RenderIcon name="chevron-up" />
        <br />
        <Button iconLeft="chevron-down" styleType="neon" label="Button" size="large" />
        <Button iconLeft="chevron-down" styleType="neon" label="Button" size="middle" />
        <Button iconLeft="chevron-down" styleType="neon" label="Button" size="small" />
        <br />
        <SelectForm options={options} size="large" isClearable />
        <SelectForm options={options} size="middle" isMulti />
        <SelectForm options={options} size="small" isMulti />
        <br />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          <Form>
            <div>
              <label htmlFor="selectedOption">Select Option:</label>
              <Field
                name="selectedOption"
                component={SelectForm}
                options={options}
                isMulti={false}
              />
              <ErrorMessage name="selectedOption" component="div" />
            </div>

            <div>
              <button type="submit">Submit</button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
