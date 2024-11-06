import { ReactElement } from 'react';

export * from './sign-up-employee.provider';
export * from './sign-up-employer.provider';

export interface IPhoneCode {
  label: string;
  value: string;
}

export interface IStepItem {
  title: string;
  component: ReactElement;
}
