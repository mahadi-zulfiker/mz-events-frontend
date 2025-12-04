# Events & Activities Platform (Next.js)

A polished event discovery and hosting experience with role-aware navigation, tactile UI polish, and mobile-first patterns.

## Navigation Architecture
- Public navbar: Logo | Home | Events | About | Contact | Auth. Sticky with transparent-to-solid transition on scroll, notification bell for signed-in users, and a left slide-in drawer on mobile with backdrop + outside-to-close.
- Dashboard sidebar: Role-aware sections for users, hosts, and admins with nested items, active-route highlights, and collapsible state on desktop plus overlay mode on mobile. Breadcrumbs keep deep routes understandable.
- Pages added: `/about` (mission & design pillars) and `/contact` (support + feedback entry points).

## Running Locally
```bash
npm install
npm run dev
```

Visit `http://localhost:3000` after the dev server starts.

## Notes
- Tailwind CSS powers styling; global utilities live in `src/app/globals.css`.
- Auth context (`src/contexts/AuthContext.tsx`) provides role data for nav rendering.
- UI building blocks live in `src/components`; dashboard scaffolding is in `src/components/layout/DashboardShell.tsx`.
