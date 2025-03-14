const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

// Add product to cart
router.post('/', (req, res) => {
    const { title, price } = req.body;
    
    const query = 'INSERT INTO products_in_cart (title, price) VALUES (?, ?)';
    db.query(query, [title, price], (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Error adding product to cart" });
        }
        res.status(201).json({ message: "Product added to cart successfully" });
    });
});

// Get cart items
router.get('/', (req, res) => {
    const query = 'SELECT * FROM products_in_cart';
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Error fetching cart items" });
        }
        res.json(results);
    });
});

// Remove item from cart
router.delete('/:id', (req, res) => {
    const cartItemId = req.params.id;
    
    const query = 'DELETE FROM products_in_cart WHERE product_in_cart_id = ?';
    db.query(query, [cartItemId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Error removing item from cart" });
        }
        res.json({ message: "Item removed from cart successfully" });
    });
});

// Clear cart
router.delete('/', (req, res) => {
    const query = 'DELETE FROM products_in_cart';
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Error clearing cart" });
        }
        res.json({ message: "Cart cleared successfully" });
    });
});

module.exports = router; 