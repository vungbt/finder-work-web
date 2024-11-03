import { RenderIcon } from '@/libraries/icons';
import { copyToClipboard } from '@/utils/helpers/common';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { ReactNode } from 'react';

type CodeSnippetPreviewProps = {
  content: ReactNode | string;
  className?: string;
};

export function CodeSnippetPreview({ content, className }: CodeSnippetPreviewProps) {
  const t = useTranslations();
  return (
    <div
      className={clsx(
        'h-fit p-2 w-full bg-dracula text-gray-200 rounded-[4px] relative min-h-10',
        className
      )}
    >
      {content}

      <button
        onClick={() => copyToClipboard(content as string, { success: t('noti.copiedToClipboard') })}
        className="absolute top-2 right-2 z-[1]"
      >
        <RenderIcon name="copy" className="text-gray-200 !w-5 !h-5" />
      </button>
    </div>
  );
}
