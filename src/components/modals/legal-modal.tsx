"use client";

import { LEGAL } from "@/lib/constants";
import { SITE } from "@/lib/site";
import { useApp } from "../app-provider";

export function LegalModal() {
  const { legal } = useApp();
  const doc = LEGAL[legal];

  return (
    <div className="flex flex-col gap-3.5">
      <span className="eyebrow !text-[11.5px]">Yasal</span>
      <h3 className="m-0 text-[30px] font-bold tracking-[-.03em]">{doc.title}</h3>
      <span className="font-mono text-[11.5px] text-muted">Son güncelleme: 10 Ekim 2026</span>
      <div className="flex flex-col border-t-[1.5px] border-ink">
        {doc.items.map(([t, d]) => (
          <div key={t} className="flex flex-col gap-1.5 border-b border-dashed border-ink/25 py-3.5">
            <span className="text-base font-semibold">{t}</span>
            <span className="text-[14.5px] leading-[1.55] text-ink-2 text-pretty">{d}</span>
          </div>
        ))}
      </div>
      <span className="text-[13.5px] text-ink-3">
        Sorularınız için:{" "}
        <a href={`mailto:${SITE.contactEmail}`} className="font-semibold underline underline-offset-3">
          {SITE.contactEmail}
        </a>
      </span>
    </div>
  );
}
