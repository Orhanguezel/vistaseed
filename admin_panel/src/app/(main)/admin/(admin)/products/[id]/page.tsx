import ProductDetailClient from '../_components/product-detail-client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}
