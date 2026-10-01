# Chrome Web Store — Listing Kopya Paketi
**Instant Meme Generator** · yayıncı: Batuhan Hazar Özkeskin · ücretsiz · non-trader

Aşağıdaki metinleri Chrome Web Store geliştirici panelindeki ilgili alanlara
birebir yapıştırabilirsin. Her alanın başlığı formdaki karşılığıyla aynı.

---

## Item name (Eklenti adı) — max 75 karakter
```
Instant Meme Generator
```

## Summary (Kısa açıklama) — max 132 karakter
```
Pause any video, snip part of the screen, add a caption, and download your meme in seconds — right inside your browser.
```

## Category (Kategori)
**Önerilen birincil kategori:** `Fun` (Just for Fun)
**Alternatif:** `Photos` (görsel/düzenleme tarafını vurgulamak istersen)
> Meme üretimi eğlence odaklı olduğu için "Fun" en doğru oturan; listendeki tam
> seçenek adı biraz farklıysa anlamca en yakınını seç.

## Language (Dil)
Birincil: **English**. (İstersen sonradan Türkçe çeviri de ekleyebilirsin — hazırlayabilirim.)

---

## Detailed description (Uzun açıklama)
```
Make a meme out of any moment — in seconds, without leaving your browser.

Watching a video and catch a hilarious face or frame? Pause it, grab exactly
the part you want, add your caption, and download the finished meme. No editor,
no uploads, no sign-up.

HOW IT WORKS
1. Pause the video on the moment you want.
2. Click the Instant Meme Generator icon and hit "Take screenshot."
3. Drag to select any area of the page — just like a snipping tool.
4. Type your caption and click "Create meme." Your text is added below the
   image in classic meme style.
5. Click download. Done.

WORKS GREAT ON
YouTube, Twitch, Kick, live streams, and most regular web video.

GOOD TO KNOW
Some paid streaming services (for example Netflix, Disney+, Prime Video) protect
their video, so a screenshot there may come out black. This is a browser-level
limitation that affects all screenshot tools — not a bug in this extension. For
YouTube, Twitch and everyday web video it works perfectly.

PRIVATE BY DESIGN
Everything happens locally in your browser. No accounts, no tracking, no servers,
nothing uploaded anywhere. Your screenshots and memes never leave your device.

Free, lightweight, and does one thing well. Enjoy!
```

---

## Single purpose description (Tek amaç açıklaması — zorunlu alan)
```
Instant Meme Generator lets the user capture a selected region of the current
browser tab, add a text caption, and download the result as a meme image. All
processing happens locally in the browser.
```

---

## Permission justifications (İzin gerekçeleri)
> Not: Aşağıdakiler olası izin setine göre yazıldı. **manifest.json'daki gerçek
> izinlerinle birebir eşleştir** — kullanmadığın bir izni silip listeden çıkar,
> fazladan izin istenen satırı yazma (az izin = daha hızlı onay).

**activeTab**
```
Used to capture the visible area of the user's current tab only at the moment
the user clicks the extension button, so they can select a region to turn into a meme.
```

**scripting**
```
Used to inject the region-selection overlay into the current page when the user
starts a capture, so they can drag to choose the area to screenshot.
```

**downloads** *(yalnızca manifest'te varsa)*
```
Used to save the finished meme image to the user's device when they click the
download button.
```

**storage** *(yalnızca manifest'te varsa)*
```
Used to remember the user's last-used settings locally (e.g. caption style).
No data is transmitted off the device.
```

**Host permissions / <all_urls>** *(yalnızca manifest'te varsa)*
```
The extension needs to capture a screenshot of whichever page the user is
viewing when they trigger it; capture only runs on user action and no page
content is collected or sent anywhere.
```

---

## Privacy practices (Gizlilik beyanı — panelde işaretlenecekler)
- **Data collection:** "This item does not collect user data" seçeneğini işaretle.
- **Privacy policy URL:** GitHub Pages'e koyacağın `privacy-policy.html` linkini gir
  (ör. `https://<kullanıcı-adın>.github.io/instant-meme-generator/privacy-policy.html`).
- **Trader status:** **Non-trader** (ücretsiz, kişisel, ticari değil).

---

## Gizlilik politikasını yayınlama (GitHub Pages — ücretsiz, 5 dk)
1. GitHub'da yeni bir public repo aç (ör. `instant-meme-generator`).
2. `privacy-policy.html` dosyasını repoya yükle.
3. Repo → Settings → Pages → Source: `main` branch, `/root` → Save.
4. Birkaç dakika sonra sayfa `https://<kullanıcı-adın>.github.io/instant-meme-generator/privacy-policy.html`
   adresinde yayında olur. Bu linki mağaza formundaki "Privacy policy URL" alanına yapıştır.
