import { UserStatus } from '@/configs/graphql/generated';
import { RenderIcon } from '@/libraries/icons';
import { useTranslations } from 'next-intl';
import { Button } from '../buttons';

type ActionsTableProps = {
  onDelete?: () => void;
  onGoToDetail?: () => void;
  onChangeStatus?: () => void;
  status: UserStatus;
};

export function ActionsTable({
  onDelete,
  onGoToDetail,
  onChangeStatus,
  status
}: ActionsTableProps) {
  console.log('===>', status);
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
        <Button
          styleType={status === UserStatus.Inactive ? 'success' : 'danger'}
          label={
            status == UserStatus.Inactive
              ? t('common.active').toLowerCase()
              : t('common.inactive').toLowerCase()
          }
          size="small"
          onClick={onChangeStatus}
        />
      )}
    </div>
  );
}
