import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Shield, ShoppingCart, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = !!user?.roles?.role_name && user.roles.role_name.toLowerCase() === 'admin';
  const stats = [
    {
      name: 'Total Roles',
      value: '0',
      icon: Shield,
      color: 'bg-primary-600',
      href: '/dashboard/roles',
    },
    {
      name: 'Rental Items',
      value: '0',
      icon: Package,
      color: 'bg-primary-500',
      href: '/dashboard/rental-items',
    },
    {
      name: 'Orders',
      value: '0',
      icon: ShoppingCart,
      color: 'bg-primary-700',
      href: '/dashboard/orders',
    },
    {
      name: 'Users',
      value: '0',
      icon: Users,
      color: 'bg-primary-800',
      href: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-primary-900 mb-2 animate-slide-in">Dashboard</h1>
          <p className="text-gray-600 text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Welcome to PCRS Management System</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            // Hide the Roles card if not admin
            if (stat.href === '/dashboard/roles' && !isAdmin) return null;
            const Icon = stat.icon;
            return (
              <Link
                key={stat.name}
                to={stat.href}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between group">
                  <div>
                    <p className="text-sm font-medium text-primary-600 mb-1 transition-all duration-200 group-hover:text-primary-700">{stat.name}</p>
                    <p className="text-3xl font-bold text-primary-900 transition-all duration-200 group-hover:scale-105">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-4 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="w-8 h-8 text-white animate-pulse-soft" />
                  </div>
                </div>
              </Link>
            );
          })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold text-primary-900 mb-4 animate-slide-in" style={{ animationDelay: '0.5s' }}>Quick Actions</h2>
          <div className="space-y-3">
            {isAdmin && (
              <Link
                to="/dashboard/roles"
                className="block p-6 bg-primary-50 rounded-xl hover:bg-primary-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md border border-primary-100 animate-scale-in group"
                style={{ animationDelay: '0.6s' }}
              >
                <div className="flex items-center">
                  <Shield className="w-8 h-8 text-primary-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-primary-900">Manage Roles</h3>
                    <p className="text-sm text-primary-600">View and manage user roles</p>
                  </div>
                </div>
              </Link>
            )}
            <Link
              to="/dashboard/rental-items"
              className="block p-6 bg-primary-50 rounded-xl hover:bg-primary-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md border border-primary-100 animate-scale-in group"
              style={{ animationDelay: '0.7s' }}
            >
              <div className="flex items-center">
                <Package className="w-8 h-8 text-primary-600 mr-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <div>
                  <h3 className="font-semibold text-primary-900 transition-colors duration-200 group-hover:text-primary-700">Manage Rental Items</h3>
                  <p className="text-sm text-primary-600 transition-colors duration-200 group-hover:text-primary-500">Add and manage rental inventory</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <h2 className="text-2xl font-bold text-primary-900 mb-4 animate-slide-in" style={{ animationDelay: '0.9s' }}>Recent Activity</h2>
          <div className="flex items-center justify-center h-40 bg-primary-50 rounded-xl border border-primary-100 animate-scale-in hover:bg-primary-100 transition-all duration-300" style={{ animationDelay: '1s' }}>
            <p className="text-primary-600 text-sm animate-pulse-soft">No recent activity to display</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;

