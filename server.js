const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const database = require("./database");

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
        // const connection = await database.getConnection();
        // const query = "INSERT INTO users (name, last_name, birth_date, curp, email, phone number, password, reguster_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        // const result = await connection.query(query, []);
        res.json({ message: `Dato: ${newUser.full}`});
    } catch (e) {
        res.status(500).json(e);
    }
});

app.post('/api/items', (req, res) => {
    const newItem = req.body;
    // Process the new item (e.g., save to database)
    res.status(201).json({ message: 'Item created', item: newItem });
});

app.post('/api/login', (req, res) => {
    const user = req.body;
    res.json({message : "Hello word: " + user});
});

// Start the server
app.listen(PORT, () => {
    console.log(`Express API listening on port http://localhost:${PORT}`);
});