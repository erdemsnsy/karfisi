"use client";

import { useState } from "react";
import { FAQ } from "@/lib/constants";

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
      <div className="mt-10 border-t-[1.5px] border-ink">
        {FAQ.map(([q, a], i) => {
          const o = open === i;
          const pad = o ? "24px" : "0px";
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
                className="grid w-full grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-5 border-0 bg-transparent py-[clamp(18px,2vw,24px)] text-left text-inherit transition-[padding] duration-300 ease-in-out"
                style={{ paddingInline: pad }}
              >
                <span className="font-mono text-[13px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[clamp(19px,1.9vw,24px)] leading-[1.2] font-semibold tracking-[-.02em]">{q}</span>
                <span className="grid size-10 place-items-center rounded-full border border-current font-mono text-base">
                  {o ? "−" : "+"}
                </span>
              </button>
              {o && (
                <div
                  className="grid grid-cols-[40px_minmax(0,1fr)_40px] gap-5 pb-[clamp(20px,2.2vw,28px)]"
                  style={{ paddingInline: pad }}
                >
                  <span />
                  <p className="m-0 max-w-[760px] text-[16.5px] leading-[1.6] text-pretty opacity-80">{a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
