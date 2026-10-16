/* Geniş ekranlarda hero'nun iki yanını dolduran dekoratif öğeler */
const BARS = [38, 54, 46, 72, 60, 88, 100];

export function HeroDecor() {
  const card = "absolute rounded-2xl border border-ink/[.13] bg-card shadow-[0_18px_40px_rgba(20,20,15,.08)]";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden select-none min-[1700px]:block">
      <div
        className="absolute inset-0 opacity-[.55]"
        style={{
          backgroundImage: "radial-gradient(rgba(20,20,15,.16) 1px, transparent 1.4px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 40%, #000 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 40%, #000 85%)",
        }}
      />
      <div className="absolute top-[40px] right-[6%] size-[320px] rounded-full bg-accent/[.10] blur-3xl" />
      <div className="absolute top-[520px] left-[4%] size-[280px] rounded-full bg-accent/[.08] blur-3xl" />

      {/* sol: net kâr kartı */}
      <div className={`${card} top-[150px] left-[4%] w-[210px] -rotate-4 p-4`}>
        <div className="label-mono">Net kâr</div>
        <div className="mt-1 text-[30px] leading-none font-bold tracking-[-.03em] tabular-nums">+₺311,80</div>
        <div className="mt-2.5 flex items-center gap-2 font-mono text-[11px] text-muted">
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">▲ %34,7</span>
          marj
        </div>
      </div>

      {/* sol: platform etiketi */}
      <div className={`${card} top-[560px] left-[8%] flex rotate-3 items-center gap-3 px-4 py-3`}>
        <span className="size-2.5 rounded-full bg-accent" />
        <span className="font-mono text-[12px] tracking-[.08em] uppercase">Komisyon %18 · Kargo ₺39</span>
      </div>

      {/* sağ: haftalık kâr grafiği */}
      <div className={`${card} top-[170px] right-[4%] w-[220px] rotate-3 p-4`}>
        <div className="flex items-baseline justify-between">
          <span className="label-mono">Haftalık kâr</span>
          <span className="font-mono text-[11px] text-accent">+12%</span>
        </div>
        <div className="mt-3 flex h-[64px] items-end gap-1.5">
          {BARS.map((h, i) => (
            <span
              key={i}
              className={`flex-1 rounded-[3px] ${i === BARS.length - 1 ? "bg-accent" : "bg-ink/[.14]"}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* sağ: tamamlandı damgası */}
      <div className="absolute top-[580px] right-[7%] -rotate-8 rounded-xl border-2 border-ink/70 px-3.5 py-2 text-center font-mono text-[11px] leading-[1.35] font-semibold tracking-[.14em] text-ink/70">
        ✓ HESAPLANDI
        <br />
        SANİYEDE
      </div>
    </div>
  );
}
