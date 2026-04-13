'use client';

import dynamic from 'next/dynamic';

const FrostWarningWidget = dynamic(
  () => import('./FrostWarningWidget').then((m) => m.FrostWarningWidget),
  { ssr: false },
);

export default function FrostWarningWidgetClient() {
  return <FrostWarningWidget />;
}
