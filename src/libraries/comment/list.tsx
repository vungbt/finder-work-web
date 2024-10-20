import { CommentItem as CommentItemType } from '@/configs/graphql/generated';
import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { InfiniteScroll } from '../common';
import { CommentItem } from './item';
import clsx from 'clsx';

type CommentListProps = {
  items: CommentItemType[];
  loading?: boolean;
  hasMore?: boolean;
  loadingReply?: boolean;
  commentSubscription: CommentItemType | null;
  onReplyComment: (
    values: { content: string; parentId?: string; level?: number },
    { resetForm }: FormikHelpers<{ content: string }>
  ) => void;
  onLoadMore: () => void;
};
export function CommentList({
  items,
  loading,
  hasMore = false,
  commentSubscription,
  onLoadMore,
  onReplyComment,
  loadingReply
}: CommentListProps) {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  return (
    <div className="overflow-hidden">
      <InfiniteScroll
        items={items}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        loading={loading}
        endMessage={<></>}
        className="!overflow-hidden"
        renderItem={(item: CommentItemType, index: number) => (
          <CommentItem
            onReplyComment={onReplyComment}
            loadingReply={loadingReply}
            key={item.id}
            item={item}
            className={clsx('pb-2', {
              'pb-0': index === items.length - 1
            })}
            commentSubscription={commentSubscription}
            setActiveReplyId={setActiveReplyId}
            activeReplyId={activeReplyId}
          />
        )}
      />
    </div>
  );
}
