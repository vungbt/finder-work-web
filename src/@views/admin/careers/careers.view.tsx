'use client';

import { AdminCareerUtils } from '@/@handles/career';
import { PostCard } from '@/libraries/common/cards';

export function CareersView() {
  const { data } = AdminCareerUtils();
  return (
    <div>
      <PostCard item={data[0]} />
    </div>
  );
}
