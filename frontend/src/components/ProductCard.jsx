import { Link } from 'react-router-dom';
// ✅ timeAgo helper import kiya
import { timeAgo } from '../utils/timeAgo';

function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
    >
      {/* ✅ Responsive Image Wrapper Height */}
      <div className="relative w-full h-32 sm:h-40 md:h-48 bg-gray-100 overflow-hidden">
        <img
         src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.quantity <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-xs sm:text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* ✅ Responsive Padding and Text Sizes */}
      <div className="p-2.5 sm:p-4">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition">
          {product.name}
        </h3>

        {/* ✅ Updated Price Layout: Selling Price + Original M.R.P Price */}
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-base sm:text-xl font-bold text-indigo-600">₹{product.price}</p>
          {product.original_price && Number(product.original_price) > Number(product.price) && (
            <p className="text-xs sm:text-sm text-gray-400 line-through">₹{product.original_price}</p>
          )}
        </div>

        {/* ✅ Dynamic Discount Badge Calculator Block */}
        {product.original_price && Number(product.original_price) > Number(product.price) && (
          <p className="text-xs text-green-600 font-medium mt-0.5">
            {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% off
          </p>
        )}

        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {product.quantity > 0 ? `${product.quantity} available` : 'Unavailable'}
        </p>
        
        {/* ✅ Dynamic Timestamp Display */}
        <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
          {timeAgo(product.created_at)}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;