const Joi = require('joi');

const categorySchema = Joi.object({
    name: Joi.string().required().min(3).trim()
});

const productSchema = Joi.object({
    name: Joi.string().required().min(3).trim(),
    category: Joi.string().required(),
    description: Joi.string().required().min(10),
    price: Joi.number().required().min(0),
    inStock: Joi.boolean().optional()
});

module.exports = {
    categorySchema,
    productSchema
};

