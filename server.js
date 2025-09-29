const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON request bodies
app.use(cors({origin: "http://localhost:4200",  credentials: true}));
app.use(express.json());

// Define your API routes
app.get('/api/data', (req, res) => {
    res.json({ message: 'Data from Express API' });
});

app.post('/api/signup', (req, res) => {
    const newUser = req.body;

    res.json({ message: 'User registered successfully' });
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