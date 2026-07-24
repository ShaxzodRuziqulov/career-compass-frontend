# Kasb Kompas — Dizayn Tizimi

> **Yo'nalish: "Expedition / Cartography"** — kasb tanlashni *xaritada yo'l topish*
> deb qaraydi ("Kompas" nomiga mos). Ishonchli, energiyali, biroz editorial;
> o'smirlar uchun, lekin bolalarcha emas. Yumshoq gradientlar o'rniga aniq
> chegaralar, qalin tipografika va bosma-xarita hissi.
>
> Asosiy manba: [`src/style.css`](src/style.css), [`src/theme/traits.ts`](src/theme/traits.ts).

---

## 1. Umumiy uslub (design language)

- **Metafora:** topografik xarita — kontur chiziqlar, kompas rozasi, punktir "yo'l" chiziqlari.
- **Brend rangi:** deep teal `#0F9D8F` (light) / brighter teal `#2DD4BF` (dark) —
  yagona urg'u rangi. Eski binafsha→pushti gradient **butunlay olib tashlangan**.
- **His:** aniq (crisp), yumshoq emas. Kartochkalarda **qattiq ofset soya**
  (`4px 4px 0`, blursiz) — sticker/bosma-xarita tuyg'usi.
- **Layout:** bitta markazlashgan ustun, `max-width: 900px`, padding `40px 24px 64px`.

---

## 2. Dizayn tokenlari (CSS o'zgaruvchilar)

`:root`da belgilanadi, dark mode `@media (prefers-color-scheme: dark)`da qayta
belgilanadi. **Tokenni o'zgartirsang — butun ilova avtomatik yangilanadi.**

| Token | Light | Dark | Vazifasi |
|---|---|---|---|
| `--bg` | `#faf9f5` (map paper) | `#0e1418` | sahifa foni |
| `--card-bg` | `#ffffff` | `#151c21` | kartochka foni |
| `--border` | `#e4e1d8` | `#26313a` | chegaralar (1.5px) |
| `--text-h` | `#12181d` (ink) | `#edf2f0` | sarlavha / muhim matn |
| `--text` | `#5a646c` (muted ink) | `#93a1a8` | oddiy matn |
| `--accent` | `#0f9d8f` (teal) | `#2dd4bf` | asosiy urg'u |
| `--accent-hover` | `#0b7c71` | `#5eead4` | hover / bosilgan holat |
| `--accent-contrast` | `#ffffff` | `#06231f` | accent ustidagi matn |
| `--accent-bg` | `rgba(15,157,143,.1)` | `rgba(45,212,191,.14)` | yengil urg'u foni |
| `--accent-border` | `rgba(15,157,143,.42)` | `rgba(45,212,191,.45)` | urg'uli / punktir chegara |
| `--danger` | `#d13438` | `#f87171` | xato matni |
| `--danger-bg` | `rgba(209,52,56,.1)` | `.22` | xato foni |

**Ofset soyalar (blursiz, "bosma" his):**
`--shadow-sm` = `3px 3px 0`, `--shadow` = `4px 4px 0`, `--shadow-lg` = `6px 6px 0`
— rangi `--shadow-color` (light: ink `18,24,29`, dark: qora `0,0,0`) orqali.

---

## 3. Rounding scale (izchil yumaloqlik)

| Token | Qiymat | Qayerda |
|---|---|---|
| `--r-card` | 16px | kartochkalar |
| `--r-btn` | 12px | tugmalar, option'lar |
| `--r-input` | 10px | input / select / textarea |
| `--r-chip` | 100px | chip, badge, pill, progress |

> Hero va katta CTA panellari uchun 20–24px istisno sifatida ishlatiladi.

---

## 4. Tipografika

- **Display (sarlavha, tugma, raqamlar):** `Space Grotesk` 500/600/700
  (`--display`) — xarakterli grotesk, `letter-spacing: -0.02em`.
- **Body:** `Manrope` 400–800 (`--sans`), `16px / 1.6`.
- Ikkalasi ham Google Fonts orqali `index.html`da ulanadi (yagona qo'shilgan
  bog'liqlik). Uzbek matn ASCII apostrof (`'`) ishlatadi — glif muammosi yo'q.
- `h1` = 34px asosiy; landing hero `clamp(34px, 8vw, 60px)`.

---

## 5. RIASEC trait rang tizimi

`src/theme/traits.ts` — olti trait o'z gradientiga ega (`from → to`). Hue'lar
**ma'nosi bo'yicha tanilarli** qoladi, lekin paper/ink palitraga mos ravishda biroz
chuqurroq/earthier qilingan. Teal brend rangi shu olti hue bilan **to'qnashmaydi**.

| Kod | Nomi | `from` | `to` | Tus |
|---|---|---|---|---|
| R | Amaliy | `#f59e42` | `#ea7c1f` | to'q sariq |
| I | Tadqiqotchi | `#3a9fd6` | `#1f7fb8` | ko'k |
| A | Ijodkor | `#e069a3` | `#c94f8a` | pushti |
| S | Ijtimoiy | `#3bb489` | `#199468` | yashil |
| E | Tashabbuskor | `#ef6a6a` | `#d64545` | qizil |
| C | Tartibli | `#7b83e0` | `#5b62c7` | indigo |

**Default** (trait yo'q): teal `#2bb3a3 → #0f9d8f`.

---

## 6. Signature vizual elementlar (blur blob'lar o'rniga)

- **Kontur fon** — [`ContourBg.vue`](src/components/ContourBg.vue): topografik
  chiziqli SVG, past kontrast. `variant="accent"` (teal) yoki `variant="ink"`.
  Hero, natija banner, empty state'larda absolute joylashtiriladi (ota-element
  `position: relative; overflow: hidden`).
- **Kompas rozasi** — [`CompassIcon.vue`](src/components/CompassIcon.vue): teal
  kompas nina motifi. `animated` prop bilan landing hero'da nina joyiga "o'tirib
  qo'nadi" (`prefers-reduced-motion`da o'chadi).
- **Punktir "yo'l" chiziqlari** — landing "Qanday ishlaydi" bo'limida qadamlarni
  bog'laydi (`border-left: 2px dashed var(--accent-border)`), trust strip chegarasi.
- **Ofset soya** — barcha kartochkalarda `4px 4px 0`, hover'da element soya tomon
  siljiydi (`translate` + soya kattalashadi) — tactile sticker effekti.

---

## 7. Asosiy komponentlar

**`.card`** — `--card-bg`, `1.5px --border`, `--r-card` (16px), `--shadow` ofset soya.

**`.btn`** — teal to'ldirilgan: display shrift, `--r-btn` (12px), `--accent` fon,
`--accent-contrast` matn, `3px 3px 0` soya. Hover'da `--accent-hover` +
`translate(-1px,-1px)`; active'da `translate(2px,2px)` (bosilish hissi).

**`.btn-outline`** — shaffof, teal matn/chegara, hover'da `--accent-bg`.

**Input'lar** — `1.5px --border`, `--r-input` (10px), fokusda `--accent-border`
+ `0 0 0 3px --accent-bg` glow halqa.

**Fokus** — global `:focus-visible` → `2.5px solid var(--accent)` outline
(klaviatura foydalanuvchilari uchun).

---

## 8. Animatsiyalar / micro-interactions

- `.fade-in-up` — sahifa yuklanganda pastdan suzib chiqish (`0.5s`).
- Sahifalararo o'tish (`App.vue`): `opacity` fade `0.22s`.
- Quiz savol o'tishi: yon sirg'alish (`slide`).
- **Kompas ninasi (landing hero)** — signature interaksiya: desktop'da kursorga
  qarab buriladi (`requestAnimationFrame` + lerp ~0.08, chiqib ketganda ~1.2s'da
  shimolga qaytadi); touch'da sekin ±8° "qidiruv" tebranishi (~6s). Faqat nina
  guruhi buriladi (`transform-origin: center`). rAF hero ko'rinmasa to'xtaydi.
- **Kontur fon** — juda sekin drift (`transform` 20px / 40s, alternate).
- **Route chizig'i** — "Qanday ishlaydi" bo'limida IntersectionObserver bilan
  chiziladi, qadam kartochkalari ~120ms stagger bilan suzib chiqadi (bir marta,
  keyin unobserve).
- **Trait kartochkalar** — hover/focus/active'da trait rangida chegara + glow +
  `translateY(-4px)`.
- **Natija namunasi bar'lari** — ko'ringanda kengaygan holatga animatsiya (`width`
  0.6s, stagger).
- Barcha harakat `transform`/`opacity` (yoki bar `width`) — layout-thrash yo'q,
  scroll-jack yo'q, yangi bog'liqlik yo'q.
- **`prefers-reduced-motion: reduce`** — hamma harakat o'chadi: nina shimolda
  qotadi, chiziq to'la, kartochkalar/bar'lar yakuniy holatda (`style.css` global
  blok + har komponentda qo'shimcha guard).

---

## 9. Sahifalar

- **Landing** ([`LandingView.vue`](src/views/LandingView.vue), route `/`): hero
  (animated kompas + kontur), "Qanday ishlaydi" (punktir yo'l, 3 qadam), RIASEC
  legend (6 trait kartochka), natija namunasi (statik HTML mock), trust strip
  (kasblar soni — public `/api/careers`dan; testlar soni TODO chunki `/api/stats`
  admin-only), yakuniy CTA, minimal footer.
- **Quiz** (`QuizView.vue`): progress bar + savol kartochkasi (trait rangli chegara
  + ofset soya), 5 ballli emoji tugmalar.
- **Result** (`ResultView.vue`): teal hero banner + kontur, profil bar'lari, kasblar.
- **Careers** (`CareersView.vue`): grid kartochkalar, rangli accent chiziq, teal
  moslik badge, filter pill.
- **CareerDetail** (`CareerDetailView.vue`): teal hero banner + kontur, roadmap.
- **Stats / Admin** (`StatsView.vue`, `AdminQuestionsView.vue`,
  `AdminLoginCard.vue`): stat tile'lar, kunlik teal bar chart, top kasblar, login
  kartochkasi (qulf badge).

---

## 10. Fayl xaritasi

| Fayl | Javobgar |
|---|---|
| `index.html` | Google Fonts ulanishi, theme-color meta |
| `src/style.css` | Tokenlar, `.card`, `.btn`, fokus, animatsiyalar, reduced-motion |
| `src/theme/traits.ts` | RIASEC trait ranglari |
| `src/components/ContourBg.vue` | Kontur fon teksturasi |
| `src/components/CompassIcon.vue` | Kompas rozasi motifi (animatsiyali) |
| `src/App.vue` | Header, nav, sahifa o'tishi |
| `src/views/*.vue` | Har sahifa uslublari (`<style scoped>`) |

---

## 11. Redesign qoidalari (kelajak uchun)

1. Ranglar/radiuslar faqat token orqali — inline hex yozma.
2. Har yangi rang uchun **light + dark** qiymat ber.
3. RIASEC hue'larini ma'nosini buzmasdan sozla; teal accent ular bilan ajralib tursin.
4. Yangi shrift qo'shilmaydi (Space Grotesk + Manrope yetarli).
5. Soyalar blursiz ofset bo'lib qolsin — bu uslubning belgisi.
