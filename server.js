const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;
const SECRET = 'your_secret_key';
const db = new sqlite3.Database(':memory:');

// Create HTTP and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
db.serialize(() => {
    db.run(`CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)`);
    db.run(`CREATE TABLE messages (id INTEGER PRIMARY KEY, username TEXT, message TEXT)`);

    const hash = bcrypt.hashSync('1234', 10);
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ['test', hash]);
});

// Login Endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Save Message Endpoint
app.post('/message', authenticateToken, (req, res) => {
    const { username } = req.user;
    const { message } = req.body;
    db.run(`INSERT INTO messages (username, message) VALUES (?, ?)`, [username, message], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true });
    });
});

// Get All Messages Endpoint
app.get('/messages', authenticateToken, (req, res) => {
    db.all(`SELECT username, message FROM messages`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json(rows);
    });
});

// JWT Authentication Middleware
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

// WebSocket Server
wss.on('connection', (ws, req) => {
    console.log('New WebSocket client connected');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        // Broadcast the message to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});

// Start the HTTP and WebSocket server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});