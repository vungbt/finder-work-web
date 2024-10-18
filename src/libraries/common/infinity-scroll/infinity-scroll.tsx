import { RenderIcon } from '@/libraries/icons';
import { ReactNode } from 'react';
import InfiniteScrollList from 'react-infinite-scroll-component';

type InfiniteScrollProps<T> = {
  items: T[];
  loading?: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
  renderItem: (item: T, index: number) => JSX.Element;
  loader?: JSX.Element;
  endMessage?: JSX.Element;
  scrollableTarget?: ReactNode;
  className?: string;
};

export const InfiniteScroll = <T,>({
  items,
  onLoadMore,
  hasMore,
  renderItem,
  loader = <RenderIcon name="loading" />,
  endMessage = <p>No more data</p>,
  scrollableTarget = 'scrollableTarget',
  className
}: InfiniteScrollProps<T>) => {
  return (
    <InfiniteScrollList
      dataLength={items.length}
      next={onLoadMore}
      hasMore={hasMore}
      loader={loader}
      endMessage={endMessage}
      className={className}
      scrollableTarget={scrollableTarget}
    >
      {items.map(renderItem)}
    </InfiniteScrollList>
  );
};
