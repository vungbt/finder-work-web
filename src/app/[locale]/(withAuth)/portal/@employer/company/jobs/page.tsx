import { JobView } from '@/@views/user/company-profile/job-company-view';
import { JobProvider } from '@/@views/user/company-profile/providers';

export default function CompanyJobs() {
  return (
    <JobProvider>
      <JobView />
    </JobProvider>
  );
}
