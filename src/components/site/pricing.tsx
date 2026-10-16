"use client";

import { useApp } from "../app-provider";
import { SectionHead } from "../ui/section-head";

const FREE = [
  "Tek ürün net kâr hesabı, sınırsız ve kayıtsız",
  "Komisyon oranları rehberi, 5 pazaryeri",
  "Sonucu WhatsApp'a kopyalama",
];

const PREMIUM = [
  "Toplu hesaplama (CSV yükleme)",
  "KDV ve stopaj hesabı",
  "İstediğin marja göre hedef fiyat",
  "Fişi PNG olarak indirme",
  "Geçmiş arşivi, PDF/Excel raporu ve kâr grafiği",
];

export function Pricing() {
  const { premium, goPremium } = useApp();

  return (
    <section id="fiyat" className="border-t border-ink/10 bg-card">
      <div className="mx-auto max-w-[1280px] px-[clamp(20px,4vw,48px)] py-[clamp(40px,5vw,68px)]">
        <SectionHead
          eyebrow="Fiyatlandırma"
          title="Ücretsiz başla, gerekirse Premium."
          lead="Tek ürün hesabı için kayıt ya da kart gerekmez."
          balance
        />
        <div className="mx-auto mt-8 grid max-w-[980px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-stretch gap-5">
          {/* Ücretsiz */}
          <div className="flex drop-shadow-[0_14px_24px_rgba(20,20,15,.12)] drop-shadow-[0_1px_2px_rgba(20,20,15,.1)]">
            <div className="ticket-edge flex flex-1 flex-col gap-[16px] bg-receipt px-[clamp(24px,3vw,36px)] py-[clamp(34px,3.4vw,44px)] max-[640px]:gap-3 max-[640px]:px-5 max-[640px]:py-7">
              <div className="flex justify-between font-mono text-[11px] tracking-[.12em] text-muted">
                <span>PLAN №01</span>
                <span>KÂR FİŞİ</span>
              </div>
              <div className="-mt-2 border-t border-dashed border-ink" />
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xl font-semibold tracking-[-.02em]">Ücretsiz</span>
                <span className="font-mono text-xs text-muted">Herkes için</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[clamp(52px,5.4vw,72px)] leading-[.9] max-[640px]:text-[40px] font-bold tracking-[-.05em]">₺0</span>
                <span className="font-mono text-[13px] text-muted">/ her zaman</span>
              </div>
              <div className="flex flex-col">
                {FREE.map((t) => (
                  <div
                    key={t}
                    className="flex gap-3.5 border-t border-dashed border-ink/[.22] py-[8px] text-[15px] leading-[1.4] max-[640px]:gap-3 max-[640px]:py-2 max-[640px]:text-[13.5px]"
                  >
                    <span className="font-mono opacity-70">✓</span>
                    {t}
                  </div>
                ))}
              </div>
              <a
                href="#hesapla"
                className="mt-auto rounded-full border-[1.5px] border-ink p-3.5 max-[640px]:p-2.5 text-center text-[15px] font-medium no-underline hover:bg-ink hover:text-paper"
              >
                Hesaplayıcıya git
              </a>
            </div>
          </div>

          {/* Premium */}
          <div className="flex drop-shadow-[0_14px_24px_rgba(20,20,15,.18)] drop-shadow-[0_1px_2px_rgba(20,20,15,.1)]">
            <div className="ticket-edge flex flex-1 flex-col gap-[16px] bg-accent px-[clamp(24px,3vw,36px)] py-[clamp(34px,3.4vw,44px)] max-[640px]:gap-3 max-[640px]:px-5 max-[640px]:py-7 text-card">
              <div className="flex justify-between font-mono text-[11px] tracking-[.12em] text-card/75">
                <span>PLAN №02</span>
                <span>KÂR FİŞİ</span>
              </div>
              <div className="-mt-2 border-t border-dashed border-card/60" />
              <div className="flex items-center justify-between gap-3">
                <span className="text-xl font-semibold tracking-[-.02em]">Premium</span>
                <span className="font-mono text-xs text-card/80">Satıcılar için</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[clamp(52px,5.4vw,72px)] leading-[.9] max-[640px]:text-[40px] font-bold tracking-[-.05em]">₺249</span>
                <span className="font-mono text-[13px] text-card/80">/ ay</span>
              </div>
              <div className="flex flex-col">
                {PREMIUM.map((t) => (
                  <div
                    key={t}
                    className="flex gap-3.5 border-t border-dashed border-card/30 py-[8px] text-[15px] leading-[1.4] max-[640px]:gap-3 max-[640px]:py-2 max-[640px]:text-[13.5px]"
                  >
                    <span className="font-mono opacity-70">✓</span>
                    {t}
                  </div>
                ))}
              </div>
              <button
                onClick={goPremium}
                className="mt-auto rounded-full border-0 bg-card p-3.5 max-[640px]:p-2.5 text-[15px] font-semibold text-ink hover:bg-white"
              >
                {premium ? "✓ Premium aktif" : "Premium'a Geç"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
