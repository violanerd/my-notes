const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming json data
app.use(express.json());
// serves public folder
app.use(express.static('public'));


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});