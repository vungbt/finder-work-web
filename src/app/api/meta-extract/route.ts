import { metaExtract } from '@/utils/meta-extract';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shareLink = searchParams.get('url');
  if (!shareLink || shareLink.length <= 0) return Response.json(null);
  const response = await metaExtract.extract(shareLink);
  if (!response) return Response.json(null);
  const imageUrl = response?.ogImage ?? response?.twitterImage;
  const title = response?.title ?? response?.ogTitle ?? response?.twitterTitle;
  const description =
    response?.description ?? response?.ogDescription ?? response?.twitterDescription;
  const url = response?.ogUrl ?? response?.alWebUrl ?? response?.twitterUrl;
  return Response.json({
    imageUrl,
    title,
    description,
    url,
    originUrl: shareLink
  });
}
