const express = require('express');
const notes = require('./db/db.json');
const path = require('path');
const createNote = require('./lib/notes');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming json data
app.use(express.json());
// serves public folder
app.use(express.static('public'));


app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request recieved to add a note`);
    console.log('req.body', req.body);
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: notes.length.toString()
        }
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else{
                const noteList = JSON.parse(data);
                
                noteList.push(newNote);
                fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(noteList, null, 2), (err) => {
                    if (err) throw err;
                    console.log('this file was written');
                }); 
                    
                
            }

        });
        
        const response = {
            status: 'sucess',
            body: newNote,
        }
        console.log('response', response)
        res.json(response);
    } else {
        res.json('Error in adding a note');
    }

})

app.get('/api/notes', (req, res) => {   
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else{
            results = JSON.parse(data);}
    console.log(`${req.method} request to see the notes`);
    res.json(results);
})})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});