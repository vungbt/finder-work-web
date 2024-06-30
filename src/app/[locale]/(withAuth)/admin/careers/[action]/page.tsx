import { CareersActionView } from '@/@views/admin/careers';
import { withActionRouter } from '@/utils/middleware';

const AdminCareersPage = (params: { isEdit: boolean }) => {
  return <CareersActionView isEdit={params.isEdit} />;
};

export default withActionRouter(AdminCareersPage);
