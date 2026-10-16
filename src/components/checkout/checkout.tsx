"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "../app-provider";

interface Pay {
  name: string;
  num: string;
  exp: string;
  cvc: string;
  email: string;
}

const EMPTY_PAY: Pay = { name: "", num: "", exp: "", cvc: "", email: "" };
const ERR = "oklch(0.55 0.17 28)";
const BORDER = "rgba(20,20,15,.18)";

const fm = (n: number) => "₺" + n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const cardBrand = (digits: string) =>
  /^4/.test(digits)
    ? "VISA"
    : /^(5[1-5]|2[2-7])/.test(digits)
      ? "MASTERCARD"
      : /^9792/.test(digits)
        ? "TROY"
        : /^3[47]/.test(digits)
          ? "AMEX"
          : "KART";

const BILLING = [
  { id: "m", title: "Aylık", price: "₺249", per: "/ ay", note: "İstediğin zaman iptal et", tag: "" },
  { id: "y", title: "Yıllık", price: "₺2.390", per: "/ yıl", note: "Aylık ₺199’a denk gelir", tag: "2 AY BEDAVA" },
] as const;

const inputBase =
  "w-full min-w-0 rounded-[11px] border-[1.5px] bg-receipt px-3 py-2.5 text-[15px] transition-[border-color] duration-150 focus:!border-ink";
const labelCls = "font-mono text-[11px] tracking-[.1em] text-muted uppercase";

function StepTitle({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-[26px] flex-none place-items-center rounded-full bg-ink font-mono text-[11px] text-paper">
        {n}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-lg leading-[1.1] font-bold tracking-[-.02em]">{title}</span>
        <span className="text-[13px] text-muted">{sub}</span>
      </span>
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? <span className="text-xs text-loss">{msg}</span> : null;
}

export function Checkout() {
  const { bill, setBill, paying, setPaying, setPremium, setView, setTxn, exitCheckout, dateStr } = useApp();
  const [pay, setPay] = useState<Pay>(EMPTY_PAY);
  const [terms, setTerms] = useState(false);
  const [payTried, setPayTried] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const monthly = bill === "m";
  const digits = pay.num.replace(/\D/g, "");
  const brand = cardBrand(digits);
  const total = monthly ? 249 : 2390;
  const price = monthly ? "₺249,00" : "₺2.390,00";
  const next = new Date();
  if (monthly) next.setMonth(next.getMonth() + 1);
  else next.setFullYear(next.getFullYear() + 1);

  const E = {
    email: pay.email.includes("@") ? "" : "E-posta gir",
    terms: terms ? "" : "Devam etmek için sözleşmeyi onayla",
    name: pay.name.trim().length < 2 ? "Ad soyad gir" : "",
    num: digits.length < 16 ? "16 haneli kart numarası gir" : "",
    exp: pay.exp.length < 5 ? "AA/YY gir" : "",
    cvc: pay.cvc.length < 3 ? "3 haneli CVC gir" : "",
  };
  const ok = !E.name && !E.num && !E.exp && !E.cvc && !E.email && !E.terms;
  const shown = payTried ? E : { name: "", num: "", exp: "", cvc: "", email: "", terms: "" };
  const bd = (k: keyof typeof E) => (shown[k] ? ERR : BORDER);
  const upd = (k: keyof Pay, v: string) => setPay((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (paying) return;
    if (!ok) {
      setPayTried(true);
      return;
    }
    setPaying(true);
    timer.current = setTimeout(() => {
      window.scrollTo(0, 0);
      setPaying(false);
      setPremium(true);
      setTxn({
        email: pay.email,
        total: price,
        id: "IYZ-" + Math.random().toString(36).slice(2, 8).toUpperCase() + String(Date.now()).slice(-4),
        last4: digits.slice(-4),
        brand,
        date: new Date().toLocaleString("tr-TR"),
        next: next.toLocaleDateString("tr-TR"),
        plan: monthly ? "Premium · Aylık" : "Premium · Yıllık",
      });
      setView("done");
    }, 1800);
  };

  const cardNumView = (digits + "•".repeat(16 - digits.length)).replace(/(.{4})(?=.)/g, "$1 ");

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-ink/10 bg-paper">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-[clamp(20px,4vw,48px)] py-4">
          <button onClick={exitCheckout} className="flex items-center gap-2.5 border-0 bg-transparent p-0 text-ink">
            <span className="text-2xl font-extrabold tracking-[-.04em]">Kâr Fişi</span>
          </button>
          <div className="flex items-center gap-2.5 font-mono text-xs tracking-[.08em] text-ink-2">
            <span className="flex items-center gap-2 font-semibold text-ink">
              <span className="grid size-5 place-items-center rounded-full border-[1.5px] border-ink text-[10px]">1</span>
              ÖDEME
            </span>
            <span className="h-px w-7 bg-ink/30" />
            <span className="flex items-center gap-2 opacity-55">
              <span className="grid size-5 place-items-center rounded-full border-[1.5px] border-current text-[10px]">2</span>
              ONAY
            </span>
          </div>
          <span className="flex items-center gap-2 font-mono text-xs text-ink-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            256-bit SSL güvenli ödeme
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,48px)] pt-5 pb-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="m-0 text-[30px] leading-none font-bold tracking-[-.03em]">Premium'a geç</h1>
          <button
            onClick={exitCheckout}
            className="border-0 bg-transparent p-0 text-sm whitespace-nowrap text-ink-2 hover:text-ink"
          >
            ← Siteye dön
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-start gap-5">
          <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-4">
            <section className="flex flex-col rounded-[22px] border border-ink/12 bg-card px-[26px] py-[22px]">
              {/* 1 · plan */}
              <div className="flex flex-col gap-3.5">
                <StepTitle n={1} title="Planını seç" sub="İstediğin zaman değiştirebilir veya iptal edebilirsin." />
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-2.5">
                  {BILLING.map((b) => {
                    const on = bill === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => setBill(b.id)}
                        className="relative flex flex-col gap-1.5 rounded-[14px] border-2 px-4 py-3 text-left text-ink transition-[border-color,background] duration-150"
                        style={{
                          borderColor: on ? "#14140F" : "rgba(20,20,15,.16)",
                          background: on ? "#FBFAF5" : "transparent",
                        }}
                      >
                        <span className="flex items-center justify-between gap-2.5">
                          <span className="flex items-center gap-2.5">
                            <span className="grid size-5 place-items-center rounded-full border-2 border-ink">
                              <span
                                className="size-2.5 rounded-full"
                                style={{ background: on ? "#14140F" : "transparent" }}
                              />
                            </span>
                            <span className="text-[15px] font-semibold">{b.title}</span>
                          </span>
                          {b.tag && (
                            <span className="flex-none rounded-full bg-accent px-2 py-1 font-mono text-[10.5px] tracking-[.1em] whitespace-nowrap text-card">
                              {b.tag}
                            </span>
                          )}
                        </span>
                        <span className="flex items-baseline gap-2">
                          <span className="text-[28px] leading-none font-bold tracking-[-.03em]">{b.price}</span>
                          <span className="font-mono text-[13px] text-muted">{b.per}</span>
                        </span>
                        <span className="text-[12.5px] text-ink-3">{b.note}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="font-mono text-[11.5px] leading-[1.6] tracking-[.04em] text-ink-3">
                  Dahil: Toplu CSV · KDV/stopaj · Hedef fiyat · PNG fiş · Excel/PDF · Performans paneli
                </div>
              </div>

              {/* 2 · iletişim */}
              <div className="mt-[18px] flex flex-col gap-3.5 border-t border-dashed border-ink/30 pt-[18px]">
                <StepTitle n={2} title="İletişim bilgileri" sub="Faturan ve ödeme bildirimin bu adrese gönderilir." />
                <label className="flex min-w-0 flex-col gap-[5px]">
                  <span className={labelCls}>E-posta</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={pay.email}
                    onChange={(e) => upd("email", e.target.value.trim().slice(0, 80))}
                    placeholder="ornek@mail.com"
                    className={inputBase}
                    style={{ borderColor: bd("email") }}
                  />
                  <FieldError msg={shown.email} />
                </label>
              </div>

              {/* 3 · kart */}
              <div className="mt-[18px] flex flex-col gap-3.5 border-t border-dashed border-ink/30 pt-[18px]">
                <StepTitle n={3} title="Kart bilgileri" sub="Banka kartı veya kredi kartı ile ödeyebilirsin." />
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] items-center gap-[22px]">
                  <div
                    className="relative flex aspect-[1.586] w-full max-w-[260px] flex-col justify-between justify-self-center overflow-hidden rounded-[14px] px-4 py-3.5 text-card shadow-[0_22px_44px_oklch(0.4_0.15_42/.32)]"
                    style={{
                      background:
                        "linear-gradient(135deg,oklch(0.36 0.12 40),oklch(0.54 0.18 42) 55%,oklch(0.64 0.16 55))",
                    }}
                  >
                    <div className="absolute -top-[70px] -right-[70px] size-[230px] rounded-full border border-card/[.18]" />
                    <div className="absolute -top-5 -right-5 size-[130px] rounded-full border border-card/12" />
                    <div className="flex items-center justify-between">
                      <span
                        className="h-[31px] w-[42px] rounded-[7px]"
                        style={{ background: "linear-gradient(135deg,#E7D9A8,#B9A56A)" }}
                      />
                      <span className="font-mono text-sm font-semibold tracking-[.14em]">{brand}</span>
                    </div>
                    <span className="font-mono text-base tracking-[.1em]">{cardNumView}</span>
                    <div className="flex items-end justify-between gap-3 font-mono text-[12.5px] tracking-[.08em]">
                      <span className="flex min-w-0 flex-col gap-[3px]">
                        <span className="text-[9.5px] opacity-70">KART SAHİBİ</span>
                        <span className="truncate">{(pay.name.trim() || "AD SOYAD").toLocaleUpperCase("tr")}</span>
                      </span>
                      <span className="flex flex-col gap-[3px] text-right">
                        <span className="text-[9.5px] opacity-70">SKT</span>
                        <span>{pay.exp || "AA/YY"}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col gap-2.5">
                    <label className="flex min-w-0 flex-col gap-[5px]">
                      <span className={labelCls}>Kart üzerindeki ad soyad</span>
                      <input
                        autoComplete="cc-name"
                        value={pay.name}
                        onChange={(e) =>
                          upd("name", e.target.value.replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ\s.'-]/g, "").slice(0, 40))
                        }
                        placeholder="Ad Soyad"
                        className={inputBase}
                        style={{ borderColor: bd("name") }}
                      />
                      <FieldError msg={shown.name} />
                    </label>
                    <label className="flex min-w-0 flex-col gap-[5px]">
                      <span className={labelCls}>Kart numarası</span>
                      <input
                        inputMode="numeric"
                        autoComplete="cc-number"
                        value={pay.num}
                        onChange={(e) =>
                          upd("num", e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})(?=.)/g, "$1 "))
                        }
                        placeholder="0000 0000 0000 0000"
                        className={`${inputBase} font-mono tracking-[.06em]`}
                        style={{ borderColor: bd("num") }}
                      />
                      <FieldError msg={shown.num} />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex min-w-0 flex-col gap-[5px]">
                        <span className={labelCls}>Son kullanma</span>
                        <input
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          value={pay.exp}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                            if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                            upd("exp", v);
                          }}
                          placeholder="AA/YY"
                          className={`${inputBase} font-mono`}
                          style={{ borderColor: bd("exp") }}
                        />
                        <FieldError msg={shown.exp} />
                      </label>
                      <label className="flex min-w-0 flex-col gap-[5px]">
                        <span className={labelCls}>CVC</span>
                        <input
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          value={pay.cvc}
                          onChange={(e) => upd("cvc", e.target.value.replace(/\D/g, "").slice(0, 3))}
                          placeholder="•••"
                          className={`${inputBase} font-mono`}
                          style={{ borderColor: bd("cvc") }}
                        />
                        <FieldError msg={shown.cvc} />
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setTerms((t) => !t)}
                  className="flex items-start gap-3 border-0 bg-transparent p-0 text-left text-[13px] leading-[1.45] text-ink-2"
                >
                  <span
                    className="mt-px grid size-[18px] flex-none place-items-center rounded-[5px] border-[1.5px] text-[13px] text-paper"
                    style={{
                      borderColor: shown.terms ? ERR : "#14140F",
                      background: terms ? "#14140F" : "transparent",
                    }}
                  >
                    {terms ? "✓" : ""}
                  </span>
                  <span>
                    <strong className="text-ink">Mesafeli Satış Sözleşmesi</strong>'ni ve{" "}
                    <strong className="text-ink">Ön Bilgilendirme Formu</strong>'nu okudum, onaylıyorum. Aboneliğim iptal
                    edene kadar otomatik yenilenir.
                  </span>
                </button>
                <FieldError msg={shown.terms} />
              </div>
            </section>
          </div>

          <aside className="sticky top-4 flex max-w-[420px] flex-[1_1_320px] flex-col gap-3">
            <div className="drop-shadow-[0_16px_28px_rgba(20,20,15,.12)] drop-shadow-[0_1px_2px_rgba(20,20,15,.08)]">
              <div className="receipt-edge bg-receipt px-6 pt-[22px] pb-10 font-mono text-[13.5px] leading-[1.55]">
                <div className="flex flex-col gap-1 text-center">
                  <span className="text-base font-semibold tracking-[.22em]">SİPARİŞ ÖZETİ</span>
                  <span className="text-[11px] text-muted" suppressHydrationWarning>
                    {dateStr}
                  </span>
                </div>
                <div className="mt-[18px] mb-3.5 border-t border-dashed border-ink" />
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between gap-3">
                    <span>{monthly ? "Premium · Aylık" : "Premium · Yıllık"}</span>
                    <span>{price}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-muted">
                    <span>Ara toplam (KDV hariç)</span>
                    <span>{fm(total / 1.2)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-muted">
                    <span>KDV (%20)</span>
                    <span>{fm(total - total / 1.2)}</span>
                  </div>
                  {!monthly && (
                    <div className="flex justify-between gap-3 text-accent">
                      <span>Yıllık indirim</span>
                      <span>−₺598,00</span>
                    </div>
                  )}
                </div>
                <div className="my-4 border-t-[3px] border-double border-ink" />
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold tracking-[.12em]">TOPLAM</span>
                  <span className="font-sans text-[32px] leading-none font-bold tracking-[-.035em]">{price}</span>
                </div>
                <div className="mt-2 text-[11.5px] text-muted" suppressHydrationWarning>
                  Sonraki ödeme: {next.toLocaleDateString("tr-TR")}
                </div>
              </div>
            </div>
            <button
              onClick={submit}
              className="flex items-center justify-center gap-2.5 rounded-full border-0 bg-ink p-4 text-base font-semibold whitespace-nowrap text-paper hover:bg-accent"
              style={{ opacity: paying ? 0.7 : 1 }}
            >
              {paying ? "3D Secure doğrulanıyor…" : price + " öde →"}
            </button>
            <div className="flex flex-wrap justify-center gap-2 font-mono text-[11px] tracking-[.08em] text-ink-3">
              {["VISA", "MASTERCARD", "TROY", "3D SECURE"].map((b) => (
                <span key={b} className="rounded-md border border-ink/20 px-[9px] py-[5px]">
                  {b}
                </span>
              ))}
            </div>
            <span className="text-center font-mono text-[11px] leading-[1.6] text-muted">
              Ödeme Iyzico altyapısıyla işlenir; kart bilgilerin Kâr Fişi'nde saklanmaz.
              <br />
              Simülasyon · Test kartı: 4242 4242 4242 4242
            </span>
          </aside>
        </div>
      </div>
    </div>
  );
}
