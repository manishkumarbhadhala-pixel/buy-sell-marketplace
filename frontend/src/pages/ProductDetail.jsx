import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../api/productApi';
import { timeAgo } from '../utils/timeAgo';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductById(id, token);
        setProduct(data.product);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  if (!product) return <p className="text-center mt-20 text-gray-500">Product not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          {product.category_name && <> / {product.category_name}</>} / {product.name}
        </p>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden md:flex">
          {/* Responsive Image Width & Heights */}
          <div className="md:w-1/2 bg-gray-100">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-64 sm:h-80 md:h-full object-cover md:max-h-[420px]"
            />
          </div>

          {/* Responsive Padding */}
          <div className="md:w-1/2 p-5 sm:p-8 flex flex-col">
            {/* Responsive Text Sizes */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{product.name}</h1>
            
            {/* ✅ Updated Price Block with Flex Row Layout */}
            <div className="flex items-baseline gap-3 mt-3">
              <p className="text-2xl sm:text-3xl font-bold text-indigo-600">₹{product.price}</p>
              {product.original_price && Number(product.original_price) > Number(product.price) && (
                <p className="text-lg text-gray-400 line-through">₹{product.original_price}</p>
              )}
            </div>

            {/* ✅ Dynamic Discount Percentage Logic Block */}
            {product.original_price && Number(product.original_price) > Number(product.price) && (
              <p className="text-sm text-green-600 font-medium mt-1">
                {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% off from original price
              </p>
            )}

            <div className="mt-2">
              <span
                className={`inline-block w-fit px-3 py-1 rounded-full text-sm font-medium ${
                  product.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Timestamp Display */}
            <p className="text-xs text-gray-400 mt-3">
              Posted {timeAgo(product.created_at)}
            </p>

            <p className="text-gray-600 mt-4 leading-relaxed text-sm sm:text-base">
              {product.description || 'No description provided.'}
            </p>

            <div className="mt-auto pt-6 border-t border-gray-100 mt-6">
              <p className="text-sm text-gray-500 mb-2">Seller Information</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                  {product.seller_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">{product.seller_name}</p>
                  <p className="text-gray-600 text-xs sm:text-sm">📞 {product.seller_phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;