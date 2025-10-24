const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const port = process.env.port || 3001;

app.get('/notes', (req, res) => {
    let rawData = fs.readFileSync('notes.json');
    let notes = JSON.parse(rawData);
    res.json(notes);
});

app.get('/notes/:id', (req, res) => {
    const noteId = Number(req.params.id);
    let rawData = fs.readFileSync('notes.json');
    let notes = JSON.parse(rawData);
    const note = notes.find(n => n.id === noteId);
    if (!note){
        return res.status(404).json({error: 'Заметка не найдена'});
    }
    res.json(note);
});

app.post('/notes', (req, res) => {
    const newNote = req.body;
    if (!newNote.body){
        return res.status(400).json({error: 'Введите текст заметки'});
    }
    let rawData = fs.readFileSync('notes.json');
    let notes = JSON.parse(rawData);
    const maxId = notes.reduce((max, n) => n.id>max ? n.id : max, 0);
    newNote.id = maxId+1;
    notes.push(newNote);
    fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2));
    console.log(`Добавлена новая заметка (id: ${newNote.id}): ${newNote.body}`);
    res.status(201).json(newNote);
});

app.listen(port, () => {
    console.log(`Note Service запущен на порту ${port}`);
});