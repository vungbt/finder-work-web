import { RenderIcon } from '@/libraries/icons';
import InfiniteScrollList from 'react-infinite-scroll-component';

type InfiniteScrollProps<T> = {
  items: T[];
  loading?: boolean;
  onLoadMore: () => void; // function to fetch more data
  hasMore: boolean; // boolean to determine if more data can be loaded
  renderItem: (item: T, index: number) => JSX.Element; // function to render each item
  loader?: JSX.Element; // optional loader to show while fetching
  endMessage?: JSX.Element; // optional message when no more data is available
};

export const InfiniteScroll = <T,>({
  items,
  onLoadMore,
  hasMore,
  renderItem,
  loading = false,
  loader = <RenderIcon name="loading" />,
  endMessage = <p>No more data</p>
}: InfiniteScrollProps<T>) => {
  return (
    <InfiniteScrollList
      dataLength={items.length}
      next={onLoadMore}
      hasMore={hasMore}
      loader={loading ? loader : null}
      endMessage={endMessage}
    >
      {items.map(renderItem)}
    </InfiniteScrollList>
  );
};
