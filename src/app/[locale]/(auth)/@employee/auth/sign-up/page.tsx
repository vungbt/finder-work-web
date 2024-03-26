import { SignUpEmployeeProvider } from '@/@views/auth/signup/providers';
import { SignUpEmployeeView } from '@/@views/auth/signup';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Jobcadu - Employee Sign Up',
  description:
    "Step into your career journey with Jobcadu's 4-step staircase, representing job search, career growth, education, and work-life fulfillment. Our ladder and 'J' curve symbolize our commitment to your continuous development and upward progression. Explore exceptional jobs, inspiring companies, and expertly curated career content."
};

export default function EmployeeRegisterPage() {
  return (
    <SignUpEmployeeProvider>
      <SignUpEmployeeView />
    </SignUpEmployeeProvider>
  );
}
