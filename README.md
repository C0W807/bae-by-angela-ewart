# BAE by Angela Ewart — website

A static site (plain HTML, CSS and a little JS, no build step) for BAE BODY, Angela's
mobile massage service in Dunfermline. Built from the Brand Bible (Oct 2026) and the
moodboard.

```
index.html        Home
treatments.html   The three treatments, home visits, aftercare, FAQ
about.html        Angela's story (her own words from the Brand Bible)
family.html       The BAE family: BODY now; MOVEMENT, RITUALS, RETREATS, EVERYDAY later
privacy.html      Draft privacy notice
contact.html      Contact details and enquiry form
css/style.css     Everything visual; palette tokens at the top
js/site.js        Menu, scroll reveals, enquiry form
assets/img/       Logo and photos (all provisional, see below)
```

Preview by opening `index.html` in a browser. After changing `css/style.css` or
`js/site.js`, bump the `?v=` number on their links in every page so returning
visitors (and iPhone Safari) pick up the new file.

## Still to confirm with Angela

Everything marked with a dashed gold box on the site (`class="tbc"`):

- Prices and durations for each treatment
- Travel radius and any travel supplement
- Deposit, payment methods and cancellation policy
- Email, phone / WhatsApp and Instagram handle (contact page and footer links)
- Qualifications and insurance (treatments page, home visits)
- Offer amounts and terms: The BAE Welcome, The BAE Ritual, Bring Your BAE, gift
  vouchers (treatments page, `#offers`)
- Set-up time, and that the hygiene answer in the FAQ matches what she actually does
- Privacy notice (`privacy.html`): her email, ICO registration, how long records are
  kept, and which form service handles enquiries
- At launch: "Bookings opening soon" on the home page becomes "Now booking", and the
  `noindex` line comes out of every page

Also:

- **Logo.** `assets/img/logo.png` is cropped from the moodboard (cream background keyed out). The Brand
  Bible asks for one approved master logo file; swap it in (an SVG or a transparent PNG
  at 600px+) once it exists.
- **Photos.** Every photo is cut from the moodboard (1536 x 1024), so they are low
  resolution and look soft on big or retina screens. If whoever made the moodboard has
  the original full-size images, drop them into `assets/img/` with the same file names
  and the whole site sharpens with no other changes. Longer term, real photos of
  Angela's own setup. Left out on purpose: the tray panel ("calmer, lighter, stronger
  you"), the "calmer / lighter / stronger" quote and "Your Sunday reset" (a future
  retreat idea, not a launch service).
- **Frosted captions.** The lymphatic and wood therapy reel covers say "Detoxify ·
  Depuff · Feel lighter" and "Sculpt · Tone", and the back shot says "Real results".
  The Brand Bible rules those claims out, so a frosted caption (`.plate`) covers the
  printed words with our own. If the originals turn up, use versions without the text.
- **Aftercare and suitability wording.** Written to the Bible's rules (no fat loss,
  detox or medical claims), but it needs checking against Angela's actual training and
  insurance scope.
- **Enquiry form.** Wired for Netlify Forms. Hosted anywhere else, point the form at
  Formspree or similar, or replace it with a mailto link.

## Hosting

Any static host works. Simplest: drag the folder onto Netlify (free), which also makes
the enquiry form work with no extra setup, then connect the domain.
