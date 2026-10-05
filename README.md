# GaugeForge QIQC Challenge demo

Static demo of the QIQC workshop and challenge website.

## Preview locally

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173/.

## GitHub Pages

Publish the root of the `main` branch through GitHub Pages. No build or package installation is required. All site asset URLs are relative and support the repository subpath.

## Included interactions

- Centered opening screen with labels, title and slogan; natural scrolling reveals the full competition page.

- Full-width pointer grid and ambient grid pulses, with reduced-motion support.
- Responsive layout, section navigation and subtle registration-button animation.
- Registration information dialog; the event registration URL is still pending.
- Four-stage interactive competition walkthrough.
- Scrollable public-lab commands with a copy button and manual-copy fallback.
- Expandable setup notes and nine Q&A entries.
- Public participant and partner PDF documents.

Copying commands uses the Clipboard API on HTTPS or localhost. The demo does not run those commands or submit registration data.

Body text uses Helvetica with system fallbacks. Headings and the slogan use locally installed Optima when available, with fallback fonts on other devices. No proprietary font files are redistributed.
