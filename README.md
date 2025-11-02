# PCRS UI

## Overview
A modern, stylish React-based UI for the PCRS (Personal Computer Rental System) backend.

## Features

- 🔐 **Authentication**: Login and Signup pages with JWT token management
- 🎨 **Modern Design**: Built with Tailwind CSS for a beautiful, responsive interface
- 🛡️ **Roles Management**: Create, update, and delete user roles
- 📦 **Rental Items**: Manage rental inventory with images and descriptions
- 📊 **Dashboard**: Overview of system statistics and quick actions
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - API communication
- **Lucide React** - Icons
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Update API base URL in `src/services/api.ts` if your backend runs on a different port:
```typescript
const API_BASE_URL = 'http://localhost:9090';
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.tsx      # Main layout with sidebar
│   ├── ProtectedRoute.tsx
│   ├── RoleModal.tsx
│   └── RentalItemModal.tsx
├── context/            # React contexts
│   └── AuthContext.tsx # Authentication context
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── Roles.tsx
│   ├── RentalItems.tsx
│   └── Orders.tsx
├── services/           # API services
│   ├── api.ts
│   ├── authService.ts
│   ├── rolesService.ts
│   └── rentalItemsService.ts
└── types/              # TypeScript types
    └── index.ts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The UI integrates with the following backend endpoints:

- `/auth/login` - User authentication
- `/auth/signup` - User registration
- `/v1/hars/roles/**` - Role management
- `/v1/hars/rental/items/**` - Rental items management
- `/v1/hars/rental-orders/**` - Order management (coming soon)

## Features in Detail

### Authentication
- Secure login with email and password
- JWT token storage in localStorage
- Automatic token injection in API requests
- Protected routes that require authentication

### Roles Management
- View all roles in a table
- Create new roles with name and description
- Edit existing roles
- Delete roles with confirmation

### Rental Items
- Grid view of all rental items
- Create items with name, description, category, price, and location
- Edit existing items
- Delete items with confirmation
- Image placeholder support

### Dashboard
- Overview statistics cards
- Quick action links
- Recent activity feed (coming soon)

## Customization

### Styling
The UI uses Tailwind CSS. You can customize the theme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom primary colors
      },
    },
  },
},
```

### API Configuration
Update the base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://your-backend-url:port';
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
