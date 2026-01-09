import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3006/api", // Connect to our server
    withCredentials: true, // If we were using cookies
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) throw new Error("No refresh token");

                const { data } = await axios.post("http://localhost:3006/api/auth/refresh", {
                    refreshToken
                });

                localStorage.setItem("accessToken", data.accessToken);
                if (data.refreshToken) {
                    localStorage.setItem("refreshToken", data.refreshToken);
                }

                api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                console.error("Token refresh failed", refreshError);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
