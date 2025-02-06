const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Serve static files (images, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file at the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to get random image IDs
app.get('/random-images', (req, res) => {
    const imageIDs = [];
    fs.createReadStream('data/filtered_images.csv')
        .pipe(csv())
        .on('data', (data) => {
            if (!imageIDs.includes(data.ImageID)) {
                imageIDs.push(data.ImageID);
            }
        })
        .on('end', () => {
            const selectedIDs = [];
            while (selectedIDs.length < 5) {
                const randomIndex = Math.floor(Math.random() * imageIDs.length);
                const randomID = imageIDs[randomIndex];
                if (!selectedIDs.includes(randomID)) {
                    selectedIDs.push(randomID);
                }
            }
            res.json(selectedIDs);
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Survey server is running at http://localhost:${port}`);
});