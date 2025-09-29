// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // For parsing application/json

// Example GET endpoint
app.get('/api/data', (req, res) => {
    res.json({ message: 'Data from Express API!' });
});

// Example POST endpoint
app.post('/api/items', (req, res) => {
    const newItem = req.body;
    // Logic to save the new item
    res.status(201).json({ message: 'Item created', item: newItem });
});

app.listen(port, () => {
    console.log(`Express API listening at http://localhost:${port}`);
});