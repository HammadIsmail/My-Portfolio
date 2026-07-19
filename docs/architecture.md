# Architecture

## High-Level Architecture
The application is a full-stack Next.js web application utilizing the App Router paradigm. It acts as both the frontend client and the backend API server.

## Data Layer
- **Database**: MongoDB is used as the primary data store.
- **ODM**: Mongoose is used for schema definition and data modeling.
- **Models**:
  - `Project`: Stores project case studies, images, links.
  - `Hackathon`: Stores hackathon experiences, links, and detailed content.
  - `Blog`: Stores blog posts, primarily in markdown or HTML formats.
- **Connection**: `src/lib/db.ts` handles establishing and maintaining the connection to MongoDB, taking care of caching the connection in development.

## Backend (API Routes)
Located in `src/app/api/`:
- **Admin Authentication**: `api/auth/login` and `api/auth/logout` manage the lifecycle of the `admin_token` JWT cookie.
- **Resource Routes**: RESTful-like endpoints for `projects`, `hackathons`, and `blogs`.
  - GET requests are typically public.
  - POST, PUT, DELETE requests are protected by a middleware-like check (often verifying the JWT directly in the route handler via `src/lib/auth.ts`).

## Frontend Architecture
- **State Management**:
  - React Context (`src/context/PortfolioContext.tsx`) is used to manage the global state of the portfolio viewer (e.g., currently active section, selected project ID, selected hackathon ID, mobile vs desktop view).
- **Routing**:
  - Main portfolio is a single-page-like experience on desktop (`src/app/page.tsx`), navigating between components conditionally rendered based on `PortfolioContext`.
  - On mobile, it acts more like a traditional scrollable page, but also has dedicated routes for detail views:
    - `/project/[id]`
    - `/hackathon/[id]`
    - `/blog/[id]`
- **Admin Interface**:
  - Located under `src/app/admin/`.
  - Uses a shared layout (`src/app/admin/layout.tsx`) that enforces authentication checks client-side and server-side.
  - Form state and submission are handled via standard React state and fetch API to the internal Next.js API routes.
- **UI Components**:
  - A mix of custom components and pre-built Shadcn UI components.
  - Tailwind CSS is used for utility-first styling.
  - CSS Variables in `src/app/globals.css` provide the theming system.

## Media Architecture
- Image uploads are routed from the client directly to Cloudinary using a preset or signed URL, or routed through an API endpoint. 
- The Cloudinary URL is then saved to the MongoDB document.

## Rendering Strategy
- The home page uses Server Components where possible to fetch initial data (Projects, Hackathons, Blogs) from MongoDB directly before passing it down to client components (`PortfolioContent.tsx`).
- Detail pages (`/blog/[id]`, etc.) also utilize Server Components to fetch data by ID directly from the DB.
