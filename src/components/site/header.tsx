"use client";

import { useApp } from "../app-provider";

const NAV = [
  ["#nasil", "Nasıl çalışır"],
  ["#toplu", "Toplu Hesaplama"],
  ["#sss", "SSS"],
  ["#fiyat", "Fiyatlandırma"],
] as const;

export function Header() {
  const { history, premium, openModal, goPremium } = useApp();
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/[.86] backdrop-blur-[14px]">
      <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-[clamp(20px,4vw,48px)] py-3">
        <a
          href="#top"
          className="flex flex-none items-center gap-2.5 whitespace-nowrap text-ink no-underline hover:text-ink"
        >
          <span className="text-2xl leading-none font-extrabold tracking-[-.04em]">Kâr Fişi</span>
        </a>
        <div className="flex-1" />
        <nav className="hidden min-w-0 gap-0.5 text-[15px] whitespace-nowrap min-[981px]:flex">
          {NAV.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-3 py-2 no-underline hover:bg-ink/[.07] hover:text-ink"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex-1" />
        <div className="flex flex-none items-center gap-2 whitespace-nowrap">
          <button
            onClick={() => openModal("profile")}
            className="flex items-center gap-2 rounded-full border-0 bg-transparent px-3.5 py-2.5 text-[15px] hover:bg-ink/[.07]"
          >
            Geçmiş{" "}
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1.5 font-mono text-[11px] text-paper">
              {history.length}
            </span>
          </button>
          <button
            onClick={goPremium}
            className="rounded-full border-0 bg-ink px-[18px] py-2.5 text-[15px] font-medium text-paper hover:bg-ink-hover"
          >
            {premium ? "✓ Premium" : "Premium'a Geç"}
          </button>
        </div>
      </div>
    </header>
  );
}
