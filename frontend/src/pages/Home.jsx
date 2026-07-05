import { useEffect, useState } from 'react';
import { getAllProducts } from '../api/productApi';
import { getAllCategories } from '../api/categoryApi';
import ProductCard from '../components/ProductCard';

function Home({ search }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeCategoryName, setActiveCategoryName] = useState('All Products');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories(token);
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Categories load karne me dikkat aayi:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getAllProducts(token, activeCategory, search);
        setProducts(data.products || []);
      } catch (error) {
        console.error("Products load karne me dikkat aayi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, search]);

  // Sorting Logic: Categories alphabetical rahengi aur 'Others' hamesha end me aayega
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.name === 'Others') return 1;
    if (b.name === 'Others') return -1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-56 bg-white border-b md:border-b-0 md:border-r border-gray-100 px-4 py-6">
        <h2 className="font-semibold text-gray-800 mb-3 px-2">Categories</h2>
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          
          <button
            onClick={() => {
              setActiveCategory(null);
              setActiveCategoryName('All Products');
            }}
            className={`text-left px-3 py-2 rounded-lg text-sm whitespace-nowrap transition ${
              !activeCategory ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All
          </button>

          {sortedCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setActiveCategoryName(cat.name);
              }}
              className={`text-left px-3 py-2 rounded-lg text-sm whitespace-nowrap transition ${
                activeCategory === cat.id ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          {/* ✅ Heading Updated to be fully responsive for mobile screens */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{activeCategoryName}</h1>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;