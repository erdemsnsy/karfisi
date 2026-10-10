"use client";

import { useApp } from "../app-provider";

export function Done() {
  const { txn, exitCheckout, setView, goTo } = useApp();

  const lines: [string, string][] = txn
    ? [
        ["PLAN", txn.plan],
        ["KART", `${txn.brand} •••• ${txn.last4}`],
        ["İŞLEM NO", txn.id],
        ["TARİH", txn.date],
        ["SONRAKİ ÖDEME", txn.next],
      ]
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-ink/10">
        <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,48px)] py-4">
          <span className="text-2xl font-extrabold tracking-[-.04em]">Kâr Fişi</span>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-[1100px] flex-1 flex-wrap items-center justify-center gap-12 px-[clamp(20px,4vw,48px)] py-[clamp(40px,6vw,80px)]">
        <div className="flex max-w-[520px] flex-[1_1_420px] flex-col gap-5">
          <span className="grid size-16 place-items-center rounded-full bg-accent text-[28px] font-bold text-card">✓</span>
          <h1 className="m-0 text-[clamp(40px,5vw,68px)] leading-[.95] font-bold tracking-[-.04em]">
            Ödeme tamamlandı.
          </h1>
          <p className="m-0 text-[19px] leading-normal text-ink-2">
            Premium üyeliğin aktif. Toplu hesaplama, vergi analizi ve raporlar artık açık. Faturan {txn?.email}{" "}
            adresine gönderildi.
          </p>
          <div className="mt-1.5 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setView("site");
                goTo("toplu");
              }}
              className="rounded-full border-0 bg-ink px-[26px] py-4 text-base font-medium whitespace-nowrap text-paper hover:bg-accent"
            >
              Toplu hesaplamayı dene →
            </button>
            <button
              onClick={exitCheckout}
              className="rounded-full border-[1.5px] border-ink bg-transparent px-6 py-[15px] text-base whitespace-nowrap hover:bg-ink hover:text-paper"
            >
              Hesaplayıcıya dön
            </button>
          </div>
        </div>
        <div className="w-full flex-[0_1_400px] drop-shadow-[0_18px_30px_rgba(20,20,15,.14)]">
          <div className="receipt-edge bg-receipt px-[26px] pt-[30px] pb-[50px] font-mono text-[13.5px] leading-[1.55]">
            <div className="flex flex-col gap-1 text-center">
              <span className="text-base font-semibold tracking-[.22em]">ÖDEME FİŞİ</span>
              <span className="text-[11px] text-muted">ONAYLANDI</span>
            </div>
            <div className="mt-4 mb-3 border-t border-dashed border-ink" />
            <div className="flex flex-col gap-[7px]">
              {lines.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <span className="text-muted">{k}</span>
                  <span className="text-right">{v}</span>
                </div>
              ))}
            </div>
            <div className="my-3.5 border-t-[3px] border-double border-ink" />
            <div className="flex items-baseline justify-between">
              <span className="font-semibold tracking-[.12em]">ÖDENEN</span>
              <span className="font-sans text-4xl font-bold tracking-[-.03em]">{txn?.total}</span>
            </div>
            <div className="barcode mt-[22px] h-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
