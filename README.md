# ROKKO — Warranty Tracker

A minimalist, production-ready warranty tracking web application with a **tosen.es-inspired aesthetic**. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

![ROKKO](https://img.shields.io/badge/Status-Production%20Ready-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Powered-green)

## ✨ Features

### Core Functionality
- **Warranty Management**: Add, view, and delete product warranties
- **Receipt Upload**: Upload receipts (JPG, PNG, WEBP, PDF) up to 40MB
- **Expiration Tracking**: Visual indicators for active, expiring, and expired warranties
- **Secure Authentication**: Email/password + Google OAuth
- **User Isolation**: RLS-protected data - users only see their own warranties

### Design & UX
- **Tosen.es-Inspired Aesthetic**: Dark, architectural, minimal chrome
- **Particles Background**: Animated WebGL/Canvas particles on landing, auth, and dashboard
- **Custom Cursor**: Desktop-only colored cursor (#ff3131 accent)
- **HUD Stats**: Corner stats showing active/expiring/expired counts
- **Overlay Menu**: Blurred navigation menu
- **Responsive Design**: Mobile-friendly with desktop enhancements
- **Accessibility**: Respects `prefers-reduced-motion`

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Supabase account ([supabase.com](https://supabase.com))

### 1. Clone & Install

```bash
cd rokkonew
npm install
```

### 2. Set Up Supabase

Follow the comprehensive setup guide in [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md):

1. Create a new Supabase project
2. Run the SQL schema and RLS policies
3. Create the `receipts` storage bucket
4. Configure authentication providers
5. Copy your environment variables

### 3. Configure Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
rokkonew/
├── app/
│   ├── app/                    # Protected app routes
│   │   ├── layout.tsx          # Auth protection
│   │   ├── page.tsx            # Dashboard
│   │   ├── new/                # Add warranty
│   │   └── warranty/[id]/      # Warranty detail
│   ├── auth/                   # Authentication pages
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/
│   ├── AppMenu.tsx             # Navigation overlay
│   ├── CustomCursor.tsx        # Desktop cursor
│   ├── HUDStats.tsx            # Corner statistics
│   ├── NoiseOverlay.tsx        # Noise texture
│   ├── ParticlesBackground.tsx # Animated particles
│   ├── WarrantyActions.tsx     # Delete warranty
│   └── WarrantyList.tsx        # Warranty cards
├── lib/
│   └── supabase/
│       ├── client.ts           # Browser client
│       ├── server.ts           # Server client
│       ├── middleware.ts       # Auth middleware
│       └── types.ts            # Database types
├── middleware.ts               # Next.js middleware
├── SUPABASE_SETUP.md          # Database setup guide
└── README.md                   # This file
```

## 🎨 Design System

### Colors
- **Background**: `#0a0a0a` (near black)
- **Accent**: `#ff3131` (red)
- **Text**: `#e5e5e5` (light gray)
- **Borders**: `#1f1f1f` (dark gray)

### Typography
- **Headings**: Uppercase, bold, generous tracking
- **Body**: Normal case, system font stack
- **Accent**: Small caps with wide letter-spacing

### Interactions
- **Transitions**: 300ms ease for most interactions
- **Hover States**: Accent color highlights
- **Focus States**: Accent border on inputs
- **Motion**: Respects `prefers-reduced-motion`

## 🔒 Security

### Implemented Security Measures

✅ **Row Level Security (RLS)**
- All database tables have RLS enabled
- Users can only access their own data
- Policies enforce user isolation

✅ **Storage Security**
- Private storage bucket (not public)
- RLS policies on storage.objects
- Files organized by user_id

✅ **Authentication**
- Secure session management via Supabase
- Server-side session verification
- Protected routes with middleware

✅ **Best Practices**
- No service_role key in browser code
- Only anon key exposed client-side
- Indexed user_id columns for RLS performance
- Cascade deletes for data cleanup

### Security Checklist

Before deploying:
- [ ] RLS enabled on all tables
- [ ] Storage RLS policies created
- [ ] Environment variables secured
- [ ] HTTPS enforced in production
- [ ] Google OAuth configured (if using)
- [ ] Database backups enabled

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Canvas API for particles

### Backend
- **Database**: Supabase (Postgres)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Supabase JS Client

### Deployment
- **Recommended**: Vercel (seamless Next.js deployment)
- **Alternatives**: Netlify, Railway, self-hosted

## 📝 Usage Guide

### Adding a Warranty

1. Click **"+ Add Warranty"** on dashboard
2. Fill in product details (name, brand, dates, etc.)
3. Optionally upload a receipt (JPG, PNG, WEBP, or PDF)
4. Click **"Add Warranty"**

### Viewing Warranties

- **Dashboard**: See all warranties sorted by expiration date
- **Status Indicators**:
  - 🔴 **Expired**: Warranty has passed
  - 🟡 **Expiring**: Expires within 30 days
  - 🟢 **Active**: Still valid
- **Click any warranty** to view full details

### Managing Warranties

- **View Details**: Click warranty card
- **Delete**: Click "Delete Warranty" on detail page
- **Receipt**: View uploaded receipt image or PDF

## 🎯 Roadmap

Potential future enhancements:

- [ ] Edit warranty functionality
- [ ] Search and filter warranties
- [ ] Export warranties to PDF/CSV
- [ ] Email notifications for expiring warranties
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Warranty categories with icons
- [ ] Bulk upload via CSV

## 🐛 Troubleshooting

### Common Issues

**"Cannot connect to Supabase"**
- Verify `.env.local` has correct values
- Check Supabase project is active
- Ensure network connectivity

**"RLS policy violation"**
- User not authenticated
- RLS policies not set up correctly
- See `SUPABASE_SETUP.md` for policy setup

**"File upload fails"**
- Check file size (max 40MB)
- Verify file type (JPG, PNG, WEBP, PDF only)
- Ensure storage bucket exists and RLS policies are set

**"Particles not showing"**
- Check browser console for errors
- Ensure Canvas API is supported
- Verify JavaScript is enabled

## 📄 License

This project is provided as-is for educational and commercial use.

## 🙏 Acknowledgments

- **Design Inspiration**: tosen.es (aesthetic and interaction patterns)
- **Framework**: Next.js team
- **Backend**: Supabase team
- **Styling**: Tailwind CSS

---

**Built with precision. Track with confidence.**

For detailed Supabase setup instructions, see [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md).
