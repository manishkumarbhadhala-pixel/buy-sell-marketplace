import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyProducts, deleteProduct } from '../api/productApi';

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    try {
      const data = await getMyProducts(token);
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id, token);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
          <Link
            to="/add-product"
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition text-sm"
          >
            + Add Product
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-lg">You haven't listed any products yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Table header - hidden on mobile */}
            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span className="text-right">Actions</span>
            </div>

            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr] sm:items-center gap-3 sm:gap-4 px-6 py-4 border-t border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`http://localhost:5000${product.image_url}`}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <span className="font-medium text-gray-800 truncate">{product.name}</span>
                </div>
                <span className="text-gray-700 font-medium">₹{product.price}</span>
                <span className="text-gray-500 text-sm">{product.quantity} in stock</span>
                <div className="flex gap-2 sm:justify-end">
                  <Link
                    to={`/edit-product/${product.id}`}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
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

export default MyProducts;