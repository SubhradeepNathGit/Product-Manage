import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyOTP from "../pages/VerifyOTP";
import ForgotPassword from "../pages/ForgotPassword";
import EmailSent from "../pages/EmailSent";
import ResetPassword from "../pages/ResetPassword";
import Profile from "../pages/Profile";
import Home from "../pages/Home";
import AddProduct from "../pages/AddProduct";
import EditProduct from "../pages/EditProduct";
import ProductDetail from "../pages/ProductDetail";
import EmployeeManagement from "../pages/EmployeeManagement";

// Components
import PrivateRoute from "../components/PrivateRoute";

const Routing = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/email-sent" element={<EmailSent />} />
            <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

            {/* Main Product Listing Page */}
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/product-listing" element={<PrivateRoute><Home /></PrivateRoute>} />

            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/employees" element={<PrivateRoute><EmployeeManagement /></PrivateRoute>} />
            <Route path="/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
            <Route path="/edit-product/:id" element={<PrivateRoute><EditProduct /></PrivateRoute>} />
            <Route path="/product/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />

            {/* 404 Route */}
            <Route
                path="*"
                element={
                    <div className="text-center mt-20 text-red-500 text-xl font-bold">
                        404 - Page Not Found
                    </div>
                }
            />
        </Routes>
    );
};

export default Routing;
