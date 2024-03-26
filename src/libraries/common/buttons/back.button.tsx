import { useTranslations } from 'next-intl';
import React from 'react';
import { Button } from '.';
import { useRouter } from 'next/navigation';

type BackButtonProps = {
  onClick?: () => void;
};
export function BackButton({ onClick }: BackButtonProps) {
  const t = useTranslations();
  const router = useRouter();

  const onHandleClick = () => {
    if (onClick) return onClick();
    router.back();
  };

  return (
    <Button
      buttonType="outline"
      className="!px-0"
      iconLeft="arrow-left"
      label={t('common.back')}
      onClick={onHandleClick}
    />
  );
}
