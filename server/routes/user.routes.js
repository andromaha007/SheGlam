const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const bcrypt = require('bcrypt');

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = 'INSERT INTO users (username, passcode, email) VALUES (?, ?, ?)';
        db.query(query, [username, hashedPassword, email], (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Error registering user" });
            }
            res.status(201).json({ message: "User registered successfully" });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const query = 'SELECT * FROM users WHERE username = ?';
        db.query(query, [username], async (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Error during login" });
            }
            
            if (results.length === 0) {
                return res.status(401).json({ error: "User not found" });
            }
            
            const match = await bcrypt.compare(password, results[0].passcode);
            if (!match) {
                return res.status(401).json({ error: "Invalid password" });
            }
            
            res.json({ message: "Login successful", userId: results[0].id });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Add this new route to get user profile
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT id, username, email FROM users WHERE id = ?';
    
    db.query(query, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Error fetching user profile" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(results[0]);
    });
});

// Add this route for deleting user account
router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'DELETE FROM users WHERE id = ?';
    
    db.query(query, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Error deleting user account" });
        }
        res.json({ message: "Account deleted successfully" });
    });
});

module.exports = router; 