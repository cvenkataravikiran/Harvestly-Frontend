# Harvestly React Application

This is the migrated version of the Harvestly application from Next.js to React with Bootstrap 5.

## 🚀 Migration Summary

### What Was Migrated
- **Framework**: Next.js → React (Vite)
- **Styling**: Tailwind CSS → Bootstrap 5
- **Routing**: Next.js App Router → React Router DOM
- **State Management**: Zustand → React Context API
- **Build Tool**: Next.js → Vite

### Project Structure
```
harvestly-react/
├── src/
│   ├── components/
│   │   ├── ui/           # UI components (Navigation, HeroSection, etc.)
│   │   └── Layout.jsx    # Main layout wrapper
│   ├── contexts/
│   │   └── AuthContext.jsx  # Authentication state management
│   ├── pages/            # All page components
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Custom styles and Bootstrap overrides
├── index.html            # HTML template with Bootstrap CDN
├── package.json          # Dependencies and scripts
└── vite.config.js        # Vite configuration
```

## 📦 Dependencies

### Core Dependencies
- **React 18.2.0** - UI library
- **React Router DOM 6.20.1** - Client-side routing
- **Bootstrap 5.3.2** - CSS framework
- **Vite 7.0.6** - Build tool

### Development Dependencies
- **@vitejs/plugin-react** - Vite React plugin
- **ESLint** - Code linting
- **TypeScript types** - Type definitions

## 🎨 Styling

### Bootstrap 5 Integration
- Bootstrap CSS and JS loaded via CDN
- Bootstrap Icons for consistent iconography
- Custom CSS variables for theme colors
- Responsive design with Bootstrap grid system

### Custom Styling
- Custom CSS variables for brand colors
- Bootstrap class overrides for consistent theming
- Custom utility classes for specific components
- Responsive design patterns

## 🔐 Authentication

### Features
- User registration and login
- Role-based access control (Customer, Vendor, Admin)
- Persistent authentication state
- Protected routes
- User profile management

### State Management
- React Context API for global state
- Local storage persistence
- User session management

## 📱 Pages & Features

### Public Pages
- **Home** (`/`) - Landing page with hero, features, testimonials
- **Welcome** (`/welcome`) - Extended welcome page with about section
- **Sign In** (`/auth/signin`) - User authentication
- **Sign Up** (`/auth/signup`) - User registration

### Protected Pages
- **Dashboard** (`/dashboard`) - User dashboard
- **Profile** (`/profile`) - User profile management
- **Search** (`/search`) - Product search and filtering
- **Cart** (`/cart`) - Shopping cart management
- **Checkout** (`/checkout`) - Order checkout process
- **Orders** (`/orders`) - Order history
- **Order Detail** (`/orders/:id`) - Individual order details

### Admin Pages
- **Admin Dashboard** (`/admin`) - Admin panel with user/product/order management

## 🛠️ Development

### Getting Started
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Vite Configuration
- React plugin enabled
- Development server on port 3000
- Auto-open browser on start
- Build output to `dist` directory

### Bootstrap Configuration
- Bootstrap 5.3.2 via CDN
- Bootstrap Icons 1.11.3
- Custom theme colors and overrides

## 📊 Component Architecture

### UI Components
- **Navigation** - Responsive navigation bar
- **HeroSection** - Landing page hero
- **FeatureCard** - Feature showcase cards
- **TestimonialCard** - Customer testimonials
- **StatsSection** - Statistics display
- **CTASection** - Call-to-action sections
- **Footer** - Site footer
- **Button** - Reusable button component

### Layout Components
- **Layout** - Main layout wrapper with navigation and footer
- **AuthProvider** - Authentication context provider

## 🎯 Key Features

### User Experience
- Responsive design for all screen sizes
- Intuitive navigation and user flow
- Consistent styling with Bootstrap 5
- Fast loading with Vite

### Functionality
- Complete e-commerce flow (search → cart → checkout → orders)
- User authentication and profile management
- Admin dashboard for site management
- Mock data for demonstration

### Performance
- Optimized bundle size
- Lazy loading where appropriate
- Efficient state management
- Fast development server

## 🔄 Migration Notes

### Preserved Elements
- All original component logic and functionality
- Data structures and mock data
- User flow and navigation patterns
- Business logic and features

### Changes Made
- Replaced Tailwind classes with Bootstrap equivalents
- Converted Next.js routing to React Router DOM
- Replaced Zustand with React Context API
- Removed Next.js specific features (SSR, API routes)
- Updated build and development tooling

## 🚀 Deployment

The application is ready for deployment to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Any static file server

## 📝 Notes

- All authentication is currently mock-based for demonstration
- Product data is static/mock data
- No backend API integration (frontend only)
- Ready for backend integration when needed

## 🤝 Contributing

This is a migrated application. For the original Next.js version, see the parent directory. 