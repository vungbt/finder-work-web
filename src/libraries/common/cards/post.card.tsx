import { Post } from '@/configs/graphql/generated';
import React from 'react';

type PostCardProps = {
  item: Post;
};

export function PostCard({ item }: PostCardProps) {
  return <div>{item.authorId}</div>;
}
