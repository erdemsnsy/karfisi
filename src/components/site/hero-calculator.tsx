"use client";

import { useEffect } from "react";
import { useApp } from "../app-provider";
import { CalculatorForm } from "./calculator-form";
import { Receipt } from "./receipt";

const DOTS = "radial-gradient(rgba(20,20,15,.14) 1px, transparent 1.4px)";
const FADE = "radial-gradient(ellipse 80% 90% at 50% 30%, transparent 35%, #000 100%)";

export function HeroCalculator() {
  const { setCalcVis } = useApp();

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

  return (
    <section id="top" className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-60"
        style={{ backgroundImage: DOTS, backgroundSize: "22px 22px", maskImage: FADE, WebkitMaskImage: FADE }}
      />
      <div className="relative mx-auto grid max-w-[1280px] items-start gap-x-[clamp(32px,5vw,80px)] gap-y-8 px-[clamp(20px,4vw,48px)] pt-[clamp(20px,4.5vh,64px)] min-[1024px]:grid-cols-[minmax(0,1.12fr)_minmax(0,.88fr)]">
        <div className="flex min-w-0 flex-col">
          <h1 className="m-0 text-[clamp(38px,min(4.8vw,7vh),72px)] leading-[.96] font-bold tracking-[-.04em] text-balance max-[640px]:text-[clamp(44px,12.6vw,60px)] max-[640px]:leading-[.94]">
            Her satıştan ne kadar <span className="text-accent">kâr kaldığını</span> saniyede gör.
          </h1>
          <div className="mt-[clamp(12px,2.2vh,24px)] flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <p className="m-0 max-w-[560px] text-[clamp(16px,1.3vw,19px)] leading-normal text-ink-2 text-pretty">
              Satış fiyatını ve maliyetini yaz. Komisyon, kargo ve KDV düşülmüş net kârını fiş olarak gör. Tekli
              hesaplama ücretsiz.
            </p>
            <a
              href="#nasil"
              className="border-b-[1.5px] border-ink py-1 text-base font-medium whitespace-nowrap no-underline hover:border-accent hover:text-accent"
            >
              Nasıl çalışır?
            </a>
          </div>
          <div id="hesapla" className="mt-[clamp(16px,3vh,32px)]">
            <CalculatorForm />
          </div>
        </div>
        <div className="min-w-0 min-[1024px]:pt-[clamp(0px,2vh,24px)]">
          <Receipt />
        </div>
      </div>
    </section>
  );
}
