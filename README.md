# Cactro Instagram Stories

A simplified Instagram Stories clone built with React and TypeScript. View a series of stories with tap navigation and auto-advance — built for mobile.

🔗 **Live Demo:** [cactro-stories.pages.dev](https://cactro-stories.pages.dev)

## Features

- **Story List** — Horizontally scrollable list of story thumbnails with gradient borders
- **Full-Screen Viewer** — Tap any story to open it in a full-screen mobile viewer
- **Tap Navigation** — Tap left side to go to previous story, right side to go to next
- **Auto-Advance** — Stories automatically advance after 5 seconds with a progress bar
- **Image Loading States** — Spinner shown while each story image loads
- **External Data** — Stories are fetched from an external JSON file

## Tech Stack

- **React 19** — UI framework
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Vite** — Build tool
- **Cloudflare Pages** — Deployment

## Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd cactro-instagram-stories

# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   └── StoryViewer.tsx   # Main story viewer component
├── App.tsx               # Root component
├── main.tsx              # Entry point
├── index.css             # Global styles + Tailwind
public/
└── stories.json          # External story data
```

## Deployment

Deployed on **Cloudflare Pages**. Every push to `main` triggers an automatic deployment.
