'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import ProductsListPanel from './_components/products-list-panel';

interface Props {
  initialCategoryId?: string;
}

export default function ProductsPage({ initialCategoryId }: Props) {
  const t = useAdminT('admin.products');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('header.title')}</CardTitle>
          <CardDescription>{t('header.description')}</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">{t('tabs.list')}</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <ProductsListPanel initialCategoryId={initialCategoryId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
