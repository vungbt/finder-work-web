import { ReactNode } from 'react';
import '@/styles/globals.scss';
import { Metadata } from 'next';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: 'Jobcadu',
  description:
    "Step into your career journey with Jobcadu's 4-step staircase, representing job search, career growth, education, and work-life fulfillment. Our ladder and 'J' curve symbolize our commitment to your continuous development and upward progression. Explore exceptional jobs, inspiring companies, and expertly curated career content."
};

export default function RootLayout({ children }: Props) {
  return children;
}
