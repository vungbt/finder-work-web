import React, { useMemo } from 'react';
import { UploadItem } from '.';
import checkIsArray from 'lodash/isArray';
import Image from 'next/image';
import { RenderIcon } from '@/libraries/icons';
import clsx from 'clsx';

type UploadPreviewProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any;
  onRemove: (item: UploadItem) => void;
  className?: string;
};
export function UploadPreview({ items, className, onRemove }: UploadPreviewProps) {
  const itemRender = useMemo(() => {
    let newItem = [];
    const isArray = checkIsArray(items);
    if (isArray) {
      newItem = (items as UploadItem[]).map((item) => ({ id: item?.id, url: item?.url }));
    } else {
      newItem = [{ id: items?.id, url: items?.url }];
    }
    return newItem;
  }, [items]);

  return (
    <div className={clsx('flex items-center justify-start gap-3 flex-wrap mt-2', className)}>
      {itemRender.map((item) => (
        <div
          key={item.id}
          className="relative rounded-lg w-fit h-fit border border-solid border-gray-100">
          <Image
            className="rounded-lg"
            width={212}
            height={152}
            src={item.url}
            alt="image-preview"
          />

          <span
            onClick={() => onRemove && onRemove(item)}
            className="w-fit h-fit min-w-6 min-h-6 rounded-full cursor-pointer absolute top-2 right-2 bg-white flex items-center justify-center">
            <RenderIcon name="close" className="!w-5 !h-5" />
          </span>
        </div>
      ))}
    </div>
  );
}
