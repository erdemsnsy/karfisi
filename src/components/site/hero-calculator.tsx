"use client";

import { useEffect } from "react";
import { useApp } from "../app-provider";
import { CalculatorForm } from "./calculator-form";
import { HeroDecor } from "./hero-decor";
import { Receipt } from "./receipt";

export function HeroCalculator() {
  const { scrollToId, setCalcVis } = useApp();

  /* Mobil alt çubuk yalnızca hesaplayıcı ekrandayken görünsün */
  useEffect(() => {
    const el = document.getElementById("hesapla-form");
    if (!el || !window.IntersectionObserver) return;
    const io = new IntersectionObserver((es) => setCalcVis(es[0].isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => {
      io.disconnect();
      setCalcVis(false);
    };
  }, [setCalcVis]);

  const startNow = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId("hesapla");
    setTimeout(() => {
      const i = document.querySelector<HTMLInputElement>('#hesapla input[inputmode="decimal"]');
      i?.focus({ preventScroll: true });
    }, 500);
  };

  return (
    <div className="relative">
    <HeroDecor />
    <section
      id="top"
      className="relative mx-auto max-w-[1280px] px-[clamp(20px,4vw,48px)] pt-[clamp(48px,7vw,96px)]"
    >
      <h1 className="m-0 max-w-[1100px] text-[clamp(42px,6.4vw,96px)] leading-[.94] font-bold tracking-[-.04em] text-balance max-[640px]:text-[clamp(50px,14.6vw,68px)] max-[640px]:leading-[.92] max-[640px]:tracking-[-.045em]">
        Her satıştan ne kadar <span className="text-accent">kâr kaldığını</span> saniyede gör.
      </h1>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-x-12 gap-y-6 max-[640px]:mt-7 max-[640px]:gap-y-8">
        <p className="m-0 max-w-[560px] text-[clamp(17px,1.4vw,20px)] leading-normal text-ink-2 text-pretty max-[640px]:text-[18px] max-[640px]:leading-[1.55]">
          Satış fiyatını ve maliyetini yaz. Komisyon, kargo ve KDV düşülmüş net kârını fiş olarak gör. Tekli hesaplama
          ücretsiz.
        </p>
        <div className="flex flex-wrap items-center gap-[22px]">
          <a
            href="#nasil"
            className="flex items-center gap-2 border-b-[1.5px] border-ink py-1.5 text-base font-medium no-underline hover:border-accent hover:text-accent"
          >
            Nasıl çalışır?
          </a>
          <a
            href="#hesapla"
            onClick={startNow}
            className="flex flex-none items-center gap-3.5 rounded-full bg-ink py-2 pr-2 pl-6 text-base font-medium whitespace-nowrap text-paper no-underline hover:bg-accent hover:text-card max-[640px]:py-1.5 max-[640px]:pr-1.5 max-[640px]:pl-5 max-[640px]:text-[15px]"
          >
            Hesaplamaya başla
            <span className="grid size-[38px] place-items-center rounded-full bg-paper text-base text-ink max-[640px]:size-8 max-[640px]:text-sm">↓</span>
          </a>
        </div>
      </div>

      <div
        id="hesapla"
        className="mt-[clamp(40px,5vw,64px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] gap-4"
      >
        <CalculatorForm />
        <Receipt />
      </div>
    </section>
    </div>
  );
}
