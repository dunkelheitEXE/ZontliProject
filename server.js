const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const database = require("./database");
const bcrypt = require('bcryptjs');

// Middleware for parsing JSON request bodies
app.use(cors({origin: "http://localhost:4200",  credentials: true}));
app.use(express.json());

// Define your API routes
app.get('/api/data', (req, res) => {
    res.json({ message: 'Data from Express API' });
});

app.post('/api/signup', async (req, res) => {
    try {
        const newUser = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newUser['password'], salt);
        const connection = await database.getConnection();
        const query = "INSERT INTO user (name, last_name, birth_date, curp, email, phone_number, password, register_date) VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())";
        const result = await connection.query(query, [
            newUser['fullName'], 
            newUser['fullName'], 
            newUser['date'], 
            newUser['rfc'], 
            newUser['email'], 
            newUser['phoneNumber'], 
            hashedPassword
        ]);
        res.json({ message: newUser});
    } catch (e) {
        res.status(500).json(e);
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

        const connection = await database.getConnection();
        
        // Query to find user by email
        const query = "SELECT * FROM user WHERE email = ?";
        const [users] = await connection.query(query, [email]);
        
        // Release connection back to pool
        connection.release();

        const length = Object.keys(users).length;
        // Check if user exists
        if (length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        const user = users;
        console.log(password);
        console.log(users.password);

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Login successful - remove password from response
        const { password: _, ...userWithoutPassword } = user;
        
        // Convert BigInt values to strings to avoid serialization issues
        const sanitizedUser = JSON.parse(JSON.stringify(userWithoutPassword, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));
        
        res.json({ 
            success: true, 
            message: 'Login successful',
            user: sanitizedUser
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Express API listening on port http://localhost:${PORT}`);
});