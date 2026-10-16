import { SectionHead } from "../ui/section-head";

const STEPS = [
  {
    no: "01",
    title: "Fiyat ve maliyet",
    text: "Satış fiyatı, alış maliyeti ve komisyon oranı yeter. Kargo biliyorsan onu da ekle.",
  },
  {
    no: "02",
    title: "Kalem kalem düşüş",
    text: "Komisyon, kargo ve maliyet satır satır çıkar. En altta net kâr ve marj yazar.",
  },
  {
    no: "03",
    title: "Kaydet veya gönder",
    text: "Geçmişe kaydet, WhatsApp'a kopyala. PNG indirme Premium'da.",
  },
];

export function HowItWorks() {
  return (
    <section id="nasil" className="mx-auto max-w-[1280px] px-[clamp(20px,4vw,48px)] py-[clamp(40px,5vw,68px)]">
      <SectionHead
        eyebrow="Nasıl çalışır"
        title="Üç adımda net kâr."
        lead="Panel brüt satışı gösterir, fiş kesintilerden sonra elinde kalanı."
      />
      <div className="mt-7 max-[640px]:mt-5 max-[640px]:grid-cols-1 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] border-t-[1.5px] border-ink">
        {STEPS.map((s, i) => (
          <a
            key={s.no}
            href="#hesapla"
            className={`flex flex-col gap-1.5 px-5 py-4 max-[640px]:gap-1.5 max-[640px]:px-3 max-[640px]:py-4 text-ink no-underline transition-[background,color] duration-300 ease-in-out hover:bg-ink hover:text-paper ${
              i < STEPS.length - 1 ? "border-r border-dashed border-ink/30 max-[640px]:border-r-0 max-[640px]:border-b" : ""
            }`}
          >
            <h3 className="mt-0 mb-0 text-[19px] max-[640px]:mt-0 max-[640px]:text-[18px] font-semibold tracking-[-.015em]"><span className="mr-2.5 text-accent">{s.no}</span>{s.title}</h3>
            <p className="m-0 text-base leading-[1.55] text-pretty opacity-75 max-[640px]:text-[14.5px] max-[640px]:leading-[1.45]">{s.text}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
