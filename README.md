# Kâr Fişi

Pazaryeri satıcıları için net kâr hesaplayıcı. Next.js 16 · TypeScript · Tailwind CSS v4.

## Çalıştırma

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Yapı

- `src/app` — layout, global stiller (renk ve yazı tipi token'ları `globals.css` içinde), sayfa
- `src/components` — `site/` (ana sayfa bölümleri), `checkout/`, `modals/`, `ui/`, `app-provider.tsx` (ortak durum)
- `src/lib` — hesaplama (`calc.ts`), biçimlendirme, sabitler, PNG üretimi, site bilgileri (`site.ts`)
- `data/komisyon-oranlari.json` — komisyon verisi (rehber ve platform butonları buradan okur)
- `docs/` — tasarım teslim paketi (referans HTML, README, komisyon sistemi notu)

## Komisyon oranlarını güncelleme

```bash
npm run update-commissions
```

- Amazon TR: resmî sayfadan otomatik okunur (`scripts/amazon.ts`).
- Trendyol, Hepsiburada, N11, Çiçeksepeti: `sources/<platform>.csv` (`group;category;min;max`). Satıcı panelinden indirdiğin tarifeyi bu biçime çevirip dosyanın üstüne yaz.
- Çıktı zod ile doğrulanır; hata olursa `data/komisyon-oranlari.json` değişmez.
- ±5 puandan büyük değişimler `commission-warnings.md` dosyasına yazılır.
- `.github/workflows/update-commissions.yml` bunu her pazartesi çalıştırır; oranlar değiştiyse doğrudan `main`'e işler ve Vercel siteyi kendiliğinden yeniler (onay gerekmez). Değişmediyse hiçbir şey olmaz.

## Notlar

- Ödeme akışı **simülasyondur**. Gerçek ödeme için Iyzico Checkout Form entegre edilmeli; kart verisi sunucuya gelmemeli.
- Premium durumu tarayıcı belleğindedir (sayfa yenilenince sıfırlanır).
- Footer'daki imza ve iletişim e-postası `src/lib/site.ts` içindedir.
