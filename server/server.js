const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const database = require("./database");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // You'll need to install this: npm install jsonwebtoken

const mailer = require('nodemailer');
require('dotenv').config({path: '/home/alangrajeda/codding/gitrepos/ZontliProject/server/.env'});


const JWT_SECRET = process.env.JWT_SECRET || 'fish-bash-kitty';

// Middleware for parsing JSON request bodies
app.use(cors({origin: "http://localhost:4200",  credentials: true}));
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Define your API routes
app.get('/api/data', (req, res) => {
    res.json({ message: 'Data from Express API' });
});

app.post('/api/signup', async (req, res) => {
    try {
        const newUser = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newUser['password'], salt);
        database.query('INSERT INTO user (name, last_name, birth_date, curp, email, phone_number, password, register_date) VALUES(?, ?, ?, ?, ?, ?, ?, NOW())',
            [newUser['fullName'], newUser['fullName'], newUser['date'], newUser['rfc'], newUser['email'], newUser['phoneNumber'], hashedPassword],
            (error, results) => {
                if(error) {
                    console.error(error);
                } else {
                    console.log("User sent");
                }
            }
        )
        res.json({ message: newUser, registered: true});
    } catch (e) {
        res.status(500).json({message: e, registered: false});
    }
});

app.post('/api/items', (req, res) => {
    const newItem = req.body;
    // Process the new item (e.g., save to database)
    res.status(201).json({ message: 'Item created', item: newItem });
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }
        
        // Query to find user by email
        const query = "SELECT * FROM user WHERE email = ?";
        const [rows] = await database.query(query, [email]);
        // console.log(rows[0]);

        // To check if password matchs
        const length = Object.keys(rows).length;
        if (length === 0) {
            return res.status(401).json({
                'success': false,
                'message': 'Any user was found'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, rows[0]['password']);
        
        if (!isPasswordValid) {
            console.error("Password is not valid");
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: rows[0]["user_id"], 
                email: rows[0]["email"]
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );


        // Login successful - remove password from response
        const { password: _, ...userWithoutPassword } = rows[0];
        
        // Convert BigInt values to strings to avoid serialization issues
        const sanitizedUser = JSON.parse(JSON.stringify(userWithoutPassword, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));
        
        res.json({ 
            success: true, 
            message: 'Login successful',
            user: sanitizedUser,
            token: token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

app.post("/api/addAccount", (req, res) => {
    try {
        const [userId, type, balance, creditLimit=null] = req.body;
        console.log(req.body);
        if (userId && type && balance) {
            const query = "INSERT INTO accounts (user_id, account_type, balance, date, opening_date, status, credit_limit) VALUES(?, ?, ?, NOW(), NOW(), 1, ?)";
            database.query(query, [userId, type, balance, creditLimit])
            res.status(201).json({
                success: true,
                message: "Recived Data from user: " + userId
            });
        } else {
            console.log("Data is not recived");
            res.status(201).json({
                success: false,
                message: "Something has gone wrong"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: "There is an error: " + error
        });
    }
});

app.post("/api/testemail", (req, res) => {
    const transport = mailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: '2525',
        secure: false,
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASSWORD,
        }
    });

    const mailOptions = {
        from: "your_verified_sender@example.com",
        to: "recipient@example.com",
        subject: "Test Email from Node.js with Nodemailer and Mailtrap",
        text: "This is a test email sent via Nodemailer and Mailtrap SMTP.",
    };

    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
        console.log(error);
        } else {
        console.log("Email sent: " + info.response);
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Express API listening on port http://localhost:${PORT}`);
});
