'use client';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import PaymentAttemptsListPanel from './_components/payment-attempts-list-panel';

export default function PaymentAttemptsPage() {
  const t = useAdminT('admin.payment-attempts');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('header.title')}</CardTitle>
          <CardDescription>{t('header.description')}</CardDescription>
        </CardHeader>
      </Card>

      <PaymentAttemptsListPanel />
    </div>
  );
}
