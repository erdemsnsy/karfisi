import { pct, signed, tl, upperTr } from "./format";
import { PNAME } from "./constants";
import type { CalcResult } from "./calc";

interface PngInput {
  r: CalcResult;
  name: string;
  platform: string;
  no: number;
}

const fontFamily = (cssVar: string, fallback: string) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  return v || fallback;
};

/** Fişi canvas ile 2× PNG olarak çizip indirir. */
export async function downloadReceiptPng({ r, name, platform, no }: PngInput) {
  const mono = fontFamily("--font-plex", '"IBM Plex Mono", monospace');
  const sans = fontFamily("--font-bricolage", '"Bricolage Grotesque", sans-serif');
  try {
    await Promise.all([
      document.fonts.load(`600 26px ${mono}`),
      document.fonts.load(`17px ${mono}`),
      document.fonts.load(`700 64px ${sans}`),
    ]);
  } catch {
    /* yazı tipi yüklenemese de çizim devam eder */
  }

  const W = 640;
  const H = 820;
  const lines: [string, string][] = [
    ["Satış fiyatı", tl(r.P)],
    [`Komisyon (%${pct(r.c)})`, "−" + tl(r.commAmt)],
    ["Kargo", "−" + tl(r.S)],
    ["Ürün maliyeti", "−" + tl(r.C)],
    ["KDV kesintisi", "−" + tl(r.kdvAmt)],
    ["Gelir vergisi", "−" + tl(r.tax)],
  ];
  const cv = document.createElement("canvas");
  cv.width = W * 2;
  cv.height = H * 2;
  const x = cv.getContext("2d");
  if (!x) return;
  x.scale(2, 2);
  x.fillStyle = "#FBFAF5";
  x.fillRect(0, 0, W, H);
  x.fillStyle = "#14140F";
  x.textAlign = "center";
  x.font = `600 26px ${mono}`;
  x.fillText("KÂR FİŞİ", W / 2, 70);
  x.font = `15px ${mono}`;
  x.fillText(`№${String(no).padStart(6, "0")} · ${new Date().toLocaleString("tr-TR")}`, W / 2, 100);

  let y = 150;
  x.font = `17px ${mono}`;
  const row = (a: string, b: string) => {
    x.textAlign = "left";
    x.fillText(a, 48, y);
    x.textAlign = "right";
    x.fillText(b, W - 48, y);
    y += 34;
  };
  row("ÜRÜN", upperTr(name.trim() || "—"));
  row("PLATFORM", upperTr(PNAME[platform] ?? platform));
  y += 16;
  lines.forEach((l) => row(l[0], l[1]));
  y += 10;
  x.fillRect(48, y, W - 96, 2);
  y += 56;
  x.textAlign = "left";
  x.font = `600 18px ${mono}`;
  x.fillText("NET KÂR", 48, y);
  x.textAlign = "right";
  x.font = `15px ${mono}`;
  x.fillText("Kâr marjı: %" + pct(r.margin), W - 48, y);
  y += 74;
  x.textAlign = "left";
  x.fillStyle = r.net >= 0 ? "#14140F" : "#b9473a";
  x.font = `700 64px ${sans}`;
  x.fillText(signed(r.net), 44, y);

  const a = document.createElement("a");
  a.download = `kar-fisi-${no}.png`;
  a.href = cv.toDataURL("image/png");
  a.click();
}

export function receiptText(r: CalcResult, name: string, platform: string, no: number): string {
  return `KÂR FİŞİ №${String(no).padStart(6, "0")}\nÜrün: ${name || "—"}\nPlatform: ${PNAME[platform]} (%${pct(r.c)})\n\nSatış fiyatı: ${tl(r.P)}\nKomisyon: −${tl(r.commAmt)}\nKargo: −${tl(r.S)}\nÜrün maliyeti: −${tl(r.C)}\nKDV (net): −${tl(r.kdvAmt)}\nGelir vergisi: −${tl(r.tax)}\n\nNET KÂR: ${signed(r.net)}\nKâr marjı: %${pct(r.margin)}\n— karfisi.com`;
}
