const express = require('express');
const app = express();
const notes = require('./db/db.json');
const path = require('path');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');


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

app.get('/api/notes', (req, res) => {   
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else{
            results = JSON.parse(data);}
    console.log(`${req.method} request to see the notes`);
    res.json(results);
})})

app.delete('/api/notes/:id', (req, res) => {
    console.log(`${req.method} request to delete a note`);
    if (req.params.id){
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else{
                let noteList = JSON.parse(data);
                noteList = noteList.filter(note => note.id !== req.params.id);
                fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(noteList, null, 2), (err) => {
                   if (err) throw err;
                });   
            }
        });
        const response = {
            status: 'note deleted',
            body: req.params.id,
            }
        console.log('response', response);
        res.json(response);
    } else {
        res.json({message: 'Error in deleting a note'});
    }
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request recieved to add a note`);
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4()
            }
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else{
                const noteList = JSON.parse(data);
                
                noteList.push(newNote);
                fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(noteList, null, 2), (err) => {
                    if (err) throw err;
                    console.log('note added to file');
                }); 
            }
        });
        const response = {
            status: 'note added',
            body: newNote,
            }
        console.log('response', response);
        res.json(response);
    } else {
        res.json({message: 'Error in adding a note'});
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});