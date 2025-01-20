# Podcast App

A Single Page Application (SPA) for exploring and listening to the top 100 podcasts. Built using **React**, **Vite**, and **TypeScript**.

## Features

- Fetch and display the top 100 podcasts from the iTunes API.
- View podcast details, including episodes and descriptions.
- Play podcast episodes using a native HTML5 audio player.
- Real-time search and filter functionality.
- Client-side caching for 24 hours to improve performance.
- Integrated GitHub Actions workflow for CI/CD pipeline.
- Pre-commit hooks using Husky to enforce code quality.

## Installation

### Prerequisites

- Node.js v18.20.5
- npm

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/HAMZADAQA/podcast_app.git
   cd podcast_app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

5. Preview the production build:

   ```bash
   npm run preview
   ```

6. Install Husky (pre-configured in the project):
   ```bash
   npm run prepare
   ```

## Scripts

- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Lint**: `npm run lint`
- **Fix Lint Issues**: `npm run lint:fix`
- **Run Tests**: `npm run test`
- **Test Coverage**: `npm run test:coverage`
- **Pre-Commit Checks**: Automatically run linting and tests before pushing using Husky.

## Architecture

- **Component-Based Design**: Modular, reusable React components.
- **State Management**: Managed using Context API.
- **Routing**: Clean, dynamic routes handled by React Router.
- **Caching**: Local storage is used to cache API responses with encryption for production.
- **Utilities**: Custom hooks, debounce functionality, and formatting utilities.

### Key Files and Directories

- `src/api`: API clients and utility functions.
- `src/components`: Reusable UI components (e.g., PodcastCard, PodcastList).
- `src/context`: Context API for state management.
- `src/pages`: Page-level components (e.g., MainView, PodcastDetail).
- `src/utils`: Helper utilities (e.g., caching, debouncing).
- `.github/workflows`: GitHub Actions workflow for CI/CD.

## Testing

- **Unit Tests**: Validates components and utility functions.
- **Integration Tests**: Ensures seamless interaction between components.
- **Tools**: Jest and React Testing Library.

## CI/CD Workflow

This project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) to automate the CI/CD process.

### Workflow Steps:

1. **Install Dependencies**: Ensures all project dependencies are installed.
2. **Lint Code**: Validates code quality using ESLint.
3. **Run Tests**: Executes unit tests and generates a coverage report.
4. **Build Project**: Builds the application for production.
5. **Deploy to Vercel**: Automatically deploys the app to Vercel after successful builds.
