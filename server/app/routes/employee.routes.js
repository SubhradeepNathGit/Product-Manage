const express = require('express');
const router = express.Router();
const {
    createEmployee,
    getEmployees,
    getEmployeeById,
    toggleEmployeeStatus,
    resetEmployeePassword,
    deleteEmployee,
} = require('../controllers/employee.controller');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');

// All routes require authentication and admin role
router.use(protect);
router.use(checkRole('admin')); // SECURITY: Only admins can manage employees

// Create employee
router.post('/', createEmployee);

// Get all employees
router.get('/', getEmployees);

// Get employee by ID
router.get('/:id', getEmployeeById);

// Toggle employee status
router.patch('/:id/toggle', toggleEmployeeStatus);

// Reset employee password
router.post('/:id/reset-password', resetEmployeePassword);

// Delete employee
router.delete('/:id', deleteEmployee);

module.exports = router;
