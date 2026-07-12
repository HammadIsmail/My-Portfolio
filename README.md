# Hammad Ismail's Professional Developer Portfolio

A dynamic, state-of-the-art developer portfolio website built using Next.js, React, Tailwind CSS, TypeScript, MongoDB, and Cloudinary. This website features a responsive public-facing presentation layer for showcasing projects and case studies, combined with a comprehensive, secure, and feature-rich Admin Dashboard for easy content management.

## 🚀 Key Features

### 💻 Public Portfolio & Case Studies
- **Interactive Showcases:** Sleek project listings with tag filters, descriptions, and dynamic page routing.
- **Dynamic Case Studies:** Deep-dive project pages supporting inline images, formatting, responsive carousels, and embedded video presentation.
- **Contact Integration:** Functional email forms configured with EmailJS for direct client communication.
- **Global Theme Engine:** Premium Light and Dark mode modes backed by `next-themes` and CSS variables.

### 🛡️ Admin Dashboard
- **Secure Authentication:** Protected admin panel utilizing stateless JWT (JSON Web Tokens) verification.
- **Project Management:** Full CRUD (Create, Read, Update, Delete) capability for projects.
- **Media Asset Clean-up:** Automatic, secure deletion of associated assets (images/videos) from Cloudinary when projects are deleted to minimize cloud storage.
- **Drag-and-Drop Image Sequencing:** Multi-image ordering via `@dnd-kit` to arrange slider images exactly how they should look in the carousel.
- **Lightbox Preview:** Full-screen modal previews for uploaded slider images inside the dashboard.
- **Upload Progress Trackers:** Real-time upload progress percentages and progress bars powered by Axios when uploading large video and image files.
- **Rich Text & Markdown Editor:** High-quality Tiptap editor configured with:
  - Custom drag-and-drop image dropzones.
  - Automatic markdown formatting on paste (converts `## Heading`, `**bold**`, `- list` inputs instantly).
  - Media library selector and direct local image upload to Cloudinary.

---

## 🛠️ Tech Stack

*   **Framework:** Next.js (App Router), React, TypeScript
*   **Styling:** Tailwind CSS, Lucide React, Shadcn UI
*   **Database:** MongoDB, Mongoose ORM
*   **Cloud Storage:** Cloudinary (for WebP image conversion and video hosting)
*   **Rich Text Editor:** Tiptap, `tiptap-markdown`
*   **State Management & Requests:** Axios (with upload progress tracking), React Query
*   **Authentication:** JWT, `jose`
*   **Animations:** Framer Motion, Tailwind Animate

---

## ⚙️ Local Setup Guide

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed.

### 2. Environment Configuration
Create a `.env.local` file in the root directory and add the following keys:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Admin Authentication
ADMIN_PASSWORD=your_dashboard_password
JWT_SECRET=your_jwt_secret_key

# Cloudinary Credentials
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

# EmailJS Config (For contact forms)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

### 3. Installation & Run
Install the dependencies and start the development server:

```bash
# Install dependencies
npm install

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📄 License
This project is open-source. Feel free to use it as a reference for building your own portfolio!
