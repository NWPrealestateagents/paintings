# 聂泽昭 – Chinese watercolor painting

A simple three-page website: Home, Gallery and Events. No build step, no
dependencies. It is plain HTML, CSS and JavaScript, so GitHub Pages can host it
as is.

## Put it online with GitHub Pages

1. On github.com, click **New repository**. Name it anything (for example
   `nie-paintings`), keep it **Public**, and click **Create repository**.
2. Click **uploading an existing file**. Drag in everything from this folder:
   `index.html`, `gallery.html`, `events.html`, `favicon.svg`, `.nojekyll`, and
   the `css`, `js`, `images` and `video` folders. Click **Commit changes**.
   (If the folders won't drag in, upload them one at a time, or use the git
   commands below.)
3. Open the repository's **Settings**, then **Pages**. Under **Build and
   deployment**, set **Source** to **Deploy from a branch**, pick the `main`
   branch and the `/ (root)` folder, and click **Save**.
4. Wait a minute or two. GitHub shows the address at the top of the Pages
   screen. It looks like `https://YOUR-USERNAME.github.io/nie-paintings/`.

### Or with git

```
git init
git add .
git commit -m "First version"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/nie-paintings.git
git push -u origin main
```

## iPad slideshow for the table

The site includes a full-screen slideshow of all the paintings at
`slideshow.html`. Once the site is live, the address looks like
`https://YOUR-USERNAME.github.io/nie-paintings/slideshow.html`.

1. Open that address in Safari on the iPad, **on Wi-Fi at home**, and tap the
   screen once. Leave it on for about a minute so every painting is saved on
   the iPad. After that it keeps working with no internet.
2. Tap the Share button, then **Add to Home Screen**. Open the slideshow from
   the new icon: it runs full screen with no Safari bars.
3. Keep the screen from dimming: in **Settings, Display & Brightness, Auto-Lock**
   choose **Never**, turn off **Low Power Mode**, and keep the iPad plugged in.
   If you use Guided Access, also set **Settings, Accessibility, Guided Access,
   Display Auto-Lock** to **Never**.

It plays by itself. Tap the arrows or swipe to go forward or back, and tap a
painting to pause it for 30 seconds.

## Add event dates

Open `js/events-data.js` (on GitHub, click the file, then the pencil icon).
The instructions and an example are at the top of that file. Add one block per
event and click **Commit changes**. The Events page updates within a minute.
Dates that have passed move to "Past events" on their own.

## Add or remove paintings

Each painting has two files with the same name: a large one in `images/full`
and a smaller one in `images/thumb` (about 640 pixels wide). To add one, put
both in those folders, then copy an existing `<figure class="art">` block in
`gallery.html` (and in `index.html` if you want it on the home page) and change
the file names, the `width` and `height` of the thumbnail, and the `alt` text.

## Change the video

Replace `video/painting.mp4` (MP4 video, ideally under 20 MB) and
`video/poster.jpg` (the still picture shown before it plays).

## Print a QR code for the table

Once the site is live, any free QR code maker can turn the address into a QR
code to print and put on the table.
