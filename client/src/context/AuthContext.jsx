import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // We will replace this with our custom axios instance later
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import api from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthError = () => {
            logout();
        };

        window.addEventListener("auth-error", handleAuthError);

        const initAuth = async () => {
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    // Even if token is expired, the axios interceptor might refresh it on the first call.
                    // But for initialization, if it's expired, we might want to try a silent refresh or just let the first API call handle it.
                    // To be safe, if we have a token, we try to get 'me'.
                    const { data } = await api.get("/auth/me");
                    setUser(data.data);
                } catch (error) {
                    console.error("Auth init error", error);
                    // If /auth/me fails, interceptor should have tried refresh. 
                    // If it still fails, it will dispatch "auth-error" which calls logout().
                }
            }
            setLoading(false);
        };

        initAuth();

        return () => {
            window.removeEventListener("auth-error", handleAuthError);
        };
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            const { accessToken, refreshToken, user } = response.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            setToken(accessToken);
            setUser(user);
            toast.success("Login successful!");
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            throw error;
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const response = await api.post("/auth/register", { name, email, password, role });
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            throw error;
        }
    };

    const rolesPermissions = {
        admin: ["create_product", "read_product", "update_product", "delete_product"],
        manager: ["create_product", "read_product", "update_product"],
        employee: ["create_product", "read_product"]
    };

    const hasPermission = (permission) => {
        if (!user) return false;
        const userRole = (user.role || "admin").toLowerCase();
        const permissions = rolesPermissions[userRole] || [];
        return permissions.includes(permission);
    };

    const verifyOtp = async (email, otp) => {
        try {
            const response = await api.post("/auth/verify-email", { email, otp });
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
            throw error;
        }
    };

    const resendOtp = async (email) => {
        try {
            const response = await api.post("/auth/resend-otp", { email });
            toast.success("OTP resent successfully");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Resend failed");
            throw error;
        }
    };

    const forgotPassword = async (email) => {
        try {
            const response = await api.post("/auth/forgotpassword", { email });
            toast.success("Password reset email sent!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send email");
            throw error;
        }
    };

    const resetPassword = async (token, password) => {
        try {
            const response = await api.put(`/auth/resetpassword/${token}`, { password });
            const { accessToken, refreshToken, user } = response.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            setToken(accessToken);
            setUser(user);

            toast.success("Password reset successful! Logging in...");
            navigate("/");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Password reset failed");
            throw error;
        }
    };

    const logout = async () => {
        // Prevent multiple toasts/actions if already logged out (e.g. multiple failed requests triggering 401)
        const isSessionActive = !!localStorage.getItem("accessToken");

        if (!isSessionActive) {
            // Already logged out, ensure state is clear but don't toast
            setToken("");
            setUser(null);
            navigate("/login");
            return;
        }

        try {
            await api.get("/auth/logout");
        } catch (e) {
            console.log("Logout api error", e);
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setToken("");
        setUser(null);
        navigate("/login");
        toast.info("Logged out");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, hasPermission, verifyOtp, resendOtp, forgotPassword, resetPassword, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
