const express = require('express');
const bodyParser = require('body-parser');
const sqlite = require('sqlite3');
let app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

var initDatabase = (conn) => {
    conn.run('CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY, subject TEXT NOT NULL, body TEXT NOT NULL, sender TEXT NOT NULL, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, deleted BOOLEAN default false);');
    db.run(`
        INSERT OR IGNORE INTO messages(subject, body, sender) 
        VALUES 
            ('Welcome to lilmessage', 'Welcome to our application, developer!', 'Lilmessage Team'), 
            ('Working OK', 'Seems your app is running fine! Keep it up!', 'Lilmessage Team');
    `);
};

//Conecta ao banco de dados
let db = new sqlite.Database('./app.db', sqlite.CREATE_OPEN, (err) => {
    if (err) {
        return console.error(err.message);
    }
    initDatabase(db);
    console.log('Connected to database');
});

/**
 * Valida o objeto mensagem
 * @param {Object} messageObj 
 */
let validateMessage = (messageObj) => {
    if (!messageObj.subject) {
        throw new Exception('Message subject is required');
    }

    if (!messageObj.body) {
        throw new Exception('Message body is required');
    }

    if (!messageObj.sender) {
        throw new Exception('Message sender is required');
    }

    return true;
};

app.get('/', (req, res) => {
    res.send('Hello! For how to use our API, visit <a href="/help" title="Help page">our help page</>.');
});

app.get('/messages', (req, res) => {
    db.all('SELECT * FROM messages WHERE deleted = "false"', (err, rows) => {
        if (err) {
            res.status(500);
            return;
        }

        res.send(rows);
    });
});

app.get('/messages/:id', (req, res) => {
    let id = Number(req.params.id);
    db.get('select * from messages where id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).send();
            return;
        }
        
        if (!row) {
            res.status(404).send('Message not found');
            return;
        }

        res.send(row);
    });
});

app.post('/messages', (req, res) => {
    let message = req.body;
    try {
        validateMessage(message);
        db.run('INSERT INTO messages (subject, body, sender) VALUES (?, ?, ?)', [message.subject, message.body, message.sender], function (err) {
            if (err) {
                res.status(500).send('Something went wrong. Please, try later');
                return;
            }
            res.status(201).send('/messages/'+this.lastID);
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

app.delete('/messages/:id', (req, res) => {
    let id = req.params.id;
    db.run(`UPDATE messages SET deleted = 'true' WHERE id= ? AND deleted = 'false'`, [id], function (err) {
        if (err) {
            res.status(500).send('Something went wrong. Please, try later');
            console.error(err);
            return;
        }
        
        if (!this.changes) {
            res.status(404).send('Not found');
            return;
        }
        
        res.status(204).send();
    });

});

app.get('/help',  (req, res) => {
    res.sendFile(__dirname + '/public/help.html');
});

app.listen(3000);