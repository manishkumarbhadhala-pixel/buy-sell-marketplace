import { useEffect, useState } from 'react';
import { getAllUsers, getAllProductsAdmin, deleteAnyProduct, deleteUser, toggleBlockUser } from '../api/adminApi';
// ✅ Updated Imports: Added updateCategory
import { getAllCategories, addCategory, deleteCategory, updateCategory } from '../api/categoryApi';

function AdminDashboard() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryMessage, setCategoryMessage] = useState('');

  // ✅ Added states for inline category editing
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, productsData, categoriesData] = await Promise.all([
        getAllUsers(token),
        getAllProductsAdmin(token),
        getAllCategories(token)
      ]);
      setUsers(usersData.users || []);
      setProducts(productsData.products || []);
      setCategories(categoriesData.categories || []);
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

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setCategoryMessage('');
    try {
      await addCategory(newCategoryName, token);
      setNewCategoryName('');
      fetchData();
    } catch (error) {
      setCategoryMessage(error.response?.data?.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category? Products using it will lose their category link.')) return;
    try {
      await deleteCategory(id, token);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to delete category');
    }
  };

  // ✅ Added: Handler to trigger Edit mode with existing values
  const handleEditClick = (cat) => {
    setEditingCategoryId(cat.id);
    setEditingCategoryName(cat.name);
  };

  // ✅ Added: Handler to submit the updated category name to backend
  const handleUpdateCategory = async (id) => {
    try {
      await updateCategory(id, editingCategoryName, token);
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: editingCategoryName } : c))
      );
      setEditingCategoryId(null); // Close editing mode
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update category');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>

        {/* Stats Section */}
        <div className="flex gap-4 mb-6 text-sm">
          <div className="bg-white px-4 py-3 rounded-xl border border-gray-100">
            <p className="text-gray-500">Total Users</p>
            <p className="text-xl font-bold text-indigo-600">{users.length}</p>
          </div>
          <div className="bg-white px-4 py-3 rounded-xl border border-gray-100">
            <p className="text-gray-500">Total Products</p>
            <p className="text-xl font-bold text-indigo-600">{products.length}</p>
          </div>
          <div className="bg-white px-4 py-3 rounded-xl border border-gray-100">
            <p className="text-gray-500">Total Categories</p>
            <p className="text-xl font-bold text-indigo-600">{categories.length}</p>
          </div>
        </div>

        {/* Tabs Menu */}
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
          <button
            onClick={() => setTab('categories')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              tab === 'categories' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            Categories
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : tab === 'users' ? (
          /* Users Table */
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
        ) : tab === 'products' ? (
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
                 <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
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
        ) : (
          /* Categories Management Tab */
          <div>
            {/* Add category form */}
            <form onSubmit={handleAddCategory} className="flex gap-3 mb-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                required
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Add
              </button>
            </form>

            {categoryMessage && <p className="text-red-500 text-sm mb-4">{categoryMessage}</p>}

            {/* ✅ Updated Categories list view table component supporting Inline Edit Mode */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="hidden sm:grid grid-cols-[3fr_1fr] gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <span>Name</span>
                <span className="text-right">Action</span>
              </div>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex justify-between items-center px-6 py-3 border-t border-gray-100 text-sm gap-3"
                >
                  {editingCategoryId === cat.id ? (
                    <input
                      type="text"
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      autoFocus
                    />
                  ) : (
                    <span className="font-medium text-gray-800">{cat.name}</span>
                  )}

                  <div className="flex gap-2">
                    {editingCategoryId === cat.id ? (
                      <>
                        <button
                          onClick={() => handleUpdateCategory(cat.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-600 hover:bg-green-100 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCategoryId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(cat)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
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
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;