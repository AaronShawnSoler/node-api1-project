// implement your API here
const express = require('express');
const db = require('./data/db');

const server = express();
server.use(express.json());

server.post('/api/users', (req, res) => {
    if(req.body.name && req.body.bio) {
        try {
            const date = new Date();
            const user = {
                name: req.body.name,
                bio: req.body.bio,
                created_at: date.toString(),
                updated_at: date.toString()
            }
            db.insert(user);
            res.status(201).json(user);
        } catch(error) {
            console.log(error);
            res.status(500).json({ error: "The users information could not be retrieved." });
        }
    } else {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }
});

server.get('/api/users', (req, res) => {
    try {
        db.find().then(data => res.send(data));
    } catch(error) {
        console.log(error);
        res.status(500).json({ error: "The users information could not be retrieved." })
    }
});

server.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    try {
        db.findById(id).then(data => {
            if(data) {
                res.send(data);
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            }
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({ error: "The user information could not be retrieved." });
    }
});

server.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    try {
        db.remove(id).then(data => {
            if(data) {
                res.sendStatus(204);
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            }
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({ error: "The user could not be removed" });
    }
});

server.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const date = new Date();

    if(req.body.name && req.body.bio) {
        try {
            db.findById(id).then(data => {
                if(data) {
                    const userUpdate = {
                        name: req.body.name,
                        bio: req.body.bio,
                        created_at: data.created_at,
                        updated_at: date.toString()
                    }
                    db.update(id, userUpdate).then(() => {
                        res.status(200).json(userUpdate);
                    })
                } else {
                    res.status(404).json({ message: "The user with the specified ID does not exist." });
                }
            });
        } catch(error) {
            console.log(error);
            res.status(500).json({ error: "The user information could not be modified." });
        }
    } else {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }
});

server.listen(8000, () => console.log('Server listening on port 8000'));