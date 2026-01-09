import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import productApi from '../api/productApi';
import ProductList from '../components/ProductList';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import Sidebar from '../components/Sidebar';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = { page, limit: 12 };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (category) params.category = category;

      const response = await productApi.getAllProducts(params);

      setProducts(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, category]);

  useEffect(() => {
    if (page !== 1) setPage(1);
  }, [searchTerm, category]);

  const handleSearch = (term) => setSearchTerm(term);
  const handleCategoryChange = (cat) => setCategory(cat);

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategory('');
    setPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <Sidebar
        selectedCategory={category}
        onCategoryChange={handleCategoryChange}
      />

      {/* Main Content */}
      <div className="w-full lg:ml-64 flex-1">
        <div className="pt-16 lg:pt-0">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-10">

            {/* Header */}
            <div className="mb-6 sm:mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  See All Products
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                  Browse our collection of products
                </p>
              </div>

              <button
                onClick={() => navigate('/add-product')}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </div>

            {/* Search + Filters Section */}
            <div className="bg-transparent rounded-lg -mt-5 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">

              {/* Search + Clear + Filters Row */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6">

                {/* Left: Search Bar */}
                <div className="flex-1">
                  <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={handleSearch}
                  />
                </div>

                {/* Right: Clear Filters button */}
                <div className="flex justify-end md:justify-start">
                  {(searchTerm || category) && (
                    <button
                      onClick={handleClearFilters}
                      className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs sm:text-sm md:text-base"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Active Filters */}
              {(searchTerm || category) && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Active Filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm">
                        Search: "{searchTerm.length > 20 ? searchTerm.substring(0, 20) + '...' : searchTerm}"
                      </span>
                    )}
                    {category && (
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm capitalize">
                        Category: {category}
                      </span>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 text-sm sm:text-base">Loading products...</p>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 sm:mb-6">
                <p className="text-red-800 text-center text-sm sm:text-base">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="mt-3 mx-auto block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Product List */}
            {!loading && !error && (
              <>
                {products.length > 0 ? (
                  <>
                    <ProductList products={products} />

                    {totalPages > 1 && (
                      <Pagination
                        page={page}
                        setPage={setPage}
                        totalPages={totalPages}
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 sm:py-16 md:py-20 px-4">
                    <div className="mb-4">
                      <svg
                        className="mx-auto h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                      No products found
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 max-w-md mx-auto">
                      {searchTerm || category
                        ? 'Try adjusting your filters to find what you\'re looking for'
                        : 'Start by adding your first product to the catalog'}
                    </p>

                    {!searchTerm && !category && (
                      <button
                        onClick={() => navigate('/add-product')}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                      >
                        Add Your First Product
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
