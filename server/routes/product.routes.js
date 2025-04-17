const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

// Get all products
router.get('/', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching products:', error);
            return res.status(500).json({ error: "Error fetching products" });
        }
        res.json(results);
    });
});

// Get product by ID
router.get('/:id', (req, res) => {
    const productId = req.params.id;
    const query = 'SELECT * FROM products WHERE product_id = ?';
    
    db.query(query, [productId], (error, results) => {
        if (error) {
            console.error('Error fetching product:', error);
            return res.status(500).json({ error: "Error fetching product" });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        res.json(results[0]);
    });
});

// Add new product
router.post('/', (req, res) => {
    console.log('Received request to add product:', req.body);
    const { title, description, price, image_url } = req.body;
    
    // Basic validation
    if (!title || price === undefined) {
        return res.status(400).json({ error: "Product title and price are required" });
    }
    
    const query = 'INSERT INTO products (title, product_description, price, image_url) VALUES (?, ?, ?, ?)';
    
    db.query(query, [title, description, price, image_url], (error, results) => {
        if (error) {
            console.error('Error adding product:', error);
            return res.status(500).json({ error: "Error adding product: " + error.message });
        }
        
        console.log('Product added successfully:', results);
        res.status(201).json({ 
            message: "Product added successfully", 
            productId: results.insertId 
        });
    });
});

// Update product
router.put('/:id', (req, res) => {
    const productId = req.params.id;
    const { title, description, price, image_url } = req.body;
    
    // Validate required fields
    if (!title || price === undefined) {
        return res.status(400).json({ error: "Product title and price are required" });
    }
    
    const query = `
        UPDATE products 
        SET title = ?, product_description = ?, price = ?, image_url = ?
        WHERE product_id = ?
    `;
    
    db.query(query, [title, description, price, image_url, productId], (error, results) => {
        if (error) {
            console.error('Error updating product:', error);
            return res.status(500).json({ error: "Error updating product" });
        }
        
        // Check if any rows were affected
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        res.json({ message: "Product updated successfully" });
    });
});

// Delete product
router.delete('/:id', (req, res) => {
    const productId = req.params.id;
    const query = 'DELETE FROM products WHERE product_id = ?';
    
    db.query(query, [productId], (error, results) => {
        if (error) {
            console.error('Error deleting product:', error);
            return res.status(500).json({ error: "Error deleting product" });
        }
        
        // Check if any rows were affected
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        res.json({ message: "Product deleted successfully" });
    });
});

module.exports = router;