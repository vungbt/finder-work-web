import {
  AllCommentQueryVariables,
  CommentItem,
  File,
  PostItem,
  SubscriptionCommentPostDocument,
  SubscriptionCommentPostSubscription,
  UserOnly
} from '@/configs/graphql/generated';
import { toastError, toastSuccess } from '@/configs/toast';
import useProfile from '@/hooks/redux/profile/useProfile';
import useSubscription from '@/hooks/useSubscription';
import { useApiClient } from '@/libraries/providers/graphql';
import { getErrorMss } from '@/utils/helpers/formatter';
import { FormikHelpers } from 'formik';
import concat from 'lodash/concat';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import {
  getPostThumbnails,
  getShareUrl,
  userIsBookmarkPost,
  userIsReportPost,
  userIsUpVote,
  useVotePosts
} from '.';
import { VoteAction } from './../../configs/graphql/generated';
import { ActionStatus } from '@/types';

type AdminCareerDetailUtilsResult = {
  data: PostItem;
  profile: UserOnly;
  thumbnails:
    | File[]
    | {
        id: string;
        url: string | undefined;
      }[];
  shareUrl: string;
  totalUpVote: number;
  totalComment: number;
  isBookmark: boolean;
  isReported: boolean;
  isUpVote: boolean;
  isDownVote: boolean;

  // model report
  isOpenReport: boolean;
  loadingReport: boolean;
  setLoadingReport: (value: boolean) => void;
  setIsOpenReport: (value: boolean) => void;
  onSubmitReport: (values: { reason: string; message?: string }) => void;

  // comment
  loadingComment: boolean;
  comments: CommentItem[];
  loadingCommentList: boolean;
  hasMore: boolean;
  commentSubscription: CommentItem | null;
  onLoadMoreComments: () => void;
  setCommentParams: (values: AllCommentQueryVariables) => void;
  onSendComment: (
    values: { content: string; parentId?: string; level?: number },
    { resetForm }: FormikHelpers<{ content: string }>
  ) => void;

  // vote
  onBookmark: () => void;
  onVotePost: (action: VoteAction) => void;
};

export function AdminCareerDetailUtils({ post }: { post: PostItem }): AdminCareerDetailUtilsResult {
  const t = useTranslations();
  const { profile } = useProfile();
  const thumbnails = getPostThumbnails(post);
  const shareUrl = getShareUrl(post);
  const { apiClient } = useApiClient();

  // set init post to handle
  const [postData, setPostData] = useState<PostItem>(post);
  useEffect(() => {
    setPostData(post);
  }, [post]);

  const totalUpVote = useMemo(() => {
    const likes = postData?._count?.likes ?? 0;
    const dislikes = postData?._count?.dislikes ?? 0;
    return likes - dislikes;
  }, [postData._count]);

  const totalComment = useMemo(() => postData?._count?.comments ?? 0, [postData]);

  const isBookmark = useMemo(() => userIsBookmarkPost(postData, profile), [postData, profile]);
  const isReported = useMemo(() => userIsReportPost(postData, profile), [postData, profile]);

  const isUpVote = useMemo(
    () => userIsUpVote(postData, profile, VoteAction.UpVote),
    [postData, profile]
  );

  const isDownVote = useMemo(
    () => userIsUpVote(postData, profile, VoteAction.DownVote),
    [postData, profile]
  );

  // report post
  const [isOpenReport, setIsOpenReport] = useState<boolean>(false);
  const [loadingReport, setLoadingReport] = useState<boolean>(false);

  const onSubmitReport = async (values: { reason: string; message?: string }) => {
    try {
      setLoadingReport(true);
      const res = await apiClient.reportPost({
        data: {
          post: {
            connect: { id: post.id }
          },
          user: {
            connect: { id: profile.id }
          },
          reason: values.reason,
          message: values.message
        }
      });
      setLoadingReport(false);
      setIsOpenReport(false);
      const result = res.create_report_post;
      if (result && result.id) {
        const newPost = { ...postData };
        let userReport: { id: string } | null = newPost.userReport ?? null;
        userReport = { id: result.userId ?? '' };

        newPost.userReport = userReport as UserOnly;
        setPostData(newPost);
        return toastSuccess(t('noti.reportPostSuccess'));
      }
      toastError('noti.reportPostFailed');
    } catch (error) {
      setLoadingReport(false);
      getErrorMss(error, t('noti.reportPostFailed'));
    }
  };

  // comment
  const [loadingComment, setLoadingComment] = useState<boolean>(false);
  const [loadingCommentList, setLoadingCommentList] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentParams, setCommentParams] = useState<AllCommentQueryVariables>({
    where: { parentId: null, postId: { equals: post.id } },
    pagination: { limit: 10, page: 1 }
  });
  const [hasMore, setHasMore] = useState(true);
  const { data: commentSubscription } = useSubscription<SubscriptionCommentPostSubscription>(
    SubscriptionCommentPostDocument
  );

  useEffect(() => {
    const newPostComment = commentSubscription?.post_comment as CommentItem;
    if (!newPostComment || newPostComment.postId !== post.id) return;
    const newComments = [...comments];
    // handle comment without parentId (top-level comment)
    if (!newPostComment.parentId) {
      newComments.unshift(newPostComment);
    }
    // handle comment with parentId (reply to a comment)
    else {
      const commentIndex = newComments.findIndex((item) => item.id === newPostComment.parentId);
      if (commentIndex !== -1) {
        const currentComment = newComments[commentIndex];
        newComments[commentIndex] = {
          ...currentComment,
          totalReplies: (currentComment?.totalReplies ?? 0) + 1
        };
      }
    }

    // update total comments
    const newPost = { ...postData };
    newPost._count = {
      ...newPost._count,
      comments: (newPost._count.comments ?? 0) + 1
    };
    setPostData(newPost);
    setComments(newComments);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentSubscription, post.id]);

  useEffect(() => {
    fetchCommentList(commentParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentParams]);

  const fetchCommentList = async (params?: AllCommentQueryVariables) => {
    try {
      if (loadingCommentList) return;
      setLoadingCommentList(true);
      const res = await apiClient.allComment(params);
      setLoadingCommentList(false);

      // get data to check has more
      const data = res?.all_comment?.data ?? [];
      const metadata = res?.all_comment?.metadata;
      if (metadata?.limit && data.length < metadata?.limit) {
        setHasMore(false);
      }

      const newComment = concat(comments, data);
      setComments(newComment as CommentItem[]);
    } catch (error) {
      setLoadingCommentList(false);
      getErrorMss(error);
    }
  };

  // load more comment
  const onLoadMoreComments = () => {
    if (hasMore && !loadingCommentList) {
      setCommentParams((prevParams) => ({
        ...prevParams,
        pagination: {
          ...prevParams.pagination,
          page: (prevParams?.pagination?.page ?? 1) + 1
        }
      }));
    }
  };

  // on create comment
  const onSendComment = async (
    values: { content: string; parentId?: string; level?: number },
    { resetForm }: FormikHelpers<{ content: string }>
  ) => {
    try {
      if (!post.id || (values?.level ?? 1) >= 3) return;
      setLoadingComment(true);
      await apiClient.createComment({
        data: {
          content: values.content,
          postId: post?.id,
          parentId: values?.parentId
        }
      });
      setLoadingComment(false);
      resetForm();
    } catch (error) {
      setLoadingComment(false);
      getErrorMss(error, t('noti.reportPostFailed'));
      resetForm();
    }
  };

  // vote post & bookmark
  const [loadingBookmark, setLoadingBookmark] = useState<boolean>(false);
  const { onVotePost: handleVotePost } = useVotePosts([postData], (items) =>
    setPostData({ ...items[0] })
  );

  const onVotePost = (action: VoteAction) => {
    if (!postData.id || !action) return;
    handleVotePost({ postId: postData.id, action });
  };

  const onBookmark = async () => {
    try {
      if (loadingBookmark || !postData.id) return;
      setLoadingBookmark(true);
      const res = await apiClient.bookmark({ postId: postData.id });
      setLoadingBookmark(false);

      const { bookmark_post } = res;

      if (bookmark_post) {
        const newPost = { ...postData };
        const { data: newBookmarkPost, metadata } = bookmark_post;
        const bookmarkStatus = metadata?.status;

        let userBookmark: { id: string } | null = newPost.userBookmark ?? null;
        if (bookmarkStatus === ActionStatus.Created) {
          userBookmark = { id: newBookmarkPost.userId };
        } else {
          userBookmark = null;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newPost.userBookmark = userBookmark as any;
        setPostData(newPost);
      }
    } catch (error) {
      setLoadingBookmark(false);
      getErrorMss(error, t('noti.createError'));
    }
  };

  return {
    profile,
    data: postData,
    thumbnails,
    shareUrl,
    totalComment,
    totalUpVote,
    isBookmark,
    isReported,
    isDownVote,
    isUpVote,

    // report post
    isOpenReport,
    loadingReport,
    setLoadingReport,
    setIsOpenReport,
    onSubmitReport,

    // comment
    loadingComment,
    loadingCommentList,
    comments,
    hasMore,
    commentSubscription: commentSubscription?.post_comment as CommentItem,
    onLoadMoreComments,
    setCommentParams,
    onSendComment,

    // vote & bookmark
    onVotePost,
    onBookmark
  };
}
