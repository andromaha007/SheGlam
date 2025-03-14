const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

// Get all products
router.get('/', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Error fetching products" });
        }
        res.json(results);
    });
});

// Add new product
router.post('/', (req, res) => {
    const { title, description, price, image_url } = req.body;
    const query = 'INSERT INTO products (title, description, price, image_url) VALUES (?, ?, ?, ?)';
    
    db.query(query, [title, description, price, image_url], (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Error adding product" });
        }
        res.status(201).json({ message: "Product added successfully", productId: results.insertId });
    });
});

// Delete product
router.delete('/:id', (req, res) => {
    const productId = req.params.id;
    const query = 'DELETE FROM products WHERE id = ?';
    
    db.query(query, [productId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Error deleting product" });
        }
        res.json({ message: "Product deleted successfully" });
    });
});

module.exports = router; 