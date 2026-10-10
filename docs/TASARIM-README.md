# Handoff: Kâr Fişi — tasarım yenileme

## Genel bakış
Kâr Fişi, pazaryeri satıcılarının (Trendyol, Hepsiburada, Amazon TR, N11, Çiçeksepeti) bir satıştan sonra ellerinde kalan net kârı hesaplayan bir web aracıdır. Mevcut site karfisi.vercel.app; bu paket onun yeni tasarımıdır.

## Tasarım dosyaları hakkında
`Kar Fisi.dc.html` HTML ile yapılmış bir **tasarım referansıdır**, doğrudan canlıya alınacak üretim kodu değildir. Görevin bu tasarımı mevcut projenin altyapısında (Next.js/React, Vercel) projenin kendi kalıplarıyla yeniden kurmaktır. Dosya tarayıcıda açılır (yanındaki `support.js` ile); tüm etkileşimler çalışır, ölçü ve renkler buradan alınabilir.

## Sadakat
**Yüksek sadakat (hi-fi).** Renk, tipografi, boşluk ve etkileşimler nihai. Piksel düzeyinde birebir uygulanmalı.

## Tasarım değerleri
- **Renkler:** zemin #EEEBE2 · kart #F7F5EF · fiş kâğıdı #FBFAF5 · mürekkep #14140F · koyu bölüm #14140F · ikincil metin #3C3B33 / #4A493F / #5E5D54 · vurgu (kobalt) oklch(0.46 0.17 264) · vurgu hover oklch(0.53 0.17 264) · koyu zeminde vurgu oklch(0.83 0.08 264) · zarar oklch(0.55 0.17 28), koyu zeminde oklch(0.75 0.15 28)
- **Yazı tipleri:** Bricolage Grotesque (400–800; başlıklar ve gövde), IBM Plex Mono (400–600; etiketler, fiş, rakamlar). Google Fonts.
- **Tipografi:** H1 clamp(42px,6.4vw,96px)/0.94, -0.04em · bölüm başlığı clamp(34px,4vw,54px)/0.98, -0.035em · gövde 16–18px/1.5 · mono etiket 11–12px, letter-spacing .1–.12em, büyük harf · fişte net kâr clamp(40px,5vw,54px) 700
- **Köşe yarıçapları:** kart 22–24px · input 11–14px · buton ve chip 999px · modal 22px
- **Fiş tırtığı:** `mask: conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) 50%/14px 100%` (fiyat kartlarında üst ve alt kenara)
- **Gölgeler:** fiş `drop-shadow(0 18px 30px rgba(20,20,15,.14)) drop-shadow(0 2px 4px rgba(20,20,15,.08))`
- **Kap:** max-width 1280px, yatay padding clamp(20px,4vw,48px), bölüm dikey padding clamp(56px,7vw,96px)
- **Genel ölçek:** `html{zoom:.9}`; tüm sayfa %90 ölçekte tasarlandı.

## Ekranlar
1. **Ana sayfa:** sırasıyla
   - Yapışkan header: logo, menü (980px altında gizli), Geçmiş (sayaçlı), Premium'a Geç.
   - Hero: H1, açıklama, "Nasıl çalışır?" linki ve "Hemen Ücretsiz Dene ↓" butonu.
   - Hesaplayıcı: solda form, sağda yapışkan canlı fiş.
   - Platform şeridi.
   - Nasıl çalışır (3 sütun).
   - Toplu Hesaplama (koyu bölüm; solda anlatım, sağda rapor fişi).
   - SSS (tam genişlik akordeon).
   - Fiyatlandırma (iki tırtıklı fiş kart).
   - Footer: ikon satırı, büyük logo, linkler, telif, imza.
2. **Ödeme sayfası** (`view: 'checkout'`):
   - Tek ekrana sığar. Sol kartta üç adım: plan, e-posta, kart.
   - Sağda yapışkan sipariş özeti fişi ve öde butonu.
3. **Onay sayfası** (`view: 'done'`): başarı mesajı ve barkodlu ödeme fişi.
4. **Modallar:** Komisyon Rehberi, Geçmiş/Performans/Abonelik, KVKK, Gizlilik.

## Etkileşimler
- **Hesap:** komisyon = fiyat × oran; net = fiyat − komisyon − kargo − maliyet.
  - Premium'da KDV (fiyat KDV dahil kabul edilir) ve stopaj da düşülür.
  - Hedef marja göre önerilen fiyat: `(kargo+maliyet)(1−t)/(1+k) / ((1−c)(1−t)/(1+k) − m)`.
- **Fiş animasyonu:**
  - Açılışta yazıcıdan kayar: translateY(-101%)→0, 1.4s, cubic-bezier(.2,.8,.2,1).
  - Değer değişince -14px titrer (0.55s).
  - Kaydedince yeniden basılır.
- **Boş durum:** fiyat girilmemişken fişte "Fiyatı gir, fişin basılsın."
- **Kaydet:** `localStorage['karfisi-history']` (son 50 fiş). Ürün adı yazılırken önceki fişlerden otomatik doldurma önerir.
- **İndir:** fişi canvas ile 2× PNG olarak çizer (Premium).
- **Toplu CSV:** sütunlar ürün, fiyat, maliyet, komisyon %, kargo; ayraç `, ; tab`. Sonuç Excel'e (CSV, BOM'lu) aktarılır.
- **Premium kilidi:**
  - Gelişmiş ayarlar %35 opaklıkta görünür, tıklanamaz.
  - Rapor rakamları ve Excel/PDF butonları blur(3px), tıklanamaz.
  - Kilitli alanlara tıklamak ödeme sayfasını açar.
- **Ödeme simülasyonu:**
  - Doğrulama yalnızca alanların dolu olmasına bakar: ad, 16 hane, AA/YY, 3 haneli CVC, @ içeren e-posta, sözleşme onayı.
  - Kart numarası otomatik 4'lü gruplanır; marka ilk hanelerden tanınır (4 Visa, 51–55/22–27 Mastercard, 9792 Troy).
  - "3D Secure doğrulanıyor…" 1.8s sürer, sonra onay sayfası açılır.
  - Gerçek entegrasyonda Iyzico Checkout Form kullanılmalı; kart verisi asla bizim sunucumuza gelmemeli.
- **Mobil (≤980px):** menü gizlenir. Fiş ekran dışındayken altta sabit net kâr çubuğu görünür ("Fişi gör ↓").
- **Erişilebilirlik:** :focus-visible ile 2px kobalt odak çerçevesi; prefers-reduced-motion'da animasyon kapanır.

## Veri
- `data/komisyon-oranlari.json`: 5 platform, ~120 kategori. Şema ve otomatik güncelleme planı `KOMISYON-SISTEMI.md` içinde.
- Rehber oranı aralıklıysa hesaplayıcıya üst sınır (max) uygulanır.

## Varlıklar
- `og-image.png` (1200×630): paylaşım önizleme görseli. `/public` altına konmalı; meta etiketleri hazır.
- İkonlar inline SVG (footer).
- Harici görsel yok.

## Dosyalar
- `Kar Fisi.dc.html`: tasarım referansı (tüm ekranlar)
- `support.js`: referans dosyayı tarayıcıda açmak için gerekli çalışma zamanı
- `data/komisyon-oranlari.json`: komisyon verisi
- `KOMISYON-SISTEMI.md`: oranların haftalık güncellenmesi için kurulum talimatı
- `og-image.png`: paylaşım görseli
