# Design System Documentation

A production-ready, premium design system for building Stripe/Uber quality SaaS dashboards with Next.js, Tailwind CSS, and Framer Motion.

## Overview

This design system provides a comprehensive set of reusable, animated components built with:
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **shadcn/ui** - Accessible component patterns
- **TypeScript** - Full type safety

All components feature:
- ✨ Smooth animations and hover effects
- 🎨 Multiple variants and customization options
- 🌙 Built-in dark mode support
- ♿ Accessibility best practices
- 📱 Fully responsive design

## Components

### Button

A versatile button component with multiple variants, sizes, and states.

#### Variants
- **primary** - Gradient blue button for main actions
- **secondary** - Subtle button for secondary actions
- **ghost** - Transparent button for tertiary actions
- **success** - Green button for positive actions
- **danger** - Red button for destructive actions
- **outline** - Bordered button for neutral actions

#### Sizes
- **sm** - 8px height, small text
- **md** - 10px height, small text (default)
- **lg** - 12px height, base text
- **xl** - 14px height, large text

#### Features
- Loading state with animated spinner
- Icon support (left or right placement)
- Smooth hover and tap animations
- Disabled state

#### Usage

```tsx
import { Button } from "@/components/design-system";

export function MyComponent() {
  return (
    <>
      {/* Basic buttons */}
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>

      {/* With icons */}
      <Button icon={<Heart className="w-4 h-4" />}>
        Like
      </Button>

      {/* Loading state */}
      <Button isLoading>Processing...</Button>

      {/* Different sizes */}
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
    </>
  );
}
```

---

### Card

A flexible card component with multiple visual styles and animations.

#### Variants
- **default** - Classic card with subtle shadow
- **glass** - Glassmorphism with backdrop blur effect
- **gradient** - Subtle gradient background
- **elevated** - High shadow card for prominence

#### Features
- Optional hover animation (lifts on hover)
- Smooth entrance animation
- Rounded corners (2xl)
- Dark mode support

#### Sub-components
- **CardHeader** - Title and description area
- **CardTitle** - Main heading
- **CardDescription** - Subheading or description
- **CardContent** - Main content area
- **CardFooter** - Action area at bottom

#### Usage

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/design-system";

export function MyComponent() {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Revenue Dashboard</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Dashboard content goes here</p>
      </CardContent>
      <CardFooter>
        <Button variant="primary">Export</Button>
      </CardFooter>
    </Card>
  );
}
```

---

### Badge

A status indicator component for labels and badges.

#### Variants
- **active** - Green (for active/online states)
- **inactive** - Gray (for inactive/offline states)
- **pending** - Amber (for pending/waiting states)
- **danger** - Red (for error/critical states)
- **warning** - Orange (for warnings)
- **success** - Green (for success/completion)
- **info** - Blue (for information)
- **purple** - Purple (for custom/special states)
- **secondary** - Gray (for secondary info)

#### Sizes
- **sm** - Small, condensed badge
- **md** - Medium badge (default)
- **lg** - Large, prominent badge

#### Features
- Optional dot indicator
- Icon support
- Pulse animation option
- Smooth hover scale effect

#### Usage

```tsx
import { Badge } from "@/components/design-system";
import { CheckCircle } from "lucide-react";

export function MyComponent() {
  return (
    <>
      {/* Basic badges */}
      <Badge variant="active" dot>
        Active
      </Badge>
      <Badge variant="pending">Pending</Badge>

      {/* With icons */}
      <Badge
        variant="success"
        icon={<CheckCircle className="w-3 h-3" />}
        size="lg"
      >
        Completed
      </Badge>

      {/* Pulse effect */}
      <Badge variant="danger" pulse>
        Error
      </Badge>
    </>
  );
}
```

---

### Input

A modern input field component with validation and icons.

#### Features
- Leading and trailing icon support
- Error state with validation messages
- Hint text for guidance
- Label support
- Disabled state
- Focus animation with ring effect
- Full width option

#### Usage

```tsx
import { Input } from "@/components/design-system";
import { Mail, Lock } from "lucide-react";

export function MyComponent() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  return (
    <>
      {/* Basic input */}
      <Input
        label="Email"
        placeholder="Enter your email"
        icon={<Mail className="w-4 h-4" />}
      />

      {/* With validation */}
      <Input
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        icon={<Mail className="w-4 h-4" />}
      />

      {/* With hint */}
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        hint="Minimum 8 characters required"
        icon={<Lock className="w-4 h-4" />}
      />

      {/* Disabled state */}
      <Input
        label="Disabled"
        placeholder="This field is disabled"
        disabled
      />
    </>
  );
}
```

---

### Navbar

A sticky navigation bar with responsive mobile menu.

#### Features
- Sticky positioning with scroll detection
- Responsive mobile menu
- Transparent mode (blurs on scroll)
- Logo and branding
- Navigation items with active state
- Right-aligned actions
- Smooth animations

#### Usage

```tsx
import { Navbar, Button } from "@/components/design-system";

export function MyLayout() {
  return (
    <Navbar
      logoText="Dashboard"
      logo={<YourLogo />}
      items={[
        { label: "Dashboard", href: "/", active: true },
        { label: "Analytics", href: "/analytics" },
        { label: "Settings", href: "/settings" },
      ]}
      rightItems={
        <>
          <Button size="sm" variant="primary">
            Sign In
          </Button>
        </>
      }
      transparent
    />
  );
}
```

---

## Design Tokens

### Colors
- **Blue** - Primary actions (blue-600)
- **Purple** - Accent/gradients (purple-600)
- **Green** - Success states (emerald-600)
- **Red** - Danger/error (red-600)
- **Amber** - Warning states (amber-600)
- **Gray** - Neutral/disabled

### Spacing
- Uses Tailwind's default spacing scale
- Components use rounded-lg and rounded-2xl
- Padding defaults to 6 units (1.5rem)

### Typography
- Uses system font stack from layout
- Labels: sm font, medium weight
- Headings: lg/xl font, semibold/bold weight
- Body: sm font, regular weight

### Shadows
- **sm** - Subtle shadow for depth
- **lg** - Medium shadow for cards
- **xl** - Strong shadow for elevated content

### Animations
All animations use Framer Motion with:
- Spring physics (stiffness: 400, damping: 10)
- Duration: 0.2-0.6s depending on animation
- Easing: ease-in-out for smooth transitions

---

## Customization

### Modifying Variants

Each component uses CVA (Class Variance Authority) for variants. To add custom variants:

```tsx
// In your component file
const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      primary: "blue-600 hover:blue-700",
      // Add your custom variant
      custom: "your-custom-classes",
    },
  },
});
```

### Tailwind Configuration

All components use standard Tailwind classes. Customize via `tailwind.config.ts`:

```tsx
export default {
  theme: {
    extend: {
      colors: {
        // Custom colors
      },
      spacing: {
        // Custom spacing
      },
    },
  },
};
```

### Dark Mode

All components automatically support dark mode. Customize dark mode colors:

```tsx
<html className="dark">
  {/* Your app */}
</html>
```

---

## Animation Customization

All animations use Framer Motion. Customize in component props:

```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  transition={{ type: "spring", stiffness: 300, damping: 15 }}
>
  Content
</motion.div>
```

---

## Accessibility

All components follow WCAG 2.1 guidelines:
- ✅ Keyboard navigation support
- ✅ Focus indicators visible
- ✅ Proper ARIA labels
- ✅ Semantic HTML
- ✅ Color contrast compliance
- ✅ Motion can be reduced (respects prefers-reduced-motion)

---

## Performance

Components are optimized for performance:
- ✅ Efficient re-renders
- ✅ Memoization where appropriate
- ✅ CSS-in-JS with Tailwind (zero runtime overhead)
- ✅ Motion animations use GPU acceleration
- ✅ Lazy loading support

---

## TypeScript Support

All components are fully typed with TypeScript:

```tsx
import type { ButtonProps, CardProps, BadgeProps } from "@/components/design-system";

const button: ButtonProps = {
  variant: "primary",
  size: "lg",
  onClick: () => console.log("clicked"),
};
```

---

## Component Showcase

Visit `/design-system` to see all components in action with live examples and code snippets.

---

## Best Practices

1. **Use semantic components** - Choose the right component for the job
2. **Maintain consistency** - Use the same variant/size combinations
3. **Respect dark mode** - Test components in both light and dark
4. **Optimize animations** - Use motion sparingly for important interactions
5. **Test accessibility** - Use keyboard navigation and screen readers
6. **Keep it responsive** - Test on mobile devices

---

## Examples

### Dashboard Card with Stats

```tsx
<Card variant="elevated">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-xl font-bold">Revenue</h3>
    <Badge variant="success" dot>
      +12%
    </Badge>
  </div>
  <p className="text-3xl font-bold mb-2">$24,500</p>
  <p className="text-sm text-gray-600">vs last month</p>
</Card>
```

### Form with Validation

```tsx
const [email, setEmail] = useState("");
const [emailError, setEmailError] = useState("");

return (
  <div className="space-y-4">
    <Input
      label="Email"
      value={email}
      onChange={(e) => {
        setEmail(e.target.value);
        setEmailError("");
      }}
      error={emailError}
      icon={<Mail className="w-4 h-4" />}
    />
    <Button
      variant="primary"
      onClick={() => {
        if (!email.includes("@")) {
          setEmailError("Invalid email");
        }
      }}
    >
      Validate
    </Button>
  </div>
);
```

### Responsive Navigation

```tsx
<Navbar
  logoText="SaaS"
  items={[
    { label: "Home", href: "/", active: true },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
  ]}
  rightItems={
    <>
      <Button size="sm" variant="secondary">
        Login
      </Button>
      <Button size="sm" variant="primary">
        Sign Up
      </Button>
    </>
  }
  transparent
/>
```

---

## Support

For issues or questions:
1. Check the `/design-system` page for live examples
2. Review component source code in `/components/design-system`
3. Check TypeScript types for prop documentation
4. Refer to Framer Motion and Tailwind CSS documentation

---

**Last updated:** March 2026
