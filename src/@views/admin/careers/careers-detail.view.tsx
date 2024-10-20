'use client';
import { AdminCareerDetailUtils } from '@/@handles/career';
import { PostItem, VoteAction } from '@/configs/graphql/generated';
import { CommentInput, CommentList } from '@/libraries/comment';
import { IconButton, ModalReport, Tag } from '@/libraries/common';
import { copyToClipboard, focusInput, getAvatar, getFullName } from '@/utils/helpers/common';
import { EDateFormat, formatDate } from '@/utils/helpers/formatter';
import { Link } from '@/utils/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function CareersDetailView({ data: post }: { data: PostItem }) {
  const t = useTranslations();
  const {
    profile,
    shareUrl,
    thumbnails,
    isBookmark,
    isReported,
    isDownVote,
    isUpVote,
    totalComment,
    totalUpVote,

    // report post
    isOpenReport,
    loadingReport,
    setIsOpenReport,
    onSubmitReport,

    // comment
    hasMore,
    comments,
    loadingComment,
    loadingCommentList,
    commentSubscription,
    onSendComment,
    onLoadMoreComments,

    // vote
    onVotePost,
    onBookmark
  } = AdminCareerDetailUtils({ post });

  return (
    <section>
      {/* TODO: Implement redirect to Author */}
      <div className="flex items-center gap-6">
        <Link href="/" className="w-fit h-fit block">
          <Image
            width={64}
            height={64}
            alt="post-author"
            src={getAvatar(post.author)}
            className="rounded-full w-16 h-16"
          />
        </Link>
        <div>
          <p className="text-lg font-medium">{getFullName(post.author)}</p>
          {/* created & read time */}
          <div className="flex items-center text-base gap-1 text-text-tertiary font-medium">
            <span>{formatDate(post.updatedAt ?? post.createdAt, EDateFormat.MMMM_yyyy)}</span>
            <span className="w-[3px] h-[3px] min-w-[3px] min-h-[3px] rounded-full bg-text-tertiary"></span>
            <span>{t('common.readTime', { number: post.minRead })}</span>
          </div>
        </div>
      </div>

      <Link href={shareUrl} target="_blank" className="mt-4 flex w-fit">
        <h1 className="text-3xl">{post.title}</h1>
      </Link>
      <article className="mt-6" dangerouslySetInnerHTML={{ __html: post.content }} />
      {/* thumbnails */}
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        {thumbnails && thumbnails.length > 0 ? (
          thumbnails.map((item) => (
            <Image
              key={item.id}
              width={400}
              height={210}
              priority
              alt="thumbnail"
              src={item.url ?? '/assets/not-found.jpg'}
              className={clsx('rounded-xl w-full max-w-[400px] h-[210px]', {
                '!w-full !max-w-full !h-auto': thumbnails.length === 1
              })}
            />
          ))
        ) : (
          <Image
            width={400}
            height={210}
            alt="thumbnail"
            src="/assets/not-found.jpg"
            className="rounded-xl max-w-[400px] h-[210px]"
          />
        )}
      </div>

      {/* tags */}
      <div className="mt-6 flex items-center justify-start gap-2 flex-wrap border-t border-solid border-gray-100 py-4">
        {(post.tags ?? []).map((item) => (
          <Tag
            className="!text-sm"
            type="outline"
            content={item.name}
            key={item.id}
            color={item.color as string}
          />
        ))}
      </div>

      {/* comment & vote */}
      <div className="flex items-center text-sm gap-3 text-text-tertiary">
        <p className="capitalize">{t('plural.upVotes', { count: totalUpVote })}</p>
        <p className="capitalize">{t('plural.comments', { count: totalComment })}</p>
      </div>

      {/* actions */}
      <div className="flex items-center justify-between border border-solid border-gray-100 rounded-2xl mt-2 pr-2">
        <div className="flex items-center justify-start">
          <div className="flex items-center border border-solid border-gray-100 rounded-2xl p-2 gap-2">
            {/* vote up */}
            <IconButton
              onClick={() => onVotePost(VoteAction.UpVote)}
              iconName={isUpVote ? 'vote-up-bold' : 'vote-up'}
              styleType="avocado"
              classNameIcon="!w-7 !h-7"
              classNameWrap={clsx({
                '!text-avocado-pressed': isUpVote
              })}
            />
            {/* vote down */}
            <IconButton
              onClick={() => onVotePost(VoteAction.DownVote)}
              iconName={isDownVote ? 'vote-down-bold' : 'vote-down'}
              styleType="ketchup"
              classNameIcon="!w-7 !h-7"
              classNameWrap={clsx({
                '!text-ketchup-pressed': isDownVote
              })}
            />
          </div>

          <div className="flex items-center px-4 justify-between gap-4">
            {/* comment */}
            <IconButton
              label={t('comment')}
              iconName={totalComment > 0 ? 'message-text-bold' : 'message-text'}
              styleType="blue-cheese"
              classNameIcon="!w-7 !h-7"
              onClick={() => focusInput('comment-box')}
              classNameWrap={clsx({
                '!text-blue-cheese-pressed': totalComment > 0
              })}
            />
            {/* bookmark */}
            <IconButton
              onClick={onBookmark}
              classNameIcon="!w-7 !h-7"
              classNameWrap={clsx({
                '!text-bun-pressed': isBookmark
              })}
              label={t('bookmark')}
              iconName={isBookmark ? 'bookmark-bold' : 'bookmark'}
              styleType="bun"
            />

            {/* share link */}
            <IconButton
              onClick={() => copyToClipboard(shareUrl, t)}
              classNameIcon="!w-7 !h-7"
              iconName="link-2"
              styleType="cabbage"
              label={t('copy')}
            />
          </div>
        </div>

        {/* report post */}
        <IconButton
          onClick={() => setIsOpenReport(true)}
          classNameIcon="!w-7 !h-7"
          classNameWrap={clsx({
            '!text-subtlest-pressed': isReported
          })}
          iconName={isReported ? 'warning-2-bold' : 'warning-2'}
          styleType="subtlest"
          disabled={isReported}
        />
      </div>

      {/* comments */}
      <CommentInput
        avatarUrl={getAvatar(profile)}
        onSubmit={onSendComment}
        loading={loadingComment}
        className="my-2"
        id="comment-box"
      />

      {/* list comments */}
      <CommentList
        onLoadMore={onLoadMoreComments}
        hasMore={hasMore}
        items={comments}
        loading={loadingCommentList}
        loadingReply={loadingComment}
        commentSubscription={commentSubscription}
        onReplyComment={onSendComment}
      />

      {/* model report */}
      <ModalReport
        message={t('noti.deleteConfirm', { label: t('setting').toLowerCase() })}
        isOpen={isOpenReport}
        isLoading={loadingReport}
        onClose={() => setIsOpenReport(false)}
        onCancel={() => setIsOpenReport(false)}
        onSubmit={onSubmitReport}
      />
    </section>
  );
}
