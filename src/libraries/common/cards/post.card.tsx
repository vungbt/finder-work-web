import { Post } from '@/configs/graphql/generated';
import { getAvatar } from '@/utils/helpers/common';
import Image from 'next/image';
import React from 'react';
import { Tag } from '../tags';

type PostCardProps = {
  item: Post;
};

export function PostCard({ item }: PostCardProps) {
  return (
    <div className="w-80 rounded-2xl bg-gray-200 p-4 flex flex-col gap-3">
      <div>
        <Image
          width={32}
          height={32}
          alt="post-author"
          src={getAvatar(item.author)}
          className="rounded-full"
        />
      </div>
      <p className="font-medium text-sm">{item.title}</p>

      {/* tags */}
      <div>
        {(item.tags ?? []).map((item) => (
          <Tag content={item.name} key={item.id} color={item.color as string} />
        ))}
      </div>
    </div>
  );
}
