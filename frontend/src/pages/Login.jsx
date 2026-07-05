import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const data = await loginUser(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.errors?.[0] || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left illustration panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex-col justify-center px-16">
        <h2 className="text-3xl font-bold mb-3">Welcome Back!</h2>
        <p className="text-indigo-100">Login to continue buying and selling amazing things.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 bg-gray-50">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email" type="email" placeholder="Email" onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <input
              name="password" type="password" placeholder="Password" onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            {message && <p className="text-red-500 text-sm">{message}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-6 text-center">
            Don't have an account? <Link to="/signup" className="text-indigo-600 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;