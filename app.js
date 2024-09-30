const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());  // Parse incoming JSON
app.use(cors());  // Allow cross-origin requests

// Import routes
const userRoutes = require('./routes/userRoutes');

// Use the routes
app.use('/api/users', userRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


app.use(express.static('public'));