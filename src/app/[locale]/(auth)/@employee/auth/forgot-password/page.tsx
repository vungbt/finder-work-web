import { ForgotPasswordEmployeeView } from '@/@views/auth/forgot-password';
import { ForgotPasswordEmployeeProvider } from '@/@views/auth/forgot-password/providers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jobcadu - Employee Forgot Password',
  description:
    "Step into your career journey with Jobcadu's 4-step staircase, representing job search, career growth, education, and work-life fulfillment. Our ladder and 'J' curve symbolize our commitment to your continuous development and upward progression. Explore exceptional jobs, inspiring companies, and expertly curated career content."
};

export default function EmployeeForgotPasswordPage() {
  return (
    <ForgotPasswordEmployeeProvider>
      <ForgotPasswordEmployeeView />
    </ForgotPasswordEmployeeProvider>
  );
}
