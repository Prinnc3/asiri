const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;
const SECRET = 'your_secret_key';
const db = new sqlite3.Database(':memory:');

app.use(cors());
app.use(express.json());

db.serialize(() => {
    db.run(`CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)`);
    db.run(`CREATE TABLE messages (id INTEGER PRIMARY KEY, username TEXT, message TEXT)`);

    const hash = bcrypt.hashSync('1234', 10);
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ['test', hash]);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
            res.json({ success: true, token });
        } else {
            res.json({ success: false });
        }
    });
});

app.post('/message', authenticateToken, (req, res) => {
    const { username } = req.user;
    const { message } = req.body;
    db.run(`INSERT INTO messages (username, message) VALUES (?, ?)`, [username, message]);
    res.json({ success: true });
});

app.get('/messages', authenticateToken, (req, res) => {
    db.all(`SELECT username, message FROM messages`, [], (err, rows) => {
        res.json(rows);
    });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});