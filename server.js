const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/videos');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

let videos = [];
let users = [];

app.get('/api/videos', (req, res) => {
    res.json(videos);
});

app.post('/api/videos', upload.single('video'), (req, res) => {
    const video = {
        id: Date.now(),
        title: req.body.title,
        url: `/videos/${req.file.filename}`,
        likes: 0,
        comments: []
    };
    videos.push(video);
    res.status(201).json(video);
});

app.post('/api/videos/:id/like', (req, res) => {
    const video = videos.find(v => v.id === parseInt(req.params.id));
    if (video) {
        video.likes += 1;
        res.json(video);
    } else {
        res.status(404).send('Video not found');
    }
});

app.post('/api/videos/:id/comments', (req, res) => {
    const video = videos.find(v => v.id === parseInt(req.params.id));
    if (video) {
        video.comments.push(req.body.comment);
        res.json(video);
    } else {
        res.status(404).send('Video not found');
    }
});

app.post('/api/users', (req, res) => {
    const user = {
        id: Date.now(),
        username: req.body.username,
        channels: []
    };
    users.push(user);
    res.status(201).json(user);
});

app.post('/api/users/:id/channels', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        const channel = {
            id: Date.now(),
            name: req.body.name,
            videos: []
        };
        user.channels.push(channel);
        res.status(201).json(channel);
    } else {
        res.status(404).send('User not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
