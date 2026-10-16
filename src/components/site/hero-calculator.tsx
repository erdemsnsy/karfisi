"use client";

import { useEffect } from "react";
import { useApp } from "../app-provider";
import { CalculatorForm } from "./calculator-form";
import { Receipt } from "./receipt";

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
    <section
      id="top"
      className="mx-auto max-w-[1280px] px-[clamp(20px,4vw,48px)] pt-[clamp(20px,4.5vh,72px)]"
    >
      <h1 className="m-0 max-w-[1100px] text-[clamp(42px,min(6.4vw,8vh),96px)] leading-[.94] font-bold tracking-[-.04em] text-balance max-[640px]:text-[clamp(50px,14.6vw,68px)] max-[640px]:leading-[.92] max-[640px]:tracking-[-.045em]">
        Her satıştan ne kadar <span className="text-accent">kâr kaldığını</span> saniyede gör.
      </h1>
      <div className="mt-[clamp(14px,2.6vh,32px)] flex flex-wrap items-end justify-between gap-x-12 gap-y-6 max-[640px]:mt-7 max-[640px]:gap-y-8">
        <p className="m-0 max-w-[760px] text-[clamp(17px,1.4vw,20px)] leading-normal text-ink-2 text-pretty max-[640px]:text-[18px] max-[640px]:leading-[1.55]">
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
        </div>
      </div>

      <div
        id="hesapla"
        className="mt-[clamp(20px,3.4vh,56px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] gap-4"
      >
        <CalculatorForm />
        <Receipt />
      </div>
    </section>
  );
}
