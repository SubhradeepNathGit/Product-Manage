const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getHomePage = async (req, res) => {
    try {
        const { category, search, sort, stock, minPrice, maxPrice } = req.query;
        let pipeline = [
            { $match: { isDeleted: false } }
        ];

        // Stock filter
        if (stock === 'true') {
            pipeline.push({ $match: { inStock: true } });
        }

        // Price range filter
        if (minPrice || maxPrice) {
            let priceMatch = {};
            if (minPrice) priceMatch.$gte = parseFloat(minPrice);
            if (maxPrice) priceMatch.$lte = parseFloat(maxPrice);
            pipeline.push({ $match: { price: priceMatch } });
        }

        // Search logic
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
                }
            });
        }

        // Category lookup
        pipeline.push({
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
            }
        });
        pipeline.push({ $unwind: '$category' });

        // Category filter by slug
        if (category) {
            pipeline.push({
                $match: { 'category.slug': category }
            });
        }

        // Sorting
        let sortStage = { createdAt: -1 };
        if (sort === 'price-low') sortStage = { price: 1 };
        if (sort === 'price-high') sortStage = { price: -1 };
        pipeline.push({ $sort: sortStage });

        const products = await Product.aggregate(pipeline);
        const categories = await Category.find({});

        res.render('customer/index', {
            products,
            categories,
            selectedCategory: category,
            search,
            sort: sort || 'newest',
            stock: stock || 'false',
            minPrice: minPrice || '',
            maxPrice: maxPrice || '',
            title: 'Product Portal'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getProductDetail = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, isDeleted: false }).populate('category');
        if (!product) return res.status(404).send('Product Not Found');

        res.render('customer/product', { product, title: product.name });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
