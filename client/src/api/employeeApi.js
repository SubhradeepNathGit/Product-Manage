import axiosInstance from './axiosInstance';

const employeeApi = {
    // Create new employee
    createEmployee: async (employeeData) => {
        const response = await axiosInstance.post('/employees', employeeData);
        return response.data;
    },

    // Get all employees
    getEmployees: async (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.role) params.append('role', filters.role);
        if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
        if (filters.search) params.append('search', filters.search);

        const response = await axiosInstance.get(`/employees?${params.toString()}`);
        return response.data;
    },

    // Get employee by ID
    getEmployeeById: async (id) => {
        const response = await axiosInstance.get(`/employees/${id}`);
        return response.data;
    },

    // Toggle employee status
    toggleEmployeeStatus: async (id) => {
        const response = await axiosInstance.patch(`/employees/${id}/toggle`);
        return response.data;
    },

    // Reset employee password
    resetEmployeePassword: async (id) => {
        const response = await axiosInstance.post(`/employees/${id}/reset-password`);
        return response.data;
    },

    // Delete employee
    deleteEmployee: async (id) => {
        const response = await axiosInstance.delete(`/employees/${id}`);
        return response.data;
    },
};

export default employeeApi;
