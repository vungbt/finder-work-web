import { Post } from '@/configs/graphql/generated';
import { RenderIcon } from '@/libraries/icons';
import { getAvatar, getPostMetaInfo } from '@/utils/helpers/common';
import { EDateFormat, formatDate } from '@/utils/helpers/formatter';
import { Link } from '@/utils/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMemo } from 'react';
import { Tag } from '../tags';

type PostCardProps = {
  item: Post;
  className?: string;
  isHot?: boolean;
};

export function PostCard({ item, className, isHot }: PostCardProps) {
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

  const totalUpVote = useMemo(() => {
    const likes = item?._count?.likes ?? 0;
    const dislikes = item?._count?.dislikes ?? 0;
    return likes - dislikes;
  }, [item]);

  const totalComment = useMemo(() => item?._count?.comments ?? 0, [item]);
  const newTags = useMemo(() => {
    const tags = item?.tags ?? [];
    if (tags.length < 3) return { tags };
    return {
      tags: tags.slice(0, 2),
      more: tags.slice(2, tags.length).length
    };
  }, [item]);

  return (
    <article className={clsx('card min-h-96 rounded-2xl shadow-md bg-gray-200 w-full', className)}>
      <div className="justify-between h-full w-full p-4 flex flex-col gap-3 relative z-[1] rounded-2xl shadow-md bg-gray-200">
        {/* header */}
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center justify-between">
            {/* TODO: Implement redirect */}
            <Link href="/" className="w-fit h-fit block">
              <Image
                width={32}
                height={32}
                alt="post-author"
                src={getAvatar(item.author)}
                className="rounded-full"
              />
            </Link>

            <div className="header-action">
              {/* read post button */}
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 text-sm text-white bg-dark rounded-lg w-fit h-auto py-2 px-2 font-bold max-h-8"
              >
                {t('common.readPost')}
                <RenderIcon name="export-icon" className="!w-5 !h-5" strokeWidth={3} />
              </Link>
            </div>
          </div>
          <p className="font-medium text-sm">{item.title}</p>
        </div>

        {/* content */}
        <div className="flex flex-col items-start gap-3">
          {/* tags */}
          <div className="flex items-center flex-wrap gap-2 justify-start px-2">
            {(newTags.tags ?? []).map((item) => (
              <Tag type="outline" content={item.name} key={item.id} color={item.color as string} />
            ))}
            {newTags.more && (
              <Tag icon="add" content={t('plural.message', { count: newTags.more })} />
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            {/* created & read time */}
            <div className="flex items-center text-xs gap-1 text-text-tertiary px-4">
              <span>{formatDate(item.updatedAt ?? item.createdAt, EDateFormat.MMMM_yyyy)}</span>
              <span className="w-[3px] h-[3px] min-w-[3px] min-h-[3px] rounded-full bg-text-tertiary"></span>
              <span>{t('common.readTime', { number: item.minRead })}</span>
            </div>

            {/* thumbnails */}
            {thumbnail && thumbnail.url ? (
              <Image
                width={288}
                height={162}
                alt="thumbnail"
                src={thumbnail.url}
                className="rounded-xl w-full max-h-[136px]"
              />
            ) : (
              <Image
                width={288}
                height={136}
                alt="thumbnail"
                src="/assets/not-found.jpg"
                className="rounded-xl w-full h-[136px]"
              />
            )}
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between">
          {/* vote */}
          <div className="action-avocado items-center flex gap-1 text-text-tertiary">
            <button className="p-[3px] rounded-lg">
              <RenderIcon name="vote-up" />
            </button>
            <span className="font-medium">{totalUpVote}</span>
          </div>

          {/* comment */}
          <div className="action-blue-cheese items-center flex gap-1 text-text-tertiary">
            <button className="p-[3px] rounded-lg">
              <RenderIcon name="message-text" />
            </button>
            <span className="font-medium">{totalComment}</span>
          </div>

          {/* bookmark */}
          <div className="action-bun items-center flex gap-1 text-text-tertiary">
            <button className="p-[3px] rounded-lg">
              <RenderIcon name="bookmark" />
            </button>
          </div>

          {/* share link */}
          <div className="action-cabbage first-line:items-center flex gap-1 text-text-tertiary ">
            <button className="p-[3px] rounded-lg">
              <RenderIcon name="link-2" />
            </button>
          </div>
        </div>
      </div>

      {/* TODO: Implement flag hot */}
      {/* flag */}
      {isHot && <div className="card__flag card__flag-hot">{t('common.hot')}</div>}
    </article>
  );
}
