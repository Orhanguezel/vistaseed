'use client';

import Image from 'next/image';
import { useSiteLogo } from '@/lib/use-site-logo';

const FALLBACK_URL = '/uploads/media/logo/vistaseed_logo.png';
const FALLBACK_ALT = 'vistaseeds';

export function AuthBrandLogo({
  size = 96,
  alt,
}: {
  size?: number;
  alt?: string;
}) {
  const logo = useSiteLogo('site_logo');
  const url = logo?.url || FALLBACK_URL;
  const label = alt || logo?.alt || FALLBACK_ALT;

  return (
    <Image
      src={url}
      alt={label}
      width={size * 4}
      height={size}
      priority
      unoptimized
      className="object-contain h-full w-auto mx-auto"
    />
  );
}
