import { getPostThumbnail, getShareUrl, userIsBookmarkPost, userIsUpVote } from '@/@handles/career';
import { PostItem, VoteAction } from '@/configs/graphql/generated';
import useProfile from '@/hooks/redux/profile/useProfile';
import { RenderIcon } from '@/libraries/icons';
import { copyToClipboard, getAvatar } from '@/utils/helpers/common';
import { EDateFormat, formatDate } from '@/utils/helpers/formatter';
import { Link, useRouter } from '@/utils/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMemo } from 'react';
import { Tag } from '../tags';
import { RouterPath } from '@/constants/router-path';

type PostCardProps = {
  item: PostItem;
  className?: string;
  isHot?: boolean;
  onBookmark?: (item: PostItem) => void;
  onVotePost?: (item: PostItem, action: VoteAction) => void;
};

export function PostCard({ item, className, isHot, onBookmark, onVotePost }: PostCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const thumbnail = useMemo(() => getPostThumbnail(item), [item]);
  const shareUrl = useMemo(() => getShareUrl(item), [item]);
  const { profile } = useProfile();

  const totalUpVote = useMemo(() => {
    const likes = item?._count?.likes ?? 0;
    const dislikes = item?._count?.dislikes ?? 0;
    return likes - dislikes;
  }, [item._count]);

  const totalComment = useMemo(() => item?._count?.comments ?? 0, [item]);
  const newTags = useMemo(() => {
    const tags = item?.tags ?? [];
    if (tags.length <= 3) return { tags };
    return {
      tags: tags.slice(0, 3),
      more: tags.slice(3, tags.length).length
    };
  }, [item.tags]);

  const isBookmark = useMemo(() => userIsBookmarkPost(item, profile), [item, profile]);

  const isUpVote = useMemo(() => userIsUpVote(item, profile, VoteAction.UpVote), [item, profile]);

  const onClickComment = () => {
    if (!item || !item.id) return;
    router.push(`${RouterPath.ADMIN_CAREERS_READ}/${item.slug}`);
  };
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
                href={shareUrl}
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
            {newTags.more ? (
              <Tag icon="add" content={t('plural.tags', { count: newTags.more })} />
            ) : (
              ''
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
                className="rounded-xl w-full h-[136px]"
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
          <div
            className={clsx('action-avocado items-center flex gap-1 text-text-tertiary', {
              '!text-avocado-pressed': isUpVote
            })}
          >
            <button
              className="p-[3px] rounded-lg"
              onClick={() => onVotePost && onVotePost(item, VoteAction.UpVote)}
            >
              <RenderIcon name={isUpVote ? 'vote-up-bold' : 'vote-up'} />
            </button>
            <span className="font-medium">{totalUpVote}</span>
          </div>

          {/* comment */}
          <div className="action-blue-cheese items-center flex gap-1 text-text-tertiary">
            <button className="p-[3px] rounded-lg" onClick={onClickComment}>
              <RenderIcon name="message-text" />
            </button>
            <span className="font-medium">{totalComment}</span>
          </div>

          {/* bookmark */}
          <div
            className={clsx('action-bun items-center flex gap-1 text-text-tertiary', {
              '!text-bun-pressed': isBookmark
            })}
          >
            <button className="p-[3px] rounded-lg" onClick={() => onBookmark && onBookmark(item)}>
              <RenderIcon name={isBookmark ? 'bookmark-bold' : 'bookmark'} />
            </button>
          </div>

          {/* share link */}
          <div className="action-cabbage first-line:items-center flex gap-1 text-text-tertiary ">
            <button className="p-[3px] rounded-lg" onClick={() => copyToClipboard(shareUrl, t)}>
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
