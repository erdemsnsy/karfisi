const NAMES = ["Trendyol", "Hepsiburada", "Amazon TR", "N11", "Çiçeksepeti"];

export function PlatformStrip() {
  return (
    <section className="mt-[clamp(56px,6vw,88px)] border-y border-ink/[.14]">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-baseline justify-center gap-x-10 gap-y-2.5 px-[clamp(20px,4vw,48px)] py-[22px] max-[640px]:gap-x-6 max-[640px]:py-4 text-[clamp(18px,1.8vw,24px)] max-[640px]:text-[16px] font-semibold tracking-[-.02em]">
        {NAMES.map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
    </section>
  );
}
