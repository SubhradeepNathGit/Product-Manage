import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import AuthContext from "../context/AuthContext";

const EmailSent = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { forgotPassword } = useContext(AuthContext);
    const [sending, setSending] = useState(false);
    const email = state?.email;

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    const handleResend = async () => {
        if (sending || !email) return;
        setSending(true);
        try {
            await forgotPassword(email);
            // toast is already handled in context
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100 text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <MailCheck className="w-12 h-12 text-blue-600" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">Check Your Email</h2>
                <p className="text-gray-600 mb-8">
                    We've sent a password reset link to <span className="font-semibold">{email}</span>. Please check your inbox and click the link to reset your password.
                </p>

                <div className="space-y-4">
                    <Link
                        to="/login"
                        className="block w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Login
                    </Link>
                    <p className="text-sm text-gray-500">
                        Didn't receive the email?{" "}
                        <button
                            onClick={handleResend}
                            disabled={sending}
                            className="text-blue-600 cursor-pointer hover:underline bg-transparent border-none p-0 focus:outline-none disabled:opacity-50"
                        >
                            {sending ? "Resending..." : "Resend"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmailSent;
