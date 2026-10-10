"use client";

import { useEffect, useState } from "react";
import { useApp } from "../app-provider";

const NAV = [
  ["#nasil", "Nasıl çalışır"],
  ["#toplu", "Toplu Hesaplama"],
  ["#sss", "SSS"],
  ["#fiyat", "Fiyatlandırma"],
] as const;

export function Header() {
  const { history, premium, openModal, goPremium } = useApp();
  const [menu, setMenu] = useState(false);

  /* Menü açıkken Esc kapatır; geniş ekrana geçilirse kendiliğinden kapanır */
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    const mq = window.matchMedia("(min-width: 981px)");
    const onMq = () => mq.matches && setMenu(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [menu]);

  const line = "absolute left-[11px] h-[1.5px] w-[18px] rounded-full bg-ink transition-all duration-300 ease-out";

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/[.86] backdrop-blur-[14px]">
      <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-[clamp(20px,4vw,48px)] py-3">
        <a
          href="#top"
          onClick={() => setMenu(false)}
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
            className="flex items-center gap-2 rounded-full border-0 bg-transparent px-3.5 py-2.5 text-[15px] hover:bg-ink/[.07] max-[520px]:hidden"
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
          <button
            onClick={() => setMenu((m) => !m)}
            aria-label={menu ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={menu}
            aria-controls="mobil-menu"
            className="relative size-10 flex-none rounded-full border border-ink/20 bg-transparent hover:bg-ink/[.07] min-[981px]:hidden"
          >
            <span className={`${line} ${menu ? "top-[19px] rotate-45" : "top-[14px]"}`} />
            <span className={`${line} top-[19px] ${menu ? "opacity-0" : "opacity-100"}`} />
            <span className={`${line} ${menu ? "top-[19px] -rotate-45" : "top-[24px]"}`} />
          </button>
        </div>
      </div>

      {menu && (
        <nav
          id="mobil-menu"
          aria-label="Ana menü"
          className="absolute top-full right-0 left-0 border-b border-ink/10 bg-paper shadow-[0_24px_40px_rgba(20,20,15,.12)] min-[981px]:hidden"
        >
          <div className="mx-auto max-w-[1280px] px-[clamp(20px,4vw,48px)] pt-2 pb-5">
            {NAV.map(([href, label], i) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenu(false)}
                className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-baseline gap-2 border-b border-dashed border-ink/25 py-4 text-ink no-underline hover:text-accent"
              >
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[26px] leading-none font-semibold tracking-[-.03em]">{label}</span>
                <span className="font-mono text-lg">→</span>
              </a>
            ))}
            <button
              onClick={() => {
                setMenu(false);
                openModal("guide");
              }}
              className="grid w-full grid-cols-[36px_minmax(0,1fr)_auto] items-baseline gap-2 border-0 border-b border-dashed border-ink/25 bg-transparent py-4 text-left text-ink hover:text-accent"
            >
              <span className="font-mono text-xs text-muted">05</span>
              <span className="text-[26px] leading-none font-semibold tracking-[-.03em]">Komisyon Rehberi</span>
              <span className="font-mono text-lg">→</span>
            </button>
            <button
              onClick={() => {
                setMenu(false);
                openModal("profile");
              }}
              className="mt-5 flex w-full items-center justify-between rounded-full border-[1.5px] border-ink bg-transparent py-3 pr-3 pl-6 text-base font-medium text-ink min-[521px]:hidden"
            >
              Geçmiş
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-ink px-2 font-mono text-xs text-paper">
                {history.length}
              </span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
