const mongoose = require('mongoose');
const slugify = require('slugify');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URL || process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }
        await mongoose.connect(uri);
        console.log('MongoDB Connected...');

        // One-time data migration for categories
        const catCollection = mongoose.connection.db.collection('categories');

        try {
            await catCollection.dropIndexes();
            console.log('Successfully dropped all indexes from categories collection');
        } catch (e) {
            console.log('Error dropping indexes (collection might be new):', e.message);
        }

        // Fix existing records: generate slugs and set isDeleted where missing
        const cats = await catCollection.find({}).toArray();
        for (const cat of cats) {
            const updates = {};
            if (!cat.slug && cat.name) {
                updates.slug = slugify(cat.name, { lower: true, strict: true });
            }
            if (cat.isDeleted === undefined || cat.isDeleted === null) {
                updates.isDeleted = false;
            }
            if (Object.keys(updates).length > 0) {
                await catCollection.updateOne({ _id: cat._id }, { $set: updates });
            }
        }
        
        const Category = require('../models/Category');
        await Category.createIndexes();
        console.log('Created new indexes for Category');
    } catch (err) {
        console.error('DB Connection Error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

