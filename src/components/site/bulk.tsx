"use client";

import { useRef } from "react";
import { bulkCsv, parseCsv, simple } from "@/lib/calc";
import { SAMPLE } from "@/lib/constants";
import { pct, signed, tl } from "@/lib/format";
import { useApp } from "../app-provider";

const STEPS = [
  "Excel'de listeni hazırla: ürün, fiyat, maliyet, komisyon (%), kargo",
  "“CSV olarak kaydet” ve buraya yükle",
  "Kâr raporunu Excel veya PDF olarak indir",
];

const COLS = "grid-cols-[minmax(0,1fr)_84px_52px_96px]";

export function Bulk() {
  const { rows, setRows, premium, goPremium, notify, dateStr } = useApp();
  const locked = !premium;
  const fileRef = useRef<HTMLInputElement>(null);
  const total = rows.reduce((a, r) => a + simple(r), 0);

  /** Premium değilse tıklamalar ödeme sayfasını açar */
  const gate = (fn: () => void) => () => {
    if (locked) {
      goPremium();
      return;
    }
    fn();
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      const parsed = parseCsv(String(fr.result));
      if (parsed.length) {
        setRows(parsed);
        notify(parsed.length + " ürün hesaplandı");
      } else notify("CSV okunamadı");
    };
    fr.readAsText(f);
    e.target.value = "";
  };

  const exportExcel = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([bulkCsv(rows)], { type: "text/csv;charset=utf-8" }));
    a.download = "kar-fisi-toplu.csv";
    a.click();
    notify("Excel dosyası indirildi");
  };

  const blur = locked ? { filter: "blur(3px)" } : undefined;

  return (
    <section id="toplu" className="overflow-hidden bg-ink text-paper">
      <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-stretch gap-x-[clamp(40px,6vw,96px)] gap-y-12 px-[clamp(20px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
        <div className="relative flex flex-col justify-between gap-9 py-2">
          <div>
            <div className="font-mono text-xs tracking-[.12em] text-accent-light uppercase">
              Premium Araç · Toplu Hesaplama
            </div>
            <h2 className="mt-5 mb-0 text-[clamp(42px,5vw,72px)] leading-[.95] font-bold tracking-[-.04em]">
              Yüzlerce ürünü tek seferde hesapla.
            </h2>
            <p className="mt-[26px] mb-0 max-w-[540px] text-[clamp(17px,1.5vw,20px)] leading-[1.55] text-dim-2 text-pretty">
              Onlarca ürün satıyorsan hepsini hesaplayıcıya tek tek girmen gerekmez. Ürün listeni CSV olarak yükle; her
              ürünün net kârını ve toplamını tek tabloda gör, sonucu Excel olarak indir.
            </p>
          </div>
          <div className="flex flex-col border-t border-paper/[.18]">
            {STEPS.map((t, i) => (
              <div
                key={t}
                className="grid grid-cols-[44px_minmax(0,1fr)] items-baseline gap-3 border-b border-paper/[.12] py-5"
              >
                <span className="font-mono text-[13px] text-dim">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[clamp(17px,1.4vw,19px)] leading-[1.4]">{t}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={gate(() => fileRef.current?.click())}
              className="rounded-full border-0 bg-paper px-[26px] py-4 text-[16.5px] font-semibold text-ink hover:bg-white"
            >
              CSV Yükle
            </button>
            <button
              onClick={gate(() => {
                setRows(SAMPLE);
                notify("Örnek veri yüklendi");
              })}
              className="border-0 bg-transparent px-1.5 py-2.5 text-[16.5px] text-paper underline underline-offset-4"
            >
              Örnek veriyle dene
            </button>
            <input ref={fileRef} type="file" accept=".csv,.txt" onChange={onFile} className="hidden" />
          </div>
        </div>

        <div className="drop-shadow-[0_20px_40px_rgba(0,0,0,.4)]">
          <div
           
            className="receipt-edge bg-receipt px-[clamp(18px,2.6vw,30px)] pt-[clamp(22px,3vw,32px)] pb-12 font-mono text-[13.5px] tabular-nums text-ink"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="text-[15px] font-semibold tracking-[.2em]">TOPLU KÂR RAPORU</span>
              <span className="text-[11.5px] text-muted" suppressHydrationWarning>
                {rows.length} ÜRÜN · {dateStr}
              </span>
            </div>
            <div className="mt-4 mb-1 border-t border-dashed border-ink" />
            <div style={blur}>
              <div
                className={`grid ${COLS} gap-3 border-b border-ink/20 py-2.5 text-[10.5px] tracking-[.12em] text-muted`}
              >
                <span>ÜRÜN</span>
                <span className="text-right">FİYAT</span>
                <span className="text-right">KOM.</span>
                <span className="text-right">NET KÂR</span>
              </div>
              {rows.map((row, i) => {
                const n = simple(row);
                return (
                  <div
                    key={i}
                    className={`grid ${COLS} items-center gap-3 border-b border-dashed border-ink/[.22] py-[11px]`}
                  >
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate font-sans text-[15.5px] font-semibold">{row[0]}</span>
                      <span className="text-[11px] text-muted-2">
                        maliyet {tl(row[2])} · kargo {tl(row[4])}
                      </span>
                    </span>
                    <span className="text-right">{tl(row[1])}</span>
                    <span className="text-right text-muted">%{pct(row[3])}</span>
                    <span
                      className="text-right font-semibold"
                      style={{ color: n >= 0 ? "#14140F" : "oklch(0.55 0.17 28)" }}
                    >
                      {signed(n)}
                    </span>
                  </div>
                );
              })}
              <div className="mt-3.5 flex items-baseline justify-between gap-3 border-t-[3px] border-double border-ink pt-3.5">
                <span className="font-semibold tracking-[.12em]">TOPLAM NET KÂR</span>
                <span className="font-sans text-[clamp(30px,3.4vw,42px)] font-bold tracking-[-.035em]">
                  {signed(total)}
                </span>
              </div>
            </div>
            <div
              className="mt-[22px] flex flex-wrap gap-2 select-none"
              style={{ ...blur, pointerEvents: locked ? "none" : "auto" }}
            >
              <button
                onClick={exportExcel}
                className="flex-1 rounded-full border-0 bg-ink px-4 py-3 font-sans text-[14.5px] font-medium whitespace-nowrap text-paper hover:bg-accent"
              >
                Excel olarak indir
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 rounded-full border border-ink/30 bg-transparent px-4 py-3 font-sans text-[14.5px] whitespace-nowrap text-ink hover:border-ink"
              >
                PDF olarak indir
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
