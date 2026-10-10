import { SectionHead } from "../ui/section-head";

const STEPS = [
  {
    no: "01",
    tag: "GİR",
    title: "Satış fiyatını ve maliyetini yaz",
    text: "Ürün fiyatı, alış maliyeti ve platform komisyon oranını gir. Kargo ücretini biliyorsan ekle.",
  },
  {
    no: "02",
    tag: "HESAPLA",
    title: "Fiş anında oluşur",
    text: "Komisyon, kargo ve maliyet tek tek düşülür; net kârın ve kâr marjın anında ekranda.",
  },
  {
    no: "03",
    tag: "KAYDET",
    title: "Fişini sakla ve paylaş",
    text: "Fişi geçmişe kaydet, WhatsApp'a kopyala ya da Premium'da PNG olarak indir.",
  },
];

export function HowItWorks() {
  return (
    <section id="nasil" className="mx-auto max-w-[1280px] px-[clamp(20px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
      <SectionHead
        eyebrow="Nasıl çalışır"
        title="Excel'e değil, fişe güven."
        lead={'Üç adımda gerçek kârını gör — platform panelinin gösterdiği "brüt satış" değil, cebine giren gerçek para.'}
      />
      <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] border-t-[1.5px] border-ink">
        {STEPS.map((s, i) => (
          <a
            key={s.no}
            href="#hesapla"
            className={`flex flex-col gap-3.5 px-6 py-7 text-ink no-underline transition-[background,color] duration-300 ease-in-out hover:bg-ink hover:text-paper ${
              i < STEPS.length - 1 ? "border-r border-dashed border-ink/30" : ""
            }`}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-[52px] leading-[.9] font-bold tracking-[-.05em]">{s.no}</span>
              <span className="font-mono text-xs tracking-[.14em]">{s.tag}</span>
            </div>
            <h3 className="mt-1.5 mb-0 text-[21px] font-semibold tracking-[-.015em]">{s.title}</h3>
            <p className="m-0 text-base leading-[1.55] text-pretty opacity-75">{s.text}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
