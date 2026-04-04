import OfferDetailClient from "../_components/offer-detail-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <OfferDetailClient id={id} />;
}
