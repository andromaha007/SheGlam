const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                error: "All fields are required" 
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                error: "Please provide a valid email address" 
            });
        }
        
        console.log('Creating transporter...');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'a.palamudova.eu@gmail.com',
                pass: 'lbaw raes lzhz wkca'
            },
            debug: true, // Enable debug output
            logger: true // Log information to the console
        });
        
        // Verify transporter
        console.log('Verifying transporter connection...');
        await transporter.verify();
        console.log('Transporter verified successfully');
        
        const mailOptions = {
            from: '"Beauty Store Contact" <a.palamudova.eu@gmail.com>',
            to: 'a.palamudova.eu@gmail.com',
            replyTo: email,
            subject: `Contact Form: ${subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p>This email was sent from the Beauty Store contact form. You can reply directly to this email to respond to the customer.</p>
            `
        };
        
        console.log('Sending email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        
        res.status(200).json({
            success: true,
            message: "Your message has been sent successfully. We will contact you shortly."
        });
        
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({
            success: false,
            error: "Failed to send your message. Please try again later.",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;