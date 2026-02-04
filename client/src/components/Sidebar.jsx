import ProfileModal from './ProfileModal';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { ShoppingBag, Laptop, Smartphone, Shirt, BookOpen, Home, Trophy, Gamepad2, Package, Menu, X, User, LogOut } from 'lucide-react';

const Sidebar = ({ selectedCategory, onCategoryChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { user, logout, hasPermission } = useContext(AuthContext);

  const categories = [
    { id: '', name: 'All Categories', icon: Package },
    { id: 'electronics', name: 'Electronics', icon: Laptop },
    { id: 'fashion', name: 'Fashion', icon: Shirt },
    { id: 'books', name: 'Books', icon: BookOpen },
    { id: 'home', name: 'Home & Garden', icon: Home },
    { id: 'sports', name: 'Sports', icon: Trophy },
    { id: 'toys', name: 'Toys', icon: Gamepad2 },
    { id: 'trash', name: 'Trash', icon: LogOut },
  ];

  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId);
    setIsMobileMenuOpen(false);
  };

  const profileImageUrl = user?.profileImage && user.profileImage !== "no-photo.jpg"
    ? (user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:3006/uploads/${user.profileImage}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=3b82f6&color=fff&size=200`;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            My Store
          </h2>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:w-64 lg:shadow-sm lg:border-r lg:border-gray-200
          w-64 flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header with Logo */}
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              My Store
            </span>
          </h2>
        </div>

        {/* User Profile Section (Top) */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={() => {
              setIsProfileModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group text-left"
          >
            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white shadow-sm group-hover:border-blue-200 transition-all">
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=3b82f6&color=fff&size=200`;
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {user?.name || 'Guest User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                View Profile
              </p>
            </div>
          </button>
        </div>

        {/* Categories Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">
            Categories
          </h3>
          <ul className="space-y-1">
            {categories
              .filter(category => {
                // Hide trash category if user doesn't have delete permission
                if (category.id === 'trash' && !hasPermission('delete_product')) {
                  return false;
                }
                return true;
              })
              .map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                return (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                        }`}
                    >
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'
                          }`}
                      />
                      <span className="truncate">{category.name}</span>
                    </button>
                  </li>
                );
              })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 font-semibold bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            Logout
          </button>
          <p className="text-[10px] text-gray-400 text-center mt-3">
            &copy; 2025 Subhradeep
          </p>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;