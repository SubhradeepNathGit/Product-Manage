const employeeService = require('../services/employee.service');

/**
 * @desc    Create new employee
 * @route   POST /api/employees
 * @access  Admin only
 */
exports.createEmployee = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name and email',
            });
        }

        // Validate role
        if (role && !['employee', 'manager'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be employee or manager',
            });
        }

        const result = await employeeService.createEmployee(
            { name, email, role },
            req.user.id
        );

        res.status(201).json({
            success: true,
            message: 'Employee created successfully. Credentials sent to email.',
            data: result.employee,
        });
    } catch (error) {
        console.error('Create employee error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to create employee',
        });
    }
};

/**
 * @desc    Get all employees
 * @route   GET /api/employees
 * @access  Admin only
 */
exports.getEmployees = async (req, res) => {
    try {
        const { role, isActive, search } = req.query;

        const filters = {};
        if (role) filters.role = role;
        if (isActive !== undefined) filters.isActive = isActive === 'true';
        if (search) filters.search = search;

        const employees = await employeeService.getEmployees(filters);

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees,
        });
    } catch (error) {
        console.error('Get employees error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch employees',
        });
    }
};

/**
 * @desc    Get employee by ID
 * @route   GET /api/employees/:id
 * @access  Admin only
 */
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await employeeService.getEmployeeById(req.params.id);

        res.status(200).json({
            success: true,
            data: employee,
        });
    } catch (error) {
        console.error('Get employee error:', error);
        res.status(404).json({
            success: false,
            message: error.message || 'Employee not found',
        });
    }
};

/**
 * @desc    Toggle employee active status
 * @route   PATCH /api/employees/:id/toggle
 * @access  Admin only
 */
exports.toggleEmployeeStatus = async (req, res) => {
    try {
        const employee = await employeeService.toggleEmployeeStatus(req.params.id);

        res.status(200).json({
            success: true,
            message: `Employee ${employee.isActive ? 'activated' : 'deactivated'} successfully`,
            data: employee,
        });
    } catch (error) {
        console.error('Toggle employee status error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to update employee status',
        });
    }
};

/**
 * @desc    Reset employee password
 * @route   POST /api/employees/:id/reset-password
 * @access  Admin only
 */
exports.resetEmployeePassword = async (req, res) => {
    try {
        const result = await employeeService.resetEmployeePassword(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Password reset successfully. New credentials sent to employee email.',
            data: result,
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to reset password',
        });
    }
};

/**
 * @desc    Delete employee (deactivate)
 * @route   DELETE /api/employees/:id
 * @access  Admin only
 */
exports.deleteEmployee = async (req, res) => {
    try {
        const result = await employeeService.deleteEmployee(req.params.id);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        console.error('Delete employee error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to delete employee',
        });
    }
};
