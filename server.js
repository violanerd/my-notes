const express = require('express');
const notes = require('./db/db.json');
const path = require('path');
const createNote = require('./lib/notes');
const fs = require('fs');
const { application } = require('express');
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
    console.log(`${req.method} request to see the notes`);
    const result = notes.filter(note => note.id === req.params.id)[0];
    console.log('delete result', result);
    if (result){
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else{
                let noteList = JSON.parse(data);
                noteList = noteList.filter(note => note.id !== req.params.id);
                console.log('notelist after splice', noteList);
                fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(noteList, null, 2), (err) => {
                   if (err) throw err;
                   console.log('this file was written');
                });   
            }

        });
        
        const response = {
            status: 'sucess',
            body: result,
        }
        console.log('response', response)
        res.json(response);
    } else {
        res.json('Error in deleting a note');
    }
})
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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});