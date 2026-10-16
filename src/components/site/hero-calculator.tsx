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
      className="mx-auto max-w-[1280px] px-[clamp(20px,4vw,48px)] pt-[clamp(20px,4.5vh,64px)]"
    >
      <h1 className="mx-auto my-0 max-w-[1100px] text-center text-[clamp(40px,min(6.6vw,8.4vh),88px)] leading-[.96] font-bold tracking-[-.04em] text-balance max-[640px]:text-[clamp(44px,12.6vw,60px)] max-[640px]:leading-[.94]">
        Her satıştan ne kadar <span className="text-accent">kâr kaldığını</span> saniyede gör.
      </h1>
      <p className="mx-auto mt-[clamp(10px,2vh,20px)] mb-0 max-w-[640px] text-center text-[clamp(16px,1.3vw,19px)] leading-normal text-ink-2 text-pretty">
        Satış fiyatını ve maliyetini yaz. Komisyon, kargo ve KDV düşülmüş net kârını fiş olarak gör. Tekli hesaplama
        ücretsiz.
      </p>

      <div
        id="hesapla"
        className="mt-[clamp(16px,3vh,40px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-stretch gap-[clamp(16px,2.4vw,32px)]"
      >
        <CalculatorForm />
        <Receipt />
      </div>
    </section>
  );
}
