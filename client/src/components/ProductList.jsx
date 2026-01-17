import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, onRestore, onForceDelete }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onRestore={onRestore}
          onForceDelete={onForceDelete}
        />
      ))}
    </div>
  );
};

export default ProductList;
