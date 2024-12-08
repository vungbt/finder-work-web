import { CompanyUtils } from '@/@handles/company/company.ultis';
import { JobColumns } from '@/@handles/job/job-col';
import { JobResultUtils } from '@/@handles/job/job-utils';
import { toastError } from '@/configs/toast';
import { FunctionBar, ModalConfirm, Pagination, Table } from '@/libraries/common';
import { useTranslations } from 'next-intl';
import { useJob } from '../providers';

export default function ResumeMain() {
  const t = useTranslations();
  const {
    actions,
    state: { formData }
  } = useJob();

  const {
    data,
    pagination,
    metadata,
    loading,
    itemDelete,
    sortActives,
    setPagination,
    onConfirmDelete,
    loadingDelete,
    setSearchValue,
    onSort,
    onCloseModalConfirmDelete,
    onDelete
  } = JobResultUtils();

  const { data: myCompany } = CompanyUtils();
  console.log('myCompany', myCompany);

  const nextAction = () => {
    if (myCompany.length === 0) {
      return toastError(t('noti.companyNotCreate'));
    }
    actions.nextStep(formData);
  };

  return (
    <div className="w-full h-screen">
      <FunctionBar
        onAdd={nextAction}
        onSearch={setSearchValue}
        // pagination top
        pagination={{
          total: metadata?.total ?? 0,
          limit: pagination.limit as number,
          currentPage: pagination.page
        }}
        onChangePage={(page) => setPagination({ ...pagination, page })}
      />

      <Table
        tableId="jobManagement"
        rows={data}
        columns={JobColumns({ onSort, sortActives, onDelete })}
        className="mt-3"
        loading={loading}
      />
      <div className="flex justify-end mt-6">
        <Pagination
          total={metadata?.total ?? 0}
          limit={pagination.limit as number}
          currentPage={pagination.page}
          onChangePage={(page) => setPagination({ ...pagination, page })}
        />
      </div>
      <ModalConfirm
        message={t('noti.deleteConfirm', { label: t('item').toLowerCase() })}
        isOpen={!!itemDelete}
        isLoading={loadingDelete}
        onClose={onCloseModalConfirmDelete}
        onCancel={onCloseModalConfirmDelete}
        onSubmit={onConfirmDelete}
      />
    </div>
  );
}
