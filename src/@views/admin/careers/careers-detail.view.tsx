'use client';
import {
  getPostThumbnails,
  getShareUrl,
  userIsBookmarkPost,
  userIsUpVote
} from '@/@handles/career';
import { PostItem, VoteAction } from '@/configs/graphql/generated';
import useProfile from '@/hooks/redux/profile/useProfile';
import { IconButton, Tag } from '@/libraries/common';
import { copyToClipboard, getAvatar, getFullName } from '@/utils/helpers/common';
import { EDateFormat, formatDate } from '@/utils/helpers/formatter';
import { Link } from '@/utils/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMemo } from 'react';

export function CareersDetailView({ data }: { data: PostItem }) {
  const t = useTranslations();
  const { profile } = useProfile();
  const post: PostItem = {
    id: '9798a483-2df5-4d81-807d-68cd2a9cf9c1',
    title: 'Array.reduce() is Goated 🐐✨\n',
    content:
      "<p>The title says it all 🐐. I want to talk about my all-time favorite javascript array method:&nbsp;<strong>Array.reduce()</strong>. I know there are a lot of contenders out there, but hear me out. reduce() is not just a method; it's a way of life✨.</p><p>I'm not going to lie though, when I first started and discovered reduce, it was a little intimidating. It took me a while before I was confidently using it everywhere in my code. But when I did, it was a game changer. Suddenly, I could perform complex operations on arrays with ease, transforming them into whatever I needed. My code become faster and cleaner.</p><p>But don't just take my word for it. Let me show you some of the things you can achieve with reduce(). It's time to dive into Array.reduce() and discover why it's absolutely goated! 🐐</p>",
    shareUrl: 'https://dev.to/mattlewandowski93/arrayreduce-is-goated-1f1j?ref=dailydev',
    metadata: {
      url: 'https://dev.to/mattlewandowski93/arrayreduce-is-goated-1f1j',
      title: 'Array.reduce() is Goated 🐐✨',
      imageUrl:
        'https://media.dev.to/cdn-cgi/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F37gxferln48z8dfxsl7b.png',
      originUrl: 'https://dev.to/mattlewandowski93/arrayreduce-is-goated-1f1j?ref=dailydev',
      description:
        'The title says it all 🐐. I want to talk about my all-time favorite javascript array method:... Tagged with webdev, javascript, typescript, beginners.'
    },
    slug: 'arrayreduce-is-goated',
    minRead: 1,
    thumbnails: [],
    jobCategory: {
      id: 'b931ecc1-a056-4e09-a034-92e832b452db',
      name: 'Software Development'
    },
    categories: [],
    tags: [
      {
        id: '0fed2893-3982-4b88-a1ef-7bc06d61a270',
        type: 'post',
        name: 'javascript',
        color: '#b69db4'
      },
      {
        id: '7760b754-60fb-4530-bcc5-53b1895a577f',
        type: 'post',
        name: 'webdev',
        color: '#61fe78'
      }
    ],
    createdAt: '2024-06-11T08:01:01.301Z',
    updatedAt: '2024-06-11T08:01:01.301Z',
    deletedAt: null,
    author: {
      id: 'c9c0c2a2-05b8-4f50-bef5-1325ff7cdc96',
      avatarUrl:
        'https://lh3.googleusercontent.com/a/ACg8ocIHT7K6EWRTSZpyBqlzZNYnU4_t9SWiJ8K71iIq_fZFTnnAlw=s96-c',
      avatar: null,
      firstName: 'Vững',
      lastName: 'Bùi',
      email: 'vungbt1999@gmail.com',
      color: '#586EE0',
      role: 'super_admin'
    },
    userBookmark: null,
    _count: {
      likes: 2,
      dislikes: 0,
      comments: 0
    },
    userVote: {
      id: 'c9c0c2a2-05b8-4f50-bef5-1325ff7cdc96',
      action: 'UP_VOTE'
    }
  };
  const thumbnails = getPostThumbnails(post);
  const shareUrl = getShareUrl(post);

  const totalUpVote = useMemo(() => {
    const likes = post?._count?.likes ?? 0;
    const dislikes = post?._count?.dislikes ?? 0;
    return likes - dislikes;
  }, [post._count]);

  const totalComment = useMemo(() => post?._count?.comments ?? 0, [post]);

  const isBookmark = useMemo(() => userIsBookmarkPost(post, profile), [post, profile]);

  const isUpVote = useMemo(() => userIsUpVote(post, profile, VoteAction.UpVote), [post, profile]);

  const isDownVote = useMemo(
    () => userIsUpVote(post, profile, VoteAction.DownVote),
    [post, profile]
  );

  return (
    <section>
      {/* TODO: Implement redirect */}
      <div className="flex items-center gap-6">
        <Link href="/" className="w-fit h-fit block">
          <Image
            width={64}
            height={64}
            alt="post-author"
            src={getAvatar(post.author)}
            className="rounded-full"
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
              onClick={() => copyToClipboard(shareUrl, t)}
              iconName={isUpVote ? 'vote-up-bold' : 'vote-up'}
              styleType="avocado"
              classNameIcon="!w-7 !h-7"
              classNameWrap={clsx({
                '!text-avocado-pressed': isUpVote
              })}
            />
            {/* vote down */}
            <IconButton
              onClick={() => copyToClipboard(shareUrl, t)}
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
              onClick={() => copyToClipboard(shareUrl, t)}
              label={t('comment')}
              iconName="message-text"
              styleType="blue-cheese"
              classNameIcon="!w-7 !h-7"
              classNameWrap={clsx({
                '!text-bun-pressed': isBookmark
              })}
            />

            {/* bookmark */}
            <IconButton
              onClick={() => copyToClipboard(shareUrl, t)}
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
        <IconButton
          onClick={() => copyToClipboard(shareUrl, t)}
          classNameIcon="!w-7 !h-7"
          iconName="warning-2"
          styleType="subtlest"
        />
      </div>
    </section>
  );
}
