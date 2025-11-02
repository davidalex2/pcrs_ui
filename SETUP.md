# PCRS UI Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   cd pcrs_ui
   npm install
   ```

2. **Configure API Endpoint**
   
   Edit `src/services/api.ts` and ensure the API_BASE_URL matches your backend:
   ```typescript
   const API_BASE_URL = 'http://localhost:9090';
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   
   Open your browser and navigate to: `http://localhost:5173`

## Default Credentials

After running the application, you can:
- Sign up for a new account
- Or use existing credentials if you have them

## Features

### ✅ Implemented
- User Authentication (Login/Signup)
- Dashboard with statistics
- Roles Management (CRUD operations)
- Rental Items Management (CRUD operations)
- Responsive design for mobile/tablet/desktop

### 🚧 Coming Soon
- Orders Management
- User Profile
- Image upload for rental items
- Advanced filtering and search

## Troubleshooting

### Backend Connection Issues
- Ensure your backend is running on port 9090
- Check CORS configuration in backend
- Verify API endpoints in browser Network tab

### Build Issues
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear Vite cache: `rm -rf node_modules/.vite`

## Development

The UI uses:
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Router** for navigation

All API calls are handled through service files in `src/services/`.

