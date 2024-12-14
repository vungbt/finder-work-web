'use client';
import { JobResultUtils } from '@/@handles/job/job-utils';
import React from 'react';

export default function JobsPage() {
  const { allJobData } = JobResultUtils();
  console.log(allJobData);
  return <div>Job portal</div>;
}
