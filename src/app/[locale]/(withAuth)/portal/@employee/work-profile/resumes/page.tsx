import { CreateResumeView } from '@/@views/user/resume';
import { CreateResumeProvider } from '@/@views/user/resume/providers';
import React from 'react';

export default function ResumesPage() {
  return (
    <CreateResumeProvider>
      <CreateResumeView />
    </CreateResumeProvider>
  );
}
