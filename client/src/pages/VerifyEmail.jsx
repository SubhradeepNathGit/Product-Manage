import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axiosInstance";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("");
    const processed = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No verification token provided.");
            return;
        }

        if (processed.current) return;
        processed.current = true;

        const verify = async () => {
            try {
                const res = await api.post("/auth/verify-email", { token });
                setStatus("success");
                setMessage(res.data.data);
            } catch (err) {
                setStatus("error");
                setMessage(err.response?.data?.message || "Verification failed");
            }
        };

        verify();
    }, [token]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md text-center">
                {status === "verifying" && (
                    <>
                        <h2 className="text-2xl font-bold text-blue-600">Verifying...</h2>
                        <p className="text-gray-700">Please wait while we verify your email.</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <h2 className="text-2xl font-bold text-green-600">Verified!</h2>
                        <p className="text-gray-700">{message}</p>
                        <Link to="/login" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Login Now
                        </Link>
                    </>
                )}
                {status === "error" && (
                    <>
                        <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
                        <p className="text-gray-700">{message}</p>
                        <Link to="/login" className="inline-block mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                            Back to Login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
