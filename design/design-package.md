# El Piquete · Design Package

The single build input for the cinematic redesign. Every line of Spanish copy below ships **verbatim**. Scroll ranges and pacing numbers are starting points, validated later by the flick test.

Status: **Phase B + C, awaiting storyboard approval.** No credits spent, no code changed.

---

## 0. Decisions locked in Phase A

| Decision | Choice |
|---|---|
| Hero world | Night kitchen: deep navy slate, warm tungsten key light, one continuous downward journey |
| Video model | Kling 3.0 Pro · 1080p · 6 s · silent · 3 chained segments |
| Jar in final shot | Test the real logo as a round label via image edit; unbranded jar is the fallback |
| Product imagery | Generated real-recipe jars + "Imágenes de referencia." note; admin photo uploads override automatically (`imagen_url \|\| fallback`) |
| Architecture | Existing React 19 + Vite + Express/MySQL on Vercel. Skill standards applied inside React. No new animation libraries. |
| Scope guard | Checkout and admin keep their current look. New tokens are namespaced `--color-ep-*`; existing tokens and `Button` are not modified. |

---

## 1. Brand premise

**El piquete justo.** A *piquete* is a small sting: tiny, and you feel it. One spoonful of encurtido, crunchy, acidic and *picosito*, changes the whole plate: el pollo con tajadas, la carne asada, la baleada. The film shows where that piquete comes from (fresh ingredients, brine, the jar). The heat selector lets each visitor choose the size of their piquete. Every section ends in the same place: taking a jar home.

Research grounding (buyers' own language): "el acompañante que nunca falta en la mesa hondureña", "cítrico y picosito", "crujiente, como debe ser". Objections found: "demasiado agrio", "fuerte de vinagre", losing crunch, not knowing how spicy it is. The copy answers each one.

---

## 2. Palette (direction; final hex sampled from the approved footage)

```css
@theme {
  --color-ep-night:   #0E1726; /* hero world + dark sections: navy slate, never black */
  --color-ep-night-2: #16233A; /* raised surfaces on night, footer */
  --color-ep-cream:   #F3EADB; /* page canvas, warmer than the current #fbf3e7 */
  --color-ep-paper:   #FBF6EC; /* cards on cream */
  --color-ep-carrot:  #E4772E; /* heat, glow, highlights (from the footage) */
  --color-ep-jalapeno:#4D6A2A; /* green accents, "En existencia" */
  --color-ep-chili:   #C1272D; /* CTA only, rare */
  --color-ep-chili-hover: #A81F25;
  --color-ep-brine:   #D8B76A; /* whisper level: brine line, particles */
  --color-ep-ink:     #1C1B19; /* text on cream */
  --color-ep-ink-2:   #5B564E; /* secondary text on cream */
  --color-ep-fog:     #ECE4D6; /* text on night */
}
```

Contrast is computed at build (4.5:1 body, 3:1 large text and interface borders), not guessed. Deliberate deviation from the skill's "AI look" list: cream + serif is kept because cream is El Piquete's own label world, but navy leads and the tones are sampled from the film.

---

## 3. Type trio (self-hosted via Fontsource, latin + latin-ext subsets only)

| Role | Face | Weights | Why |
|---|---|---|---|
| Display | **Young Serif** | 400 | Chunky, warm, old-style. Reads like an artisan label, not a fashion magazine. |
| Body | **Figtree** | 400, 500, 600 | Friendly, very legible for prices and descriptions on phones. |
| Micro-labels | **DM Mono** | 400, 500 | Batch-stamp feel for small labels ("03 · Mezcla", "250 ML"). |

Replaces Fraunces + Inter on the storefront only. Current imports also ship Cyrillic, Greek and Vietnamese subsets that Spanish never uses; the new imports load latin + latin-ext only.

---

## 4. The hero band map

Hero height **1000vh** (scroll range 900vh; 0.01 progress = 9vh). Film = 3 × 6 s = 18 s. Captions live in the **left third**; the action lane is center-right. Micro-labels in DM Mono above each caption.

| Band | Range | Footage moment | Micro-label | Copy (verbatim) | Entrance (echo) |
|---|---|---|---|---|---|
| 1 | 0.00 → 0.15 | S1 0.0–2.7 s: macro whole carrot with droplets, camera sinking past it | `01 · Ingrediente` | **Todo comienza fresco.** | Blur-to-sharp (focus arriving on the macro). One-time load ramp so it opens settled. |
| 2 | 0.18 → 0.32 | S1 3.2–5.8 s: slow rain of julienne strips | `02 · Corte` | **Seleccionamos cada ingrediente.** | Drift-down: words fall into place like the strips. |
| 3 | 0.35 → 0.49 | S2 0.3–2.8 s: carrot, red onion, jalapeño tumbling | `03 · Mezcla` | **Color. Textura. Picante.** | Word-punch with overshoot, one word per ingredient; a hairline under each word draws in carrot, violet, green. |
| 4 | 0.52 → 0.66 | S2 3.2–5.9 s: brine surface, splash, lens under, bubbles | `04 · Salmuera` | **El equilibrio está en cada detalle.** | Bubble-rise (invented): characters float up from below with a slight lateral wobble, staggered. |
| 5 | 0.69 → 0.82 | S3 0.3–3.2 s: inside the jar, ingredients settle and pack | `05 · Frasco` | **Preparado artesanalmente.** | Pack (invented): letters start spread wide and pack tight, like vegetables settling into the jar. |
| 6 | 0.85 → 1.00 | S3 3.6–6.0 s: camera exits the glass, jar at rest, light settles | `Encurtidos artesanales · Tegucigalpa` | H1 **El sabor que transforma cada comida.** · Sub **Encurtidos artesanales preparados con ingredientes frescos y el nivel de picante perfecto.** · CTA **Descubrir El Piquete** (→ `#picante`) · CTA **Comprar ahora** (→ `#productos`) | Word-by-word rise into staged settle: headline, then subline, then the CTA row. No ease-out (the journey ends settled). |

Each band has a ~90vh fully visible plateau and ~18vh eased ramps. Hero furniture at whisper level: a loading ring (carrot stroke) while the video streams, a thin right-edge descent line with 6 ticks, a scroll cue at the start. All hidden under `(max-height: 560px)`.

Header over the hero: transparent with fog text and a soft top scrim; it switches to the cream state once the hero ends.

---

## 5. Static hero (phones, portrait tablets, coarse portrait, landscape phones, reduced motion)

Stacked, not overlaid: the jar image (hero-ending, cover-cropped, `object-position: 62% 50%`) fills the top ~62svh, and the copy sits below on night.

- Micro: **Encurtidos artesanales · Tegucigalpa**
- H1: **El sabor que transforma cada comida.**
- Sub: **Encurtidos artesanales preparados con ingredientes frescos y el nivel de picante perfecto.**
- CTAs: **Comprar ahora** (primary) · **Descubrir El Piquete**

Mobile story strip right below ("De la tabla al frasco"), three frames pulled from the film, horizontal scroll-snap, gentle parallax:
1. **Todo comienza fresco.**
2. **El equilibrio está en cada detalle.**
3. **Preparado artesanalmente.**

No video, no Blob fetch and no desktop poster are downloaded on these devices. The gate is re-evaluated live on rotation, resize and preference change.

---

## 6. Below the hero (verbatim copy)

One commercial direction: every section funnels to **Comprar ahora** / add to cart. Nav: Inicio · Productos · Picante · Combos · Nosotros · Preguntas · Contacto · **Comprar ahora** · 🛒. All existing ids are kept.

### 02 · Productos destacados `#productos` (cream)
- Kicker: **02 · La colección**
- H2: **Tres frascos. Un mismo origen.**
- Lede: **La misma receta de cebolla, zanahoria y jalapeño, en tres niveles de picante. Preparada por lotes para que llegue crujiente a tu mesa.**
- Layout: editorial feature grid. The "Más vendido" product is a large card; the other two stack beside it. Dark jar images on paper cards.
- Card data, all from the API: name, description, presentación, heat meter (3 SVG jalapeño pips + level label), price, availability (**En existencia** / **Agotado**), buttons **Añadir al carrito** / **Comprar ahora** (existing cart behavior).
- Under the grid: **Imágenes de referencia.**
- Microinteractions: soft lift + light sweep across the jar image on hover, image parallax inside the frame, magnetic primary button (pointer: fine only).

### 03 · Elige tu nivel `#picante` (signature interaction, warm gradient over night)
- Kicker: **03 · Tu nivel**
- H2: **¿Qué tan valiente eres?**
- Control: a slider with three stops **Suave · Tradicional · Picante**, mapped to the real products by `nivel_picante`. Keyboard accessible (`role="slider"`, arrow keys), tappable labels.
- Copy per level:
  - **Suave:** **Crujiente y ácido, con un picor que apenas saluda. Para toda la familia.**
  - **Tradicional:** **El balance de la casa: acidez, crujido y un picante que se nota sin tapar la comida.**
  - **Picante:** **Para quien pide más chile. El mismo frasco, con un piquete que se queda.**
- What changes: background warmth (crossfade of three pre-rendered gradients), jalapeño rings inside an SVG jar (3 / 7 / 12), chili-flake particles (6 / 14 / 28), the copy, and the product price.
- CTA: **Añadir al carrito** (adds that level's real product, first variant) · secondary **Ver en la colección** (→ `#productos`).
- Reduced motion: instant state changes, no particles.

### 04 · Ingredientes `#ingredientes` (cream, sticky split)
- Kicker: **04 · Lo que lleva**
- H2: **Lo que ves es lo que lleva.**
- Rows, each with a lit ingredient cutout drifting at its own parallax depth:
  - **Zanahoria.** **En tiras finas, para que cada bocado cruja.**
  - **Cebolla morada.** **En media luna. Aporta el color y la dulzura que equilibra el vinagre.**
  - **Jalapeño.** **En rodajas. De él depende tu nivel de picante.**
- Closing line: **Vinagre, sal y especias hacen el resto.**
- Transition band after it, slow marquee (living element): **Va con lo que ya te gusta:** Pollo con tajadas · Carne asada · Baleadas · Pastelitos · Pescado frito · Tacos

### 05 · Combos `#combos` (paper, two package cards)
- Kicker: **05 · Para compartir**
- H2: **Arma tu mesa.**
- Lede: **Combos para probar los tres niveles o tener siempre un frasco a mano.**
- Two large package cards (Combo para Probar, Combo Familiar), each with its own image. Data, prices and "Más vendido" from the API. Buttons unchanged.
- Under the cards: **Imágenes de referencia.**
- Combo para Negocio moves to section 08.

### 06 · Nuestra historia `#nosotros` (night, full-bleed editorial)
- Kicker: **06 · Nuestra historia**
- H2: **De receta de casa a frasco artesanal.**
- Body (current text, kept): **Nacimos con la idea de convertir una receta tradicional en un producto práctico, delicioso y cuidadosamente preparado. Cada frasco combina frescura, acidez y el toque justo de picante.**
- Pull line over a full-bleed film frame: **El acompañante que nunca falta en la mesa hondureña, hecho con calma.**
- The logo closes the section small, as a signature.

### 07 · Cómo lo preparamos `#proceso` (cream, three steps joined by a self-drawing brine line)
- Kicker: **07 · El proceso**
- H2: **Tres pasos. Sin atajos.**
- **1 · Cortamos.** **Zanahoria en tiras, cebolla en media luna, jalapeño en rodajas. Todo fresco.**
- **2 · Encurtimos.** **Los vegetales reposan en vinagre, sal y especias hasta tomar su punto.**
- **3 · Envasamos.** **Por lotes pequeños, frasco por frasco, para que llegue crujiente.**
- Each step image is a frame pulled from the film (0 credits).

### 08 · Para negocios `#negocios` (night, split layout, intentionally different)
- Kicker: **08 · Restaurantes y negocios**
- H2: **Que tus clientes pregunten por el encurtido.**
- Lede: **Presentaciones de 6 y 12 frascos para restaurantes, comedores y ventas de comida. Precio mayorista según volumen.**
- Variants and prices from the API (Combo para Negocio). Note: **Precio final sujeto a cotización.**
- CTA: **Cotizar por WhatsApp** (existing message builder, includes the chosen presentación).
- Visual: the plate still (pollo con tajadas with encurtido) + the crate of jars.

### 09 · Opiniones `#opiniones` (cream)
- Kicker: **09 · Opiniones**
- H2: **Lo dicen quienes ya lo probaron.**
- Real reviews only, from the database. Nothing invented.
- Empty state: **Aún no tenemos opiniones publicadas.** **Sé la primera persona en dejar la tuya.** (→ `/opinion`)
- Link: **Déjanos tu opinión** (→ `/opinion`)

### 10 · Preguntas frecuentes `#preguntas` (cream, sticky heading + accordion)
- H2: **Preguntas frecuentes**
- The current 8 questions and answers ship unchanged (they are honest about the pending shelf-life study).
- Proposed addition, **needs the owner's confirmation before shipping**:
  - **¿Es muy ácido?** **Buscamos el punto medio: se siente el vinagre, pero no tapa el sabor de la comida. Si es tu primera vez, empieza por el Tradicional.**

### 11 · Cierre `#pedido` (night, hero-ending frame reused full-bleed)
- H2: **Tu próxima comida merece un piquete.**
- Sub: **Entregas en Tegucigalpa. Pago contra entrega en zonas seleccionadas.**
- CTAs: **Comprar ahora** (→ `#productos`) · **Pedir por WhatsApp** (existing link builder)
- Trust strip: **Hecho por lotes · Entregas en Tegucigalpa · Pedidos por WhatsApp**

### 12 · Footer `#contacto` (night-2)
Current content kept. **Owner must replace the placeholders** `+504 0000-0000` and `contacto@elpiquete.com` before launch.

Adjacent layouts never repeat: feature grid → full-width interactive → sticky split + marquee → two package cards → full-bleed image → three-step line → dark split → review grid → sticky accordion → full-bleed CTA.

---

## 7. Vector and motion layer

- **Brine line (motif):** an SVG meniscus curve on the top edge of every night section. It draws itself on entry and then undulates on a slow 12 s loop, paused off-screen.
- **Heat meter:** 3 SVG jalapeño pips per product card.
- **Spice jar:** an SVG jar outline with jalapeño-ring shapes that scale in per level, plus drifting chili-flake particles.
- **Process line:** an SVG path joining the 3 steps, drawn with scroll progress.
- **Environment layer:** one fixed layer behind the page: static grain (SVG noise) at 3 to 4 % plus a warm light drift on a 60 s loop.
- **Ingredient depth layers:** the 3 cutouts at section transitions (04, 05 edge, 08), scroll-linked `translateY` at different rates. One is foreground and pre-softened (static blur, never an animated filter).
- **Motion language:** mask and clip-path reveals, words rising, ingredient drift, soft light sweeps. No bouncing, no springy overshoot outside the one "punch" beat, and no generic fade-up on every element.
- **Reduced motion:** every drawn line finished, counters at target, loops stopped, the heat selector instant. Applied live in both directions.

---

## 8. Engineering list (the skill's standard, inside React)

- `CinematicHero` component. **One** `useEffect` owns everything, and its cleanup aborts the fetch, revokes the object URL, cancels rAF, removes listeners and disconnects observers. It is safe under StrictMode double-mount.
- Poster paints first. Then a **streamed Blob fetch** with `priority: 'low'`, an honest progress ring and a 20 s no-progress watchdog that falls back to the still hero.
- **dt-normalized lerp** (`k = 0.16` per 60 fps frame) in a rAF loop that **rests** when converged and when the hero is off-screen (IntersectionObserver). This gives the same feel on 60 Hz and 120 Hz.
- **Gated seeks:** coalesce to the newest target, exactly one follow-up on `seeked`, and an `error` escape so it can never deadlock.
- **Delta-gated DOM writes:** CSS variables written straight to refs, only on change. **No React state per frame.**
- Band pacing with `--k` per band (delta-gated at 0.008), a band-1 load ramp, and the four-layer legibility system (base scrim, per-band scrim, text-shadow token, chip scrim). Worst-frame contrast must be at least 3.5:1.
- **Five gates**, character-for-character identical in CSS and JS, live `change` listeners.
- **Complete without video:** poster + captions + CTAs all work. The video `error` event hides the element.
- Media in `frontend/public/cinematic/` (outside the Vite graph and outside the PWA precache, whose globs cover only js/css/html/ico/png/svg/webp). Raw and review files live in `design/review/`, which is git-ignored and never deployed.
- Video element: `muted playsInline preload="none" aria-hidden tabIndex={-1}`, promoted to its own layer.
- GSAP is removed if nothing uses it after the redesign.
- **Functional QA:** navigation and hash links, product and combo data, cart add, qty and remove, the drawer, checkout through to confirmation against the local DB, every WhatsApp link, admin untouched, 10/10 frontend tests still passing, zero console errors, phone widths, reduced motion, video blocked, the skill's 12-point self-test.

---

## 9. Storyboard and generation plan (Phase C)

**Shared world phrase** (used in every prompt so all assets read as one place): *deep navy-blue slate and blue haze, warm tungsten key light from the upper right, glowing carrot orange, violet red onion, glossy jalapeño green, golden brine, shallow depth of field, macro food commercial, subtle film grain.*

**Real recipe only:** carrot julienne, red onion half-moons, jalapeño rings, peppercorns, golden brine. No cucumber, no beet, no hands, no knives, no generated lettering.

**Order of spending, with a gate at each step:** K1 + K2 → your OK on the look → K2L logo test → S1 → your review → S2 → your review → S3 → your review → the stills.

### Hero keyframes

**K1 · Start frame** · GPT Image 2.5 · 16:9 · 2k · high · **2.75 cr**
> Extreme macro food-commercial photograph, composed as the first frame of a slow, steady downward camera move. A single fresh whole carrot with its feathery green top is suspended vertically in the air in the center-right of the frame, tip pointing down, its skin beaded with tiny water droplets that catch the light. Warm tungsten key light rakes in from the upper right, making the carrot glow deep orange and revealing its fine ridges, with a soft rim light along its edge. The world around it is one continuous deep navy-blue atmosphere filling the frame edge to edge, dark blue slate tones dissolving into soft blue haze, with a few out-of-focus droplets and faint warm specks floating in the air. The left third of the frame is calm, soft deep-blue haze with gentle gradations of shadow. Shallow depth of field, 100mm macro lens feel, subtle film grain, cinematic grade of navy blues and warm orange. Photorealistic, 16:9. No text, no logos, no lettering anywhere.

**K2 · End frame (the page's resting composition)** · GPT Image 2.5 · 16:9 · 2k · high · **2.75 cr**
> Premium food-commercial product photograph, the final resting frame of a film. A single cylindrical glass jar filled to the shoulder with thin julienne carrot strips, red onion half-moon slices and bright green jalapeño rings in clear golden brine with a few black peppercorns, closed with an olive green metal screw lid, a loop of natural twine tied around the neck in a small bow. The jar stands on dark navy-blue slate, placed right of center with its center about 62 percent across the frame, occupying about 55 percent of the frame height, with generous space above and below it. A few fresh jalapeños, a small bundle of carrot strips and a halved red onion rest beside the jar on the slate. Warm tungsten key light from the upper right passes through the brine and makes it glow amber-gold, crisp highlights on the glass, fine condensation droplets on the glass, soft rim light. The background is one continuous deep navy-blue world, the slate receding into soft blue haze, calm and even across the left half of the frame. Shallow depth of field, 85mm lens feel, subtle film grain, cinematic navy and warm orange grade. Photorealistic, 16:9. No text, no logos, no labels, no lettering anywhere.

Checks before approval: jar fully inside a 9:16 portrait crop centered at 62 %, clear margin under a mocked nav bar at 1440×900 and 1280×600, no stray lettering, contents match the real recipe, lid olive green.

**K2L · Logo test** · GPT Image 2.5 edit · refs: K2 + uploaded `logo.jpeg` · **2.75 cr**
> Edit the first image only. Apply the brand logo from the second image as a round printed paper label on the front of the glass jar, centered on the jar body, about 60 percent of the jar's width, printed on warm off-white paper, wrapping naturally around the jar's curvature, with lighting, shading and glass reflections consistent with the scene. Reproduce the logo exactly as in the reference, artwork and lettering unchanged. Change nothing else in the image.

Accept only if every letter matches the real logo ("ENCURTIDOS", "El Piquete", "EL SABOR HASTA TU MESA", the "KG" monogram) and the label sits believably on the glass. Otherwise K2 stays the end frame and the jar ships unbranded.

### Hero video segments (Kling 3.0 Pro · 1080p · 6 s · sound off · 10.5 cr each)

**S1 · Beats 01 to 02** · start image: K1 · end: free
> One continuous shot, no cuts. The camera descends slowly and steadily straight down past a fresh whole carrot suspended in the air, traveling from its feathery green top along its glowing orange body until its tip rises out of the top of the frame. Below the carrot the camera enters a gentle slow-motion rain of thin julienne carrot strips falling downward, each strip catching warm light, a few passing close to the lens with soft motion blur. The carrot stays alive: tiny droplets tremble and slide down its skin, the green top sways slightly. The scene stays alive: floating droplets and warm specks drift, soft haze shifts through the deep navy-blue atmosphere. Warm tungsten key light from the upper right throughout, deep navy shadows, shallow depth of field, macro food commercial. The left third of the frame stays calm dark blue haze. The shot ends mid-motion, the camera still descending through the falling julienne strips, one close strip sweeping across the foreground. No text or lettering anywhere.

**S2 · Beats 03 to 04** · start image: S1 final frame (full-quality PNG) · end: free
> One continuous shot, no cuts, continuing the same slow downward camera move at the same speed. The camera keeps descending through falling julienne carrot strips while glossy red onion half-moon slices in violet and white and bright green jalapeño rings with pale seeds join them from above, all tumbling gently downward together in slow motion, lit by warm tungsten light from the upper right against a deep navy-blue atmosphere. Below them a surface of clear golden brine rises toward the camera. The ingredients drop into it with small splashes and the camera plunges through the surface: a splash across the lens, droplets on the lens, a brief beat of blur, then a clear underwater view full of tiny rising bubbles, black peppercorns and vegetables sinking slowly, warm light rays shafting down through the golden brine. The ingredients stay alive, turning slowly as they fall and sink. The left third of the frame stays calmer and darker. The shot ends mid-motion underwater, a dense column of small bubbles rising past the lens. No text or lettering anywhere.

**S3 · Beats 05 to 06** · start image: S2 final frame · end image: K2L (or K2)
> One continuous shot, no cuts. Underwater in clear golden brine, the camera finishes its descent as julienne carrot strips, red onion slices and jalapeño rings sink slowly and settle, packing together, and the curved glass wall of a jar becomes visible around them with light refracting through it. The camera then eases gently backward and slightly up, passing out through the glass wall: refraction bends the image, condensation droplets on the outside of the glass slide past the lens, and the whole jar is revealed. The shot ends at rest on the composed final frame: the glass jar full of vegetables in glowing golden brine, olive green metal lid tied with natural twine, standing on dark navy-blue slate right of center with fresh jalapeños and carrot strips beside it, warm tungsten light from the upper right, calm deep navy space on the left. Motion slows to complete stillness, only a few small bubbles drifting up inside the jar. No new text or lettering anywhere; the jar's existing label, if present, stays exactly as in the final frame.

Seams: S1→S2 lands inside a strip sweeping across the lens; S2→S3 lands inside the rising bubble column. If a seam still shows, the rescue is a 0.25 s crossfade join (single encode). If an ending drifts, the fix is a tail trim, not a re-roll.

### Supporting stills (only after S3 passes its review)

All use the shared world phrase and K2/K2L as an image reference so the jar is the same object everywhere.

| Id | Use | Format | Content | Credits |
|---|---|---|---|---|
| P1 | Card: Encurtido Suave | 4:5 · 2k · high | Same jar, mostly carrot and onion, only a few jalapeño rings | 2.75 |
| P2 | Card: Encurtido Tradicional | 4:5 · 2k · high | Same jar, balanced mix | 2.75 |
| P3 | Card: Encurtido Picante | 4:5 · 2k · high | Same jar, many jalapeño rings plus thin red chile slices, brine a shade deeper | 2.75 |
| C1 | Combo para Probar | 4:3 · 2k · high | Three identical jars in a row, heat rising left to right | 2.75 |
| C2 | Combo Familiar | 4:3 · 2k · high | Three larger jars grouped on slate with a folded linen cloth | 2.75 |
| C3 | Para negocios | 16:9 · 2k · high | Wooden crate holding twelve jars on a stainless restaurant pass | 2.75 |
| F1 | Para negocios / "Va con lo que ya te gusta" | 16:9 · 2k · high | Pollo con tajadas with a generous spoonful of encurtido on top, dark plate on slate | 2.75 |
| I1 | Depth layer | 1:1 · 2k · medium · transparent | Whole carrot with greens, same light | 1 |
| I2 | Depth layer | 1:1 · 2k · medium · transparent | Halved red onion with a few half-moon slices | 1 |
| I3 | Depth layer | 1:1 · 2k · medium · transparent | Two jalapeños with a few rings | 1 |

If K2L passes, P1 to P3 and C1 to C3 inherit the real logo label from the reference. If it fails, all jars stay unbranded.

### Free assets (ffmpeg, 0 credits)
`hero-scrub.mp4`, `hero-poster.jpg`, `hero-ending.jpg`, three mobile strip frames, three "Cómo lo preparamos" frames, one Historia frame, a new `og-image.jpg`.

### Budget (real prices from free preflights, 30 Sep 2026)

| Block | Generations | Credits |
|---|---|---|
| Keyframes K1, K2, K2L | 3 images | 8.25 |
| Segments S1, S2, S3 | 3 videos | 31.50 |
| Stills P1–P3, C1–C3, F1 | 7 images | 19.25 |
| Cutouts I1–I3 | 3 images | 3.00 |
| **Total** | **16 generations** | **62.00** |
| Balance today | | 81.75 |
| **Reserve** | | **19.75** (one segment re-roll + a few still re-rolls) |

Rule: if one segment fails three attempts, the shot design changes. No more re-rolls on the same prompt.

---

## 10. Copy gate

Every viewer-facing line above ships verbatim. Before anyone sees the build: zero em dashes and none of the English stock words from the skill, plus no Spanish corporate filler ("soluciones", "potenciar", "experiencia única", "calidad premium", "al siguiente nivel"). Deliberate devices stay: "Color. Textura. Picante." and "Tres pasos. Sin atajos." No claims the business hasn't validated ("100 % natural", "sin conservantes", shelf life).
