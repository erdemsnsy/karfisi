"use client";

import { pct, signed, tl } from "@/lib/format";
import { useApp } from "../app-provider";

export function MobileBar() {
  const { barVisible, hasPrice, result, receiptRef } = useApp();
  if (!barVisible) return null;

  const goReceipt = () => {
    const el = receiptRef.current;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
  };

  return (
    <div className="fixed right-3 bottom-3 left-3 z-150 flex items-center justify-between gap-3 rounded-[18px] bg-ink py-2.5 pr-2.5 pl-[18px] text-paper shadow-[0_16px_40px_rgba(0,0,0,.3)]">
      <span className="flex min-w-0 flex-col gap-px">
        <span className="font-mono text-[10px] tracking-[.12em] text-dim">
          {hasPrice ? `NET KÂR · MARJ %${pct(result.margin)}` : "CANLI NET KÂR"}
        </span>
        {hasPrice ? (
          <>
          <span
            className="text-[22px] font-bold tracking-[-.03em] tabular-nums"
            style={{ color: result.net >= 0 ? "#EBE5D5" : "oklch(0.75 0.15 28)" }}
          >
            {signed(result.net)}
          </span>
          <span className="truncate font-mono text-[10.5px] text-dim">
            Kom. −{tl(result.commAmt)} · Kargo −{tl(result.S)} · Mal. −{tl(result.C)}
          </span>
          </>
        ) : (
          <span className="text-[17px] font-semibold tracking-[-.02em] text-dim-2">Fiyatı gir, fişin basılsın</span>
        )}
      </span>
      <button
        onClick={goReceipt}
        className="flex-none rounded-full border-0 bg-paper px-4 py-3 text-[14.5px] font-semibold text-ink"
      >
        Fişi gör ↓
      </button>
    </div>
  );
}
