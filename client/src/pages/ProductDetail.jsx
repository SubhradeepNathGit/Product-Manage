import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productApi from '../api/productApi';
import AuthContext from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasPermission } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProductDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productApi.getProductById(id);
      setProduct(data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.response?.data?.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      setDeleting(true);
      await productApi.restoreProduct(id);
      alert('Product restored successfully!');
      navigate('/');
    } catch (err) {
      console.error('Error restoring product:', err);
      alert(err.response?.data?.message || '❌ Failed to restore product');
    } finally {
      setDeleting(false);
    }
  };

  // Soft Delete (Move to Trash)
  const handleSoftDelete = async () => {
    if (!window.confirm('Are you sure you want to move this product to trash?')) {
      return;
    }

    try {
      setDeleting(true);
      await productApi.deleteProduct(id);
      alert('Product moved to trash!');
      navigate('/');
    } catch (err) {
      console.error('Error soft deleting product:', err);
      alert(err.response?.data?.message || '❌ Failed to move to trash');
    } finally {
      setDeleting(false);
    }
  };

  // Force Delete (Permanent)
  const handleForceDelete = async () => {
    if (!window.confirm('Are you sure you want to PERMANENTLY delete this product? This acton cannot be undone!')) {
      return;
    }

    try {
      setDeleting(true);
      await productApi.forceDeleteProduct(id);
      alert('Product permanently deleted!');
      navigate('/');
    } catch (err) {
      console.error('Error force deleting product:', err);
      alert(err.response?.data?.message || '❌ Failed to permanently delete product');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error || 'Product not found'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = product.image && product.image.startsWith('http')
    ? product.image
    : 'https://via.placeholder.com/600x600?text=No+Image';

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-6"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </button>

        {/* Product Detail Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image Section */}
            <div className="relative">
              <div className="aspect-square w-full bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                  }}
                />
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${product.inStock
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}
                >
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                {product.category && (
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                    {product.category}
                  </span>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col">
              <div className="flex-1">
                {/* Product Name */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-sm text-gray-600 block mb-1">Price</span>
                  <span className="text-4xl font-bold text-blue-600">
                    Rs. {Number(product.price).toFixed(2)}
                  </span>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Product Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Product Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-gray-800 capitalize">
                        {product.category || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock Status:</span>
                      <span
                        className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'
                          }`}
                      >
                        {product.inStock ? 'Available' : 'Out of Stock'}
                      </span>
                    </div>
                    {product.createdAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Added:</span>
                        <span className="font-medium text-gray-800">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                {hasPermission('update_product') && (
                  <button
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Edit Product
                  </button>
                )}

                {hasPermission('delete_product') && (
                  <>
                    {!product.isDeleted ? (
                      <button
                        onClick={handleSoftDelete}
                        disabled={deleting}
                        className="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleting ? 'Processing...' : 'Move to Trash'}
                      </button>
                    ) : (
                      <button
                        onClick={handleRestore}
                        disabled={deleting}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleting ? 'Processing...' : 'Restore'}
                      </button>
                    )}

                    <button
                      onClick={handleForceDelete}
                      disabled={deleting}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting ? 'Processing...' : 'Delete'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ProductDetail;