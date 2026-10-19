# Original local artwork

All raster artwork in this folder was generated for Reject All with the built-in image-generation tool. Final delivery assets are local WebP files; there are no runtime image-generation calls or hotlinked photographs. The detailed prompt set is saved in `.diff_logs/site-art-prompts.md`.

| File | Purpose |
|---|---|
| `catalogue.webp` | Original six-product studio-photography sheet |
| `catalogue-2.webp` | Six additional photographed products |
| `products/0.webp`–`products/11.webp` | Square product slices for undistorted catalogue and basket imagery |
| `meal.webp` | Meal-kit hero and one food-feed post |
| `meal-tomato.webp` | Original tomato/basil rigatoni photograph for meal-kit and recipe variants |
| `meal-chickpea.webp` | Original chickpea/sweet-potato bowl photograph for meal-kit and recipe variants |
| `astral.webp` | Celestial RPG event background |
| `astral-item.webp` | Original complete astrolabe image, retained as the cutout's edit source |
| `travel.webp` | Coastal resort property photo |
| `stream.webp` | Original cinematic night-city artwork |
| `fitness.webp` | Original gym interior photograph |
| `tickets.webp` | Original concert stage for ticket checkout |
| `arcade.webp` | Capsule machine shop background |
| `arcade-item.webp` | Original complete capsule image, retained as the cutout's edit source |
| `astral-item-cutout.webp` | Transparent-background astrolabe used by the current banner and reward card |
| `arcade-item-cutout.webp` | Transparent-background capsule pair used by the current reward card |
| `post-desk.webp` | Creative desk feed post |
| `post-coast.webp` | Coastal boardwalk feed post |
| `post-coffee.webp` | Cafe feed post |
| `clickbait-singles.webp` | Original adult profile-photo pair for the simulated “Hot singles near you” ad |

The generated source PNGs remain in the Codex generated-images directory; no source originals were deleted. Sharp was used only for delivery-format encoding, feed-image downscaling and slicing catalogue cells. It is not a runtime dependency. Icons under `icons/` are project-authored SVG primitives. System fonts are used without bundling third-party font files. The simulated site brands are fictional. A clickbait quiz names Hogwarts at the user's request, using original letter-crests; no real company logos or proprietary game characters were copied into these assets.

Product selection, feed images, author names, captions and story thumbnails vary deterministically with the round seed. The gallery's “Another variation” button cycles the visual pool predictably so consecutive clicks show different products/posts. Reward cards use their own item images with `object-fit: contain`, not zoomed crops of the larger scene.

FreshBox cycles three matching meal photos, names, ingredient descriptions and preparation times. RecipeTable uses those three dinners plus its existing croissant/coffee page. The two new 960px food photographs were generated as separate original images; exact prompts are in `.diff_logs/food-art-prompts.md`. Delivery WebP copies were resized/encoded only, and source PNGs remain intact.

The two `*-cutout.webp` files are built-in image-generation background-extraction edits of the corresponding original item art. They retain actual alpha transparency and were encoded/downscaled with Sharp without background flattening. Originals remain intact as references; the exact prompts and alpha measurements are in `.diff_logs/`. No external image service or API key was used.

`icons/app.svg` extends the game's existing white-cross-on-blue mark for browser and home-screen use. Its local 180, 192 and 512px PNG copies were rendered with Sharp. These are project-authored vector primitives, with no third-party fonts or artwork. The central mark stays within the maskable-icon safe area.

`clickbait-singles.webp` is an original generated photograph of two fictional adult women, delivered at 640×320. Its complete source is retained in the generated-images folder. Only resizing and WebP encoding were performed. The popup uses the complete image without cropping faces. Exact prompt/source details are in `.diff_logs/clickbait-art-prompts.md`. Quiz crests, wheels, virus symbols, puzzle tiles, cash and download icons are CSS/DOM artwork in the popup component; article teasers reuse `post-coffee.webp`.
