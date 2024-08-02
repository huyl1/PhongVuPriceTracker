import express from 'express';
import Product from '../models/productModel.js';

const router = express.Router();

router.get('/', (req, res) => {
    Product.find().limit(25)
      .then(products => res.json(products))
      .catch(err => res.status(500).json({ error: err.message }));
  });

router.get('/:id', async (req, res) => {
    Product.findById(req.params.id)
        .then(product => res.json(product))
        .catch(err => res.status(500).json({ error: err.message }));
});

export default router;