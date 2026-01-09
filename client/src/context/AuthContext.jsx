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
        const initAuth = async () => {
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;
                    if (decoded.exp < currentTime) {
                        // Token expired, try refresh or logout
                        // For simplicity, let's just logout if initially expired, 
                        // or rely on the axios interceptor to handle refresh
                        await logout(); // Or try refresh here
                    } else {
                        // Fetch user profile if needed, or just decode
                        // For now, let's fetch profile to be sure
                        const { data } = await api.get("/auth/me");
                        setUser(data.data);
                    }
                } catch (error) {
                    console.error("Auth init error", error);
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
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

    const register = async (name, email, password) => {
        try {
            const response = await api.post("/auth/register", { name, email, password });
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            throw error;
        }
    };

    const logout = async () => {
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
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
