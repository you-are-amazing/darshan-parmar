# Darshan A. Parmar — Portfolio Assistant

A single-page chat-style portfolio site. Click a suggested prompt and the
"assistant" replies with that section of the portfolio (About, Skills,
Experience, Projects, Research, Contact).

## Structure

```
portfolio-assistant/
├── index.html        # page shell + markup only
├── css/
│   └── style.css      # all styling (extracted from the original inline <style>)
├── js/
│   ├── data.js         # content: RESPONSES (per-section HTML) and PROMPT_LABELS
│   └── app.js           # app logic: name modal, chat rendering, chip wiring
└── README.md
```

Previously everything (HTML + CSS + JS) lived in one file. It's now split
so that:
- editing content → only touch `js/data.js`
- editing look & feel → only touch `css/style.css`
- editing behavior → only touch `js/app.js`

## Running it

No build step — just open `index.html` in a browser, or serve the folder
with any static file server, e.g.:

```bash
npx serve .
```

## Notes / next steps

- All portfolio content is sourced from the current resume (Software QA at
  Exotic Infotech, AI/ML internships, research). Edit it in `js/data.js`.
- The Blog and Activity sections were removed (no matching resume content).
  The viewer panel for blog posts / repo previews is still in `app.js`;
  populate `blogPosts` / `repoPreviews` in `js/data.js` to bring them back.
- GitHub / X links were dropped because the resume only lists email and
  LinkedIn. Add a GitHub link in `index.html` (social menu) and `js/data.js`
  (About + Contact) once you have one.
- The visitor's name is stored in `localStorage` under
  `portfolio_visitor_name` so the modal only asks once per browser.
