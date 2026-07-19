# Folder Structure

```
My-Portfolio/
├── .env.local              # Environment variables (DB URI, JWT secret, Cloudinary keys)
├── docs/                   # Project documentation
│   ├── architecture.md
│   ├── requirements.md
│   └── folder_structure.md
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router root
│   │   ├── admin/          # Admin dashboard & CRUD pages
│   │   │   ├── add-blog/
│   │   │   ├── add-hackathon/
│   │   │   ├── add-project/
│   │   │   ├── edit-blog/
│   │   │   ├── edit-hackathon/
│   │   │   ├── edit-project/
│   │   │   ├── layout.tsx  # Admin layout with sidebar
│   │   │   └── page.tsx    # Admin dashboard with tabs
│   │   ├── api/            # Next.js API Routes (Backend)
│   │   │   ├── auth/       # Login/Logout handlers
│   │   │   ├── blogs/      # Blogs CRUD endpoints
│   │   │   ├── hackathons/ # Hackathons CRUD endpoints
│   │   │   ├── projects/   # Projects CRUD endpoints
│   │   │   └── upload/     # Media upload endpoints
│   │   ├── blog/           # Public mobile detail view for blogs
│   │   ├── hackathon/      # Public mobile detail view for hackathons
│   │   ├── project/        # Public mobile detail view for projects
│   │   ├── globals.css     # Global styles and Tailwind directives
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Main public portfolio entry point
│   ├── components/         # React Components
│   │   ├── admin/          # Components specific to the admin interface
│   │   ├── ui/             # Reusable UI components (e.g., shadcn/radix)
│   │   ├── BlogDetail.tsx  # Desktop blog detail view
│   │   ├── Blogs.tsx       # Blogs list view
│   │   ├── HackathonDetail.tsx # Desktop hackathon detail view
│   │   ├── Hackathons.tsx  # Hackathons list view
│   │   ├── PortfolioContent.tsx # Main content router/renderer
│   │   ├── Sidebar.tsx     # Portfolio navigation sidebar
│   │   └── ...             # Other section components (Hero, Skills, etc.)
│   ├── context/            # React Contexts
│   │   └── PortfolioContext.tsx # Global state for portfolio navigation
│   ├── hooks/              # Custom React Hooks
│   ├── lib/                # Utility functions and library wrappers
│   │   ├── auth.ts         # JWT verification utilities
│   │   ├── db.ts           # MongoDB connection utility
│   │   └── utils.ts        # Tailwind merge utilities
│   ├── models/             # Mongoose schemas/models
│   │   ├── Blog.ts
│   │   ├── Hackathon.ts
│   │   └── Project.ts
│   └── types/              # TypeScript type definitions
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```
