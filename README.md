# Welcome to My Portfolio

## Project info

**URL**: https://muhammadhammadismail.vercel.app/

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone git@github.com:HammadIsmail/My-Portfolio.git

# Step 2: Navigate to the project directory.
cd My-Portfolio

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Configure Environment Variables
Create a `.env` file in the root directory and add your EmailJS credentials:
```env
VITE_EMAILJS_SERVICE_ID="your_service_id"
VITE_EMAILJS_TEMPLATE_ID="your_template_id"
VITE_EMAILJS_PUBLIC_KEY="your_public_key"
```

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```
## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- EmailJS (for Contact Form)
