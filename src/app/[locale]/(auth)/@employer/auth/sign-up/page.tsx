import { SignUpEmployerView } from '@/@views/auth/signup';
import { SignUpEmployerProvider } from '@/@views/auth/signup/providers';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Finder Work - Employer Sign Up',
  description:
    "Step into your career journey with Finder Work's 4-step staircase, representing job search, career growth, education, and work-life fulfillment. Our ladder and 'J' curve symbolize our commitment to your continuous development and upward progression. Explore exceptional jobs, inspiring companies, and expertly curated career content."
};

export default function EmployerRegisterPage() {
  return (
    <SignUpEmployerProvider>
      <SignUpEmployerView />
    </SignUpEmployerProvider>
  );
}
