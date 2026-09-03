# Wanderlust — Design Esthetics Travel Application

> A competition-grade travel exploration & itinerary planning web application designed and built for the **Design Esthetics** Front-End Developer assessment.

[![Built with React](https://img.shields.io/badge/Built%20with-React%2019-61DAFB?logo=react&logoColor=white)](#tech-stack)
[![Vite](https://img.shields.io/badge/Bundler-Vite%208-646CFF?logo=vite&logoColor=white)](#tech-stack)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?logo=tailwind-css&logoColor=white)](#tech-stack)
[![Framer Motion](https://img.shields.io/badge/Animations-Framer%20Motion-0055FF?logo=framer&logoColor=white)](#motion--interaction)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%203.6%20Flash-8E75B2?logo=google&logoColor=white)](#7-ai-chatbot--itinerary-planner)
[![OpenWeather](https://img.shields.io/badge/Weather-OpenWeatherMap-EB6E4B?logo=openweathermap&logoColor=white)](#5-real-time-weather)

---

## 🌟 Live Demo & Deployment

- **Live Application Link**: [https://wanderlust-designesthetics.vercel.app](https://wanderlust-designesthetics.vercel.app) *(Replace with your live deployed URL)*
- **GitHub Repository**: [Public GitHub Repository Link](#)

---

## 📖 Overview

**Wanderlust** is an editorial-grade travel web application engineered for wanderers, backcountry explorers, and cultural enthusiasts. Conceived as a design-led product, it pairs brutalist editorial typography with organic fluid curves, glassmorphism telemetry widgets, cinematic 4K video storytelling, and real-time intelligence:

- **Cinematic Landing Experience**: Immersive looping hero video with dynamic parallax depth and curated expedition showcases.
- **Global Destination Explorer**: High-performance multi-criteria search, continent filtering, tag pills, and live distance telemetry calculated relative to the user's origin.
- **Deep-Dive Destination Pages**: Curated guides with interactive photo lightboxes, landmark intelligence, best visiting hours, and photography tips.
- **Location Awareness & Geolocation**: Dual-mode origin detection (automatic browser GPS + instant search across global gateway cities).
- **Live Meteorological Telemetry**: Real-time atmospheric conditions, feels-like temperatures, humidity, wind vectors, and 3-day forecasts powered by OpenWeatherMap and Open-Meteo.
- **Conversational AI Travel Guide**: Interactive multi-turn travel concierge powered by Google Gemini, tailored specifically to each destination.
- **Structured Day-by-Day Itinerary Planner**: Interactive schedule generator creating readable, day-by-day plans with adjustable pacing, travel styles, and one-click Markdown/Print export.

---

## 📸 Screenshots

| 1. Hero Experience & Looping Video | 2. Destination Explorer & Distance Telemetry |
|:---:|:---:|
| ![Hero Landing](https://raw.githubusercontent.com/placeholder/wanderlust-hero.png) | ![Explore Page](https://raw.githubusercontent.com/placeholder/wanderlust-explore.png) |
| *Immersive 4K video hero with organic wavy divider* | *Real-time search, continent filters, and distance calculation* |

| 3. Destination Detail & Famous Places | 4. AI Itinerary Planner & Day-by-Day Schedule |
|:---:|:---:|
| ![Destination Detail](https://raw.githubusercontent.com/placeholder/wanderlust-destination.png) | ![Itinerary Planner](https://raw.githubusercontent.com/placeholder/wanderlust-itinerary.png) |
| *Live weather telemetry, landmark cards & photo lightbox* | *Structured multi-day itinerary with pacing & export options* |

| 5. Scoped AI Travel Assistant | 6. Full-Screen Photo Lightbox |
|:---:|:---:|
| ![AI Chat Assistant](https://raw.githubusercontent.com/placeholder/wanderlust-chat.png) | ![Photo Lightbox](https://raw.githubusercontent.com/placeholder/wanderlust-gallery.png) |
| *Context-aware Gemini chatbot with markdown formatting* | *Keyboard-navigable high-res photography gallery* |

---

## 🎯 Assessment Requirements Checklist

Every requirement specified in the official **Design Esthetics Front-End Developer Assignment brief** has been meticulously fulfilled:

| # | Requirement | Implementation Details | Code References |
|---|---|---|---|
| **01** | **A Landing Experience** | High-definition looping video background with scroll parallax, cinematic typography (Fraunces & DM Sans), organic SVG wavy dividers, and interactive curated expedition showcases. | [`LandingPage.jsx`](./src/pages/LandingPage.jsx), [`public/hero-video.mp4`](./public/hero-video.mp4) |
| **02** | **Destination Explorer** | Full-text instant search, continent filter pills, thematic tags, and 4-tier sorting (Featured, A–Z, Z–A, and Nearest to You). Responsive 1→2→3→4 column card layout. | [`ExplorePage.jsx`](./src/pages/ExplorePage.jsx), [`DestinationCard.jsx`](./src/components/DestinationCard.jsx) |
| **03** | **Famous Places** | Rich landmark cards featuring imagery, optimal visiting time, expert photography guides, expandable detail modals, interactive bookmarking, and full-screen lightbox navigation. | [`PlaceCard.jsx`](./src/components/PlaceCard.jsx), [`PhotoLightbox.jsx`](./src/components/PhotoLightbox.jsx) |
| **04** | **Location Awareness** | Seamless geolocation via `navigator.geolocation` with reverse-geocoding, distance telemetry (km & flight hours), and instant search fallback across global gateway cities. | [`LocationContext.jsx`](./src/context/LocationContext.jsx), [`LocationBar.jsx`](./src/components/layout/LocationBar.jsx) |
| **05** | **Real-Time Weather** | Live weather feed using OpenWeatherMap API with automatic failover to Open-Meteo. Displays current conditions, wind speed, humidity, feels-like temp, and 3-day forecast. | [`WeatherWidget.jsx`](./src/components/WeatherWidget.jsx), [`weather.js`](./src/services/weather.js) |
| **06** | **Dynamic Images** | Live Unsplash API image search for destinations and landmarks, with in-memory caching and zero-latency curated fallback library so broken images never appear. | [`images.js`](./src/services/images.js), [`useImages.js`](./src/hooks/useImages.js) |
| **07** | **An AI Chatbot** | Conversational travel assistant powered by Google Gemini, strictly scoped to the destination. Supports multi-turn chat, markdown rendering, quick suggestion chips, and error recovery. | [`ChatWidget.jsx`](./src/components/ChatWidget.jsx), [`gemini.js`](./src/services/gemini.js) |
| **08** | **Itinerary Planning** | AI-driven structured itinerary planner outputting day-by-day interactive schedules (themes, time periods, activities, insider tips, completion checkboxes, and Markdown/Print export). | [`ItineraryPanel.jsx`](./src/components/ItineraryPanel.jsx), [`PlanningPage.jsx`](./src/pages/PlanningPage.jsx) |

---

## 🎨 Design Philosophy & Aesthetics

Design Esthetics is a **design-led company**, and Wanderlust was crafted under strict design principles:

### 1. Typography Hierarchy
- **Display Headings**: *Fraunces Variable* — an optical-size serif that gives editorial authority and warmth.
- **Body & Telemetry**: *DM Sans Variable* — a clean, geometric sans-serif ensuring effortless legibility across dense data.
- Self-hosted through `@fontsource-variable` for zero layout shifts and no external CDN dependencies.

### 2. Considered Color Palette & Restraint
- **Backgrounds**: Deep Obsidian `#050505` and Midnight Plum `#0f0c29` creating dramatic contrast.
- **Accents**: Warm Sand/Gold `#C9A96E` (primary branding) and Coral Ember `#FF6B6B` (interactive cues).
- **Gradients & Glows**: Subtle ambient radial glows that illuminate content without overwhelming readability.
- **Glassmorphism**: Translucent panels (`backdrop-blur-md`, `bg-white/[0.04]`, `border-white/10`) creating spatial hierarchy.

### 3. Motion with Intent
- **Parallax Hero**: Subtle scroll-driven translation on the background video and headline.
- **Staggered Scroll-Reveal**: Cards and sections arrive gracefully with tailored spring easings (`[0.16, 1, 0.3, 1]`).
- **Tactile Feedback**: Hover lifts (`y: -4px`), interactive buttons, and smooth accordion transitions.
- **Reduced Motion Support**: Full compliance with `prefers-reduced-motion: reduce` for accessibility.

### 4. Resilient Error & Empty State Architecture
- Every failure mode has a designed state:
  - **Location Permission Denied**: Friendly banner with one-click manual city search.
  - **Weather API Failure / Rate Limit**: Instant fallback to Open-Meteo meteorological feed.
  - **AI Model Latency / Outage**: Graceful fallback to verified destination expert guides.
  - **Image Missing / Network Offline**: Curated high-resolution fallback library and branded SVGs.
  - **Zero Search Results**: Thoughtful empty state with one-click "Reset Filters" action.

---

## 🛠️ Tech Stack

| Domain | Tools & Libraries | Rationale |
|---|---|---|
| **Core Framework** | React 19, Vite 8 | Ultra-fast HMR, lightweight bundle size, modern React features |
| **Styling** | Tailwind CSS v4 | Next-gen CSS engine, custom theme tokens, modern utilities |
| **Motion** | Framer Motion 13 | Physics-based animations, layout transitions, scroll progress |
| **Routing** | React Router v7 | Client-side routing with route-level exit/entry animations |
| **AI Integration** | Google GenAI SDK (`@google/genai`) | High-speed structured itinerary generation & conversational assistance |
| **APIs** | OpenWeatherMap, Open-Meteo, Unsplash | Real-time weather data & high-res travel photography |
| **Icons** | Lucide React | Consistent, scalable vector iconography |
| **Linter** | Oxlint | High-speed rust-based static code analysis |

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/wanderlust-travel.git
cd wanderlust-travel
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the sample environment file:
```bash
cp .env.example .env
```

Open `.env` and add your API keys:
```env
# Google Gemini API — https://aistudio.google.com
VITE_GEMINI_KEY=your_gemini_api_key_here

# OpenWeatherMap API — https://openweathermap.org/api
VITE_OPENWEATHER_KEY=your_openweather_api_key_here

# Unsplash API — https://unsplash.com/developers
VITE_UNSPLASH_KEY=your_unsplash_access_key_here
```

> **Security Note**: `.env` is listed in `.gitignore` from the initial commit. API keys are never tracked in Git.
> *Note: If any API keys are omitted, Wanderlust seamlessly falls back to integrated Open-Meteo live feeds and curated offline intelligence so the entire app remains 100% interactive.*

### 4. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 5. Build for Production
```bash
npm run build
npm run preview
```

---

## 📂 Project Architecture

```
wanderlust-travel/
├── public/
│   ├── destinations/        # Curated high-res destination photography
│   ├── hero-video.mp4       # 4K looping travel hero video
│   └── favicon.svg          # Brand favicon
├── src/
│   ├── assets/              # Static vector illustrations and images
│   ├── components/
│   │   ├── common/          # Reusable design elements (WavyEdgeDivider, SquircleBadge, etc.)
│   │   ├── layout/          # Navbar, Footer, LocationBar, PageWrapper
│   │   ├── ui/              # Button, Input, Select, Badge, Skeleton, ErrorCard, EmptyState
│   │   ├── ChatWidget.jsx   # Gemini-powered destination AI chatbot
│   │   ├── DestinationCard.jsx # Explore grid destination card
│   │   ├── DestinationDock.jsx # Quick navigation floating dock
│   │   ├── DestinationTelemetry.jsx # Altitude, coordinates & distance badge
│   │   ├── ItineraryPanel.jsx # Day-by-day itinerary planner with export
│   │   ├── PhotoLightbox.jsx# Full-screen photography gallery
│   │   ├── PlaceCard.jsx    # Notable landmarks with tips & bookmarks
│   │   └── WeatherWidget.jsx# Live meteorological telemetry
│   ├── context/
│   │   ├── LocationContext.jsx # Geolocation & distance state management
│   │   └── ToastContext.jsx    # Accessible notification toasts
│   ├── data/
│   │   └── destinations.json   # Comprehensive database of 20 world destinations
│   ├── hooks/
│   │   ├── useDestinations.js  # Search, filter, and sort hook
│   │   ├── useGemini.js        # AI chat & itinerary hooks
│   │   ├── useGeolocation.js   # Browser GPS & permission listener
│   │   ├── useImages.js        # Unsplash API fetcher & fallback
│   │   └── useWeather.js       # Live weather fetcher & cache
│   ├── pages/
│   │   ├── LandingPage.jsx     # Hero video, curated marquee, and editorial highlights
│   │   ├── ExplorePage.jsx     # Full destination explorer with live filters
│   │   ├── DestinationPage.jsx # In-depth destination guide & itinerary suite
│   │   ├── PlanningPage.jsx    # Dedicated AI itinerary workshop
│   │   ├── BookPage.jsx        # Interactive trip reservation interface
│   │   ├── ContactPage.jsx     # Expedition concierge contact form
│   │   └── NotFoundPage.jsx    # Branded 404 error page
│   ├── services/
│   │   ├── gemini.js           # Google GenAI integration & fallback responses
│   │   ├── images.js           # Unsplash client & curated photo cache
│   │   └── weather.js          # OpenWeatherMap & Open-Meteo client
│   ├── utils/
│   │   └── motion.js           # Tailwind merge & animation transition presets
│   ├── config.js               # Centralized configuration & environment constants
│   ├── index.css               # Design tokens, custom utilities, and font imports
│   ├── App.jsx                 # Routing, layout shell, and global providers
│   └── main.jsx                # Application root entry point
├── netlify.toml                # Netlify deployment configuration
├── vercel.json                 # Vercel deployment configuration & SPA routing
├── vite.config.js              # Vite bundler configuration
└── package.json
```

---

## 🌐 Deployment Instructions

### Deploy to Vercel (Recommended)
1. Push your repository to your GitHub account.
2. Visit [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `wanderlust-travel` repository.
4. Add the environment variables:
   - `VITE_GEMINI_KEY`
   - `VITE_OPENWEATHER_KEY`
   - `VITE_UNSPLASH_KEY`
5. Click **"Deploy"**. The app will be live with full client-side routing support (`vercel.json` is pre-configured).

### Deploy to Netlify
1. Connect your repository on [Netlify](https://www.netlify.com).
2. Set Build Command to `npm run build` and Publish Directory to `dist`.
3. Add environment variables in Site Configuration.
4. Deploy (`netlify.toml` handles SPA redirects).

---

## 📝 License

This project was built for the **Design Esthetics** Front-End Developer evaluation. All original code is available under the MIT License.
