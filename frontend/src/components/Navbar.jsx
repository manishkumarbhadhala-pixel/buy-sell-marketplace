import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutConfirmModal from './LogoutConfirmModal';

function Navbar({ search, setSearch }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ FIXED: confirmLogout function me modal close karne ka state logic sync kiya
  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowLogoutModal(false); // Modal state closed set ki
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
          <Link to="/" className="text-lg sm:text-xl font-bold text-indigo-600 whitespace-nowrap">
            🛍️ Buy & Sell
          </Link>

          {token && setSearch && (
            <div className="flex-1 max-w-md hidden sm:block">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          )}

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-6">
            {token ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium text-sm">Home</Link>
                <Link to="/my-products" className="text-gray-700 hover:text-indigo-600 font-medium text-sm">My Products</Link>
                
                {/* Admin Link for Desktop view (Conditional) */}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-indigo-600 font-medium text-sm">
                    Admin
                  </Link>
                )}

                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium text-sm">Login</Link>
                <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">Signup</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden text-gray-700 text-2xl"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="sm:hidden px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
            {token && setSearch && (
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            )}

            {token ? (
              <div className="flex flex-col gap-3">
                <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium text-sm">Home</Link>
                <Link to="/my-products" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium text-sm">My Products</Link>
                
                {/* Admin Link for Mobile Dropdown view (Conditional) */}
                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium text-sm">
                    Admin
                  </Link>
                )}

                <button
                  onClick={() => { setMenuOpen(false); setShowLogoutModal(true); }}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium text-sm">Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center">Signup</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {showLogoutModal && (
        <LogoutConfirmModal
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}

export default Navbar;