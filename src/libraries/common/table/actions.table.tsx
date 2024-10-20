import { RenderIcon } from '@/libraries/icons';
import { useTranslations } from 'next-intl';
import React from 'react';

type ActionsTableProps = {
  onDelete?: () => void;
  onGoToDetail?: () => void;
  onChangeStatus?: () => void;
};

export function ActionsTable({ onDelete, onGoToDetail, onChangeStatus }: ActionsTableProps) {
  const t = useTranslations();
  return (
    <div className="flex items-center gap-2">
      {onGoToDetail && (
        <button onClick={onGoToDetail}>
          <RenderIcon name="eye" className="!w-5 !h-5 text-info" />
        </button>
      )}
      {onDelete && (
        <button onClick={onDelete}>
          <RenderIcon name="trash" className="!w-5 !h-5 text-danger" />
        </button>
      )}
      {onChangeStatus && (
        <button onClick={onChangeStatus}>
          <div className=" text-avocado">{t('button.buttonChangeStatus')}</div>
        </button>
      )}
    </div>
  );
}
