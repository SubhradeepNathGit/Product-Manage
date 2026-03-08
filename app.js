require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');

const connectDB = require('./app/config/db');
const Category = require('./app/models/Category');

const app = express();

// Database Connection
connectDB();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session & Flash
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Global Variables
app.use(async (req, res, next) => {
    try {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        // Fetch categories globally for the sidebar
        res.locals.globalCategories = await Category.find({ isDeleted: false });
        next();
    } catch (err) {
        console.error('Error in global middleware:', err);
        next();
    }
});

// Routes
app.use('/', require('./app/routes/index'));
app.use('/admin', require('./app/routes/admin'));

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
