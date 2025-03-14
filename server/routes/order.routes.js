const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

// Create new order
router.post('/create', (req, res) => {
    const { user_id, address, city, postal_code, country, first_name, last_name, final_price } = req.body;
    
    // Start transaction
    db.beginTransaction(error => {
        if (error) {
            return res.status(500).json({ error: "Error starting transaction" });
        }
        
        // Create order
        const orderQuery = 'INSERT INTO orders (user_id) VALUES (?)';
        db.query(orderQuery, [user_id], (error, orderResult) => {
            if (error) {
                return db.rollback(() => {
                    res.status(500).json({ error: "Error creating order" });
                });
            }
            
            const order_id = orderResult.insertId;
            
            // Create order details
            const detailsQuery = `
                INSERT INTO orders_details 
                (order_id, address, final_price, city, postal_code, country, first_name, last_name) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            db.query(detailsQuery, 
                [order_id, address, final_price, city, postal_code, country, first_name, last_name],
                (error) => {
                    if (error) {
                        return db.rollback(() => {
                            res.status(500).json({ error: "Error creating order details" });
                        });
                    }
                    
                    // Commit transaction
                    db.commit(error => {
                        if (error) {
                            return db.rollback(() => {
                                res.status(500).json({ error: "Error committing transaction" });
                            });
                        }
                        res.status(201).json({ 
                            message: "Order created successfully", 
                            order_id 
                        });
                    });
                }
            );
        });
    });
});

// Get user's orders
router.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    
    const query = `
        SELECT o.order_id, o.user_id, od.address, od.final_price 
        FROM orders o 
        JOIN orders_details od ON o.order_id = od.order_id 
        WHERE o.user_id = ?
    `;
    
    db.query(query, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Error fetching orders" });
        }
        res.json(results);
    });
});

module.exports = router; 