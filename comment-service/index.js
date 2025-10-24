const express = require('express');
const fs = require('fs');
const axios = require('axios');

const app = express();
app.use(express.json());

const port = process.env.port || 3002;

app.get('/comments', (req, res) => {
    let rawData = fs.readFileSync('comments.json');
    let comments = JSON.parse(rawData);
    res.json(comments);
});

app.get('/comments/:id', async (req, res) => {
    const commentId = Number(req.params.id);
    let rawData = fs.readFileSync('comments.json');
    let comments = JSON.parse(rawData);
    const comment = comments.find(c => c.id === commentId);
    if (!comment){
        return res.status(404).json({error: 'Комментарий не найден'});
    }
    try {
        const noteRes = await axios.get(`http://note-service:3001/notes/${comment.noteId}`);
        comment.note = noteRes.data;

    } catch (err) {
        console.error(`Не удалось получить замтку id=${comment.noteId}`);
        comment.note = null;
    }
    res.json(comment);
});

app.post('/comments', (req, res) => {
    const newComment = req.body;
    if (!newComment.body || !newComment.noteId){
        return res.status(400).json({error: 'Необходимые поля: текст и айди заметки'});
    }
    let rawData = fs.readFileSync('comments.json');
    let comments = JSON.parse(rawData);
    const maxId = comments.reduce((max, n) => n.id>max ? n.id : max, 0);
    newComment.id = maxId+1;
    comments.push(newComment);
    fs.writeFileSync('comments.json', JSON.stringify(comments, null, 2));
    console.log(`Добавлен новый комментарий  (id: ${newComment.id}): ${newComment.body}`);
    res.status(201).json(newComment);
});

app.listen(port, () => {
    console.log(`Comment Service запущен на порту ${port}`);
});