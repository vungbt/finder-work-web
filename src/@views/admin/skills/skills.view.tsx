'use client';

import { AdminSkillManagementColumns } from '@/@handles/skill/skill-columns';
import { AdminSkillManagementUtils } from '@/@handles/skill/skill.utils';
import { FunctionBar, ModalConfirm, Pagination, Table } from '@/libraries/common';
import { useTranslations } from 'next-intl';
import { ModalSKill } from './skill-model';

export function SkillsManagementView() {
  const {
    data,
    pagination,
    metadata,
    loading,
    sortActives,
    loadingDelete,
    itemDelete,
    dataDetails,
    isOpenAdd,
    formikRef,
    loadingSkill,
    setSearchValue,
    setPagination,
    onSort,
    onDelete,
    onCloseModalConfirmDelete,
    onConfirmDelete,
    onAddWorkingSkill,
    onCloseModalSkill,
    onSubmit,
    onEdit
  } = AdminSkillManagementUtils();

  const t = useTranslations();

  return (
    <div>
      <FunctionBar
        onAdd={onAddWorkingSkill}
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
        tableId="UserManagement"
        rows={data}
        columns={AdminSkillManagementColumns({ onSort, sortActives, onDelete, onEdit })}
        loading={loading}
        className="mt-3"
      />

      {/* pagination */}
      <div className="flex justify-end mt-6">
        <Pagination
          total={metadata?.total ?? 0}
          limit={pagination.limit as number}
          currentPage={pagination.page}
          onChangePage={(page) => setPagination({ ...pagination, page })}
        />
        <ModalSKill
          isOpen={isOpenAdd}
          onClose={onCloseModalSkill}
          onCancel={onCloseModalSkill}
          onSubmit={onSubmit}
          data={dataDetails}
          formikRef={formikRef}
          loading={loadingSkill}
        />
        <ModalConfirm
          message={t('noti.deleteConfirm', { label: t('skill').toLowerCase() })}
          isOpen={!!itemDelete}
          isLoading={loadingDelete}
          onClose={onCloseModalConfirmDelete}
          onCancel={onCloseModalConfirmDelete}
          onSubmit={onConfirmDelete}
        />
      </div>
    </div>
  );
}
