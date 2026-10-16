"use client";

import { useState } from "react";
import { DEMO_BARS } from "@/lib/constants";
import { num, pct, signed, tl } from "@/lib/format";
import type { HistoryItem, ProfileTab } from "@/lib/types";
import { useApp } from "../app-provider";

const TABS: [ProfileTab, string][] = [
  ["history", "Geçmiş"],
  ["perf", "Performans"],
  ["plan", "Abonelik"],
];

const marginOf = (h: HistoryItem) => (h.margin != null ? h.margin : num(h.price) ? (h.net / num(h.price)) * 100 : 0);

export function ProfileModal() {
  const { history, premium, txn, setPremium, goPremium, notify, fillFromHistory, removeHistory, clearHistory } =
    useApp();
  const [tab, setTab] = useState<ProfileTab>("history");
  const locked = !premium;
  const hist = history.slice().reverse();

  const total = history.reduce((a, h) => a + h.net, 0);
  const avgMargin = history.length ? history.reduce((a, h) => a + marginOf(h), 0) / history.length : 0;

  const barsSrc = history.length ? history.slice(-10).map((h) => h.net) : DEMO_BARS;
  const bMax = Math.max(1, ...barsSrc.map(Math.abs));

  const stat = "flex min-w-0 flex-col gap-1 rounded-[14px] border border-ink/10 bg-receipt px-3.5 py-3";
  const statLabel = "font-mono text-[10px] tracking-[.12em] text-muted";
  const statVal = "overflow-hidden text-[19px] font-bold tracking-[-.02em] text-ellipsis whitespace-nowrap tabular-nums";

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="flex flex-col gap-2 pr-10">
        <span className="eyebrow !text-[11.5px]">Hesabım</span>
        <h3 className="m-0 text-[30px] leading-none font-bold tracking-[-.03em]">Kayıtlı fişlerin</h3>
      </div>

      {tab === "history" && (
        <div className="grid grid-cols-3 gap-2">
          <div className={stat}>
            <span className={statLabel}>FİŞ</span>
            <span className={statVal}>{history.length}</span>
          </div>
          <div className={stat}>
            <span className={statLabel}>TOPLAM NET</span>
            <span className={statVal}>{signed(total)}</span>
          </div>
          <div className={stat}>
            <span className={statLabel}>ORT. MARJ</span>
            <span className={statVal}>%{history.length ? pct(avgMargin) : "0"}</span>
          </div>
        </div>
      )}

      <div className="flex gap-1 rounded-full bg-paper p-1">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 rounded-full border-0 p-[9px] text-sm whitespace-nowrap ${
              tab === id ? "bg-ink text-paper" : "bg-transparent text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "history" && (
        <div className="flex flex-col gap-2.5">
          {history.length === 0 && (
            <div className="flex flex-col items-center gap-2.5 rounded-2xl border border-dashed border-ink/30 px-5 py-7 text-center">
              <span className="flex h-[52px] w-11 flex-col gap-[5px] rounded-t-[4px] border border-ink/15 bg-receipt px-2 py-[9px]">
                <span className="h-[3px] bg-ink/20" />
                <span className="h-[3px] w-[70%] bg-ink/20" />
                <span className="h-[3px] w-[85%] bg-ink/20" />
              </span>
              <span className="text-base font-semibold">Henüz kayıtlı fiş yok</span>
              <span className="max-w-[300px] text-sm text-muted">
                Hesaplayıcıda tüm alanları doldur ve fişin altındaki “Kaydet”e bas.
              </span>
            </div>
          )}
          <div className="-mx-1 flex max-h-[340px] flex-col gap-2 overflow-auto px-1">
            {hist.map((h, ri) => (
              <div
                key={h.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3.5 gap-y-1.5 rounded-[14px] border border-ink/10 bg-receipt px-4 py-3.5"
              >
                <span className="flex min-w-0 flex-col gap-[3px]">
                  <span className="truncate text-base font-semibold">{h.name}</span>
                  <span className="font-mono text-[11px] text-muted">
                    {h.platform} · {h.date} · Satış {tl(num(h.price))}
                  </span>
                </span>
                <span className="flex flex-col items-end gap-0.5">
                  <span
                    className="font-mono text-[15px] font-semibold whitespace-nowrap"
                    style={{ color: h.net >= 0 ? "#14140F" : "oklch(0.55 0.17 28)" }}
                  >
                    {signed(h.net)}
                  </span>
                  <span className="font-mono text-[11px] text-muted">marj %{pct(marginOf(h))}</span>
                </span>
                <span className="col-span-full flex gap-3.5 border-t border-dashed border-ink/20 pt-2 font-mono text-[11.5px] tracking-[.06em]">
                  <button
                    onClick={() => fillFromHistory(h, { closeModal: true, scroll: true })}
                    className="cursor-pointer border-0 bg-transparent p-0 underline underline-offset-3"
                  >
                    HESAPLAYICIYA YÜKLE
                  </button>
                  <button
                    onClick={() => removeHistory(history.length - 1 - ri)}
                    className="cursor-pointer border-0 bg-transparent p-0 text-loss"
                  >
                    SİL
                  </button>
                </span>
              </div>
            ))}
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="self-start border-0 bg-transparent p-0 font-mono text-[11.5px] tracking-[.06em] text-muted underline underline-offset-3"
            >
              TÜM GEÇMİŞİ TEMİZLE
            </button>
          )}
        </div>
      )}

      {tab === "perf" && (
        <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-receipt p-[18px]">
          <div
            className="flex flex-col gap-4 select-none"
            style={{ filter: locked ? "blur(5px)" : "none", pointerEvents: locked ? "none" : "auto" }}
          >
            <div className="flex justify-between font-mono text-[11px] tracking-[.1em] text-muted">
              <span>SON FİŞLER · NET KÂR</span>
              <span>{history.length ? `SON ${Math.min(10, history.length)} FİŞ` : "ÖRNEK VERİ"}</span>
            </div>
            <div className="flex h-[150px] items-end gap-2 border-b-[1.5px] border-ink">
              {barsSrc.map((v, i) => (
                <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <div
                    className="min-h-1 w-full rounded-t-[5px]"
                    style={{
                      height: Math.max(3, (Math.abs(v) / bMax) * 100) + "%",
                      background: v >= 0 ? "oklch(0.86 0.08 55)" : "oklch(0.55 0.17 28)",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-[3px]">
                <span className="font-mono text-[10px] tracking-[.12em] text-muted">EN KÂRLI ÜRÜN</span>
                <span className="truncate text-[15px] font-semibold">
                  {history.length ? history.reduce((a, b) => (b.net > a.net ? b : a)).name : "—"}
                </span>
              </div>
              <div className="flex flex-col gap-[3px]">
                <span className="font-mono text-[10px] tracking-[.12em] text-muted">FİŞ BAŞI ORTALAMA</span>
                <span className="text-[15px] font-semibold">{history.length ? signed(total / history.length) : "—"}</span>
              </div>
            </div>
          </div>
          {locked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 p-5 text-center">
              <span className="text-[17px] font-semibold">Kâr performans paneli</span>
              <span className="max-w-[280px] text-[13.5px] text-ink-2">
                Kaydettiğin fişlerin trendini Premium ile gör.
              </span>
              <button
                onClick={goPremium}
                className="rounded-full border-0 bg-ink px-[18px] py-[11px] text-sm font-medium whitespace-nowrap text-paper hover:bg-accent"
              >
                Premium'a geç →
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "plan" && (
        <div className="flex flex-col gap-3.5 rounded-2xl border border-ink/10 bg-receipt p-[18px]">
          <div className="flex items-start justify-between gap-3">
            <span className="flex flex-col gap-1">
              <span className="font-mono text-[10.5px] tracking-[.12em] text-muted">MEVCUT PLAN</span>
              <span className="text-2xl font-bold tracking-[-.02em]">{premium ? "Premium" : "Ücretsiz"}</span>
            </span>
            <span
              className={`rounded-full px-[9px] py-[5px] font-mono text-[10.5px] tracking-[.1em] whitespace-nowrap ${
                premium ? "bg-accent text-card" : "bg-paper text-ink"
              }`}
            >
              {premium ? "AKTİF" : "ÜCRETSİZ"}
            </span>
          </div>
          <div className="flex flex-col border-t border-dashed border-ink/25">
            {(premium
              ? [
                  ["Ücret", txn ? txn.total + (txn.plan.includes("Yıllık") ? " / yıl" : " / ay") : "₺249,00 / ay"],
                  ["Sonraki ödeme", txn ? txn.next : "—"],
                  ["Ödeme yöntemi", txn ? `${txn.brand} •••• ${txn.last4}` : "—"],
                ]
              : [
                  ["Hesaplayıcı ve komisyon rehberi", "Açık"],
                  ["Toplu CSV, vergi analizi, raporlar", "Kilitli"],
                  ["Premium", "₺249 / ay"],
                ]
            ).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 border-b border-dashed border-ink/[.18] py-[9px] text-sm">
                <span className="text-muted">{k}</span>
                <span className="text-right font-medium">{v}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              if (premium) {
                setPremium(false);
                notify("Abonelik iptal edildi");
              } else goPremium();
            }}
            className={`self-start rounded-full px-[18px] py-[11px] text-sm font-medium whitespace-nowrap ${
              premium ? "border border-loss bg-transparent text-loss" : "border-0 bg-ink text-paper"
            }`}
          >
            {premium ? "Aboneliği iptal et" : "Premium'a geç →"}
          </button>
        </div>
      )}
    </div>
  );
}
