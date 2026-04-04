import ReferenceDetailClient from '../_components/reference-detail-client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <ReferenceDetailClient id={id} />;
}
