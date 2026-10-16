"use client";

import { useEffect } from "react";
import { pct, signed, tl, upperTr } from "@/lib/format";
import { PNAME } from "@/lib/constants";
import { calc } from "@/lib/calc";
import { downloadReceiptPng, receiptText } from "@/lib/png";
import { useApp } from "../app-provider";

const DEMO = calc({ price: "899", cost: "420", comm: "18", ship: "39", target: "", kdv: 20, stopaj: 0, premium: false });

const FEED_T = ["translateY(0)", "translateY(-14px)", "translateY(-101%)"] as const;

export function Receipt() {
  const {
    form,
    result: r,
    premium,
    hasPrice,
    feed,
    feedDur,
    no,
    dateStr,
    receiptRef,
    setRcptVis,
    saveHistory,
    notify,
    goPremium,
  } = useApp();
  const locked = !premium;
  const sample = !hasPrice;
  const v = sample ? DEMO : r;

  /* fiş ekran dışındayken mobilde alt çubuk görünsün */
  useEffect(() => {
    const el = receiptRef.current;
    if (!el || !window.IntersectionObserver) return;
    const io = new IntersectionObserver((es) => setRcptVis(es[0].isIntersecting), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [receiptRef, setRcptVis]);

  const lines: [string, string, number][] = [
    ["Satış fiyatı", tl(v.P), 600],
    ["Komisyon kesintisi", "−" + tl(v.commAmt), 400],
    ["Kargo gideri", "−" + tl(v.S), 400],
    ["Ürün maliyeti", "−" + tl(v.C), 400],
    ["KDV kesintisi (net)", premium && !sample ? "−" + tl(v.kdvAmt) : "—", 400],
    ["Gelir vergisi", premium && !sample ? "−" + tl(v.tax) : "—", 400],
  ];

  const copyDetails = () => {
    const t = receiptText(r, form.name, form.platform, no);
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).catch(() => {
      const a = document.createElement("textarea");
      a.value = t;
      document.body.appendChild(a);
      a.select();
      try {
        document.execCommand("copy");
      } catch {
        /* kopyalama desteklenmiyor */
      }
      a.remove();
    });
    notify("Detaylar panoya kopyalandı");
  };

  const download = async () => {
    if (locked) {
      goPremium();
      return;
    }
    await downloadReceiptPng({ r, name: form.name, platform: form.platform, no });
    notify("Fiş PNG olarak indirildi");
  };

  const action =
    "flex items-center gap-2 border-0 bg-transparent px-1 py-2 font-mono text-[12.5px] tracking-[.1em] uppercase underline decoration-transparent underline-offset-[5px] transition-[opacity,text-decoration-color] duration-150 hover:opacity-100 hover:decoration-ink";

  return (
    <div className="sticky top-[88px] flex flex-col items-center gap-5 self-start px-[clamp(0px,2vw,24px)] py-2 text-ink">
      <div
        ref={receiptRef}
        className="w-full max-w-[430px] drop-shadow-[0_18px_30px_rgba(20,20,15,.14)] drop-shadow-[0_2px_4px_rgba(20,20,15,.08)]"
      >
        {/* yazıcı ağzı */}
        <div className="relative z-2 h-2.5 rounded-full bg-ink shadow-[inset_0_-2px_0_rgba(255,255,255,.12)]" />
        <div className="-mt-[5px] mr-2.5 ml-2.5 overflow-hidden">
          <div
            className="receipt-edge relative bg-receipt px-6 pt-[34px] pb-11 font-mono text-[13px] leading-normal text-ink max-[640px]:pt-6 max-[640px]:pb-8 max-[640px]:text-[12.5px]"
            style={{
              transform: FEED_T[feed],
              transition: feed ? "none" : `transform ${feedDur}s cubic-bezier(.2,.8,.2,1)`,
            }}
          >
            <div className="flex flex-col gap-1 text-center">
              <span className="text-[17px] font-semibold tracking-[.22em]">KÂR FİŞİ</span>
              <span className="text-[11px] text-muted" suppressHydrationWarning>
                №{String(no).padStart(6, "0")} · {dateStr}
              </span>
            </div>
            <div className="mt-[18px] mb-3 border-t border-dashed border-ink max-[640px]:mt-3 max-[640px]:mb-2" />
            <div className="flex flex-col gap-[3px]">
              <div className="flex justify-between gap-3">
                <span className="text-muted">ÜRÜN</span>
                <span className="truncate text-right">{upperTr(form.name.trim() || "—")}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted">PLATFORM</span>
                <span>{upperTr(PNAME[form.platform])}</span>
              </div>
            </div>
            <div className="my-3 border-t border-dashed border-ink" />

            <div className={sample ? "opacity-45 select-none" : ""}>
                <div className="flex flex-col gap-1.5 max-[640px]:gap-1">
                  {lines.map(([label, value, w]) => (
                    <div key={label} className="flex justify-between gap-3 tabular-nums">
                      <span>{label}</span>
                      <span style={{ fontWeight: w }}>{value}</span>
                    </div>
                  ))}
                </div>
                <div className="my-3.5 border-t-[3px] border-double border-ink max-[640px]:my-2.5" />
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold tracking-[.12em]">NET KÂR</span>
                  <span className="text-[11.5px] text-muted">Kâr marjı: %{pct(v.margin)}</span>
                </div>
                <div
                  className="mt-1.5 font-sans text-[clamp(40px,5vw,54px)] leading-[1.05] max-[640px]:text-[38px] font-bold tracking-[-.035em] tabular-nums"
                  style={{ color: v.net >= 0 ? "#14140F" : "oklch(0.55 0.17 28)" }}
                >
                  {signed(v.net)}
                </div>
            </div>
            {sample && (
              <div className="mt-3 text-center font-mono text-[11px] tracking-[.1em] text-accent uppercase">
                ↑ Örnek hesap · kendi fiyatını yaz
              </div>
            )}

            <div className="barcode mt-[26px] h-[46px] max-[640px]:mt-4 max-[640px]:h-8" />
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-[410px] items-center justify-center gap-[22px] pt-0.5">
        <button onClick={saveHistory} className={`${action} font-semibold`}>
          <span className="text-sm">+</span>Kaydet
        </button>
        <span className="size-[3px] rounded-full bg-ink/30" />
        <button onClick={copyDetails} className={`${action} opacity-[.72]`}>
          <span className="text-sm">⧉</span>Kopyala
        </button>
        <span className="size-[3px] rounded-full bg-ink/30" />
        <button onClick={download} className={`${action} opacity-[.72]`}>
          <span className="text-sm">↓</span>İndir
        </button>
      </div>
    </div>
  );
}
