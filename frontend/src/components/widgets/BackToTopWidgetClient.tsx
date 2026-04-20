'use client';

import dynamic from 'next/dynamic';

const BackToTopWidget = dynamic(
  () => import('./BackToTopWidget').then((m) => m.BackToTopWidget),
  { ssr: false },
);

export default function BackToTopWidgetClient() {
  return <BackToTopWidget />;
}
