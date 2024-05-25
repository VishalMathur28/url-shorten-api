const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const URLs = {};
const APP_URL = "http://localhost:3000";

function generateHash(url) {
    const hash = crypto.createHash('sha256');
    hash.update(url);
    return hash.digest('base64').replace(/\//g, '');
}

// Shorten URL route
app.post('/shorten', (req, res) => {
    const url = req.body.url;
    const hash = generateHash(url);
    URLs[hash] = url;
    const shortUrl = `${APP_URL}/${hash}`;
    res.json({ shortUrl });
});

// Redirect to original URL route
app.get('/:hash', (req, res) => {
    const originalUrl = URLs[`${req.params.hash}`];
    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).json({ error: 'URL not found!' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
