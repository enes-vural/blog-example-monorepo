---
name: huzurlu-blog
description: >
  Huzurlu Yaşam (apartman/site yönetim yazılımı) blog motoru — claude-blog'un
  ÜSTÜNE oturur. Blog yazmadan ÖNCE bu skill okunur; owner (Sinan/Enes)
  yönlendirmeleriyle zamanla kurulmuş AEO (AI alıntılanabilirlik) + SEO
  (Google ranking) özelliklerini, guardrail'leri ve yayın/doğrulama akışını
  claude-blog pipeline'ına ekler. Use when the user asks to write/rewrite a
  Huzurlu Yaşam (huzurluyasam.net) blog post, "bugünün postu", "günün blogu",
  "HY blog", "apartman/site/aidat/kat mülkiyeti blog yazısı", or any daily-blog
  cadence task for this project. Trigger BEFORE calling blog-write/blog-rewrite
  for this site.
user-invokable: true
argument-hint: "[konu veya 'GSC'den seç']"
license: MIT
---

# Huzurlu Yaşam Blog Motoru (claude-blog + öğrenilen AEO/SEO katmanı)

Bu skill **claude-blog'u değiştirmez, ona sarar.** Amaç: her HY blog postunu owner'ın
zamanla verdiği yönergelerle yazmak. Sıra: (1) bu skill'i oku → (2) konu seç + doğrula
→ (3) claude-blog (`blog-write`/`blog-rewrite`) ile yaz, AMA aşağıdaki katmanı zorla →
(4) yayınla + doğrula → (5) hafızaya işle.

Proje kökü: `/Users/sakastudio/development/projects/sinan/hedefim/hazalkenthuzurluyasam`
Site: https://huzurluyasam.net · Astro 5 SSG, `web/` · Cloudflare Pages (wrangler).
Yazılar: `web/src/content/blog/*.md` · render: `web/src/pages/blog/[...slug].astro`.

---

## 0) HARD GUARDRAILS (asla ihlal etme)

1. **ÜRÜN İDDİASI GUARDRAIL** — yalnız GERÇEK özellikleri söyle.
   - ✅ GERÇEK: daire-bazında borç/ödeme kaydı, sakin portalı (şeffaf gösterim),
     iOS/Android app, toplu Excel yükleme, duyurular, HuzurGate akıllı giriş,
     **33 daireye kadar ücretsiz**.
   - ❌ SAHTE (ASLA iddia etme): otomatik gecikme tazminatı hesabı, otomatik ödeme
     hatırlatma/otomasyonu. Product CTA = sadece gerçek özellikler.
2. **RAKİP MARKA ADI YASAK** — Apsiyon/Aidat360/vb. postta ASLA geçmez (TR Ticari
   Reklam Yönetmeliği riski). Kategori diliyle yaz ("kurumsal kapsamlı çözümler",
   "aidat odaklı sade araçlar"). "Huzurlu Yaşam" kendi markan, serbest.
3. **YMYL → WEB-VERIFY** — hukuk/mevzuat (634 KMK, TMK, İİK, 7579, KVKK, cezalar)
   içeren her post ÖNCE tier-1 kaynaktan (mevzuat.gov.tr, resmigazete.gov.tr)
   doğrulanır. Bunu `blog-researcher` subagent'ına (model: sonnet) yaptır. Madde
   numaralarını ve 2025/2026 değişikliklerini teyit et.
4. **CEZA/RAKAM TEMKİNİ** — güncel idari para cezası tutarından emin değilsen RAKAM
   VERME; "yeniden değerleme ile güncellenir, kesin tutar için mevzuata bak" de.
5. **DEPLOY ET, COMMİTLEME** — yalnız `publish.sh` (wrangler) ile yayınla. `git
   commit`/`push` YAPMA (owner: "deploy et commitleme"). Web işleri shared
   checkout'ta uncommitted kalır.
6. **DIŞ BACKLINK = OWNER GÖNDERİR** — dizin/forum/YaCevap gönderimlerini ben
   taslaklarım, hesap açıp paylaşan owner. GSC/Yandex "Request Indexing"i de owner
   elle yapar (ben yapamam).

---

## 1) AEO KATMANI (AI alıntılanabilirlik — owner: "az insan okusa bile AI okusa yeter")

Öncelik: **AI extraction > insan okuması.** Her post şunları İÇERMEK ZORUNDA:

- **Answer-capsule (AI "bounding box")** — postun EN ÜSTÜNDE, frontmatter'dan hemen
  sonra `<div class="answer-capsule">` içinde 3-5 cümlelik, KENDİ BAŞINA anlamlı,
  madde-numaralı direkt cevap. Bu kutu AI'ın alıntıladığı birincil pasajdır.
  ```html
  <div class="answer-capsule">

  <!-- self-contained cevap: tanım + madde no + kilit kural. Örn: -->
  Apartman karar defteri, kurul kararlarının yazıldığı **noter tasdikli, sıra
  numaralı zorunlu defterdir** (634 sayılı Kanun m.32). ...

  </div>
  ```
  NOT: capsule içindeki markdown'ın render olması için `<div>`'den sonra ve `</div>`
  önce BOŞ SATIR bırak (bu blok markdown; SVG bloğuyla karıştırma — bkz. §2 SVG kuralı).
- **FAQPage schema** — frontmatter `faq:` altında 5 adet `q/a`. Her `a` kendi başına
  citable, tam cümle, madde numaralı. `[...slug].astro` bunu JSON-LD FAQPage'e çevirir.
- **Answer-first H2'ler** — her H2 bir soruyu doğrudan ilk cümlede cevaplar (Speakable
  dostu). "Ne, kim, ne zaman, hangi çoğunluk" gibi.
- **Information-gain / yanlış-düzeltme** — yaygın yanlış varsayımı AÇIKÇA düzelt
  (örn. "2026'da karar defteri değişti mi? Hayır — 7579 sayılı Kanun m.32'ye
  dokunmadı"). Bu özgün bilgi = AI daha çok alıntılar + rakiplerde yok.
- **Net varlıklar/tanımlar** — madde numaraları, tarihler (22 Mayıs 2026), rakamlar,
  tanım cümleleri. Bulanık dil değil.
- **Sonunda kısa "Sıkça Sorulan Sorular"** metin bloğu (frontmatter FAQ'e ek, gövdede
  soru-cevap; her cevap 1-2 cümle).

---

## 2) İNLİNE SVG DATA-VİZ (asıl SEO/AEO ağırlığı burada — text-based, citable, özgün)

Her postta **en az 1 konuya-özel inline SVG** infographic/data-viz olacak (kapaktan
daha önemli). Metin tabanlı olduğu için AI okur + alıntılar.

⚠️ **SVG BOŞ-SATIR TUZAĞI (kritik, non-obvious):** Astro markdown'da inline
`<figure>`/`<svg>` bloğunun İÇİNDE **boş satır** olursa raw-HTML passthrough KIRILIR →
SVG'nin gerisi DÜZ METİN olarak render olur ("görsel olmamış" hatası). Kurallar:
- `<figure>...</figure>` TEK BİTİŞİK BLOK yaz, **elemanlar arasında boş satır YOK**.
- `<style>` içine geçersiz CSS koyma (örn. `rx:10` — `rx` SVG attribute'u, CSS değil).
- Class'lı stil kullan (`<style>.kt{font-family:Arial}...</style>`), inline tekrar azalt.
- Marka paleti: turuncu `#fd8830` / `#ee701b` / koyu `#a2440f`, ink `#1c1917`,
  muted `#57534e`/`#78716c`, zemin şeffaf/`#fff7ed`.
- `role="img"` + açıklayıcı `aria-label` (AI + erişilebilirlik).
- Sonuna küçük "Dayanak: 634 ... m.XX" kaynak satırı.

**Build sonrası doğrula:** `grep -c '&lt;rect' <dist-html>` = 0 olmalı (leak yok),
`grep -o '<rect' | wc -l` > 0 olmalı (gerçek render).

---

## 3) SEO KATMANI

- **Branded PIL kapak** (heroImage + OG kartı). 1200×675 JPEG, `public/blog/<slug>.jpg`.
  Motif: apartman skyline + eyebrow pill (ör. "YÖNETİM · 634 KMK · 2026") + 3-satır
  başlık + wordmark "Huzurlu Yaşam huzurluyasam.net". Palet #fd8830/#26211e.
  PIL python: macOS `/opt/homebrew/bin/python3`, Windows `python` (venv/global — Pillow
  installed via `pip install Pillow`). Şablon: `references/gen_cover.py` (OS'a göre font
  yolunu ve OUTDIR'ı otomatik seçer: macOS Arial Supplemental, Windows `C:/Windows/Fonts`,
  Linux DejaVu; Mac proje checkout'u yoksa çıktı `references/blog-covers/`'a düşer).
  Not: kapak ≈ 0 direkt Google lift; değeri OG/sosyal + cila. Asıl ağırlık SVG'de.
- **İndirilebilir asset = backlink magnet** (kanıtlı: çizelge CSV, ihtarname/makbuz/
  karar örneği Word+PDF). Kullanıcıya gerçek değer + link mıknatısı + ranking sayfası.
  Word/PDF üreten python (docx+reportlab): macOS `~/.claude/tools/scrapling/.venv/bin/python`,
  Windows `python` (global — `pip install python-docx reportlab`).
  PDF Türkçe font: macOS `/System/Library/Fonts/Supplemental/Arial*.ttf`, Windows
  `C:/Windows/Fonts/arial.ttf` + `arialbd.ttf`. **PDF başlıkları
  SİYAH** (owner tercihi, turuncu değil). İndirme butonları gövdeye:
  ```html
  <div class="flex flex-wrap gap-3 my-6">
    <a href="/blog/<asset>.docx" download class="inline-flex items-center gap-2 rounded-lg bg-[#ee701b] px-5 py-3 font-semibold text-white no-underline hover:bg-[#d5610f]">⬇ Word (.docx) indir</a>
    <a href="/blog/<asset>.pdf" download class="inline-flex items-center gap-2 rounded-lg border-2 border-[#ee701b] px-5 py-3 font-semibold text-[#ee701b] no-underline hover:bg-orange-50">⬇ PDF indir</a>
  </div>
  ```
- **İç link: max 4-5, anlamlı, reciprocal** (link yığını YASAK — owner "liste+link
  yığını istemiyorum"). Legal hub-and-spoke: yeni postu ilgili 3-4 posta bağla + en
  az birine karşılıklı link ekle. Hub = `apartman-yonetmeligi-ve-kanunu-2026`.
- **Dış tier-1 mevzuat linki** — 634 → `mevzuat.gov.tr/mevzuatmetin/1.5.634.pdf`,
  7579 → resmigazete. 1-2 tane, bağlamıyla.
- **Named author rotation** — `sinan-yuce`, `enes-vural`, `alper-vural`, `huzurlu-yasam`
  (bkz. `web/src/data/authors.ts`). Hukuk-doküman postlarında enes-vural iyi oturur.
  Her post farklı yazar (E-E-A-T + doğal çeşitlilik).
- **pubDate = o gün** (drip yayın, günde 1 post cadence).
- Meta: title ~55-60 char + anahtar kelime başta; description ~150-160 char, sorulu.

---

## 4) OKUNABİLİRLİK (owner: "kahvede yöneticiye anlatır gibi, insan-okunur")

- Bullet/link yığını değil, **anlatı + gerçek örnek** ("Diyelim 24 daireli bir sitede…").
- Neden'i açıkla, sadece ne'yi listeleme. Sıcak, hikâye gibi ton.
- Answer-capsule + FAQ + 1 SVG yapıyı taşır ama PROSE postu taşır.
- `blog-analyze` ile **95+ hedefle** (owner: "daha iyi olsun"). <95 ise yayınlamadan
  önce derinlik/örnek/tier-1 kaynak/deneyim sinyali ekle. En zayıf kategori genelde
  E-E-A-T → dış otoriter kaynak + deneyim işareti (app ekranı, özgün SVG verisi) ile kaldır.

---

## 5) KONU SEÇİMİ (keyword-driven, cannibalization guard)

1. `mcp__gsc__detect_quick_wins` + `mcp__gsc__search_analytics`
   (`sc-domain:huzurluyasam.net`, query dim) ile TALEP gör. Pos 4-20, impr>20,
   CTR düşük = fırsat. Yeni/uncovered intent ara.
2. **Cannibalization guard:** `ls web/src/content/blog/` — aynı intent'i karşılayan
   post var mı? Varsa YENİ AÇIYLA ayrış (örn. "kat malikleri kurulu" = toplantı;
   "karar defteri" = belge → farklı intent). Rakip iki postu asla aynı sorguya sokma.
3. Legal/hesaplama/downloadable gap'leri tercih et; commercial "program" cluster
   SATURATED (6 post) → yeni commercial = cannibalization.

---

## 6) YAYIN + DOĞRULAMA

⚠️ **bgIsolation:** shared checkout'ta Edit/Write reddedilebilir → dosyaları **Bash
`cat > ... <<'MD'` heredoc** ile yaz (publish.sh oradan deploy eder; fresh worktree
bugünün uncommitted işini görmez).

1. `cd web && npm run build` — sayfa sayısı +1 mi?
2. Doğrula (dist HTML): leaked HTML=0, SVG rect>0, download link=2, FAQPage=1, hero=2.
3. `bash web/scripts/publish.sh` (build + wrangler deploy + IndexNow → Bing/Yandex).
4. Prod 200 kontrol: post URL + .docx/.pdf/.jpg. NOT: deploy sonrası ilk curl'de yeni
   asset 404 dönebilir = Cloudflare edge negatif-cache/propagation lag; birkaç sn sonra
   200, panik yok, retry et. .docx MIME'ı
   `application/vnd.openxmlformats-officedocument.wordprocessingml.document` olmalı.
5. **Owner'a URL ver** → elle GSC Request Indexing + Yandex Reindex (owner yapar).
6. Hafızaya işle: `.../memory/daily-blog-cadence.md` sonuna `## <tarih>` bölümü
   (post adı, keyword-dayanak, verified madde no'ları, asset'ler, doğrulama, owner aksiyonu).

---

## Pre-flight checklist (yazmadan önce hepsini işaretle)

- [ ] GSC'den keyword-driven konu seçildi + cannibalization guard geçti
- [ ] YMYL ise tier-1 web-verify yapıldı (madde no + 2026 değişikliği teyit)
- [ ] answer-capsule (AI bounding box) + 5 FAQ (schema) + answer-first H2
- [ ] information-gain / yaygın-yanlış düzeltmesi var
- [ ] ≥1 konuya-özel SVG, TEK BLOK (boş satır yok), geçersiz CSS yok, kaynak satırı
- [ ] branded PIL kapak (heroImage) üretildi
- [ ] (uygunsa) indirilebilir Word+PDF asset, PDF başlıkları siyah, 2 indirme butonu
- [ ] iç link 4-5 (reciprocal dahil), dış tier-1 mevzuat link 1-2
- [ ] named author (rotasyon), pubDate = bugün
- [ ] anlatı + gerçek örnek, list/link yığını değil
- [ ] ürün iddiası GERÇEK, rakip markası YOK, ceza rakamı temkinli
- [ ] build +1 sayfa, dist doğrulama geçti, publish.sh, prod 200
- [ ] daily-blog-cadence.md güncellendi, owner'a URL verildi

---

## Referanslar

- İçerik/marka kuralları: `~/.claude/context/blog-rules.md`, proje memory
  `daily-blog-cadence.md` + `huzurluyasam-web-astro.md`.
- Kapak üreteci örneği: `references/gen_cover.py` (bu skill klasöründe).
- claude-blog alt-skilleri (bu skill onların ÜSTÜNE biner): `blog-write`,
  `blog-rewrite`, `blog-analyze`, `blog-researcher` (agent), `blog-schema`, `blog-chart`.
