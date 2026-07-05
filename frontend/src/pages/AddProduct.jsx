import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../api/productApi';
import { getAllCategories } from '../api/categoryApi';

function AddProduct() {
  // ✅ State me original_price add kiya
  const [form, setForm] = useState({ name: '', description: '', price: '', original_price: '', quantity: '', category_id: '' });
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories(token);
        setCategories(data.categories || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      // ✅ FormData me original_price append kiya
      formData.append('original_price', form.original_price);
      formData.append('quantity', form.quantity);
      formData.append('category_id', form.category_id);
      if (image) formData.append('image', image);

      await addProduct(formData, token);
      navigate('/my-products');
    } catch (error) {
      const errMsg = error.response?.data?.errors
        ? error.response.data.errors.join(', ')
        : error.response?.data?.message || 'Failed to add product';
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Add New Product</h1>
        <p className="text-gray-500 mb-6 text-sm">List your item for others to buy</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Title</label>
            <input
              name="name" value={form.name} placeholder="Enter product title" onChange={handleChange} required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Category</label>
            <select
              name="category_id" value={form.category_id} onChange={handleChange} required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Description</label>
            <textarea
              name="description" value={form.description} placeholder="Describe your product..." rows="3" onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
            />
          </div>

          {/* ✅ Replaced Layout: Original Price and Selling Price row */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-sm text-gray-600 mb-1 block">Original Price (₹)</label>
              <input
                name="original_price" value={form.original_price} type="number" placeholder="Shop price (MRP)" onChange={handleChange} required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div className="w-1/2">
              <label className="text-sm text-gray-600 mb-1 block">Selling Price (₹)</label>
              <input
                name="price" value={form.price} type="number" placeholder="Your price" onChange={handleChange} required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* ✅ Quantity Field row wrapper separate */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Quantity</label>
            <input
              name="quantity" value={form.quantity} type="number" placeholder="Enter quantity" onChange={handleChange} required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Product Image</label>
            <label className="block border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-indigo-400 transition">
              {preview ? (
                <img src={preview} alt="Preview" className="h-32 mx-auto object-cover rounded-lg" />
              ) : (
                <span className="text-sm text-gray-500">Click to upload product image</span>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          {message && <p className="text-red-500 text-sm">{message}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;