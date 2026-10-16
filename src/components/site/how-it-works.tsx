import { SectionHead } from "../ui/section-head";

const STEPS = [
  {
    no: "01",
    tag: "GİR",
    title: "Fiyat ve maliyet",
    text: "Satış fiyatı, alış maliyeti ve komisyon oranı yeter. Kargo biliyorsan onu da ekle.",
  },
  {
    no: "02",
    tag: "HESAPLA",
    title: "Kalem kalem düşüş",
    text: "Komisyon, kargo ve maliyet satır satır çıkar. En altta net kâr ve marj yazar.",
  },
  {
    no: "03",
    tag: "KAYDET",
    title: "Kaydet veya gönder",
    text: "Geçmişe kaydet, WhatsApp'a kopyala. PNG indirme Premium'da.",
  },
];

export function HowItWorks() {
  return (
    <section id="nasil" className="mx-auto max-w-[1520px] px-[clamp(20px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
      <SectionHead
        eyebrow="Nasıl çalışır"
        title="Panelde satış, fişte kâr."
        lead="Platform paneli brüt satışı gösterir. Fiş, kesintilerden sonra cebine kalanı gösterir."
      />
      <div className="mt-10 max-[640px]:mt-6 max-[640px]:grid-cols-1 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] border-t-[1.5px] border-ink">
        {STEPS.map((s, i) => (
          <a
            key={s.no}
            href="#hesapla"
            className={`flex flex-col gap-3.5 px-6 py-7 max-[640px]:gap-1.5 max-[640px]:px-3 max-[640px]:py-4 text-ink no-underline transition-[background,color] duration-300 ease-in-out hover:bg-ink hover:text-paper ${
              i < STEPS.length - 1 ? "border-r border-dashed border-ink/30 max-[640px]:border-r-0 max-[640px]:border-b" : ""
            }`}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-[52px] leading-[.9] max-[640px]:text-[32px] font-bold tracking-[-.05em]">{s.no}</span>
              <span className="font-mono text-xs tracking-[.14em]">{s.tag}</span>
            </div>
            <h3 className="mt-1.5 mb-0 text-[21px] max-[640px]:mt-0 max-[640px]:text-[18px] font-semibold tracking-[-.015em]">{s.title}</h3>
            <p className="m-0 text-base leading-[1.55] text-pretty opacity-75 max-[640px]:text-[14.5px] max-[640px]:leading-[1.45]">{s.text}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
