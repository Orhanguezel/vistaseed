// src/app/(main)/auth/login/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { motion } from 'framer-motion';

import { LoginForm } from '../_components/login-form';
import { useLocaleContext } from '@/i18n';
import { AuthBrandLogo } from '@/components/auth/auth-brand-logo';

function LoginFormFallback() {
  return (
    <div className="space-y-4">
      <div className="h-12 w-full rounded-xl bg-muted/50 animate-pulse" />
      <div className="h-12 w-full rounded-xl bg-muted/50 animate-pulse" />
      <div className="h-12 w-full rounded-xl bg-muted/50 animate-pulse" />
      <div className="h-12 w-full rounded-xl bg-muted/50 animate-pulse" />
    </div>
  );
}

export default function Login() {
  const { t } = useLocaleContext();

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* Sol Panel: Görsel ve Marka Mesajı */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="hidden relative lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden"
      >
        {/* Arka Plan Görseli */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/auth/login-bg.webp"
            alt="Vistaseeds Agriculture"
            fill
            className="object-cover scale-105"
            priority
          />
          {/* Gradyan Katman */}
          <div className="absolute inset-0 bg-linear-to-tr from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>

        {/* Logo Bölümü */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-2xl">
            <AuthBrandLogo size={48} />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl tracking-tight uppercase">Vistaseeds</span>
            <span className="text-white/60 text-xs tracking-widest uppercase">Admin Panel</span>
          </div>
        </div>

        {/* Alt Bilgi / Tagline */}
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-4"
          >
            <h2 className="text-white text-5xl font-light leading-tight">
              {t('admin.auth.login.welcomeBack')}
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Tarımsal verimliliği teknolojiyle buluşturan Vistaseeds ekosistemine hoş geldiniz. 
              Yönetim paneliniz üzerinden tüm operasyonları kolayca kontrol edin.
            </p>
          </motion.div>
          
          <div className="mt-12 flex gap-8">
            <div className="flex flex-col">
              <span className="text-white font-bold text-2xl">24k+</span>
              <span className="text-white/50 text-sm uppercase tracking-tighter">Sera Alanı (m²)</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-2xl">17M+</span>
              <span className="text-white/50 text-sm uppercase tracking-tighter">Fide Kapasitesi</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sağ Panel: Giriş Formu */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-linear-to-b from-background to-muted/20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md space-y-10"
        >
          {/* Mobil Logo (Sadece mobilde görünür) */}
          <div className="lg:hidden flex justify-center mb-8">
             <AuthBrandLogo size={64} />
          </div>

          <div className="space-y-3 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t('admin.auth.login.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('admin.auth.login.description')}
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border shadow-xl space-y-6">
            <Suspense fallback={<LoginFormFallback />}>
              <LoginForm />
            </Suspense>

            <div className="pt-6 border-t border-border/50 flex flex-col gap-3">
              <p className="text-center text-muted-foreground text-xs leading-relaxed">
                {t('admin.auth.login.noAccess')}{' '}
                <Link
                  prefetch={false}
                  href="/auth/login"
                  className="text-primary font-medium hover:underline underline-offset-4 transition-all"
                >
                  {t('admin.auth.login.contactAdmin')}
                </Link>
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="h-px flex-1 bg-border/50" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold px-2">Veya</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <p className="text-center text-muted-foreground text-xs">
                Bayi hesabı için{' '}
                <Link
                  prefetch={false}
                  href="/auth/seller/login"
                  className="text-primary font-medium hover:underline underline-offset-4 transition-all"
                >
                  bayi girişini kullan
                </Link>
              </p>
            </div>
          </div>

          {/* Alt Footer Notu */}
          <p className="text-center text-muted-foreground/40 text-[10px] uppercase tracking-[0.2em]">
            © 2026 Vistaseeds Digital Ecosystem
          </p>
        </motion.div>
      </div>
    </div>
  );
}
