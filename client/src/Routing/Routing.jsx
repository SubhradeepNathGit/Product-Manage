import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import AddProduct from '../pages/AddProduct';
import EditProduct from '../pages/EditProduct';
import ProductDetail from '../pages/ProductDetail';
import Navbar from '../layout/Navbar';


const Routing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route
            path="*"
            element={
              <div className="text-center mt-20 text-red-500 text-xl">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </main>
    
    </div>
  );
};

export default Routing;
