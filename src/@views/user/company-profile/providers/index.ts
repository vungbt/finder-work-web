import { ReactElement } from 'react';

export * from './job-company.provider';
export interface IPhoneCode {
  label: string;
  value: string;
}

export interface IStepItem {
  title: string;
  component: ReactElement;
}
