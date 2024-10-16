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
  userIsUpVote
} from '.';
import { VoteAction } from './../../configs/graphql/generated';

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
    values: { content: string; parentId?: string },
    { resetForm }: FormikHelpers<{ content: string }>
  ) => void;
};

export function AdminCareerDetailUtils({ post }: { post: PostItem }): AdminCareerDetailUtilsResult {
  const t = useTranslations();
  const { profile } = useProfile();
  const thumbnails = getPostThumbnails(post);
  const shareUrl = getShareUrl(post);
  const { apiClient } = useApiClient();

  const totalUpVote = useMemo(() => {
    const likes = post?._count?.likes ?? 0;
    const dislikes = post?._count?.dislikes ?? 0;
    return likes - dislikes;
  }, [post._count]);

  const totalComment = useMemo(() => post?._count?.comments ?? 0, [post]);

  const isBookmark = useMemo(() => userIsBookmarkPost(post, profile), [post, profile]);
  const isReported = useMemo(() => userIsReportPost(post, profile), [post, profile]);

  const isUpVote = useMemo(() => userIsUpVote(post, profile, VoteAction.UpVote), [post, profile]);

  const isDownVote = useMemo(
    () => userIsUpVote(post, profile, VoteAction.DownVote),
    [post, profile]
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
      if (result && result.id) return toastSuccess(t('noti.reportPostSuccess'));
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
    where: { parentId: null },
    pagination: { limit: 10, page: 1 }
  });
  const [hasMore, setHasMore] = useState(true);
  const { data: commentSubscription } = useSubscription<SubscriptionCommentPostSubscription>(
    SubscriptionCommentPostDocument
  );

  useEffect(() => {
    const newPostComment = commentSubscription?.post_comment as CommentItem;
    if (newPostComment && newPostComment.postId === post.id && !newPostComment?.parentId) {
      const newComments = [...comments];
      newComments.unshift(newPostComment);
      setComments(newComments);
    }
    if (newPostComment && newPostComment.postId === post.id && newPostComment.parentId) {
      const newComments = [...comments];
      const commentIndex = newComments.findIndex((item) => item.id === newPostComment.parentId);
      const currentComment = newComments[commentIndex];
      newComments.splice(commentIndex, 1, {
        ...currentComment,
        totalReplies: currentComment.totalReplies + 1
      });
      setComments(newComments);
    }
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
    values: { content: string; parentId?: string },
    { resetForm }: FormikHelpers<{ content: string }>
  ) => {
    try {
      if (!post.id) return;
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

  return {
    profile,
    data: post,
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
    onSendComment
  };
}
