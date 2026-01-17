import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProductCard = ({ product, onRestore, onForceDelete }) => {
  const { user } = useContext(AuthContext);
  const isOwner = user && product.createdBy && (
    (user._id || user.id) === (product.createdBy._id || product.createdBy)
  );

  const imageUrl = product.image && product.image.startsWith('http')
    ? product.image
    : 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <div className="group bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex flex-col h-full relative hover:-translate-y-1">
      {/* Link wrapper for the whole card content (except actions) */}
      <Link to={!product.isDeleted ? `/product/${product._id}` : '#'} className="flex flex-col flex-1">

        {/* Image Container - White background, contained image */}
        <div className="relative w-full aspect-[4/3] p-6 bg-white flex items-center justify-center overflow-hidden border-b border-gray-50">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.category && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 uppercase tracking-wider">
                {product.category}
              </span>
            )}
            {!product.inStock && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 uppercase tracking-wider">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Title */}
          <h3 className="font-medium text-gray-900 text-sm sm:text-base leading-snug mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Description Snippet */}
          <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2 min-h-[2.5em]">
            {product.description}
          </p>

          {/* Price & Rating Placeholder */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-xs text-gray-500 font-medium">₹</span>
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Action Footer (Outside Link) */}
      <div className="px-4 pb-4 bg-white">
        {product.isDeleted ? (
          isOwner ? (
            <div className="flex gap-2 w-full">
              <button
                onClick={(e) => { e.preventDefault(); onRestore(product._id); }}
                className="flex-1 py-1.5 bg-green-50 text-green-700 rounded-md text-xs font-semibold hover:bg-green-100 transition-colors border border-green-200"
              >
                Restore
              </button>
              <button
                onClick={(e) => { e.preventDefault(); onForceDelete(product._id); }}
                className="flex-1 py-1.5 bg-red-50 text-red-700 rounded-md text-xs font-semibold hover:bg-red-100 transition-colors border border-red-200"
              >
                Delete
              </button>
            </div>
          ) : (
            <div className="w-full text-center py-1.5 bg-gray-50 text-gray-400 rounded-md text-xs font-semibold border border-gray-200">
              Item Unavailable
            </div>
          )
        ) : (
          <Link
            to={`/product/${product._id}`}
            className="block w-full text-center py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductCard;