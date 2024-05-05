import { RenderIcon } from '@/libraries/icons';
import React from 'react';

type ActionsTableProps = {
  onDelete?: () => void;
  onGoToDetail?: () => void;
};

export function ActionsTable({ onDelete, onGoToDetail }: ActionsTableProps) {
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
    </div>
  );
}
