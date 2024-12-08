import { JobProvider } from '@/@views/user/company-profile/providers';
import { JobView } from '@/@views/user/company-profile/job-company-view';

export default function CompanyJobs() {
  return (
    <JobProvider>
      <JobView />
    </JobProvider>
  );
}
