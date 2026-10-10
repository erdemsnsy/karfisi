export type PlatformId = "trendyol" | "hepsiburada" | "amazon" | "n11" | "ciceksepeti";

export interface Platform {
  id: PlatformId;
  name: string;
  rate: number;
}

/** [ürün, fiyat, maliyet, komisyon %, kargo] */
export type BulkRow = [string, number, number, number, number];

export interface HistoryItem {
  id: number;
  name: string;
  platform: string;
  pid: PlatformId;
  price: string;
  cost: string;
  ship: string;
  comm: string;
  net: number;
  margin: number;
  date: string;
}

export interface RatesCategory {
  platform: string;
  group: string;
  category: string;
  min: number;
  max: number;
}

export interface RatesPlatform {
  name: string;
  defaultRate: number;
  base: string;
  extras?: string;
  source: string;
  checkedAt: string;
}

export interface RatesData {
  version?: string;
  updatedAt: string | null;
  note?: string;
  platforms: Record<string, RatesPlatform>;
  categories: RatesCategory[];
}

export type View = "site" | "checkout" | "done";
export type ModalKind = null | "profile" | "guide" | "legal";
export type LegalKind = "kvkk" | "privacy";
export type ProfileTab = "history" | "perf" | "plan";
export type Billing = "m" | "y";

export interface Txn {
  email: string;
  total: string;
  id: string;
  last4: string;
  brand: string;
  date: string;
  next: string;
  plan: string;
}

export interface FormState {
  name: string;
  platform: PlatformId;
  price: string;
  cost: string;
  comm: string;
  ship: string;
  kdv: number;
  stopaj: number;
  target: string;
}
