/**
 * Komisyon oranlarını günceller (bkz. docs/KOMISYON-SISTEMI.md).
 *
 * - `sources/<platform>.csv` dosyası varsa o platformun kategorileri değiştirilir.
 *   Sütunlar: group,category,min,max  (başlık satırı zorunlu, max boşsa min kullanılır)
 * - Amazon oranları resmî sayfadan otomatik çekilir (scripts/amazon.ts).
 * - Çıktı zod ile doğrulanır; hata olursa mevcut JSON'a dokunulmaz.
 * - Bir oran tek seferde ±5 puandan fazla değişirse `commission-warnings.md` yazılır.
 *
 * Çalıştırma: npm run update-commissions
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { AMAZON_MAP, fetchAmazon } from "./amazon";

const DATA = join(process.cwd(), "data", "komisyon-oranlari.json");
const SOURCES = join(process.cwd(), "sources");
const WARN = join(process.cwd(), "commission-warnings.md");
const MAX_JUMP = 5;

const Platform = z.object({
  name: z.string(),
  defaultRate: z.number().min(0).max(100),
  base: z.string(),
  extras: z.string().optional(),
  source: z.string(),
  checkedAt: z.string(),
});

const Category = z
  .object({
    platform: z.string(),
    group: z.string().min(1),
    category: z.string().min(1),
    min: z.number().min(0).max(100),
    max: z.number().min(0).max(100),
  })
  .refine((c) => c.min <= c.max, "min, max'tan büyük olamaz");

const Schema = z.object({
  version: z.string(),
  updatedAt: z.string(),
  note: z.string().optional(),
  platforms: z.record(z.string(), Platform),
  categories: z.array(Category),
});

type Data = z.infer<typeof Schema>;
type Cat = z.infer<typeof Category>;

const today = new Date().toISOString().slice(0, 10);
const num = (v: string) => parseFloat(v.replace(",", "."));

function readCsv(platform: string, file: string): Cat[] {
  const [head, ...lines] = readFileSync(file, "utf8").replace(/^﻿/, "").split(/\r?\n/).filter(Boolean);
  const sep = head.includes(";") ? ";" : ",";
  const cols = head.split(sep).map((c) => c.trim().toLowerCase());
  const idx = (n: string) => {
    const i = cols.indexOf(n);
    if (i < 0) throw new Error(`${file}: "${n}" sütunu yok`);
    return i;
  };
  const [g, c, mn, mx] = [idx("group"), idx("category"), idx("min"), idx("max")];
  return lines.map((l) => {
    const p = l.split(sep).map((x) => x.trim());
    const min = num(p[mn]);
    const max = p[mx] ? num(p[mx]) : min;
    return { platform, group: p[g], category: p[c], min, max };
  });
}

async function main() {
  const current = Schema.parse(JSON.parse(readFileSync(DATA, "utf8")));
  const next: Data = structuredClone(current);
  const warnings: string[] = [];
  const touched: string[] = [];

  for (const id of Object.keys(current.platforms)) {
    const file = join(SOURCES, `${id}.csv`);
    if (!existsSync(file)) continue;
    const fresh = readCsv(id, file);
    const old = new Map(
      current.categories.filter((c) => c.platform === id).map((c) => [`${c.group}|${c.category}`, c]),
    );
    for (const c of fresh) {
      const o = old.get(`${c.group}|${c.category}`);
      if (o && Math.abs(o.max - c.max) > MAX_JUMP) {
        warnings.push(`- **${id} · ${c.category}**: %${o.max} → %${c.max}`);
      }
    }
    next.categories = [...next.categories.filter((c) => c.platform !== id), ...fresh];
    next.platforms[id].checkedAt = today;
    touched.push(id);
  }

  /* Amazon: resmî sayfadan mevcut kategorilerin oranlarını tazele */
  try {
    const rows = await fetchAmazon();
    const byName = new Map(rows.map((r) => [r.name.toLocaleLowerCase("tr"), r]));
    for (const c of next.categories.filter((x) => x.platform === "amazon")) {
      const map = AMAZON_MAP[c.category] ?? [c.category];
      const row = map && byName.get(map[0].toLocaleLowerCase("tr"));
      if (!map || !row) {
        warnings.push(`- **amazon · ${c.category}**: Amazon sayfasında eşleşme bulunamadı, eski oran korundu`);
        continue;
      }
      const picked = map[1] != null ? [row.rates[map[1]]] : row.rates;
      const [min, max] = [Math.min(...picked), Math.max(...picked)];
      if (!Number.isFinite(min)) continue;
      if (Math.abs(c.max - max) > MAX_JUMP) warnings.push(`- **amazon · ${c.category}**: %${c.max} → %${max}`);
      c.min = min;
      c.max = max;
    }
    const known = new Set(
      next.categories
        .filter((x) => x.platform === "amazon")
        .map((x) => (AMAZON_MAP[x.category]?.[0] ?? x.category).toLocaleLowerCase("tr")),
    );
    for (const r of rows) {
      if (known.has(r.name.toLocaleLowerCase("tr"))) continue;
      next.categories.push({ platform: "amazon", group: "Diğer", category: r.name, min: Math.min(...r.rates), max: Math.max(...r.rates) });
      warnings.push(`- **amazon · yeni kategori eklendi**: ${r.name} (${r.rates.map((x) => "%" + x).join(" / ")})`);
    }
    next.platforms.amazon.checkedAt = today;
    touched.push("amazon (resmî sayfa)");
  } catch (e) {
    warnings.push(`- **amazon**: otomatik çekim başarısız (${e instanceof Error ? e.message : e}); eski oranlar korundu`);
  }

  if (!touched.length) {
    console.log("Güncellenecek kaynak (sources/*.csv) bulunamadı; dosya değişmedi.");
    return;
  }

  /* Oranlar gerçekten değişmediyse dosyaya (ve "son kontrol" tarihine) dokunma */
  if (JSON.stringify(next.categories) === JSON.stringify(current.categories)) {
    console.log("Oranlar değişmedi; dosya güncellenmedi.");
    return;
  }

  next.updatedAt = today;
  next.version = today;
  const valid = Schema.parse(next); // hata varsa burada durur, eski dosya korunur

  writeFileSync(DATA, JSON.stringify(valid, null, 2) + "\n");
  if (warnings.length) {
    writeFileSync(WARN, `## ±${MAX_JUMP} puandan büyük değişimler\n\n${warnings.join("\n")}\n`);
    console.warn(`${warnings.length} büyük değişim var, commission-warnings.md yazıldı.`);
  }
  console.log("Güncellendi:", touched.join(", "));
}

main().catch((e) => {
  console.error("Güncelleme başarısız, mevcut dosya korundu:", e instanceof Error ? e.message : e);
  process.exit(1);
});
