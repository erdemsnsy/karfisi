import type { BulkRow, Platform } from "./types";

export const PLATFORMS: Platform[] = [
  { id: "trendyol", name: "Trendyol", rate: 18 },
  { id: "hepsiburada", name: "Hepsiburada", rate: 16 },
  { id: "amazon", name: "Amazon TR", rate: 15 },
  { id: "n11", name: "N11", rate: 14 },
  { id: "ciceksepeti", name: "Çiçeksepeti", rate: 20 },
];

export const PNAME: Record<string, string> = Object.fromEntries(PLATFORMS.map((p) => [p.id, p.name]));

export const KDV: [number, string, string][] = [
  [0, "%0", "KDV Hariç"],
  [1, "%1", "Gıda/Kitap"],
  [10, "%10", "Tekstil/Hizmet"],
  [20, "%20", "Genel"],
];

export const STOPAJ: [number, string, string][] = [
  [0, "%0", "Vergisiz"],
  [15, "%15", "Şahıs · Alt dilim"],
  [20, "%20", "Şahıs · Orta dilim"],
  [25, "%25", "Kurumlar"],
];

export const SAMPLE: BulkRow[] = [
  ["Kablosuz Kulaklık", 899, 420, 18, 39],
  ["Telefon Kılıfı", 149, 38, 21, 29],
  ["Seramik Kupa", 249, 85, 20, 34],
  ["Yoga Matı", 549, 260, 16, 45],
  ["Deri Cüzdan", 699, 290, 18, 39],
  ["Bambu Kesme Tahtası", 329, 140, 15, 34],
];

export const FAQ: [string, string][] = [
  ["Verilerim saklanıyor mu?", "Ücretsiz hesaplamalarda veriler sunucuya gönderilmez. Premium üyelerde ise geçmişin arşivlenmesi amacıyla veritabanımızda güvenle saklanır."],
  ["İstediğim zaman iptal edebilir miyim?", "Evet, premium üyelik istediğin an, taahhüt olmadan iptal edilebilir."],
  ["Hangi platformları destekliyorsunuz?", "Trendyol, Hepsiburada, Amazon TR, N11 ve Çiçeksepeti için hesaplama yapabilirsin."],
  ["Net kâr nasıl hesaplanıyor?", "Satış fiyatından platform komisyonu, kargo ücreti ve ürün maliyeti düşülür. Premium’da bunlara ek olarak net KDV ve gelir vergisi (stopaj) da hesaba katılır."],
  ["KDV hesabı nasıl çalışıyor?", "Satış fiyatı KDV dahil kabul edilir. Komisyon, kargo ve maliyet düşüldükten sonra kalan tutar üzerinden ödenecek net KDV hesaplanır."],
  ["Komisyon oranları güncel mi?", "Rehberdeki oranlar düzenli olarak kontrol edilir; son kontrol tarihi rehberin başında yazar. Kampanya ve satıcı seviyesine göre değişebileceği için kesin oranı platform panelinden doğrulayabilir, hesaplayıcıya elle de girebilirsin."],
  ["Toplu hesaplama için CSV dosyam nasıl olmalı?", "Her satırda sırasıyla ürün adı, satış fiyatı, maliyet, komisyon oranı (%) ve kargo ücreti olmalı. Sütunlar virgül veya noktalı virgülle ayrılabilir; Excel’den “CSV olarak kaydet” yeterli."],
  ["Ödeme nasıl alınıyor?", "Premium ödemeleri Iyzico güvencesiyle, 256-bit SSL şifreleme ile işlenir. Kart bilgilerin Kâr Fişi tarafından saklanmaz."],
];

export const LEGAL: Record<"kvkk" | "privacy", { title: string; items: [string, string][] }> = {
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    items: [
      ["Veri sorumlusu", "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu Kâr Fişi’dir."],
      ["İşlenen veriler", "Premium üyelikte e-posta adresi, ad soyad ve ödeme işlem kaydı. Kart bilgileri Kâr Fişi tarafından işlenmez ve saklanmaz; ödeme Iyzico tarafından alınır."],
      ["İşleme amacı ve hukuki sebep", "Üyeliğin kurulması, faturalandırma ve destek taleplerinin yanıtlanması. Hukuki sebep, sözleşmenin ifası ve yasal yükümlülüklerdir (KVKK m.5/2-c, ç)."],
      ["Aktarım", "Veriler yalnızca ödeme hizmet sağlayıcısı (Iyzico) ve yasal zorunluluk hâlinde yetkili kurumlarla paylaşılır."],
      ["Haklarınız", "KVKK m.11 uyarınca verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini isteme ve işlemeye itiraz etme hakkına sahipsiniz."],
    ],
  },
  privacy: {
    title: "Gizlilik Politikası",
    items: [
      ["Hesaplama verileri", "Hesaplayıcıya girdiğin fiyat, maliyet ve komisyon bilgileri sunucuya gönderilmez; tamamen tarayıcında işlenir."],
      ["Kayıtlı fişler", "“Kaydet” ile oluşturduğun fiş geçmişi yalnızca bu tarayıcının yerel depolamasında tutulur. Tarayıcı verilerini temizlediğinde silinir."],
      ["Ödeme bilgileri", "Kart bilgilerin doğrudan Iyzico’nun 3D Secure altyapısına iletilir. Kâr Fişi kart numarası veya CVC saklamaz."],
      ["Çerezler", "Reklam veya takip çerezi kullanılmaz. Sadece sitenin çalışması için gerekli teknik depolama kullanılır."],
    ],
  },
};

export const HISTORY_KEY = "karfisi-history";
export const DEMO_BARS = [420, 310, 520, 180, 610, 470, 390];
