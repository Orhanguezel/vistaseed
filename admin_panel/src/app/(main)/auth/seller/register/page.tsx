// src/app/(main)/auth/seller/register/page.tsx
'use client';

import Link from 'next/image';
import Image from 'next/image';
import { Suspense } from 'react';
import { motion } from 'framer-motion';

import { RegisterForm } from '../../_components/register-form';
import { AuthBrandLogo } from '@/components/auth/auth-brand-logo';

function RegisterFormFallback() {
  return (
    <div className="space-y-4">
      <div className="h-12 w-full rounded-xl bg-muted/50 animate-pulse" />
      <div className="h-12 w-full rounded-xl bg-muted/50 animate-pulse" />
      <div className="h-12 w-full rounded-xl bg-muted/50 animate-pulse" />
      <div className="h-12 w-full rounded-xl bg-muted/50 animate-pulse" />
    </div>
  );
}

export default function SellerRegisterPage() {
  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* Sol Panel: Görsel ve Bayi Mesajı */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="hidden relative lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden"
      >
        {/* Arka Plan Görseli */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/auth/login-bg-alt.webp"
            alt="Vistaseeds Greenhouse Landscape"
            fill
            className="object-cover scale-105"
            priority
          />
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
            <span className="text-white/60 text-xs tracking-widest uppercase">Dealer Network</span>
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
              Bayi Başvurusu
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Vistaseeds ekosistemine katılarak yüksek verimli tohumlarımızı geniş kitlelerle buluşturun. 
              Kayıt formunu doldurarak bayi ağımıza ilk adımı atın.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Sağ Panel: Kayıt Formu */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-linear-to-b from-background to-muted/20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md space-y-10"
        >
          {/* Mobil Logo */}
          <div className="lg:hidden flex justify-center mb-8">
             <AuthBrandLogo size={64} />
          </div>

          <div className="space-y-3 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Bayi Hesabı Oluştur
            </h1>
            <p className="text-muted-foreground">
              Vistaseeds bayi ağının bir parçası olun.
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border shadow-xl space-y-6">
            <Suspense fallback={<RegisterFormFallback />}>
              <RegisterForm mode="seller" fallbackNext="/admin/dashboard" />
            </Suspense>

            <div className="pt-6 border-t border-border/50">
              <p className="text-center text-muted-foreground text-xs leading-relaxed">
                Zaten bir hesabınız var mı?{' '}
                <a
                  href="/auth/seller/login"
                  className="text-primary font-medium hover:underline underline-offset-4 transition-all"
                >
                  Bayi girişine dön
                </a>
              </p>
            </div>
          </div>

          <p className="text-center text-muted-foreground/40 text-[10px] uppercase tracking-[0.2em]">
            © 2026 Vistaseeds Dealer Program
          </p>
        </motion.div>
      </div>
    </div>
  );
}
