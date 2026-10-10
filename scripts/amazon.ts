/**
 * Amazon TR resmî ücretlendirme sayfasından (satis.amazon.com.tr/ucretlendirme)
 * kategori komisyonlarını okur. Sayfa tablo yerine "kategori adı / oran" çifti
 * olarak ardışık metin kutuları kullanır; çiftler buradan ayrıştırılır.
 */
export const AMAZON_URL = "https://satis.amazon.com.tr/ucretlendirme";

export interface AmazonRow {
  name: string;
  /** Metinde geçen tüm yüzdeler (kademeli oranlarda birden fazla) */
  rates: number[];
}

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

export function parseAmazon(html: string): AmazonRow[] {
  const texts = [...html.matchAll(/<div class="text align-start[^"]*"[^>]*>([\s\S]*?)<\/div>/g)].map((m) =>
    decode(m[1]),
  );
  const start = texts.indexOf("ÜCRETLER");
  const rows: AmazonRow[] = [];
  for (let i = start + 1; i < texts.length - 1; i++) {
    const rates = [...texts[i + 1].matchAll(/%\s?(\d+(?:,\d+)?)/g)].map((m) => parseFloat(m[1].replace(",", ".")));
    const isRateText = texts[i + 1].startsWith("%") || /satış fiyatı/i.test(texts[i + 1]);
    if (isRateText && rates.length && texts[i].length < 80 && !texts[i].startsWith("%")) {
      rows.push({ name: texts[i], rates });
      i++;
    }
  }
  return rows;
}

export async function fetchAmazon(): Promise<AmazonRow[]> {
  const res = await fetch(AMAZON_URL, { headers: { "user-agent": "Mozilla/5.0 (karfisi-commission-bot)" } });
  if (!res.ok) throw new Error(`Amazon sayfası alınamadı: HTTP ${res.status}`);
  const rows = parseAmazon(await res.text());
  if (rows.length < 15) throw new Error(`Amazon sayfası beklenen yapıda değil (${rows.length} satır bulundu)`);
  return rows;
}

/** Bizim kategori adı → [Amazon satır adı, kademeli oranda kaçıncı oran] */
export const AMAZON_MAP: Record<string, [string, number?]> = {
  Giyim: ["Giyim"],
  "Ayakkabı, çanta ve aksesuarları": ["Ayakkabılar, Kol Çantaları ve Ayakkabı Aksesuarları"],
  "Kol saati": ["Kol Saatleri"],
  "Bavul ve seyahat": ["Bavullar ve Seyahat Aksesuarları"],
  Elektronik: ["Elektronik"],
  "Elektronik aksesuar": ["Elektronik Aksesuarlar"],
  "Cep telefonu": ["Cep Telefonu"],
  Bilgisayar: ["Bilgisayar"],
  "Fotoğraf makinesi": ["Fotoğraf Makinesi"],
  "Ev eğlence sistemleri": ["Ev Eğlence Sistemleri"],
  "Beyaz eşya": ["Beyaz Eşyalar"],
  "Küçük ev aletleri": ["Mutfak (Küçük Ev Aletleri)"],
  "Kişisel bakım cihazları": ["Kişisel Bakım Cihazları"],
  "Kişisel bakım ve kozmetik (≤500 TL)": ["Kişisel Bakım ve Kozmetik", 0],
  "Kişisel bakım ve kozmetik (>500 TL)": ["Kişisel Bakım ve Kozmetik", 1],
  "Mutfak eşyaları ve dekorasyon": ["Mutfak Eşyaları ve Dekorasyon"],
  Mobilya: ["Mobilya"],
  Bahçe: ["Bahçe"],
  "Yapı market": ["Yapı Market"],
  "Oyuncak ve oyun": ["Oyuncaklar ve Oyunlar"],
  "Bebek ürünleri (giyim hariç)": ["Bebek Ürünleri (Giyim hariç)"],
  Kitap: ["Kitaplar"],
  "Ofis ürünleri": ["Ofis Ürünleri"],
  Spor: ["Spor"],
};
