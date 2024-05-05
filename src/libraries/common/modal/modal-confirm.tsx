import React, { ReactNode, useMemo } from 'react';
import { ModalWrap, ModalWrapProps } from './modal-wrap';
import { Button } from '../buttons';
import { IconName, RenderIcon } from '@/libraries/icons';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

type ModalConfirmProps = Omit<ModalWrapProps, 'children'> & {
  onCancel?: () => void;
  cancelLabel?: string;
  cancelIcon?: IconName;
  classNameCancel?: string;

  onSubmit?: () => void;
  submitLabel?: string;
  submitIcon?: IconName;
  isLoading?: boolean;
  classNameSubmit?: string;

  message?: string;
  warning?: string;

  actions?: ReactNode;
  iconMain?: IconName;
};
export function ModalConfirm({
  onCancel,
  cancelIcon,
  cancelLabel,
  classNameCancel,
  onSubmit,
  submitIcon,
  submitLabel,
  classNameSubmit,
  onClose,
  actions,
  isLoading,
  message,
  iconMain = 'danger-solid',
  isOpen,
  warning
}: ModalConfirmProps) {
  const t = useTranslations();

  const renderActions = useMemo(() => {
    if (actions) return actions;
    return (
      <div className="flex justify-center items-center gap-3 mt-5">
        <Button
          onClick={onCancel}
          label={cancelLabel ?? t('noCancel')}
          iconLeft={cancelIcon}
          size="middle"
          className={classNameCancel}
        />
        <Button
          onClick={onSubmit}
          label={submitLabel ?? t('yesSure')}
          iconLeft={submitIcon ?? 'trash-solid'}
          className={clsx(classNameSubmit)}
          styleType="danger"
          size="middle"
          isLoading={isLoading}
        />
      </div>
    );
  }, [
    actions,
    t,
    isLoading,
    cancelIcon,
    cancelLabel,
    submitIcon,
    submitLabel,
    classNameCancel,
    classNameSubmit,
    onSubmit,
    onCancel
  ]);

  return (
    <ModalWrap isOpen={isOpen} onClose={onClose} className="max-w-[500px]">
      <div className="flex flex-col">
        {/* header */}
        <div className="w-full flex justify-end pb-1">
          <button onClick={onClose}>
            <RenderIcon className="!w-5 !h-5 text-text-secondary" name="close" />
          </button>
        </div>

        {/* main content */}
        <div className="w-full flex items-center flex-col justify-center">
          {iconMain && <RenderIcon name={iconMain} className="!w-14 !h-14 text-warning-100" />}

          {message && message.length > 0 && (
            <p className="mt-3 font-medium text-text-secondary px-5 text-center">{message}</p>
          )}
        </div>

        {/* waning block */}
        {warning && warning.length > 0 && (
          <div className="bg-danger-100 rounded-md py-3 px-2 text-danger-200 text-sm mt-5">
            <div className="flex items-center gap-1">
              <RenderIcon name="danger-solid" className="text-danger-200 !w-4 !h-4 mb-[2px]" />
              <span className="font-bold">{t('warning')}</span>
            </div>
            <p className="mt-1">{warning}</p>
          </div>
        )}

        {/* actions */}
        {renderActions}
      </div>
    </ModalWrap>
  );
}
