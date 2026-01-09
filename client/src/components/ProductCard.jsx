import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const imageUrl = product.image && product.image.startsWith('http')
    ? product.image
    : 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative w-full h-40 xs:h-44 sm:h-48 md:h-56 bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />

        {/* Stock Badge */}
        <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2">
          <span
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] xs:text-xs font-semibold rounded-full ${product.inStock
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
              }`}
          >
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] xs:text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
              {product.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Product Name */}
        <h3 className="font-semibold text-lg sm:text-base md:text-xl mb-3 text-gray-700">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-xs sm:text-sm mb-3 ">
          {product.description}
        </p>

        {/* Footer */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0 ">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs text-gray-500">Price</span>
            <span className="font-bold text-base sm:text-lg md:text-xl text-blue-500">
              Rs.{Number(product.price).toFixed(2)}
            </span>
          </div>

          <Link
            to={`/product/${product._id}`}
            className="w-full h-10 xs:w-auto text-center mb-3 mt-3 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            See Product
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;