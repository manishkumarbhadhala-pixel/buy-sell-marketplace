import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../api/authApi';

function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await signupUser(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      const errMsg = error.response?.data?.errors
        ? error.response.data.errors.join(', ')
        : error.response?.data?.message || 'Signup failed';
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 bg-gray-50 order-2 md:order-1">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Sign Up</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" placeholder="Full Name" onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            <input name="email" type="email" placeholder="Email" onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            <input name="password" type="password" placeholder="Password" onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            <input name="phone" placeholder="Phone number" onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            {message && <p className="text-red-500 text-sm">{message}</p>}
            {success && <p className="text-green-600 text-sm">Account created! Redirecting...</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50">
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-6 text-center">
            Already have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>

      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-700 to-indigo-600 text-white flex-col justify-center px-16 order-1 md:order-2">
        <h2 className="text-3xl font-bold mb-3">Join Our Community!</h2>
        <p className="text-indigo-100">Create an account and start exploring great deals.</p>
      </div>
    </div>
  );
}

export default Signup;