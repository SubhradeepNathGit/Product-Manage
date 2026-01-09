import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";

const ProductList = () => {
    const { user, logout } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");

    const [showDeleted, setShowDeleted] = useState(false);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get(`/products?page=${page}&limit=5&search=${search}&isDeleted=${showDeleted}`);
            setProducts(data.data.products);
            setTotalPages(data.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, search, showDeleted]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to move this to trash?")) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success("Product moved to trash");
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.error || "Delete failed");
        }
    };

    const handleForceDelete = async (id) => {
        if (!window.confirm("Are you sure? This cannot be undone!")) return;
        try {
            await api.delete(`/products/${id}/force`);
            toast.success("Product permanently deleted");
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.error || "Delete failed");
        }
    };

    const handleRestore = async (id) => {
        try {
            await api.put(`/products/${id}/restore`);
            toast.success("Product restored");
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.error || "Restore failed");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Product Manager</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Welcome, {user?.name}</span>
                        <Link to="/profile" className="text-blue-600 hover:text-blue-800">Profile</Link>
                        <button onClick={logout} className="text-red-600 hover:text-red-800">Logout</button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-4 items-center">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            onClick={() => {
                                setShowDeleted(!showDeleted);
                                setPage(1);
                            }}
                            className={`px-4 py-2 rounded-lg border ${showDeleted ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}
                        >
                            {showDeleted ? 'Show Active' : 'Show Bin'}
                        </button>
                    </div>
                    {!showDeleted && (
                        <Link to="/products/new" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow transition">
                            + Add Product
                        </Link>
                    )}
                </div>

                {products.length === 0 && (
                    <div className="text-center text-gray-500 py-10">
                        {showDeleted ? "No deleted items found." : "No products found."}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                            <div className="relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className={`w-full h-48 object-cover ${showDeleted ? 'grayscale' : ''}`}
                                />
                                {showDeleted && (
                                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                                        Deleted
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                                    <div className="flex space-x-2">
                                        {user?.id === product.createdBy._id && (
                                            <>
                                                {!showDeleted ? (
                                                    <>
                                                        <Link to={`/products/edit/${product._id}`} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600">Edit</Link>
                                                        <button onClick={() => handleDelete(product._id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">Delete</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => handleRestore(product._id)} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">Restore</button>
                                                        <button onClick={() => handleForceDelete(product._id)} className="px-3 py-1 bg-red-700 text-white rounded text-sm hover:bg-red-800">Delete Forever</button>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8 space-x-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2 border rounded bg-white">{page} / {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProductList;
