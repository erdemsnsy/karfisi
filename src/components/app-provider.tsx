"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { calc, type CalcResult } from "@/lib/calc";
import { HISTORY_KEY, PLATFORMS, PNAME, SAMPLE } from "@/lib/constants";
import { num } from "@/lib/format";
import type {
  Billing,
  BulkRow,
  FormState,
  HistoryItem,
  LegalKind,
  ModalKind,
  PlatformId,
  RatesData,
  Txn,
  View,
} from "@/lib/types";

type FeedState = 0 | 1 | 2;

interface AppContextValue {
  rates: RatesData;
  /* hesaplayıcı */
  form: FormState;
  setField: (key: "name" | "price" | "cost" | "comm" | "ship" | "target", value: string) => void;
  setKdv: (v: number) => void;
  setStopaj: (v: number) => void;
  pickPlatform: (id: PlatformId) => void;
  platformRate: (id: PlatformId) => number;
  result: CalcResult;
  hasPrice: boolean;
  adv: boolean;
  toggleAdv: () => void;
  saveTried: boolean;
  applySuggested: () => void;
  fillFromHistory: (h: HistoryItem, opts?: { closeModal?: boolean; scroll?: boolean; toast?: string }) => void;
  applyCategory: (platform: string, category: string, max: number) => void;
  /* premium / görünüm */
  premium: boolean;
  setPremium: (v: boolean) => void;
  view: View;
  setView: (v: View) => void;
  goPremium: () => void;
  exitCheckout: () => void;
  goTo: (id: string) => void;
  scrollToId: (id: string) => void;
  /* modallar */
  modal: ModalKind;
  legal: LegalKind;
  openModal: (m: Exclude<ModalKind, null>) => void;
  openLegal: (k: LegalKind) => void;
  closeModal: () => void;
  /* fiş */
  feed: FeedState;
  feedDur: number;
  no: number;
  dateStr: string;
  receiptRef: RefObject<HTMLDivElement | null>;
  rcptVis: boolean;
  setRcptVis: (v: boolean) => void;
  /** Hesaplayıcı bölümü ekranda mı */
  calcVis: boolean;
  setCalcVis: (v: boolean) => void;
  /** Mobilde alt net kâr çubuğu görünüyor mu */
  barVisible: boolean;
  isMobile: boolean;
  /* geçmiş */
  history: HistoryItem[];
  saveHistory: () => void;
  removeHistory: (idx: number) => void;
  clearHistory: () => void;
  /* toplu */
  rows: BulkRow[];
  setRows: (r: BulkRow[]) => void;
  /* ödeme */
  bill: Billing;
  setBill: (b: Billing) => void;
  txn: Txn | null;
  setTxn: (t: Txn | null) => void;
  paying: boolean;
  setPaying: (v: boolean) => void;
  /* toast */
  toast: string | null;
  notify: (msg: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp yalnızca AppProvider içinde kullanılabilir");
  return ctx;
}

const INITIAL_FORM: FormState = {
  name: "",
  platform: "trendyol",
  price: "",
  cost: "",
  comm: "18",
  ship: "",
  kdv: 20,
  stopaj: 0,
  target: "25",
};

/** localStorage'tan okunan kayıtların biçimini doğrular (bozuk veri arayüzü çökertmesin) */
const isHistoryItem = (h: unknown): h is HistoryItem => {
  if (!h || typeof h !== "object") return false;
  const x = h as Record<string, unknown>;
  return (
    typeof x.id === "number" &&
    typeof x.name === "string" &&
    typeof x.platform === "string" &&
    typeof x.pid === "string" &&
    typeof x.net === "number" &&
    Number.isFinite(x.net) &&
    typeof x.date === "string"
  );
};

const persist = (history: HistoryItem[]) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-50)));
  } catch {
    /* depolama kapalıysa sessizce geç */
  }
};

const nowString = () =>
  new Date().toLocaleDateString("tr-TR") +
  " " +
  new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

export function AppProvider({ rates, children }: { rates: RatesData; children: React.ReactNode }) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [adv, setAdv] = useState(false);
  const [saveTried, setSaveTried] = useState(false);
  const [premium, setPremium] = useState(false);
  const [view, setView] = useState<View>("site");
  const [modal, setModal] = useState<ModalKind>(null);
  const [legal, setLegal] = useState<LegalKind>("kvkk");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [rows, setRows] = useState<BulkRow[]>(SAMPLE);
  const [bill, setBill] = useState<Billing>("m");
  const [txn, setTxn] = useState<Txn | null>(null);
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [no, setNo] = useState(142);
  const [feed, setFeed] = useState<FeedState>(2);
  const [feedDur, setFeedDur] = useState(1.4);
  const [isMobile, setIsMobile] = useState(false);
  const [rcptVis, setRcptVis] = useState(true);
  const [calcVis, setCalcVis] = useState(false);
  const [dateStr, setDateStr] = useState("");

  const receiptRef = useRef<HTMLDivElement | null>(null);
  const lastFeed = useRef(0);
  const raf = useRef(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /* ilk açılış: fiş yazıcıdan kayar, geçmiş ve tarih yüklenir */
  useEffect(() => {
    const t = setTimeout(() => setFeed(0), 350);
    try {
      const hs: unknown = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      if (Array.isArray(hs)) {
        const valid = hs.filter(isHistoryItem);
        if (valid.length) setHistory(valid);
      }
    } catch {
      /* bozuk kayıt yok sayılır */
    }
    setDateStr(nowString());
    const tick = setInterval(() => setDateStr(nowString()), 30_000);
    return () => {
      clearTimeout(t);
      clearInterval(tick);
    };
  }, []);

  /* mobil eşiği */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 980px)");
    const f = () => setIsMobile(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  useEffect(
    () => () => {
      clearTimeout(toastTimer.current);
      cancelAnimationFrame(raf.current);
    },
    [],
  );

  const notify = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  /** Değer değişince fiş -14px titrer */
  const wiggle = useCallback(() => {
    if (Date.now() - lastFeed.current < 220) return;
    lastFeed.current = Date.now();
    setFeed(1);
    setFeedDur(0.55);
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      raf.current = requestAnimationFrame(() => setFeed(0));
    });
  }, []);

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 84, behavior: "smooth" });
  }, []);

  const goTo = useCallback(
    (id: string) => {
      setTimeout(() => scrollToId(id), 30);
    },
    [scrollToId],
  );

  const platformRate = useCallback(
    (id: PlatformId) => rates.platforms[id]?.defaultRate ?? PLATFORMS.find((p) => p.id === id)?.rate ?? 0,
    [rates],
  );

  const setField = useCallback<AppContextValue["setField"]>(
    (key, value) => {
      setForm((f) => ({ ...f, [key]: value }));
      if (key !== "name" && key !== "target") wiggle();
    },
    [wiggle],
  );

  const pickPlatform = useCallback(
    (id: PlatformId) => {
      setForm((f) => ({ ...f, platform: id, comm: String(platformRate(id)) }));
      wiggle();
    },
    [platformRate, wiggle],
  );

  const result = useMemo(
    () =>
      calc({
        price: form.price,
        cost: form.cost,
        comm: form.comm,
        ship: form.ship,
        target: form.target,
        kdv: form.kdv,
        stopaj: form.stopaj,
        premium,
      }),
    [form, premium],
  );
  const hasPrice = num(form.price) > 0;

  const applySuggested = useCallback(() => {
    if (!result.sug) return;
    setForm((f) => ({ ...f, price: result.sug!.toFixed(2) }));
    notify("Önerilen fiyat uygulandı");
  }, [result.sug, notify]);

  const fillFromHistory = useCallback<AppContextValue["fillFromHistory"]>(
    (h, opts) => {
      setForm((f) => ({
        ...f,
        name: h.name,
        price: String(h.price || ""),
        cost: String(h.cost || ""),
        ship: String(h.ship || ""),
        comm: String(h.comm || f.comm),
        platform: h.pid || f.platform,
      }));
      if (opts?.closeModal) setModal(null);
      wiggle();
      if (opts?.scroll) setTimeout(() => scrollToId("hesapla"), 50);
      notify(opts?.toast ?? "Fiş hesaplayıcıya yüklendi");
    },
    [wiggle, scrollToId, notify],
  );

  const applyCategory = useCallback(
    (platform: string, category: string, max: number) => {
      setForm((f) => ({ ...f, platform: platform as PlatformId, comm: String(max) }));
      setModal(null);
      wiggle();
      notify(`${PNAME[platform]} · ${category} %${max.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} uygulandı`);
      setTimeout(() => scrollToId("hesapla"), 50);
    },
    [wiggle, scrollToId, notify],
  );

  const saveHistory = useCallback(() => {
    const missing = (
      [
        [!form.name.trim(), "Ürün adı"],
        [!(num(form.price) > 0), "Satış fiyatı"],
        [form.cost.trim() === "", "Ürün maliyeti"],
        [form.comm.trim() === "", "Komisyon"],
        [form.ship.trim() === "", "Kargo ücreti"],
      ] as [boolean, string][]
    )
      .filter((x) => x[0])
      .map((x) => x[1]);
    if (missing.length) {
      setSaveTried(true);
      notify("Eksik: " + missing.join(", "));
      return;
    }
    const item: HistoryItem = {
      name: form.name.trim() || "Adsız ürün",
      platform: PNAME[form.platform],
      pid: form.platform,
      price: form.price,
      cost: form.cost,
      ship: form.ship,
      comm: form.comm,
      net: result.net,
      margin: result.margin,
      id: Date.now(),
      date: new Date().toLocaleDateString("tr-TR"),
    };
    const next = [...history, item];
    setHistory(next);
    setSaveTried(false);
    setNo((n) => n + 1);
    setFeed(2);
    setFeedDur(1.1);
    persist(next);
    setTimeout(() => setFeed(0), 60);
    notify("Fiş geçmişe kaydedildi");
  }, [form, result, history, notify]);

  const removeHistory = useCallback(
    (idx: number) => {
      const next = history.filter((_, i) => i !== idx);
      setHistory(next);
      persist(next);
      notify("Fiş silindi");
    },
    [history, notify],
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    persist([]);
    notify("Geçmiş temizlendi");
  }, [notify]);

  const goPremium = useCallback(() => {
    if (premium) {
      notify("Premium zaten aktif");
      return;
    }
    setView("checkout");
    setModal(null);
    window.scrollTo(0, 0);
  }, [premium, notify]);

  const exitCheckout = useCallback(() => {
    if (paying) return;
    setView("site");
    goTo("hesapla");
  }, [paying, goTo]);

  const closeModal = useCallback(() => {
    if (paying) return;
    setModal(null);
  }, [paying]);

  const value: AppContextValue = {
    rates,
    form,
    setField,
    setKdv: (v) => setForm((f) => ({ ...f, kdv: v })),
    setStopaj: (v) => setForm((f) => ({ ...f, stopaj: v })),
    pickPlatform,
    platformRate,
    result,
    hasPrice,
    adv,
    toggleAdv: () => setAdv((a) => !a),
    saveTried,
    applySuggested,
    fillFromHistory,
    applyCategory,
    premium,
    setPremium,
    view,
    setView,
    goPremium,
    exitCheckout,
    goTo,
    scrollToId,
    modal,
    legal,
    openModal: (m) => setModal(m),
    openLegal: (k) => {
      setLegal(k);
      setModal("legal");
    },
    closeModal,
    feed,
    feedDur,
    no,
    dateStr,
    receiptRef,
    rcptVis,
    setRcptVis,
    calcVis,
    setCalcVis,
    barVisible: isMobile && calcVis && !rcptVis,
    isMobile,
    history,
    saveHistory,
    removeHistory,
    clearHistory,
    rows,
    setRows,
    bill,
    setBill,
    txn,
    setTxn,
    paying,
    setPaying,
    toast,
    notify,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
