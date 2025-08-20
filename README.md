# Forum Frontend (React)

This is the **frontend** of a full-stack forum application built with **React + Vite**.  
It connects to the Spring Boot backend and provides the UI/UX for posts, communities, comments, profiles, notifications, chat, and more.  
The design supports **light/dark mode**, **modular layouts**, and **real-time updates**.

---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How to Run](#how-to-run)
- [Features](#features)
- [Routes Overview](#routes-overview)
- [Additional Notes](#additional-notes)

---

## Tech Stack

- **React 18 (Vite)**
- **React Router v6**
- **Axios** (API client)
- **TailwindCSS + shadcn/ui + lucide-react**
- **Framer Motion** (animations)
- **Context API + custom hooks** (Auth, Theme, Login Modal)
- **Infinite Scroll (IntersectionObserver)**
- **WebSocket (chat, notifications)**

---

## Project Structure

```
src/
├── api/                    # Axios instance & API clients
├── components/             # Shared UI components (buttons, modals, dropdowns, cards)
├── constants/              # Route constants, labels, configs
│   ├── apiRoutes/          # Domain-based API route definitions
│   └── labels/
├── context/                # React contexts (Auth, Theme, etc.)
├── features/               # Feature-based modules
│   ├── auth/               # Login, signup, modal
│   ├── bookmark/           # Saved posts page
│   ├── chat/               # Chat modal & full-page chat
│   ├── community/          # Community detail, create, manage, sidebar
│   ├── home/               # Home page sections
│   ├── post/               # Post detail page, create, edit, actions
│   ├── profile/            # Profile page, edit, sidebar, follow modal
│   ├── trending/           # Trending page + sidebar
│   └── report/             # Report modal & flows
├── hooks/                  # Custom hooks (e.g. useLoginModal, useInfiniteScroll)
├── layout/                 # Navbar, LeftSidebar, RightSidebar, MainLayout
├── pages/                  # Top-level routed pages
├── styles/                 # Global styles (Tailwind config)
└── main.jsx                # App entry point
```

---

## How to Run

### Prerequisites
- Node.js 18+
- Backend server running (Spring Boot)

### Install dependencies
```bash
npm install
```

### Run in development
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

---

## Features

- **Authentication**
  - Token-based login/signup (JWT)
  - Login modal with dark/light mode
- **Navigation & Layout**
  - Global Navbar (search, create, notifications, profile dropdown)
  - LeftSidebar (Home, You, Communities, Explore)
  - RightSidebar (community/profile/trending-specific content)
  - Responsive MainLayout
- **Posts**
  - Create, edit, delete posts
  - Post detail page (full-page & modal)
  - Post actions (like, dislike, share, comment)
  - Image upload & preview
- **Comments**
  - Nested comment threads with replies
  - Like/Dislike system with real-time update
- **Communities**
  - Create & manage communities
  - Join/leave communities
  - Favorite communities
  - Community-specific sidebar
- **Profile**
  - Profile page with bio, nickname, username edit
  - Profile image & banner upload
  - Infinite scroll for user posts
  - Follow/Unfollow system with modal lists
- **Bookmarks**
  - Save/unsave posts to bookmarks
- **Trending**
  - Trending page for posts
  - Trending sidebar for communities
- **Chat**
  - Real-time modal chat
  - Dedicated full-page chat
- **Reports**
  - Report posts, comments, users, and communities
  - Integrated moderation flow
- **Notifications**
  - Real-time notifications (likes, comments, replies, follows, reports)
  - Mark all as read
- **Theming**
  - Light/Dark mode toggle (global)
- **Infinite Scroll**
  - Profile posts & feed scrolling

---

## Routes Overview

- `/` → HomePage
- `/login` → LoginPage
- `/signup` → SignupPage
- `/posts/:id` → PostDetailPage
- `/posts/create` → CreatePostPage
- `/posts/edit/:id` → EditPostPage
- `/communities/:id` → CommunityDetailPage
- `/communities/create` → CreateCommunityPage
- `/communities/manage/:id` → CommunityManagePage
- `/communities/me` → MyCommunitiesPage
- `/profile/:username` → ProfilePage
- `/profile/:username/edit` → ProfileEditPage (nickname, bio, username, image)
- `/bookmarks` → BookmarkPostsPage
- `/chat` → ChatPage
- `/trending` → TrendingPage

---

## Additional Notes

- Frontend fully decoupled and integrated with Spring Boot backend.
- Modular file structure for scalable features.
- Light/Dark mode supported throughout the app.
- Optimized for **Vercel** deployment.
- 
