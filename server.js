const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();
const port = 3000;

// Middleware to parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

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

// Endpoint to handle form submissions
app.post('/submit-survey', (req, res) => {
    const data = req.body;
    const imageIDs = {};

    // Initialize the imageIDs object with default values
    Object.keys(data).forEach(key => {
        const [imageID, cls] = key.split('_');
        if (!imageIDs[imageID]) {
            imageIDs[imageID] = { Monitor: 0, Keyboard: 0, Mouse: 0, Computer: 0 };
        }
        imageIDs[imageID][cls] = data[key] === '1' ? 1 : 0;
    });

    // Prepare CSV rows
    const csvRows = Object.entries(imageIDs).map(([imageID, classes]) => {
        return `${imageID},${classes.Monitor},${classes.Keyboard},${classes.Mouse},${classes.Computer}`;
    });

    const csvData = csvRows.join('\n') + '\n';

    fs.appendFile(path.join(__dirname, 'survey-results.csv'), csvData, (err) => {
        if (err) {
            console.error('Error writing to CSV file', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Survey submitted successfully!');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Survey server is running at http://localhost:${port}`);
});