import { CreateResumeView } from '@/@views/user/resume/layout';
import { ResumeProvider } from '@/@views/user/resume/providers/resume-providers';

export default function ResumesPage() {
  return (
    <ResumeProvider>
      <CreateResumeView />
    </ResumeProvider>
  );
}
