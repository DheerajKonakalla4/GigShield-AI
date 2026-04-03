# Copilot Instructions for SaaS Dashboard Project

## Project Overview
This is a modern SaaS dashboard built with:
- **Next.js 16** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for pre-built UI components
- **Framer Motion** for animations
- **Recharts** for data visualization

## Premium Design System

This project includes a Stripe/Uber quality design system with production-ready components:

### Components Available
- **Button** - 6 variants (primary, secondary, ghost, success, danger, outline)
- **Card** - 4 variants (default, glass, gradient, elevated) with sub-components
- **Badge** - 9 status variants with dot indicators and pulse effects
- **Input** - Modern input fields with validation and icon support
- **Navbar** - Responsive sticky navigation with mobile menu

All components feature:
- ✨ Smooth Framer Motion animations
- 🌙 Full dark mode support
- ♿ Accessibility best practices
- 📱 Fully responsive design
- 🎨 Tailwind CSS customization

### Quick Access
- View components: `/design-system` page
- Component code: `/components/design-system/`
- Documentation: `components/design-system/DESIGN_SYSTEM.md`
- Quick start: `components/design-system/QUICK_START.md`
- Example dashboard: `components/design-system/ExampleDashboard.tsx`

## Project Structure
```
├── app/                  # Next.js App Router pages and layouts
│   ├── layout.tsx       # Root layout with Inter font and dark mode
│   ├── page.tsx         # Home page with dashboard template
│   └── globals.css      # Global styles and Tailwind configuration
├── components/
│   ├── ui/              # shadcn/ui components
│   └── [your components here]
├── lib/                 # Utility functions and helpers
│   └── utils.ts         # Tailwind CSS class merging utility
├── hooks/               # Custom React hooks for dashboard logic
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## Key Features
- ✅ **Dark Mode Support**: Automatic system preference detection
- ✅ **Modern Typography**: Inter font for clean UI
- ✅ **Gradient Background**: Subtle gradient in light and dark modes
- ✅ **Component Library**: shadcn/ui for consistent design
- ✅ **Animation Ready**: Framer Motion pre-installed
- ✅ **Charts Ready**: Recharts for data visualization
- ✅ **TypeScript**: Full type safety throughout

## Development Guidelines

### Component Creation
- Use shadcn/ui components as base components
- Place custom components in `/components`
- Use TypeScript for all new components
- Import UI components from `@/components/ui`

### Custom Hooks
- Place all custom hooks in `/hooks` directory
- Use the `use` prefix for hook names (e.g., `useLocalStorage`)
- Example: `hooks/useLocalStorage.ts`

### Utilities
- Add utility functions to `/lib` directory
- Keep utilities focused and reusable
- Export functions as named exports

### Styling
- Use Tailwind CSS classes for styling
- Dark mode variants are already configured
- Use `dark:` prefix for dark mode styles

### Running the Project
```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

## Adding Components with shadcn/ui
```bash
npx shadcn@latest add [component-name]
```

Common components:
- `button` - Button component
- `card` - Card component
- `input` - Input field
- `dialog` - Modal dialog
- `dropdown-menu` - Dropdown menu
- `table` - Data table

## Recommended Directory Usage

### For New Pages
```
app/dashboard/
  ├── page.tsx           # Dashboard page
  ├── layout.tsx         # Dashboard layout
  └── components/        # Page-specific components
```

### For Reusable Components
```
components/
  ├── dashboard/
  │   ├── Header.tsx
  │   ├── Sidebar.tsx
  │   └── StatCard.tsx
  └── common/
      ├── Navigation.tsx
      └── Footer.tsx
```

### For Custom Hooks
```
hooks/
  ├── useLocalStorage.ts
  ├── useDashboardData.ts
  └── useTheme.ts
```

## Best Practices
1. Keep components small and focused
2. Use TypeScript for type safety
3. Leverage Tailwind CSS for styling
4. Use Framer Motion for smooth animations
5. Implement error boundaries for robustness
6. Use shadcn/ui components consistently
7. Test charts with sample data first

## Dark Mode Implementation
Dark mode is automatically applied based on system preference. Override with:
```tsx
<html className="dark">
  {/* content */}
</html>
```

## Environment Variables
Create a `.env.local` file in the root directory for environment variables:
```
NEXT_PUBLIC_API_URL=https://api.example.com
```
