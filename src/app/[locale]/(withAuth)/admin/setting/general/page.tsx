'use client';
import { AdminGeneralUtils } from '@/@handles/setting';
import { AdminGeneralColumns } from '@/@handles/setting/admin-general.columns';
import { RouterPath } from '@/constants/router-path';
import { FunctionBar, ModalConfirm, Table } from '@/libraries/common';
import { useTranslations } from 'next-intl';

export default function GeneralPage() {
  const t = useTranslations();
  const {
    loading,
    data,
    sortActives,
    onDelete,
    onSort,
    setSearchValue,
    onConfirmDelete,
    onCloseModalConfirmDelete,
    itemDelete,
    loadingDelete
  } = AdminGeneralUtils();

  return (
    <div>
      <FunctionBar addUrl={RouterPath.ADMIN_SETTING_GENERAL_ADD} onSearch={setSearchValue} />
      <Table
        tableId="GeneralSetting"
        columns={AdminGeneralColumns({ onDelete, onSort, sortActives })}
        rows={data}
        loading={loading}
        className="mt-3"
      />

      <ModalConfirm
        message={t('noti.deleteConfirm', { label: t('setting').toLowerCase() })}
        isOpen={!!itemDelete}
        isLoading={loadingDelete}
        onClose={onCloseModalConfirmDelete}
        onCancel={onCloseModalConfirmDelete}
        onSubmit={onConfirmDelete}
      />
    </div>
  );
}
