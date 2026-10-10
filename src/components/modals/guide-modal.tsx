"use client";

import { useState } from "react";
import { PLATFORMS, PNAME } from "@/lib/constants";
import { formatDate, lowerTr, pct } from "@/lib/format";
import { useApp } from "../app-provider";
import { chipClass } from "../ui/chip";

export function GuideModal() {
  const { rates, applyCategory } = useApp();
  const [gp, setGp] = useState<string>("all");
  const [q, setQ] = useState("");

  const qq = lowerTr(q.trim());
  const rows = rates.categories.filter(
    (c) =>
      (gp === "all" || c.platform === gp) &&
      (!qq || lowerTr(`${c.category} ${c.group} ${PNAME[c.platform] || ""}`).includes(qq)),
  );
  const note = gp !== "all" ? rates.platforms[gp] : undefined;

  return (
    <div className="flex flex-col gap-4">
      <span className="eyebrow !text-[11.5px]">
        Komisyon Rehberi · Son kontrol {rates.updatedAt ? formatDate(rates.updatedAt) : "—"}
      </span>
      <h3 className="m-0 text-[34px] leading-none font-bold tracking-[-.03em]">Kategori Komisyon Oranları</h3>
      <p className="m-0 text-base leading-normal text-ink-2">
        Kategorini bul, <strong>"Uygula"</strong> ile oranı hesaplayıcıya aktar. Aralıklı oranlarda temkinli olması için
        üst sınır uygulanır.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {[{ id: "all", name: "Tümü" }, ...PLATFORMS].map((p) => (
          <button
            key={p.id}
            onClick={() => setGp(p.id)}
            className={`rounded-full border px-3 py-[7px] text-[13.5px] ${chipClass(gp === p.id)}`}
          >
            {p.name}
          </button>
        ))}
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Kategori ara (örn. ayakkabı, telefon)"
        className="rounded-full border border-ink/20 bg-receipt px-[18px] py-[13px] text-base"
      />
      {note && (
        <div className="flex flex-col gap-1 rounded-xl bg-paper px-3.5 py-3 text-[13.5px] leading-[1.45]">
          <span>
            <strong>Matrah:</strong> {note.base}
          </span>
          {note.extras && (
            <span>
              <strong>Ek bedel:</strong> {note.extras}
            </span>
          )}
          <span className="font-mono text-[11px] text-muted">Kaynak: {note.source}</span>
        </div>
      )}
      <div className="flex flex-col border-t-[1.5px] border-ink">
        {rows.map((c, i) => (
          <div
            key={`${c.platform}-${c.group}-${c.category}-${i}`}
            className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3.5 border-b border-dashed border-ink/25 py-[11px]"
          >
            <span className="flex min-w-0 flex-col">
              <span className="font-semibold">{c.category}</span>
              <span className="font-mono text-[11.5px] text-muted">
                {PNAME[c.platform] || c.platform} · {c.group}
              </span>
            </span>
            <span className="font-mono text-[15px] font-semibold whitespace-nowrap">
              %{c.min === c.max ? pct(c.max) : `${pct(c.min)}–${pct(c.max)}`}
            </span>
            <button
              onClick={() => applyCategory(c.platform, c.category, c.max)}
              className="rounded-full border border-ink bg-transparent px-3.5 py-[7px] text-sm hover:bg-ink hover:text-paper"
            >
              Uygula
            </button>
          </div>
        ))}
        {rows.length === 0 && <p className="m-0 py-5 text-muted">Sonuç bulunamadı.</p>}
      </div>
      <span className="font-mono text-[11.5px] text-muted-2">
        Oranlar bilgilendirme amaçlıdır; kampanya ve satıcı seviyesine göre değişebilir. Kesin oranı platform panelinden
        doğrula.
      </span>
    </div>
  );
}
