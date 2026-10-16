"use client";

import { useMemo } from "react";
import { KDV, PLATFORMS, STOPAJ } from "@/lib/constants";
import { lowerTr, num, tl } from "@/lib/format";
import type { FormState } from "@/lib/types";
import { useApp } from "../app-provider";
import { chipClass } from "../ui/chip";

type NumField = "price" | "cost" | "comm" | "ship";

const FIELDS: { label: string; key: NumField; unit: string; ph: string }[] = [
  { label: "Satış fiyatı", key: "price", unit: "₺", ph: "899" },
  { label: "Ürün maliyeti", key: "cost", unit: "₺", ph: "420" },
  { label: "Platform komisyonu", key: "comm", unit: "%", ph: "18" },
  { label: "Kargo ücreti", key: "ship", unit: "₺", ph: "39" },
];

export function CalculatorForm() {
  const {
    form,
    setField,
    setKdv,
    setStopaj,
    pickPlatform,
    adv,
    toggleAdv,
    saveTried,
    premium,
    result,
    applySuggested,
    openModal,
    goPremium,
    scrollToId,
    history,
    fillFromHistory,
  } = useApp();
  const locked = !premium;

  const suggestions = useMemo(() => {
    const qn = lowerTr(form.name.trim());
    if (!qn) return [];
    const seen = new Set<string>();
    return history
      .slice()
      .reverse()
      .filter((x) => {
        const k = lowerTr(x.name || "");
        if (seen.has(k) || x.cost == null) return false;
        seen.add(k);
        return k.startsWith(qn) && !(k === qn && String(x.cost) === form.cost && String(x.ship) === form.ship);
      })
      .slice(0, 3);
  }, [history, form.name, form.cost, form.ship]);

  const err = "oklch(0.55 0.17 28)";

  return (
    <div id="hesapla-form" className="flex flex-col justify-between gap-5 rounded-[22px] border border-ink/[.13] bg-card p-[clamp(20px,2.4vw,30px)] max-[980px]:gap-5">
      <label className="flex flex-col gap-2">
        <span className="label-mono">Ürün Adı</span>
        <input
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          placeholder="Kablosuz Kulaklık"
          className="w-full border-0 border-b-[1.5px] bg-transparent pt-1.5 pb-2.5 text-2xl font-medium tracking-[-.01em]"
          style={{ borderBottomColor: saveTried && !form.name.trim() ? err : "#14140F" }}
        />
      </label>

      {suggestions.length > 0 && (
        <div className="-mt-3.5 flex flex-col gap-2">
          <span className="text-[13px] font-medium text-muted">Önceki fişlerden doldur</span>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((x) => (
              <button
                key={x.id}
                onClick={() =>
                  fillFromHistory(x, { toast: "Önceki fişten dolduruldu" })
                }
                className="flex flex-col items-start gap-0.5 rounded-xl border border-ink/[.14] bg-paper px-3 py-[9px] text-left hover:border-ink"
              >
                <span className="text-[14.5px] font-semibold">{x.name}</span>
                <span className="font-mono text-[11px] text-muted">
                  {x.platform} · maliyet {tl(num(x.cost))} · kargo {tl(num(x.ship))}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <span className="label-mono">Satış Platformu</span>
          <a
            onClick={() => openModal("guide")}
            className="cursor-pointer text-sm underline underline-offset-3"
          >
            Kategori oranları →
          </a>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => pickPlatform(p.id)}
              className={`rounded-full border px-[13px] py-2 text-sm transition-[background] duration-150 ${chipClass(form.platform === p.id)}`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-6 max-[980px]:gap-y-4">
        {FIELDS.map((f) => (
          <label key={f.key} className="flex min-w-0 flex-col gap-[5px]">
            <span className="label-mono">{f.label}</span>
            <span
              className="flex items-baseline gap-1.5 border-b-[1.5px] pb-2"
              style={{ borderBottomColor: saveTried && String(form[f.key as keyof FormState]).trim() === "" ? err : "#14140F" }}
            >
              <input
                value={form[f.key]}
                onChange={(e) => setField(f.key, e.target.value)}
                inputMode="decimal"
                placeholder={f.ph}
                className="w-full min-w-0 border-0 bg-transparent pt-1 text-[30px] font-semibold tracking-[-.02em] tabular-nums max-[980px]:text-[26px]"
              />
              <span className="font-mono text-base text-muted-2">{f.unit}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-dashed border-ink/30 pt-5">
        <button
          onClick={() => {
            toggleAdv();
            if (!adv) setTimeout(() => scrollToId("hesapla"), 60);
          }}
          className="flex w-full items-center justify-between border-0 bg-transparent p-0"
        >
          <span className="flex items-center gap-2.5 text-[17px] font-semibold">
            Gelişmiş ayarlar
            <span className="rounded-[4px] bg-ink px-[7px] py-[3px] font-mono text-[10px] tracking-[.12em] text-accent-light">
              PRO
            </span>
          </span>
          <span className="grid size-8 place-items-center rounded-full border border-ink/20 font-mono text-xl">
            {adv ? "−" : "+"}
          </span>
        </button>

        {adv && (
          <div className="relative">
            <div
              className="flex flex-col gap-3.5"
              style={{ opacity: locked ? 0.35 : 1, pointerEvents: locked ? "none" : "auto" }}
            >
              <OptionGroup
                title="KDV Oranı"
                options={KDV}
                value={form.kdv}
                onPick={setKdv}
              />
              <OptionGroup
                title="Gelir Vergisi (Stopaj)"
                options={STOPAJ}
                value={form.stopaj}
                onPick={setStopaj}
              />
              <div className="flex flex-wrap items-end gap-4">
                <label className="flex w-[150px] flex-col gap-2">
                  <span className="label-mono">Hedef Kâr Marjı</span>
                  <span className="flex items-baseline gap-1.5 border-b-[1.5px] border-ink pb-1.5">
                    <input
                      value={form.target}
                      onChange={(e) => setField("target", e.target.value)}
                      inputMode="decimal"
                      placeholder="0"
                      className="w-full min-w-0 border-0 bg-transparent text-2xl font-semibold"
                    />
                    <span className="font-mono text-muted-2">%</span>
                  </span>
                </label>
                <div className="flex min-w-[220px] flex-1 items-center justify-between gap-3 rounded-[14px] bg-ink py-2 pr-2 pl-4 text-paper">
                  <span className="flex flex-col gap-0.5">
                    <span className="font-mono text-[10.5px] tracking-[.12em] text-dim uppercase">Önerilen fiyat</span>
                    <span className="text-[22px] font-semibold tabular-nums">
                      {result.sug ? tl(result.sug) : "—"}
                    </span>
                  </span>
                  <button
                    onClick={applySuggested}
                    className="rounded-full border-0 bg-accent px-4 py-2.5 font-semibold text-card"
                  >
                    Uygula
                  </button>
                </div>
              </div>
            </div>
            {locked && (
              <div className="absolute -inset-2 flex items-center justify-center rounded-[14px] bg-card/55">
                <button
                  onClick={goPremium}
                  className="rounded-full border-0 bg-ink px-[22px] py-3.5 text-[15px] font-medium text-paper shadow-[0_10px_30px_rgba(20,20,15,.25)]"
                >
                  KDV, stopaj ve hedef fiyat için Premium’a geç →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function OptionGroup({
  title,
  options,
  value,
  onPick,
}: {
  title: string;
  options: [number, string, string][];
  value: number;
  onPick: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="label-mono">{title}</span>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(96px,1fr))] gap-1.5">
        {options.map(([v, short, label]) => (
          <button
            key={v}
            onClick={() => onPick(v)}
            className={`flex flex-col gap-0 rounded-xl border px-2.5 py-1.5 text-left ${chipClass(value === v)}`}
          >
            <span className="font-mono text-[14px] font-semibold">{short}</span>
            <span className="text-[11.5px] leading-tight opacity-75">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
