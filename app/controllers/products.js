const mongoose = require('mongoose');

const Product = mongoose.model('Product');

const getAll = (req, res) => {
    return Product.find()
        .then(products => {
            return products.map(event => {
                return { ...event._doc, price: event._doc.price.toString() }
            })
        })
        .catch(err => res.status(500).json(err));
};
const getAllJSon = (req, res) => {
    Product.find()
        .exec()
        .then(products => {
            res.json(products);
        })
        .catch(err => res.status(500).json(err));
};
const getById = (product_id) => {
   return Product.findOne({ product_id: +product_id })
        // .exec()
        .then(product => {
            return { ...product._doc, _id: product._doc._id.toString(), price: +product._doc.price.toString() };
        })
        .catch(err => console.log(err));
};

const removeOne = (product_id) => {
    return Product.deleteOne({ product_id: product_id })
        // .exec()
        .then(product => {
            console.log(product);
            return {message:"success, product removed"};
        })
        .catch(err => {
            console.log(err);
            
            return {message:"product not removed"};
        });
};
const updateOne = (args) => {
    Product.findOneAndUpdate({ product_id: args.product_id }, args)
        .then(product => console.log(product))
        .catch(err => console.log(err));
};
const createOne = (args) => {
    Product.create(args)
        .then(createdProduct => console.log(createdProduct))
        .catch(err => console.log(err));
};

module.exports = {
    createOne,
    removeOne,
    updateOne,
    getById,
    getAllJSon,
    getAll
};