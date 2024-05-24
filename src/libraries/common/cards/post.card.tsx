import { Post } from '@/configs/graphql/generated';
import { getAvatar, getFullName, getPostMetaInfo } from '@/utils/helpers/common';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { Tag } from '../tags';
import { useTranslations } from 'next-intl';
import { EDateFormat, formatDate } from '@/utils/helpers/formatter';
import { RenderIcon } from '@/libraries/icons';

type PostCardProps = {
  item: Post;
};

export function PostCard({ item }: PostCardProps) {
  const t = useTranslations();
  const thumbnail = useMemo(() => {
    if (item.thumbnails && item.thumbnails.length > 0) return item.thumbnails[0];
    const metadata = getPostMetaInfo(item);
    if (metadata)
      return {
        id: metadata.title,
        url: metadata.imageUrl
      };
    return null;
  }, [item]);

  return (
    <div className="w-80 min-h-96 rounded-2xl bg-gray-200 justify-between p-4 flex flex-col gap-3">
      {/* header */}
      <div className="flex flex-col gap-3">
        <div>
          <Image
            width={32}
            height={32}
            alt="post-author"
            src={getAvatar(item.author)}
            className="rounded-full"
          />
          {/* 
          <div>
            <p>{getFullName(item.author)}</p>
          </div> */}
        </div>
        <p className="font-medium text-sm">{item.title}</p>
      </div>

      {/* content */}
      <div className="flex flex-col items-start gap-3">
        {/* tags */}
        <div className="flex items-center flex-wrap gap-2 justify-start px-2">
          {(item.tags ?? []).map((item) => (
            <Tag type="outline" content={item.name} key={item.id} color={item.color as string} />
          ))}
        </div>

        <div className="flex flex-col gap-1">
          {/* created & read time */}
          <div className="flex items-center text-xs gap-1 text-text-tertiary px-4">
            <span>{formatDate(item.updatedAt ?? item.createdAt, EDateFormat.MMMM_yyyy)}</span>
            <span className="w-[3px] h-[3px] min-w-[3px] min-h-[3px] rounded-full bg-text-tertiary"></span>
            <span>{t('common.readTime', { number: item.minRead })}</span>
          </div>

          {/* thumbnails */}
          {thumbnail && thumbnail.url && (
            <Image
              width={288}
              height={162}
              alt="thumbnail"
              src={thumbnail.url}
              className="rounded-xl"
            />
          )}
        </div>
      </div>

      {/* footer */}
      <div>
        <button>
          <RenderIcon name="caret-up-solid" />
        </button>
      </div>
    </div>
  );
}
