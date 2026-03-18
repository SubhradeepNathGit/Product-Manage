const User = require('../models/User');
const { generatePassword, generateEmployeeId } = require('../utils/passwordGenerator');
const { sendEmployeeWelcomeEmail, sendPasswordResetEmail } = require('../utils/emailService');

/**
 * Create a new employee
 * @param {Object} employeeData - Employee data
 * @param {string} adminId - ID of the admin creating the employee
 * @returns {Object} - Created employee and generated password
 */
exports.createEmployee = async (employeeData, adminId) => {
    const { name, email, role } = employeeData;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Email already registered');
    }

    // Get last employee to determine next ID
    const lastEmployee = await User.findOne({ employeeId: { $exists: true } })
        .sort({ employeeId: -1 })
        .select('employeeId');

    let nextIdNumber = 1;
    if (lastEmployee && lastEmployee.employeeId) {
        const lastIdMatch = lastEmployee.employeeId.match(/EMP(\d+)/);
        if (lastIdMatch) {
            nextIdNumber = parseInt(lastIdMatch[1], 10) + 1;
        }
    }

    // Helper to pad number
    const generateId = (num) => `EMP${String(num).padStart(3, '0')}`;
    const employeeId = generateId(nextIdNumber);

    // Generate secure password
    const generatedPassword = generatePassword(12);

    // Create employee
    const employee = await User.create({
        name,
        email,
        password: generatedPassword,
        role: role || 'employee',
        employeeId,
        isActive: true,
        isFirstLogin: true,
        createdBy: adminId,
        isVerified: true, // Auto-verify admin-created employees
    });

    // Send welcome email with credentials
    try {
        await sendEmployeeWelcomeEmail({
            to: email,
            name,
            employeeId,
            password: generatedPassword,
        });
    } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the employee creation if email fails
    }

    return {
        employee: {
            _id: employee._id,
            name: employee.name,
            email: employee.email,
            employeeId: employee.employeeId,
            role: employee.role,
            isActive: employee.isActive,
            createdAt: employee.createdAt,
        },
        generatedPassword, // Return this for admin to see (optional)
    };
};

/**
 * Get all employees
 * @param {Object} filters - Filter options
 * @returns {Array} - List of employees
 */
exports.getEmployees = async (filters = {}) => {
    const query = { employeeId: { $exists: true } };

    // Apply filters
    if (filters.role) {
        query.role = filters.role;
    }
    if (filters.isActive !== undefined) {
        query.isActive = filters.isActive;
    }
    if (filters.search) {
        query.$or = [
            { name: { $regex: filters.search, $options: 'i' } },
            { email: { $regex: filters.search, $options: 'i' } },
            { employeeId: { $regex: filters.search, $options: 'i' } },
        ];
    }

    const employees = await User.find(query)
        .select('-password -refreshToken -otp -otpExpire -resetPasswordToken -resetPasswordExpire')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

    return employees;
};

/**
 * Get employee by ID
 * @param {string} employeeId - Employee ID
 * @returns {Object} - Employee details
 */
exports.getEmployeeById = async (employeeId) => {
    const employee = await User.findById(employeeId)
        .select('-password -refreshToken -otp -otpExpire -resetPasswordToken -resetPasswordExpire')
        .populate('createdBy', 'name email');

    if (!employee || !employee.employeeId) {
        throw new Error('Employee not found');
    }

    return employee;
};

/**
 * Toggle employee active status
 * @param {string} employeeId - Employee ID
 * @returns {Object} - Updated employee
 */
exports.toggleEmployeeStatus = async (employeeId) => {
    const employee = await User.findById(employeeId);

    if (!employee || !employee.employeeId) {
        throw new Error('Employee not found');
    }

    employee.isActive = !employee.isActive;

    // If account is being deactivated, clear refresh token to force logout from all devices
    if (!employee.isActive) {
        employee.refreshToken = undefined;
    }

    await employee.save();

    return {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        isActive: employee.isActive,
    };
};

/**
 * Reset employee password
 * @param {string} employeeId - Employee ID
 * @returns {Object} - Success message
 */
exports.resetEmployeePassword = async (employeeId) => {
    const employee = await User.findById(employeeId);

    if (!employee || !employee.employeeId) {
        throw new Error('Employee not found');
    }

    // Generate new password
    const newPassword = generatePassword(12);

    // Update password
    employee.password = newPassword;
    employee.isFirstLogin = true;
    employee.lastPasswordChange = new Date();
    await employee.save();

    // Send password reset email
    try {
        await sendPasswordResetEmail({
            to: employee.email,
            name: employee.name,
            password: newPassword,
        });
    } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        // Don't fail the password reset if email fails
    }

    return {
        message: 'Password reset successfully',
        email: employee.email,
    };
};

/**
 * Delete employee (soft delete by deactivating)
 * @param {string} employeeId - Employee ID
 * @returns {Object} - Success message
 */
exports.deleteEmployee = async (employeeId) => {
    const employee = await User.findById(employeeId);

    if (!employee || !employee.employeeId) {
        throw new Error('Employee not found');
    }

    employee.isActive = false;
    await employee.save();

    return {
        message: 'Employee deactivated successfully',
    };
};
