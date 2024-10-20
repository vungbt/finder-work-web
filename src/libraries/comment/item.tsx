import {
  AllCommentQueryVariables,
  CommentItem as CommentItemType,
  SortOrder,
  User
} from '@/configs/graphql/generated';
import useProfile from '@/hooks/redux/profile/useProfile';
import { focusInput, getAvatar, getFullName } from '@/utils/helpers/common';
import { getErrorMss, getTimeToNow } from '@/utils/helpers/formatter';
import clsx from 'clsx';
import { FormikHelpers } from 'formik';
import concat from 'lodash/concat';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useApiClient } from '../providers/graphql';
import { CommentInput } from './input';

type CommentItemProps = {
  item: CommentItemType;
  loadingReply?: boolean;
  parentReplies?: CommentItemType[];
  isReplying?: boolean;
  activeReplyId: string | null;
  commentSubscription: CommentItemType | null;
  className?: string;
  level?: number;
  setActiveReplyId: (id: string | null) => void;
  setParentReplies?: (items: CommentItemType[]) => void;
  onReplyComment: (
    values: { content: string; parentId?: string; level?: number },
    { resetForm }: FormikHelpers<{ content: string }>
  ) => void;
};

export function CommentItem({
  item,
  parentReplies = [],
  loadingReply,
  className,
  level = 1,
  onReplyComment,
  activeReplyId,
  commentSubscription,
  setActiveReplyId,
  setParentReplies
}: CommentItemProps) {
  const t = useTranslations();
  const { profile } = useProfile();
  const isShowReplying = item?.id && activeReplyId === item?.id;
  const [loading, setLoading] = useState(false);
  const { apiClient } = useApiClient();
  const [replies, setReplies] = useState<CommentItemType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [firstInit, setFirstInit] = useState<boolean>(false);
  const [commentParams, setCommentParams] = useState<AllCommentQueryVariables>({
    pagination: { limit: 10, page: 0 },
    where: { parentId: { equals: item.id } },
    orderBy: [{ createdAt: SortOrder.Asc }]
  });

  // handle new comment subscription
  useEffect(() => {
    if (commentSubscription && commentSubscription.parentId === item.id) {
      if (firstInit || profile?.id === commentSubscription?.userId) {
        setReplies((prevReplies) => [...prevReplies, commentSubscription]);
      }

      if (setParentReplies) {
        const updatedReplies = parentReplies.map((parentReply) =>
          parentReply.id === commentSubscription.parentId
            ? { ...parentReply, totalReplies: (parentReply?.totalReplies ?? 0) + 1 }
            : parentReply
        );
        setParentReplies(updatedReplies);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentSubscription, item.id, firstInit]);

  useEffect(() => {
    if (activeReplyId) {
      focusInput(`reply-${activeReplyId}`);
    }
  }, [activeReplyId]);

  const fetchReplyList = async (params?: AllCommentQueryVariables) => {
    try {
      if (loading) return;
      setLoading(true);
      const res = await apiClient.allComment(params);
      setLoading(false);

      // get data to check has more
      const data = res?.all_comment?.data ?? [];
      const metadata = res?.all_comment?.metadata;
      if (metadata?.limit && data.length < metadata?.limit) {
        setHasMore(false);
      }

      const newComments = params?.pagination?.page === 1 ? data : concat(replies, data);
      setReplies(newComments as CommentItemType[]);
    } catch (error) {
      setLoading(false);
      getErrorMss(error);
    }
  };

  const onViewReplies = () => {
    const params = {
      ...commentParams,
      pagination: {
        ...commentParams.pagination,
        page: (commentParams?.pagination?.page ?? 1) + 1
      }
    };
    if (params.pagination?.page === 1) {
      setReplies([]);
    }
    setFirstInit(true);
    setCommentParams(params);
    fetchReplyList(params);
  };

  const onClickReply = (id: string) => {
    if (level >= 3) return;
    setActiveReplyId(id);
    focusInput(`reply-${id}`);
  };

  return (
    <div className={clsx('flex gap-[6px] items-start w-full', className)}>
      <Image
        width={36}
        height={36}
        className="w-9 h-9 rounded-full min-w-8 aspect-1 border border-solid shadow-sm"
        alt="avatar"
        src={getAvatar(item.user as User)}
      />

      {/* main content */}
      <div className="w-full">
        <div className="flex flex-col bg-gray-100 px-4 py-2 rounded-2xl w-fit">
          <p className="text-xs font-medium">{getFullName(item.user as User)}</p>
          <div className="text-xs text-start">{item.content}</div>
        </div>
        {/* actions */}
        <div className="flex items-center text-xs gap-3">
          <span>{getTimeToNow(item?.updatedAt ?? item.createdAt)}</span>
          <button
            className={clsx('cursor-pointer w-fit', {
              hidden: level >= 3
            })}
            onClick={() => onClickReply(item.id)}
          >
            {t('common.reply')}
          </button>
        </div>

        {/* click to view all */}
        {item.totalReplies && replies.length <= 0 ? (
          <button onClick={onViewReplies} className="text-sm mt-2 cursor-pointer outline-none">
            {t('common.viewAllReplies', { number: item.totalReplies ?? 0 })}
          </button>
        ) : null}

        <div className="mt-2">
          {/* Render replies */}
          {replies && replies.length > 0 && (
            <div className="ml-8 border-l-[1px] border-gray-100 pl-2">
              {replies.map((replyItem, replyIndex) => (
                <CommentItem
                  key={replyItem.id}
                  onReplyComment={(values, formHelper) =>
                    onReplyComment({ ...values, parentId: replyItem.id, level }, formHelper)
                  }
                  setActiveReplyId={setActiveReplyId}
                  activeReplyId={activeReplyId}
                  loadingReply={loadingReply}
                  parentReplies={replies}
                  commentSubscription={commentSubscription}
                  item={replyItem as CommentItemType}
                  isReplying
                  level={level + 1}
                  className={clsx('pb-2', {
                    'pb-0': replyIndex === replies.length - 1
                  })}
                  setParentReplies={setReplies}
                />
              ))}

              {item.totalReplies && hasMore && item.totalReplies - replies.length > 0 ? (
                <button
                  onClick={onViewReplies}
                  className="text-sm mt-2 cursor-pointer outline-none"
                >
                  {t('common.viewAllReplies', { number: item.totalReplies - replies.length })}
                </button>
              ) : null}
            </div>
          )}

          {/* Reply box */}
          {isShowReplying && (
            <div
              className={clsx('ml-8 border-l-[1px] border-gray-100 pl-2', {
                'pt-2': replies.length > 0
              })}
            >
              <CommentInput
                id={`reply-${item.id}`}
                placeholder="Write a reply..."
                onSubmit={(values, formHelper) =>
                  onReplyComment({ ...values, parentId: item.id }, formHelper)
                }
                loading={loadingReply}
                avatarUrl={getAvatar(profile)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
