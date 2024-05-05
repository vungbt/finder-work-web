/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import { JSONEditorReact, JSONEditorReactProps } from './json-editor-react';
import { FieldInputProps, FormikProps } from 'formik';
import { FormGroup } from '../../form';

interface JSONEditorProps extends Omit<JSONEditorReactProps, 'onChange'> {
  field?: FieldInputProps<never>;
  form?: FormikProps<any>;
  json?: object;
  text?: string;
  schema?: object;
  schemaRefs?: object;

  label?: string;
  isLoading?: boolean;
  isRequired?: boolean;
  className?: string;
  error?: string;
  layout?: 'horizontal' | 'vertical';
}

export const JSONEditor: React.FC<JSONEditorProps> = ({
  field,
  form,
  label,
  json,
  isRequired,
  layout,
  isLoading,
  ...reset
}) => {
  const name = field?.name;
  const value = field?.value;
  const valueIsJson = useMemo(() => typeof value !== 'string', [value]);

  const isHaveError = !form || !name ? false : form.errors[name] && form.touched[name];

  const onHandleChange = (newValue: string) => {
    if (name && form) {
      form.setFieldTouched(name, true);
      form.setFieldValue(name, newValue);
    }
  };

  return (
    <FormGroup layout={layout} label={label} name={name} isRequired={isRequired}>
      <JSONEditorReact
        isHaveError={isHaveError as any}
        isLoading={isLoading}
        {...reset}
        json={valueIsJson ? value : json}
        text={!valueIsJson ? value : '{}'}
        onChangeText={onHandleChange}
      />
    </FormGroup>
  );
};
