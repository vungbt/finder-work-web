import { CommentItem as CommentItemType } from '@/configs/graphql/generated';
import { FormikHelpers } from 'formik';
import { InfiniteScroll } from '../common';
import { CommentItem } from './item';
import { useState } from 'react';

type CommentListProps = {
  items: CommentItemType[];
  loading?: boolean;
  hasMore?: boolean;
  loadingReply?: boolean;
  onReplyComment: (
    values: { content: string; parentId?: string },
    { resetForm }: FormikHelpers<{ content: string }>
  ) => void;
  onLoadMore: () => void;
};
export function CommentList({
  items,
  loading,
  hasMore = false,
  onLoadMore,
  onReplyComment,
  loadingReply
}: CommentListProps) {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  return (
    <div>
      <InfiniteScroll
        items={items}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        loading={loading}
        endMessage={<></>}
        renderItem={(item) => (
          <CommentItem
            onReplyComment={onReplyComment}
            loadingReply={loadingReply}
            key={item.id}
            item={item}
            setActiveReplyId={setActiveReplyId}
            activeReplyId={activeReplyId}
          />
        )}
      />
    </div>
  );
}
