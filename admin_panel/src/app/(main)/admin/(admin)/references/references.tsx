'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import ReferencesListPanel from './_components/references-list-panel';

export default function ReferencesPage() {
  const t = useAdminT('admin.references');

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
          <ReferencesListPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
