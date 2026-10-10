import { num } from "./format";
import type { BulkRow } from "./types";

export interface CalcInput {
  price: string;
  cost: string;
  comm: string;
  ship: string;
  target: string;
  kdv: number;
  stopaj: number;
  premium: boolean;
}

export interface CalcResult {
  P: number;
  C: number;
  c: number;
  S: number;
  commAmt: number;
  kdvAmt: number;
  tax: number;
  net: number;
  margin: number;
  /** Hedef marja göre önerilen satış fiyatı */
  sug: number | null;
}

export function calc(i: CalcInput): CalcResult {
  const P = num(i.price);
  const C = num(i.cost);
  const c = num(i.comm);
  const S = num(i.ship);
  const k = i.premium ? i.kdv / 100 : 0;
  const t = i.premium ? i.stopaj / 100 : 0;
  const m = num(i.target) / 100;

  const commAmt = (P * c) / 100;
  const base = P - commAmt - S - C;
  const kdvAmt = base > 0 ? (base * k) / (1 + k) : 0;
  const pre = base - kdvAmt;
  const tax = pre > 0 ? pre * t : 0;
  const net = pre - tax;

  const denom = ((1 - c / 100) * (1 - t)) / (1 + k) - m;
  const sug = m > 0 && denom > 0 ? ((S + C) * (1 - t)) / (1 + k) / denom : null;

  return { P, C, c, S, commAmt, kdvAmt, tax, net, margin: P ? (net / P) * 100 : 0, sug };
}

/** Toplu hesapta vergi uygulanmaz: fiyat − komisyon − kargo − maliyet */
export const simple = ([, p, c, k, s]: BulkRow): number => p - (p * k) / 100 - s - c;

export function parseCsv(text: string): BulkRow[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.split(/[;,\t]/).map((c) => c.trim()))
    .filter((c) => c.length >= 3 && c[0])
    .filter((c) => Number.isFinite(num(c[1])) && num(c[1]) > 0)
    .map((c): BulkRow => [c[0], num(c[1]), num(c[2]), num(c[3]), num(c[4])]);
}

export function bulkCsv(rows: BulkRow[]): string {
  return (
    "﻿Ürün;Fiyat;Maliyet;Komisyon %;Kargo;Net Kâr\n" +
    rows.map((row) => [...row, simple(row).toFixed(2)].join(";")).join("\n")
  );
}
