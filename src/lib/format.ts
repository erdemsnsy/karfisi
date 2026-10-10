export const num = (v: unknown): number => {
  const n = parseFloat(String(v ?? "").replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

export const tl = (n: number): string =>
  "₺" + n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const signed = (n: number): string => (n < 0 ? "−" : "") + tl(Math.abs(n));

export const pct = (n: number): string => n.toLocaleString("tr-TR", { maximumFractionDigits: 2 });

export const upperTr = (s: string): string => s.toLocaleUpperCase("tr");
export const lowerTr = (s: string): string => s.toLocaleLowerCase("tr");

export const formatDate = (d: string): string => {
  try {
    return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return d;
  }
};
