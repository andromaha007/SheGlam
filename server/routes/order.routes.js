const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

// Create new order
router.post('/create', (req, res) => {
    const { user_id, address, city, postal_code, country, first_name, last_name, final_price } = req.body;
    
    // Start transaction
    db.beginTransaction(error => {
        if (error) {
            console.error('Transaction error:', error);
            return res.status(500).json({ error: "Error starting transaction" });
        }
        
        // Create order
        const orderQuery = 'INSERT INTO orders (user_id) VALUES (?)';
        db.query(orderQuery, [user_id], (error, orderResult) => {
            if (error) {
                console.error('Order creation error:', error);
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
                        console.error('Order details error:', error);
                        return db.rollback(() => {
                            res.status(500).json({ error: "Error creating order details" });
                        });
                    }
                    
                    // At this point we could also add logic to save each cart item to an order_items table
                    // if that's a requirement for your system
                    
                    // Commit transaction
                    db.commit(error => {
                        if (error) {
                            console.error('Commit error:', error);
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
        SELECT o.order_id, o.user_id, od.address, od.final_price, od.city, od.postal_code,
               od.country, od.first_name, od.last_name 
        FROM orders o 
        JOIN orders_details od ON o.order_id = od.order_id 
        WHERE o.user_id = ?
        ORDER BY o.order_id DESC
    `;
    
    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Fetch orders error:', error);
            return res.status(500).json({ error: "Error fetching orders" });
        }
        res.json(results);
    });
});

// Get single order details
router.get('/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    
    const query = `
        SELECT o.order_id, o.user_id, od.address, od.final_price, od.city, od.postal_code,
               od.country, od.first_name, od.last_name 
        FROM orders o 
        JOIN orders_details od ON o.order_id = od.order_id 
        WHERE o.order_id = ?
    `;
    
    db.query(query, [orderId], (error, results) => {
        if (error) {
            console.error('Fetch order error:', error);
            return res.status(500).json({ error: "Error fetching order details" });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }
        
        res.json(results[0]);
    });
});

module.exports = router;