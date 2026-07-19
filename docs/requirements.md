# Requirements

## Overview
This is a personal portfolio website with a custom admin panel for managing dynamic content. The content is divided into Projects, Hackathons, and Blogs.

## Frontend Requirements
- **Responsive Design**: The portfolio must look good on both mobile and desktop devices.
- **Dynamic Content**: Data for Projects, Hackathons, and Blogs should be fetched dynamically from the database.
- **Sections**:
  - **Profile**: Hero section with quick intro.
  - **Projects**: Display case studies with links to Live Demos and GitHub Repositories.
  - **Hackathons**: Detail participation in hackathons, learnings, demo URLs, and GitHub repos.
  - **Blogs**: Markdown/HTML based blogs detailing learnings or other topics.
  - **Experience, Skills, Services, Contact**: Standard portfolio sections.
- **Navigation**:
  - Desktop: Sidebar navigation on the left.
  - Mobile: Hamburger menu or vertical scroll for main sections.
- **Detailed Views**: Dedicated mobile-responsive pages and desktop inline views for viewing single Projects, Hackathons, and Blogs.

## Backend / Admin Panel Requirements
- **Authentication**: A secure login system using a JWT token (`admin_token`) verified against a secret (`JWT_SECRET`).
- **Dashboard**: A tabbed dashboard interface to manage Projects, Hackathons, and Blogs.
- **CRUD Operations**: Ability to Create, Read, Update, and Delete entries for:
  - Projects (including GitHub and Demo URLs)
  - Hackathons (including GitHub and Demo URLs, rich content)
  - Blogs (including rich text content, tags)
- **Media Uploads**: Capability to upload images/videos to Cloudinary via the admin panel.

## Technology Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, Shadcn UI / Radix UI components
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (`jose` library)
- **Media**: Cloudinary for image hosting
- **Icons**: Lucide React
- **Content Parsing**: React Markdown for rendering markdown blog/hackathon posts.
