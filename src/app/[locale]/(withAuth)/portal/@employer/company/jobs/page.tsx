import { JobView } from '@/@views/user/company-profile/job-company-view';
import { JobCompanyProvider } from '@/@views/user/company-profile/providers';

export default function CompanyJobs() {
  return (
    <JobCompanyProvider>
      <JobView />
    </JobCompanyProvider>
  );
}
