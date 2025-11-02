import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { rolesService } from '../services/rolesService';
import type { Role } from '../types';
import { UserPlus, Mail, Lock, User, Phone, Shield, Eye, EyeOff } from 'lucide-react';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: '',
    company: '',
    roleId: '',
  });
  const [confirmError, setConfirmError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await rolesService.getAll();
        // Filter out "user" role (case-insensitive) - hide USER role
        const filteredRoles = data.filter(
          (role) => role.role_name?.toLowerCase() !== 'user'
        );
        setRoles(filteredRoles);
      } catch (err) {
        console.error('Failed to load roles:', err);
        setError('Failed to load roles. Please refresh the page.');
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear confirm password error while user types
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setConfirmError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setConfirmError('');

    if (!formData.roleId) {
      setError('Please select a role');
      return;
    }

    // Client-side password validation
    if (!formData.password || !formData.confirmPassword) {
      setConfirmError('Please enter and confirm your password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setConfirmError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const signupData = {
        ...formData,
        roles: { role_id: formData.roleId },
      };
  // Remove roleId and confirmPassword from the data before sending
  const { roleId, confirmPassword, ...userData } = signupData;
  await authService.signup(userData as any);
      navigate('/login');
    } catch (err: any) {
      // Normalize backend "user already exists" responses so we can show
      // a friendly, specific message on the signup form.
      const serverMessage = err?.response?.data?.message;
      const status = err?.response?.status;

      if (
        status === 409 ||
        /already exists|already registered|duplicate|user exists/i.test(serverMessage || '')
      ) {
        setError('An account with that email already exists. Please sign in or reset your password.');
      } else {
        setError(serverMessage || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="max-w-md w-full animate-fade-in-up">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-primary-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4 animate-scale-in hover:scale-110 transition-transform duration-300">
              <UserPlus className="w-8 h-8 text-white animate-slide-in" />
            </div>
            <h1 className="text-3xl font-bold text-primary-900 mb-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Create Account</h1>
            <p className="text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>Join PCRS today</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-scale-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div>
              <label className="label">
                <User className="inline w-4 h-4 mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">
                <Mail className="inline w-4 h-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">
                <Phone className="inline w-4 h-4 mr-2" />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">
                <Lock className="inline w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pr-10"
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">
                <Lock className="inline w-4 h-4 mr-2" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input pr-10"
                  required
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-900"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmError && (
                <p className="mt-1 text-xs text-red-600">{confirmError}</p>
              )}
            </div>

            <div>
              <label className="label">
                <Shield className="inline w-4 h-4 mr-2" />
                Role *
              </label>
              {loadingRoles ? (
                <div className="input flex items-center">
                  <span className="text-gray-500">Loading roles...</span>
                </div>
              ) : (
                <select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.role_name}
                      {role.description && ` - ${role.description}`}
                    </option>
                  ))}
                </select>
              )}
              {roles.length === 0 && !loadingRoles && (
                <p className="mt-1 text-xs text-yellow-600">
                  No roles available. Please contact administrator.
                </p>
              )}
            </div>

            <div>
              <label className="label">Company (Optional)</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Address (Optional)</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

