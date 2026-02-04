import React, { useState, useRef, useEffect, useContext } from "react";
import {
    X,
    Camera,
    Package,
    User,
    Mail,
    Save,
    Loader,
    ChevronRight,
    Lock,
    Eye,
    EyeOff
} from "lucide-react";
import AuthContext from "../context/AuthContext";
import productApi from "../api/productApi";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import ProductCard from "./ProductCard";

const ProfileModal = ({ isOpen, onClose }) => {
    const { user, updatePassword } = useContext(AuthContext);

    const [activeTab, setActiveTab] = useState("info");
    const [userProducts, setUserProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user?.name || "");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Change Password State
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const fileInputRef = useRef(null);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (passwordData.new !== passwordData.confirm) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwordData.new.length < 6) {
            toast.error("New password must be at least 6 characters long");
            return;
        }

        try {
            setIsUpdatingPassword(true);
            await updatePassword(passwordData.current, passwordData.new);
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (error) {
            // Error handled in context or toast
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    useEffect(() => {
        if (isOpen && user) {
            setEditName(user.name);
            if (activeTab === "products") {
                fetchUserProducts();
            }
        }
    }, [isOpen, activeTab, user]);

    const fetchUserProducts = async () => {
        try {
            setLoadingProducts(true);
            const res = await productApi.getAllProducts({
                userId: user.id || user._id,
                limit: 100,
            });
            setUserProducts(res?.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load your products");
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = async () => {
        if (!editName.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        try {
            setIsSaving(true);
            const formData = new FormData();
            formData.append("name", editName.trim());
            if (selectedFile) {
                formData.append("profileImage", selectedFile);
            }

            const res = await api.put("/users/profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.success) {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
                setSelectedFile(null);
                setPreviewUrl(null);
                setTimeout(() => window.location.reload(), 1000);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    const profileImageUrl =
        previewUrl ||
        (user?.profileImage && user.profileImage !== "no-photo.jpg"
            ? user.profileImage.startsWith("http")
                ? user.profileImage
                : `http://localhost:3006/uploads/${user.profileImage}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "User"
            )}&background=3b82f6&color=fff&size=200`);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] min-h-[500px]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
                            <p className="text-sm text-gray-500">
                                Manage your account settings
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/80 rounded-xl transition-all group"
                    >
                        <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700 group-hover:rotate-90 transition-all" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 bg-gray-50/80 border-r border-gray-100 p-4 space-y-2 shrink-0">
                        <button
                            onClick={() => setActiveTab("info")}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${activeTab === "info"
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                : "text-gray-700 hover:bg-white hover:shadow-sm"
                                }`}
                        >
                            <User className="w-5 h-5" />
                            <span className="flex-1 text-left">Personal Info</span>
                            {activeTab === "info" && (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab("products")}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${activeTab === "products"
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                : "text-gray-700 hover:bg-white hover:shadow-sm"
                                }`}
                        >
                            <Package className="w-5 h-5" />
                            <span className="flex-1 text-left">My Products</span>
                            {activeTab === "products" && (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </button>

                        {user?.role === 'employee' && (
                            <button
                                onClick={() => setActiveTab("security")}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${activeTab === "security"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                    : "text-gray-700 hover:bg-white hover:shadow-sm"
                                    }`}
                            >
                                <Lock className="w-5 h-5" />
                                <span className="flex-1 text-left">Security</span>
                                {activeTab === "security" && (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </button>
                        )}
                    </div>


                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto bg-gray-50/30">
                        {/* Personal Info */}
                        {activeTab === "info" && (
                            <div className="p-6 md:p-8">
                                <div className="max-w-2xl mx-auto space-y-6">
                                    <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
                                        <div className="relative group mb-4">
                                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white ring-4 ring-blue-50 shadow-sm">
                                                <img
                                                    src={profileImageUrl}
                                                    alt={user?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {isEditing && (
                                                <button
                                                    onClick={() => fileInputRef.current.click()}
                                                    className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-xl shadow-lg"
                                                >
                                                    <Camera className="w-5 h-5" />
                                                </button>
                                            )}

                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                hidden
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </div>

                                        {!isEditing ? (
                                            <>
                                                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                                    {user?.name}
                                                </h3>
                                                <p className="text-gray-500 flex items-center justify-center gap-2 mb-6">
                                                    <Mail className="w-4 h-4" />
                                                    {user?.email}
                                                </p>
                                                <div className="flex flex-col gap-2 w-full max-w-xs mx-auto">
                                                    <button
                                                        onClick={() => setIsEditing(true)}
                                                        className="w-full px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                                                    >
                                                        Edit Profile
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full space-y-6 bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 rounded-2xl">
                                                <input
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                    placeholder="Enter your name"
                                                />

                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setIsEditing(false);
                                                            setEditName(user?.name);
                                                            setSelectedFile(null);
                                                            setPreviewUrl(null);
                                                        }}
                                                        className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium"
                                                    >
                                                        Cancel
                                                    </button>

                                                    <button
                                                        onClick={handleSaveProfile}
                                                        disabled={isSaving}
                                                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-blue-700 disabled:opacity-70"
                                                    >
                                                        {isSaving ? (
                                                            <Loader className="animate-spin w-5 h-5" />
                                                        ) : (
                                                            <Save className="w-5 h-5" />
                                                        )}
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Products */}
                        {activeTab === "products" && (
                            <div className="p-6 md:p-8">
                                {loadingProducts ? (
                                    <div className="flex justify-center py-20">
                                        <Loader className="animate-spin w-8 h-8 text-blue-600" />
                                    </div>
                                ) : userProducts.length ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                        {userProducts.map((product) => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                        <Package className="w-16 h-16 text-gray-200 mb-4" />
                                        <p>No products added yet</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Security */}
                        {activeTab === "security" && (
                            <div className="p-6 md:p-8">
                                <div className="max-w-md mx-auto">
                                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <Lock className="w-5 h-5 text-blue-600" />
                                            Change Password
                                        </h3>

                                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Current Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        required
                                                        value={passwordData.current}
                                                        onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-11"
                                                        placeholder="••••••••"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showNewPassword ? "text" : "password"}
                                                        required
                                                        value={passwordData.new}
                                                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-11"
                                                        placeholder="••••••••"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Must be at least 6 characters long
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Confirm New Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        required
                                                        value={passwordData.confirm}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-11"
                                                        placeholder="••••••••"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={isUpdatingPassword}
                                                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-70"
                                                >
                                                    {isUpdatingPassword ? (
                                                        <>
                                                            <Loader className="animate-spin w-5 h-5" />
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        'Update Password'
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
