# Komisyon oranları — güncel tutma sistemi (Claude Code için)

Tasarım, oranları `data/komisyon-oranlari.json` dosyasından okur. Sayfada oran yazılı değildir; dosya güncellenince rehber, platform butonları ve "Son kontrol" tarihi otomatik değişir.

## Veri şeması
- `updatedAt` — dosyanın son güncellenme tarihi (ISO).
- `platforms.<id>` — `name`, `defaultRate` (platform butonuna basınca gelen oran), `base` (komisyonun hesaplandığı matrah), `extras` (ek bedeller), `source`, `checkedAt`.
- `categories[]` — `platform`, `group`, `category`, `min`, `max` (tek oranlıysa min = max). Hesaplayıcıya `max` uygulanır.

## Önerilen kurulum
1. **Kaynak:** Her platformun resmî satıcı tarifesi. Amazon için `satis.amazon.com.tr/ucretlendirme` herkese açık. Trendyol, Hepsiburada, N11 ve Çiçeksepeti tarifeleri satıcı paneli arkasında; satıcı hesabın varsa panelden dışa aktarılan Excel/CSV en doğru kaynaktır.
2. **Script:** `scripts/update-commissions.ts`
   - Amazon sayfasını çekip tabloyu ayrıştırır.
   - Diğer platformlar için `sources/<platform>.csv` dosyasını okur (panelden indirilen tarife).
   - Çıktıyı şemaya göre doğrular (zod), `checkedAt` ve `updatedAt` alanlarını günceller.
3. **Zamanlama:** GitHub Actions ile haftalık cron (`0 6 * * 1`). Script çalışır, dosya değiştiyse otomatik **Pull Request** açar; oranları bir insan onaylayıp birleştirir.
4. **Güvenlik ağı:** Bir oran tek seferde ±5 puandan fazla değişirse PR'a uyarı etiketi eklensin; script hata verirse eski dosya korunur.
5. **Yayın:** Vercel, main'e merge sonrası otomatik deploy eder. JSON için `Cache-Control: s-maxage=3600` yeterli.

## Claude Code'a verilecek komut
> `KOMISYON-SISTEMI.md` dosyasındaki kurulumu yap: update-commissions script'i, zod şeması, haftalık GitHub Action ve otomatik PR akışı. Mevcut `data/komisyon-oranlari.json` şemasını bozma.
