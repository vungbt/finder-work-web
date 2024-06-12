import {
  PostItem,
  SubscriptionVotePostDocument,
  SubscriptionVotePostSubscription,
  VoteAction,
  VotePostMutationVariables
} from '@/configs/graphql/generated';
import useSubscription from '@/hooks/useSubscription';
import { useApiClient } from '@/libraries/providers/graphql';
import { ActionStatus } from '@/types';
import { getErrorMss } from '@/utils/helpers/formatter';
import { useEffect, useRef, useState } from 'react';

export function useVotePost(data: PostItem[], callback: (items: PostItem[]) => void) {
  const { data: votePost } = useSubscription<SubscriptionVotePostSubscription>(
    SubscriptionVotePostDocument
  );
  const { apiClient } = useApiClient();
  const [loading, setLoading] = useState<boolean>(false);
  const prevDataRef = useRef<PostItem[]>([]);

  useEffect(() => {
    if (prevDataRef.current !== data && votePost) {
      handleVotePost();
    }
    prevDataRef.current = data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [votePost]);

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
        const postCount = postItem._count;
        const likesCount = VoteAction.UpVote === action ? postCount.likes - 1 : postCount.likes;
        const dislikesCount =
          VoteAction.DownVote === action ? postCount.dislikes - 1 : postCount.dislikes;
        postItem._count = { ...postCount, likes: likesCount, dislikes: dislikesCount };
      } else {
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

  const onVotePost = async (variables: VotePostMutationVariables) => {
    try {
      if (loading) return;
      setLoading(true);
      const res = await apiClient.votePost(variables);
      setLoading(false);
      const votePost = res?.vote_post;
      const { data: votePostResult, metadata } = votePost;
      const status = metadata?.status;
      const action = metadata?.action;

      const newData = [...data];
      const postIndexValid = newData.findIndex((item) => item.id === votePostResult.postId);
      if (postIndexValid !== -1) {
        const postItem = newData[postIndexValid];
        if (status === ActionStatus.Deleted) {
          postItem.userVote = null;
        } else {
          postItem.userVote = {
            id: votePostResult?.userId,
            action: action
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any;
        }
        newData.splice(postIndexValid, 1, postItem);
        callback(newData);
      }
    } catch (error) {
      getErrorMss(error);
      setLoading(false);
    }
  };

  return {
    onVotePost,
    loading,
    data: votePost
  };
}
