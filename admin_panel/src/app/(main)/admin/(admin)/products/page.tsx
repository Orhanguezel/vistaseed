import ProductsPage from './products';

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { category } = await searchParams;
  return <ProductsPage initialCategoryId={category} />;
}
