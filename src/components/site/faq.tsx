"use client";

import { useState } from "react";
import { FAQ } from "@/lib/constants";

const GRID = "grid grid-cols-[40px_minmax(0,1fr)_40px] gap-5 max-[640px]:grid-cols-[24px_minmax(0,1fr)_32px] max-[640px]:gap-3";

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="sss" className="mx-auto max-w-[1280px] px-[clamp(20px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-12 gap-y-6">
        <div>
          <div className="eyebrow">Merak edilenler</div>
          <h2 className="mt-4 mb-0 text-[clamp(34px,4vw,54px)] leading-[.98] font-bold tracking-[-.035em]">
            Sık sorulan sorular.
          </h2>
        </div>
      </div>
      <div className="mt-10 border-t-[1.5px] border-ink max-[640px]:mt-6">
        {FAQ.map(([q, a], i) => {
          const o = open === i;
          const pad = o ? "px-6 max-[640px]:px-4" : "px-0";
          return (
            <div
              key={q}
              className={`border-b border-ink/[.16] transition-[background,color] duration-300 ease-in-out hover:bg-ink hover:text-paper ${
                o ? "bg-ink text-paper" : "bg-transparent text-ink"
              }`}
            >
              <button
                onClick={() => setOpen(o ? -1 : i)}
                aria-expanded={o}
                className={`${GRID} w-full items-center border-0 bg-transparent py-[clamp(18px,2vw,24px)] text-left text-inherit transition-[padding] duration-300 ease-in-out max-[640px]:py-4 ${pad}`}
              >
                <span className="font-mono text-[13px] opacity-60 max-[640px]:text-xs">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[clamp(19px,1.9vw,24px)] leading-[1.2] font-semibold tracking-[-.02em] max-[640px]:text-[17px]">
                  {q}
                </span>
                <span className="grid size-10 place-items-center rounded-full border border-current font-mono text-base max-[640px]:size-8 max-[640px]:text-sm">
                  {o ? "−" : "+"}
                </span>
              </button>
              {o && (
                <div className={`${GRID} pb-[clamp(20px,2.2vw,28px)] max-[640px]:pb-4 ${pad}`}>
                  <span />
                  <p className="m-0 max-w-[760px] text-[16.5px] leading-[1.6] text-pretty opacity-80 max-[640px]:text-[14px] max-[640px]:leading-[1.5]">
                    {a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
