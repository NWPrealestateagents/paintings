# 聂泽昭 – Chinese watercolor painting

All files live in one folder, with no sub-folders. To update the site, upload
the changed files to GitHub (Add file, Upload files). Same-named files get
replaced.

## Pages
Home, Shop, Gallery, Events, About, plus the iPad slideshow at `slideshow.html`.

## The three files you'll edit
- `site-config.js`: turn the shop's Buy buttons on (`shopOpen: true`), the
  delivery note, a contact email, and the charity pledge.
- `shop-data.js`: one line per painting. Price, Square payment link,
  available or sold, and the date it went up. Instructions are at the top.
- `events-data.js`: event dates. Instructions are at the top.

## Weekly restock
1. Upload the new photos (any file name, like `w3-01.jpg`).
2. In `shop-data.js`, paste a new line at the top for each painting with
   `image: "w3-01.jpg"`, the title, the price, its Square link, and today's date
   as `added`.
3. When something sells, change its status to `"sold"` and turn off its link
   in Square.

## Custom domain (Cloudflare)
1. Buy the domain in Cloudflare (Domain Registration).
2. In Cloudflare DNS add four A records for the bare domain pointing to
   185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153, and a
   CNAME record `www` pointing to `nwprealestateagents.github.io`. Set them to
   "DNS only" (grey cloud) at first.
3. In GitHub: Settings, Pages, Custom domain. Type the domain and save. When the
   check passes, tick "Enforce HTTPS".
