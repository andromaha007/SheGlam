const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const bcrypt = require('bcrypt');

// Register new admin
router.post('/register', async (req, res) => {
    try {
        const { username, password, fname, lname } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = 'INSERT INTO admins (username, passcode, fname, lname) VALUES (?, ?, ?, ?)';
        db.query(query, [username, hashedPassword, fname, lname], (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Error registering admin" });
            }
            res.status(201).json({ message: "Admin registered successfully" });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Admin login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Admin login attempt:', username); // Debug log
    
    const query = 'SELECT * FROM admins WHERE username = ?';
    db.query(query, [username], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: "Error during login" });
        }
        
        console.log('Query results:', results); // Debug log
        
        if (results.length === 0) {
            return res.status(401).json({ error: "Admin not found" });
        }
        
        // Direct password comparison for the preset admin
        if (password === results[0].passcode) {
            res.json({ 
                message: "Admin login successful",
                adminId: results[0].id,
                isAdmin: true,
                username: results[0].username
            });
        } else {
            return res.status(401).json({ error: "Invalid password" });
        }
    });
});

module.exports = router; 