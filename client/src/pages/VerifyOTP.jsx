import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";

const VerifyOTP = () => {
    const { verifyOtp, resendOtp } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [timeLeft, setTimeLeft] = useState(179); // 1 minute
    const [canResend, setCanResend] = useState(false);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate("/register");
        }
    }, [email, navigate]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    // ✅ OTP Auto-submit when length becomes 6
    useEffect(() => {
        if (otp.length === 6) {
            handleVerify();
        }
    }, [otp]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`;
    };

    const handleVerify = async (e) => {
        if (e) e.preventDefault();
        if (verifying) return;

        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            setVerifying(true);
            await verifyOtp(email, otp);
            toast.success("Email verified! Please login.");
            navigate("/login");
        } catch (err) {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        try {
            await resendOtp(email);
            setTimeLeft(60);
            setCanResend(false);
        } catch (err) {
            // Error handled in context
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Verify OTP
                </h2>

                <div className="text-center mb-6">
                    <p className="text-gray-600">Enter the 6-digit OTP sent to</p>
                    <p className="font-semibold text-gray-800">{email}</p>
                </div>

                <form onSubmit={handleVerify}>
                    <div className="mb-6">
                        <label
                            htmlFor="otp"
                            className="block text-gray-700 font-bold mb-2"
                        >
                            Enter OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            maxLength="6"
                            autoFocus
                            disabled={verifying}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) =>
                                setOtp(e.target.value.replace(/\D/g, ""))
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={verifying}
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 disabled:opacity-60"
                    >
                        {verifying ? "Verifying..." : "Verify Email"}
                    </button>
                </form>

                <div className="text-center">
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            className="text-blue-500 hover:text-blue-700 font-semibold"
                        >
                            Resend OTP
                        </button>
                    ) : (
                        <p className="text-gray-500">
                            Resend OTP in{" "}
                            <span className="font-mono font-bold">
                                {formatTime(timeLeft)}
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
