import { useEffect, useState } from 'react';
import { getAllUsers, getAllProductsAdmin, deleteAnyProduct, deleteUser, toggleBlockUser } from '../api/adminApi';

function AdminDashboard() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, productsData] = await Promise.all([
        getAllUsers(token),
        getAllProductsAdmin(token)
      ]);
      setUsers(usersData.users || []);
      setProducts(productsData.products || []);
    } catch (error) {
      console.error("Dashboard data load karne me error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteAnyProduct(id, token);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user? Their products will also be removed.')) return;
    try {
      await deleteUser(id, token);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Added: Dynamic Block/Unblock toggle event handler function
  const handleToggleBlock = async (id) => {
    try {
      const data = await toggleBlockUser(id, token);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_blocked: data.is_blocked } : u))
      );
    } catch (error) {
      console.error("User status toggle error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>

        <div className="flex gap-4 mb-6 text-sm">
          <div className="bg-white px-4 py-3 rounded-xl border border-gray-100">
            <p className="text-gray-500">Total Users</p>
            <p className="text-xl font-bold text-indigo-600">{users.length}</p>
          </div>
          <div className="bg-white px-4 py-3 rounded-xl border border-gray-100">
            <p className="text-gray-500">Total Products</p>
            <p className="text-xl font-bold text-indigo-600">{products.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              tab === 'users' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setTab('products')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              tab === 'products' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            Products
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : tab === 'users' ? (
          /* ✅ Replaced Layout Block: Users Table with brand new Status Column & Layout */
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="hidden sm:grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <span>Name</span>
              <span>Email</span>
              <span>Phone</span>
              <span>Role</span>
              <span>Status</span>
              <span className="text-right">Action</span>
            </div>
            {users.map((u) => (
              <div
                key={u.id}
                className="flex flex-col sm:grid sm:grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] sm:items-center gap-2 sm:gap-4 px-6 py-3 border-t border-gray-100 text-sm"
              >
                <span className="font-medium text-gray-800">{u.name}</span>
                <span className="text-gray-600 truncate">{u.email}</span>
                <span className="text-gray-600">{u.phone}</span>
                <span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {u.role}
                  </span>
                </span>
                <span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    u.is_blocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {u.is_blocked ? 'Blocked' : 'Active'}
                  </span>
                </span>
                <div className="flex gap-2 sm:justify-end">
                  {u.role !== 'admin' && (
                    <>
                      <button
                        onClick={() => handleToggleBlock(u.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          u.is_blocked
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                        }`}
                      >
                        {u.is_blocked ? 'Unblock' : 'Block'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Products Table list */
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <span>Product</span>
              <span>Price</span>
              <span>Category</span>
              <span>Seller</span>
              <span className="text-right">Action</span>
            </div>
            {products.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] sm:items-center gap-2 sm:gap-4 px-6 py-3 border-t border-gray-100 text-sm"
              >
                <div className="flex items-center gap-3">
                  <img src={`http://localhost:5000${p.image_url}`} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  <span className="font-medium text-gray-800 truncate">{p.name}</span>
                </div>
                <span className="text-gray-700">₹{p.price}</span>
                <span className="text-gray-600">{p.category_name || '-'}</span>
                <span className="text-gray-600 truncate">{p.seller_name}</span>
                <div className="sm:text-right">
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;