const express = require('express');
const app = express();
const fetch = require('node-fetch');
const port = 3000;

// Your API key for Google Books API (keep this secret in the backend)
const apiKey = 'AIzaSyC2lPVELazlhLT8Nr66xG_HLruUBHP-CLo';

// Middleware to serve static files like CSS, JS, images
app.use(express.static('public'));  // Serving files from the 'public' directory

// Search endpoint
app.get('/search', async (req, res) => {
    const query = req.query.q || '';
    const startIndex = req.query.startIndex || 0;
    const maxResults = req.query.maxResults || 10;

    if (!query) {
        return res.status(400).json({ error: 'Please provide a search query' });
    }

    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data); // Send back the book data to the frontend
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving data from Google Books API' });
    }
});

// Book details endpoint
app.get('/search/details/:bookId', async (req, res) => {
    const bookId = req.params.bookId;

    try {
        const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data); // Send book details to frontend
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving book details from Google Books API' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
