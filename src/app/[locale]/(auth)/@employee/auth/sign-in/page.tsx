import { SignInEmployeeView } from '@/@views/auth/signup';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jobcadu - Employee Sign In',
  description:
    "Step into your career journey with Jobcadu's 4-step staircase, representing job search, career growth, education, and work-life fulfillment. Our ladder and 'J' curve symbolize our commitment to your continuous development and upward progression. Explore exceptional jobs, inspiring companies, and expertly curated career content."
};

export default function EmployeeLoginPage() {
  return <SignInEmployeeView />;
}
