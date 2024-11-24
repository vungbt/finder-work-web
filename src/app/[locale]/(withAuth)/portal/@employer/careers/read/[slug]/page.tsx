import { CareersDetailView } from '@/@views/admin/careers';
import { PostItem } from '@/configs/graphql/generated';
import { getDetailPost } from '@/utils/server-transfers';
import { notFound } from 'next/navigation';

// export async function generateStaticParams() {
//   const posts = await fetch('https://.../posts').then((res) => res.json())

//   return posts.map((post) => ({
//     slug: post.slug,
//   }))
// }

export default async function CareersPageDetail({ params }: { params: { slug: string } }) {
  if (!params.slug || params.slug.length <= 0) return notFound();
  const post = await getDetailPost({ where: { slug: { equals: params.slug } } });
  if (!post) return notFound();

  return <CareersDetailView data={post as PostItem} />;
}
