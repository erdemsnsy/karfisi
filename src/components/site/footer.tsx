"use client";

import { SITE } from "@/lib/site";
import { useApp } from "../app-provider";

const stroke = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const ICONS: { title: string; node: React.ReactNode }[] = [
  {
    title: "Yüzde",
    node: (
      <svg {...stroke}>
        <line x1="19" y1="5" x2="5" y2="19" />
        <circle cx="7" cy="7" r="2.5" />
        <circle cx="17" cy="17" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Fiş",
    node: (
      <svg {...stroke}>
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="9" y1="12" x2="15" y2="12" />
      </svg>
    ),
  },
  { title: "Lira", node: <span className="font-mono text-[21px] leading-none">₺</span> },
  {
    title: "Etiket",
    node: (
      <svg {...stroke}>
        <path d="M3 12V4h8l10 10-8 8z" />
        <circle cx="7.5" cy="8.5" r="1.5" />
      </svg>
    ),
  },
  {
    title: "Sepet",
    node: (
      <svg {...stroke}>
        <path d="M3 4h2l2.5 11h11L21 7H6.2" />
        <circle cx="9" cy="19.5" r="1.3" />
        <circle cx="17" cy="19.5" r="1.3" />
      </svg>
    ),
  },
  {
    title: "Paket",
    node: (
      <svg {...stroke}>
        <path d="M12 3 3 7.5v9L12 21l9-4.5v-9z" />
        <path d="M3 7.5 12 12l9-4.5" />
        <line x1="12" y1="12" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: "Kargo",
    node: (
      <svg {...stroke}>
        <rect x="2" y="6" width="12" height="10" />
        <path d="M14 9h4l3 3.5V16h-7" />
        <circle cx="6" cy="18" r="1.8" />
        <circle cx="17" cy="18" r="1.8" />
      </svg>
    ),
  },
  {
    title: "Barkod",
    node: (
      <svg {...stroke}>
        {[4, 7, 11, 13.5, 17, 20].map((x) => (
          <line key={x} x1={x} y1="5" x2={x} y2="19" />
        ))}
      </svg>
    ),
  },
  {
    title: "Grafik",
    node: (
      <svg {...stroke}>
        <polyline points="3,17 9,11 13,15 21,7" />
        <polyline points="15,7 21,7 21,13" />
      </svg>
    ),
  },
];

const LINKS = [
  ["#nasil", "Nasıl çalışır"],
  ["#toplu", "Toplu Hesaplama"],
  ["#sss", "SSS"],
  ["#fiyat", "Fiyatlandırma"],
] as const;

const link = "cursor-pointer text-dim-2 no-underline hover:text-paper";

export function Footer() {
  const { openModal, openLegal } = useApp();

  return (
    <footer className="overflow-hidden bg-ink text-paper">
      <div className="mx-auto flex max-w-[1520px] flex-col items-center px-[clamp(20px,4vw,48px)] pt-[clamp(56px,7vw,88px)] pb-7 text-center">
        <div className="mb-[clamp(32px,4vw,52px)] flex flex-wrap justify-center gap-3 max-[640px]:mb-8 max-[640px]:max-w-[250px] max-[640px]:gap-2">
          {ICONS.map((i) => (
            <span
              key={i.title}
              aria-hidden="true"
              title={i.title}
              className="grid size-12 place-items-center rounded-full max-[640px]:size-10 border border-paper/[.16] text-paper/55 transition-[color,border-color,transform] duration-200 hover:-translate-y-[3px] hover:border-paper/50 hover:text-paper"
            >
              {i.node}
            </span>
          ))}
        </div>
        <div className="text-[clamp(56px,11vw,150px)] leading-[.85] font-extrabold tracking-[-.055em]">Kâr Fişi</div>
        <div className="mt-10 flex w-full flex-wrap justify-center gap-x-7 gap-y-2.5 max-[640px]:mt-8 max-[640px]:gap-x-5 font-mono text-[12.5px] tracking-[.04em]">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} className={link}>
              {label}
            </a>
          ))}
          <a onClick={() => openModal("guide")} className={link}>
            Komisyon Rehberi
          </a>
        </div>
        <div className="mt-6 grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] items-center gap-x-6 gap-y-3 border-t border-paper/[.18] pt-5 font-mono text-xs text-dim max-[640px]:grid-cols-1 max-[640px]:justify-items-center max-[640px]:gap-y-4 max-[640px]:text-center">
          <span suppressHydrationWarning>© {new Date().getFullYear()} Kâr Fişi · Tüm hakları saklıdır.</span>
          <div className="flex flex-wrap justify-center gap-5">
            <a onClick={() => openLegal("kvkk")} className={link}>
              KVKK
            </a>
            <a onClick={() => openLegal("privacy")} className={link}>
              Gizlilik
            </a>
            <a href={`mailto:${SITE.contactEmail}`} className={link}>
              İletişim
            </a>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="justify-self-end max-[640px]:justify-self-center rounded-full border border-paper/25 bg-transparent px-3.5 py-[7px] font-mono text-xs whitespace-nowrap text-dim-2 hover:border-paper hover:text-paper"
          >
            Yukarı çık ↑
          </button>
        </div>
        <div className="mt-[18px] flex w-full justify-center font-mono text-xs text-dim-3">
          <span className="flex flex-wrap items-center justify-center gap-1.5">
            Tasarım ve geliştirme:{" "}
            <a
              href={SITE.creatorUrl}
              target="_blank"
              rel="noopener"
              className="text-paper underline decoration-paper/35 underline-offset-4 hover:decoration-paper"
            >
              {SITE.creatorName} ↗
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
