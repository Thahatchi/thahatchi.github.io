const express = require('express');
const app = express();
const port = 3000;
const fetch = require('node-fetch'); // To make API requests to Google Books API

// Middleware to serve static files like CSS, JS, images
app.use(express.static('public'));  // Serving files from the 'public' directory

// Middleware to parse URL-encoded data (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve the index.html page on the root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // send HTML file on GET request
});

// Endpoint to search for books using Google Books API
app.get('/search', async (req, res) => {
    const query = req.query.q || ''; // Get search query from request
    const startIndex = req.query.startIndex || 0; // Start index for pagination
    const resultsPerPage = 10; // Results per page
    const apiKey = 'AIzaSyC2lPVELazlhLT8Nr66xG_HLruUBHP-CLo'; // Your API key

    if (!query) {
        return res.status(400).json({ error: 'Please provide a search query' });
    }

    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${resultsPerPage}&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        // Send back the book data as JSON response
        res.json(data);
    } catch (error) {
        console.error('Error fetching data from Google Books API:', error);
        res.status(500).json({ error: 'Error retrieving data from the Google Books API' });
    }
});

// Endpoint to handle form submission
app.post('/submit-form', (req, res) => {
    const { name, email, message } = req.body; // Access form data
    if (name && email && message) {
        res.send('Message has been received!');
    } else {
        res.status(400).send('Please provide all required information: name, email, and message.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

