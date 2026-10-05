# Oyun şablonu (HTML5 + JavaScript)

*English below.*

Bu şablonla yaptığın oyun, Oyun Takımı sitesinde yayınlanır. Telefonda da bilgisayarda da çalışmalı.

## Başlarken
1. Bu sayfada **Use this template → Create a new repository** de. Repoyu kendi hesabında **Private** olarak oluştur.
2. Repo ayarlarından (**Settings → Collaborators**) asistanını collaborator olarak ekle.
3. `game.json` dosyasını doldur: `slug` (oyunun adresi, örn. `uzay-kosusu`), `title`, `author` (takma adın; gerçek adını yazmak zorunda değilsin), `category`, `orientation`.
4. Oyununu `game/` klasöründe yaz. `game/main.js` bir örnek oyun; onu silip kendi oyununu yazabilirsin. `game/index.html` mutlaka olmalı.

## Bilgisayarında denemek
Oyunu bir yerel sunucuyla aç, örneğin:
```
npx serve game
```
ya da VS Code'da **Live Server** eklentisiyle `game/index.html`'i aç. Telefon görünümü için tarayıcıda geliştirici araçlarını açıp cihaz modunu kullan.
Doğrudan açıldığında oyun **önizleme modunda** çalışır: skorlar sadece senin tarayıcında tutulur. Adrese `?lang=en` ekleyerek İngilizceyi, `?player=Ali` ekleyerek giriş yapmış bir oyuncuyu deneyebilirsin.

Göndermeden önce kontrol et:
```
node scripts/check.mjs
```

## Siteyle konuşmak: OyunSDK
`oyun-sdk.js` dosyasını değiştirme; `index.html`'de oyun kodundan önce yüklenmeli.
```js
OyunSDK.getLanguage();             // "tr" veya "en"
await OyunSDK.getPlayer();         // { nickname } ya da giriş yapılmadıysa null
await OyunSDK.submitScore(42);     // oyun bitince skoru gönder → { saved, best }
OyunSDK.onPause(() => { ... });    // oyuncu sekmeyi değiştirdi: oyunu durdur
OyunSDK.onResume(() => { ... });
```
Skor kullanmıyorsan `game.json`'da `"scores": false` yap.

## Kurallar
- Her şey `game/` klasöründe olmalı; dışarıdan (CDN, başka site) dosya yükleme.
- Toplam boyut en fazla 60 MB.
- Dokunmatik ekranda oynanabilmeli (`pointerdown` gibi pointer olaylarını kullan).
- Uygunsuz içerik yok; site herkese açık.

## Teslim
Oyun bitince repoyu asistanına transfer et (**Settings → Danger Zone → Transfer**). Repo `oyun-team` organizasyonuna taşındıktan sonra, `main`'e her push oyunu otomatik yayınlar. İlk yayın asistan onayladıktan sonra görünür.

Transfer yapamıyorsan, oyun bir fork ise, dal adı `main` değilse ya da taşıdıktan sonra **Publish** adımı "skipped" görünüyorsa: [AGENTS.md](AGENTS.md) dosyasının 2. bölümü her durumu adım adım anlatır. Bir yapay zekâ kod asistanı kullanıyorsan ona "AGENTS.md'ye göre oyunu oyun-team'e taşı" demen yeterli.

---

# Game template (HTML5 + JavaScript)

Games made from this template are published on the Oyun Team site. They must work on phones and computers.

**Getting started:** click **Use this template**, create a **private** repo on your account, and add your TA as a collaborator. Fill in `game.json` (`slug`, `title`, `author` as a nickname, `category`, `orientation`), and write your game in `game/` (`game/main.js` is an example you can replace; `game/index.html` is required).

**Testing:** run `npx serve game` (or VS Code Live Server). Opened directly, the game runs in **preview mode**, with scores kept only in your browser. Add `?lang=en` or `?player=Ali` to the address to test those cases. Run `node scripts/check.mjs` before handing in.

**OyunSDK:** see the code block above; `submitScore` when a round ends, `onPause`/`onResume` to pause, `getLanguage` for text. Don't edit `oyun-sdk.js`.

**Rules:** everything inside `game/`, no external files, 60 MB max, playable with touch, nothing inappropriate.

**Handing in:** transfer the repo to your TA. Once it is in `oyun-team`, every push to `main` publishes automatically; the first release appears after the TA approves it. If you can't transfer, the repo is a fork, the branch isn't `main`, or **Publish** shows as skipped after the move, section 2 of [AGENTS.md](AGENTS.md) covers every case step by step; an AI coding assistant can follow it for you ("move this game into oyun-team following AGENTS.md").
