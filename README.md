# SaaS Dashboard

A modern, production-ready SaaS dashboard built with Next.js 16, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Next.js 16** - Latest React framework with App Router
- **TypeScript** - Full type safety and IntelliSense
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - High-quality, accessible components
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Beautiful, responsive charts
- **Dark Mode** - Built-in dark mode support with system preference detection
- **Inter Font** - Modern typography
- **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
├── app/                           # Next.js App Router
│   ├── layout.tsx                # Root layout with dark mode support
│   ├── page.tsx                  # Home page with design system intro
│   ├── design-system/            # Design system showcase
│   │   └── page.tsx              # Live component examples
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── design-system/            # Premium design system
│   │   ├── Button.tsx            # Button component (primary, secondary, ghost, etc.)
│   │   ├── Card.tsx              # Card component (default, glass, gradient, elevated)
│   │   ├── Badge.tsx             # Badge component (status indicators)
│   │   ├── Input.tsx             # Input component (modern, clean)
│   │   ├── Navbar.tsx            # Navigation bar (responsive, sticky)
│   │   ├── index.ts              # Exports all design system components
│   │   └── DESIGN_SYSTEM.md      # Component documentation
│   └── [your-components]/        # Custom dashboard components
├── lib/
│   ├── utils.ts                  # Utility functions
│   └── dashboard-utils.ts        # Dashboard-specific utilities
├── hooks/
│   └── index.ts                  # Custom React hooks
├── public/                       # Static assets
└── package.json                  # Dependencies
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or yarn

### Installation

1. Install dependencies (already done):
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Premium Design System

This project includes a production-ready design system with Stripe/Uber quality components:

### Components Included

- **Button** - Multiple variants (primary, secondary, ghost, success, danger)
- **Card** - Glassmorphism, gradient, and elevated styles
- **Badge** - Status indicators (active, pending, danger, success, info)
- **Input** - Modern input fields with validation and icons
- **Navbar** - Responsive sticky navigation with mobile menu

### Design System Features

- ✨ Smooth Framer Motion animations
- 🎨 Tailwind CSS with dark mode
- ♿ Accessible and semantic
- 📱 Fully responsive
- 🌙 Perfect dark/light mode support
- 🚀 Production ready

### Quick Start with Design System

```tsx
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Navbar,
} from "@/components/design-system";

export function Dashboard() {
  return (
    <>
      <Navbar
        logoText="Dashboard"
        items={[{ label: "Home", href: "/" }]}
      />
      
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <Button variant="primary">Get Started</Button>
      </Card>
    </>
  );
}
```

### View Design System

Visit [http://localhost:3000/design-system](http://localhost:3000/design-system) to see all components in action.

### Learn More

See [components/design-system/DESIGN_SYSTEM.md](components/design-system/DESIGN_SYSTEM.md) for complete documentation on all components, usage examples, and customization options.

---

```bash
npx shadcn@latest add [component-name]
```

Popular components for dashboards:
- `card` - Card container
- `button` - Button element
- `input` - Input field
- `table` - Data table
- `dialog` - Modal dialog
- `dropdown-menu` - Dropdown menu

## 🎯 Creating Components

### Custom Component Structure

```tsx
// components/dashboard/StatCard.tsx
'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className="p-6">
      {icon && <div className="mb-2">{icon}</div>}
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </Card>
  );
}
```

### Custom Hooks

Create custom hooks in the `/hooks` directory:

```tsx
// hooks/index.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Hook implementation
}

export function useTheme() {
  // Theme hook implementation
}
```

## 🌙 Dark Mode

Dark mode is automatically supported and follows system preferences. The root layout includes:

- `suppressHydrationWarning` to prevent warning on initial load
- Gradient background that adapts to light/dark mode
- Tailwind's `dark:` variants for responsive styling

To force dark mode:

```tsx
<html className="dark">
  {/* Content */}
</html>
```

## 📊 Using Recharts

Example chart component:

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

export function RevenueChart() {
  const data = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
  ];

  return (
    <LineChart width={600} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
    </LineChart>
  );
}
```

## ✨ Using Framer Motion

Example animation:

```tsx
'use client';

import { motion } from 'framer-motion';

export function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      Content
    </motion.div>
  );
}
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

## 📝 Best Practices

1. **Keep components small and focused** - One responsibility per component
2. **Use TypeScript everywhere** - For better type safety and IntelliSense
3. **Organize by feature** - Group related components, hooks, and utilities
4. **Use semantic HTML** - For better accessibility
5. **Optimize images** - Use Next.js Image component
6. **Lazy load components** - Use `dynamic` import for heavy components
7. **Test your components** - Write unit tests for critical components

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy is using Vercel:

1. Push your code to GitHub
2. Import your repository on Vercel
3. Vercel will auto-detect Next.js and configure the build settings
4. Your site is live!

### Other Platforms

The `npm run build` creates an optimized production build in the `.next` folder, which can be deployed to any Node.js hosting platform.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)
- [Recharts](https://recharts.org)

## 📄 License

This project is open source and available under the MIT License.

---

**Happy coding! 🎉**
