# Shyam Poduval — Portfolio

Personal portfolio website built with React, Vite, and React Three Fiber. Neo-brutalist design with 3D interactive elements.

**Live:** https://wurmple.github.io/portfolio/

---

## Tech Stack

- **Framework:** React 18 + Vite 5
- **3D:** Three.js, @react-three/fiber, @react-three/drei, @react-spring/three
- **Styling:** Tailwind CSS, K2D + JetBrains Mono fonts
- **Deployment:** GitHub Pages via gh-pages

## Sections

| Section | Description |
|---------|-------------|
| Hero | Full-viewport intro with 3D MacBook model |
| Experience | Interactive 3D timeline cubes — click to expand details |
| Projects | Floating 3D cards — click to expand details |
| Skills | Language, technology, and concept breakdown |
| Education | Academic background |
| Contact | Links and resume download |

## Development

```bash
npm install
npm run dev       # start dev server at localhost:5173
npm run build     # production build
npm run preview   # preview production build locally
npm run deploy    # build + push to GitHub Pages
```

## Adding Content

All data lives in `src/data/` — no need to touch component files.

```
src/data/
  personal.js      — name, bio, contact info, social links
  experiences.js   — work experience entries (add new jobs here)
  projects.js      — project entries (add new projects here)
  skills.js        — skill categories and items
  education.js     — education entries
```

### Add a new experience

Open `src/data/experiences.js` and add an object to the array:

```js
{
  company: 'Company Name',
  role: 'Your Role',
  period: 'Mon YYYY – Mon YYYY',
  location: 'City, State',
  color: '#hexcolor',
  imageUrl: 'company-logo.svg',   // place in public/
  highlights: [
    'Bullet point one',
    'Bullet point two',
  ]
}
```

### Add a new project

Open `src/data/projects.js` and add an object:

```js
{
  title: 'Project Name',
  period: 'Mon YYYY – Mon YYYY',
  imageUrl: projectIcon,           // import SVG from src/assets/
  highlights: [
    'What you built and with what',
    'Impact or interesting technical detail',
  ]
}
```

## Resume

The LaTeX source is at `.sdd/main.tex` (excluded from git). To update:

1. Edit `.sdd/main.tex`
2. Compile in [Overleaf](https://overleaf.com) or locally with `pdflatex`
3. Place the output PDF at `public/Shyam-Resume.pdf`
4. Redeploy with `npm run deploy`

## Assets

- `public/laptop.glb` — 3D MacBook model used in the Hero
- `public/fonts/Impact.ttf` — font for 3D text in scene components
- `public/shyam.jpg` — profile photo
- `public/*.svg` — company logos and UI icons
- `src/assets/*.svg` — project icons (imported as modules)

## Deployment Notes

The Vite base path is `/portfolio/` to match the GitHub Pages URL. If you fork and deploy to a different repo/path, update `base` in `vite.config.js`.
