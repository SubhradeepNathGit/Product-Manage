import React, { useState, useEffect, useContext } from 'react';
import { Users, UserPlus, Mail, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import employeeApi from '../api/employeeApi';
import { toast } from 'react-toastify';

const EmployeeManagement = () => {
    const { user } = React.useContext(AuthContext);
    const [employees, setEmployees] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [newEmployee, setNewEmployee] = React.useState({
        name: '',
        email: '',
        role: 'employee'
    });
    const [submitting, setSubmitting] = React.useState(false);

    // Redirect if not admin
    React.useEffect(() => {
        if (user && user.role !== 'admin') {
            window.location.href = '/';
        }
    }, [user]);

    // Fetch employees on mount
    React.useEffect(() => {
        if (user && user.role === 'admin') {
            fetchEmployees();
        }
    }, [user]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await employeeApi.getEmployees();
            setEmployees(response.data || []);
        } catch (error) {
            console.error('Error fetching employees:', error);
            toast.error('Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await employeeApi.createEmployee(newEmployee);
            toast.success(response.message || `Employee created! Credentials sent to ${newEmployee.email}`);
            setShowAddModal(false);
            setNewEmployee({ name: '', email: '', role: 'employee' });

            // Refresh employee list
            fetchEmployees();
        } catch (error) {
            console.error('Create employee error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create employee';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (employeeId, currentStatus) => {
        try {
            const response = await employeeApi.toggleEmployeeStatus(employeeId);

            setEmployees(prev => prev.map(emp =>
                emp._id === employeeId ? { ...emp, isActive: !currentStatus } : emp
            ));

            toast.success(response.message || `Employee ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        } catch (error) {
            toast.error('Failed to update employee status');
        }
    };



    const filteredEmployees = employees.filter(emp => {
        return emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar selectedCategory="" onCategoryChange={() => { }} />
                <div className="w-full lg:ml-64 flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading employees...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Fixed Sidebar */}
            <Sidebar selectedCategory="" onCategoryChange={() => { }} />

            {/* Main Content */}
            <div className="w-full lg:ml-64 flex-1">
                <div className="pt-16 lg:pt-0">
                    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-10">

                        {/* Header */}
                        <div className="mb-6 sm:mb-8">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                                        <Users className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                                        Employee Management
                                    </h1>
                                    <p className="text-gray-600 text-xs sm:text-sm md:text-base">Manage employee accounts and permissions</p>
                                </div>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
                                >
                                    <UserPlus className="w-5 h-5" />
                                    Add New Employee
                                </button>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Total Employees</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-1">{employees.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Active</p>
                                            <p className="text-3xl font-bold text-green-600 mt-1">
                                                {employees.filter(e => e.isActive).length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Inactive</p>
                                            <p className="text-3xl font-bold text-red-600 mt-1">
                                                {employees.filter(e => !e.isActive).length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, or employee ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Employee Table */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Employee
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Added By
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Joined
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredEmployees.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                    No employees found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredEmployees.map((employee) => (
                                                <tr key={employee._id} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                                                                {employee.profileImage && employee.profileImage !== "no-photo.jpg" ? (
                                                                    <img
                                                                        src={employee.profileImage.startsWith("http") ? employee.profileImage : `http://localhost:3006/uploads/${employee.profileImage}`}
                                                                        alt={employee.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <span className="text-blue-600 font-semibold text-sm">
                                                                        {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{employee.name}</p>
                                                                <p className="text-sm text-gray-500">{employee.email}</p>
                                                                <p className="text-xs text-gray-400">{employee.employeeId}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => handleToggleStatus(employee._id, employee.isActive)}
                                                            className={`inline-flex items-center justify-center gap-1 w-24 py-1.5 rounded-full text-xs font-medium transition ${employee.isActive
                                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                                }`}
                                                        >
                                                            {employee.isActive ? (
                                                                <>
                                                                    <ToggleRight className="w-3.5 h-3.5" />
                                                                    Active
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ToggleLeft className="w-3.5 h-3.5" />
                                                                    Inactive
                                                                </>
                                                            )}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {employee.createdBy ? (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{employee.createdBy.name}</p>
                                                                <p className="text-xs text-gray-500">{employee.createdBy.email}</p>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">System / Legacy</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {new Date(employee.createdAt).toLocaleDateString()}
                                                    </td>

                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Employee Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <UserPlus className="w-6 h-6 text-blue-600" />
                                Add New Employee
                            </h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddEmployee} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newEmployee.name}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={newEmployee.email}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>


                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> Login credentials will be auto-generated and sent to the employee's email address.
                                </p>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Creating...' : 'Create Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeManagement;
