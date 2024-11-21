const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // send HTML file on GET request
});

app.post('/submit-form', (req, res) => {
    const { name, email, message } = req.body; // access form data
    // Check if all fields are present
    if (name && email && message) {
        // Here you might perform additional validation if needed
        // For simplicity, we'll assume all data is valid
        res.send('Message has been received!');
    } else {
        res.status(400).send('Please provide all required information: name, email, and message.');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
