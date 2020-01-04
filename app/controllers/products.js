const mongoose = require('mongoose');

const Product = mongoose.model('Product');

const getAll = (req, res) => {
  Product.find()
    .exec()
    .then(products => res.json(products))
    .catch(err => res.status(500).json(err));
};
const getAllJSon = (req, res) => {
  Product.find()
    .exec()
    .then((products) => {
      res.json(products);
    })
    .catch(err => res.status(500).json(err));
};
const getById = (req, res) => {
  Product.findOne({ product_id: +req.params.id })
    .exec()
    .then((products) => {
      res.json(products);
    })
    .catch(err => res.status(500).json(err));
};
const updateOne = (req, res) => {
  Product.findOneAndUpdate({ product_id: +req.params.id }, req.body)
    .exec()
    .then((product) => {
      res.json(product);
    })
    .catch(err => res.status(500).json(err));
};
const removeOne = (req, res) => {
  Product.deleteOne({ product_id: +req.params.id })
    .exec()
    .then((product) => {
      res.json(product);
    })
    .catch(err => res.status(500).json(err));
};
const createOne = (req, res) => {
  Product.create(req.body)
    .then(createdProduct => res.json(createdProduct))
    .catch(err => res.status(500).json(err));
};

module.exports = {
  createOne,
  removeOne,
  updateOne,
  getById,
  getAllJSon,
  getAll,
};
