import { describe, expect, it } from "vitest";
import { bulkCsv, calc, parseCsv, simple, type CalcInput } from "./calc";
import { num, pct, signed, tl } from "./format";

const base: CalcInput = {
  price: "899",
  cost: "420",
  comm: "18",
  ship: "39",
  target: "25",
  kdv: 20,
  stopaj: 0,
  premium: false,
};

describe("format", () => {
  it("virgül ve nokta ondalığını okur", () => {
    expect(num("12,5")).toBe(12.5);
    expect(num("12.5")).toBe(12.5);
    expect(num("")).toBe(0);
    expect(num("abc")).toBe(0);
  });

  it("Türkçe para biçimi ve eksi işareti", () => {
    expect(tl(1234.5)).toBe("₺1.234,50");
    expect(signed(-10)).toBe("−₺10,00");
    expect(pct(21.36)).toBe("21,36");
  });
});

describe("calc", () => {
  it("ücretsiz planda net = fiyat − komisyon − kargo − maliyet", () => {
    const r = calc(base);
    expect(r.commAmt).toBeCloseTo(161.82);
    expect(r.net).toBeCloseTo(899 - 161.82 - 39 - 420);
    expect(r.kdvAmt).toBe(0);
    expect(r.tax).toBe(0);
  });

  it("premium'da KDV ve stopaj düşülür", () => {
    const r = calc({ ...base, premium: true, kdv: 20, stopaj: 15 });
    const before = 899 - 161.82 - 39 - 420;
    expect(r.kdvAmt).toBeCloseTo((before * 0.2) / 1.2);
    expect(r.net).toBeCloseTo((before - r.kdvAmt) * 0.85);
  });

  it("zarar eden satışta KDV ve vergi 0 olur", () => {
    const r = calc({ ...base, premium: true, price: "100", stopaj: 20 });
    expect(r.net).toBeLessThan(0);
    expect(r.kdvAmt).toBe(0);
    expect(r.tax).toBe(0);
  });

  it("önerilen fiyat hedef marjı tutturur", () => {
    const r = calc(base);
    expect(r.sug).not.toBeNull();
    const back = calc({ ...base, price: String(r.sug) });
    expect(back.margin).toBeCloseTo(25, 4);
  });

  it("hedef marj ulaşılamazsa öneri yoktur", () => {
    expect(calc({ ...base, target: "95" }).sug).toBeNull();
  });
});

describe("toplu hesap", () => {
  it("simple vergisiz net kârı verir", () => {
    expect(simple(["Ürün", 100, 40, 10, 5])).toBe(45);
  });

  it("CSV'yi ; , ve tab ayracıyla okur, geçersiz satırı atar", () => {
    const rows = parseCsv("Ürün;Fiyat;Maliyet;Komisyon;Kargo\nA;100;40;10;5\nB,200,80,15,10\nC\tbozuk");
    expect(rows).toEqual([
      ["A", 100, 40, 10, 5],
      ["B", 200, 80, 15, 10],
    ]);
  });

  it("Excel CSV'si BOM ile başlar ve net kâr sütununu içerir", () => {
    const csv = bulkCsv([["A", 100, 40, 10, 5]]);
    expect(csv.startsWith("﻿Ürün;")).toBe(true);
    expect(csv).toContain("A;100;40;10;5;45.00");
  });
});
