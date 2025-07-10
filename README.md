# Agentic AI Garden

A modern, responsive website for exploring and learning about Agentic AI on AWS. This is a simplified version of the original website, built with Vue 3 and VueUse.

## Features

- 🌙 Dark/Light mode toggle using VueUse
- 📱 Fully responsive design for all screen sizes
- 🔍 Resource filtering and search
- 📊 Grid-based resource card layout
- 🧭 Simple navigation and routing

## Tech Stack

- Vue 3 (Composition API)
- Vue Router for navigation
- VueUse for composable utilities
- Custom UI components
- CSS variables for theming

## Project Structure

```
/
├── public/               # Static assets
│   └── images/           # Image assets
│     └── favicon.svg
├── src/
│   ├── assets/           # CSS and other assets
│   │   └── styles/       # Global styles
│   ├── components/       # Vue components
│   │   ├── icons/        # SVG icon components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # Reusable UI components
│   ├── composables/      # Composable functions
│   ├── data/             # Content and configuration
│   │   └── content/      # Blog posts and other content
│   ├── pages/            # Page components
│   ├── tests/            # Unit tests
│   ├── utils/            # Utility functions
│   ├── App.vue           # Main app component
│   ├── main.js           # App entry point
│   └── routes.js         # Route definitions
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
└── vitest.config.js      # Vitest test configuration
```

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build
```

### Preview

```bash
# Preview production build
npm run preview
```

## Key Features Implemented

1. **Resource Cards**: Interactive cards to browse different resource categories
2. **Learn Page**: Filterable list of blogs, videos, and workshops
3. **Responsive Header**: Adapts to different screen sizes with mobile menu
4. **Dark Mode**: Toggle between light and dark themes

## Customization

The application uses CSS variables for easy theming. You can modify the colors and spacing in `src/assets/styles/main.css`.
