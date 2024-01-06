'use client';
import Banner from '@/libraries/banner';
import {
  Button,
  CheckboxGroup,
  CheckboxItem,
  InputForm,
  RadioGroup,
  SelectForm
} from '@/libraries/common';
import { Field, Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
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
      .min(1, 'Please select at least one option')
  });

  const initialValues = {
    selectedOption: { value: 'apple', label: 'Apple' },
    input: '',
    radio: '',
    checkbox: []
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (values: any) => {
    // Handle form submission logic here
    console.log('Form values:', values);
    // setSubmitting(false);
  };

  const [items, setItems] = useState<string[]>([]);

  const onChangeItem = (value: string) => {
    const newItems = [...items];
    const indexItemValid = newItems.findIndex((item) => item === value);
    if (indexItemValid === -1) {
      newItems.push(value);
    } else {
      newItems.splice(indexItemValid, 1);
    }
    setItems(newItems);
  };

  return (
    <div>
      <Banner
        type="employee"
        title={t('banner.stepIntoSuccess')}
        tags={['UI/UX Designer', 'Netflix', 'IT', '', 'Sale', 'Marketing']}
      />
      <div className="container">
        <CheckboxItem
          size="small"
          styleType="danger"
          indeterminate={items.length < options.length && items.length > 0}
          checked={items.length === options.length}
          onClick={() => {
            if (items.length < options.length) {
              const allItem = options.map((item) => item.value);
              setItems(allItem);
            } else {
              setItems([]);
            }
          }}
        />
        <div>
          {options.map((item) => {
            return (
              <CheckboxItem
                key={item.value}
                label={item.label}
                value={item.value}
                styleType="info"
                checked={items.includes(item.value)}
                onChange={(e) => onChangeItem(e.target.value)}
              />
            );
          })}
        </div>

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
                />
                <Field name="radio" component={RadioGroup} options={options} layout="vertical" />
                <Field
                  name="checkbox"
                  component={CheckboxGroup}
                  options={options}
                  layout="vertical"
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
