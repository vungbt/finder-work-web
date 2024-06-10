import {
  PostItem,
  VoteAction,
  VotePostDocument,
  VotePostSubscription,
  VotePostSubscriptionVariables
} from '@/configs/graphql/generated';
import useSubscription from '@/hooks/useSubscription';
import { useApiClient } from '@/libraries/providers/graphql';
import { ActionStatus } from '@/types';
import { getErrorMss } from '@/utils/helpers/formatter';
import { useEffect, useState } from 'react';

export function useVotePost(data: PostItem[], callback: (items: PostItem[]) => void) {
  const { data: votePost } = useSubscription<VotePostSubscription>(VotePostDocument);
  const { apiClient } = useApiClient();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    handleVotePost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, votePost, callback]);

  const handleVotePost = () => {
    if (!data || data.length <= 0 || !votePost) return;
    const newData = [...data];
    const { data: votePostResult, metadata } = votePost.vote_post;
    const status = metadata?.status;
    const action = metadata?.action;

    const postIndexValid = newData.findIndex((item) => item.id === votePostResult.postId);
    if (postIndexValid !== -1) {
      const postItem = newData[postIndexValid];
      if (status === ActionStatus.Deleted) {
        postItem.userVote = null;
        const postCount = postItem._count;
        const likesCount = VoteAction.UpVote === action ? postCount.likes - 1 : postCount.likes;
        const dislikesCount =
          VoteAction.DownVote === action ? postCount.dislikes - 1 : postCount.dislikes;
        postItem._count = { ...postCount, likes: likesCount, dislikes: dislikesCount };
      } else {
        postItem.userVote = {
          userId: votePostResult.userId
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
        const postCount = postItem._count;
        const likesCount = VoteAction.UpVote === action ? postCount.likes + 1 : postCount.likes;
        const dislikesCount =
          VoteAction.DownVote === action ? postCount.dislikes + 1 : postCount.dislikes;
        postItem._count = { ...postCount, likes: likesCount, dislikes: dislikesCount };
      }
      newData.splice(postIndexValid, 1, postItem);
      callback(newData);
    }
  };

  const onVotePost = async (variables: VotePostSubscriptionVariables) => {
    try {
      if (loading) return;
      setLoading(true);
      await apiClient.votePost(variables);
      setLoading(false);
    } catch (error) {
      getErrorMss(error);
      setLoading(false);
    }
  };

  return {
    onVotePost,
    loading,
    data
  };
}
