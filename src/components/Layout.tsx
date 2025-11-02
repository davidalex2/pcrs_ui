import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Shield,
  Package,
  ShoppingCart,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const Layout: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Roles', href: '/dashboard/roles', icon: Shield },
    { name: 'Rental Items', href: '/dashboard/rental-items', icon: Package },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Your Orders', href: '/dashboard/your-orders', icon: ShoppingCart },
  ];

  // (role check is done inline where needed)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-primary-900 bg-opacity-50 z-20 lg:hidden animate-fade-in-up"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-primary-100 shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 ease-in-out lg:translate-x-0 animate-slide-in`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-primary-100">
            <h1 className="text-2xl font-bold text-primary-600 animate-scale-in hover:scale-105 transition-transform duration-300">PCRS</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-primary-500 hover:text-primary-700 transition-colors duration-300"
            >
              <X className="w-6 h-6 hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation
              // Filter out the Roles link unless the user is an admin
              .filter((item) => item.name !== 'Roles' || (!!user?.roles?.role_name && user.roles.role_name.toLowerCase() === 'admin'))
              .map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-up group ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <Icon className="w-5 h-5 mr-3 group-hover:rotate-6 transition-transform duration-300" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-primary-100 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center mb-4 px-4 group">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 animate-scale-in" style={{ animationDelay: '0.9s' }}>
                <span className="text-primary-600 font-semibold group-hover:text-primary-700 transition-colors duration-300">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-primary-900 group-hover:text-primary-700 transition-colors duration-300">{user?.fullName || 'User'}</p>
                <p className="text-xs text-primary-500 group-hover:text-primary-600 transition-colors duration-300">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 transform hover:scale-105 group animate-fade-in-up"
              style={{ animationDelay: '1s' }}
            >
              <LogOut className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white border-b border-primary-100 h-16 flex items-center px-4 lg:px-6 shadow-sm animate-fade-in-up">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-primary-600 hover:text-primary-700 transition-colors duration-300"
          >
            <Menu className="w-6 h-6 hover:rotate-180 transition-transform duration-500" />
          </button>
          <div className="ml-4 lg:ml-0 animate-slide-in">
            <h2 className="text-xl font-semibold text-primary-900">
              {navigation.find((item) => item.href === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

