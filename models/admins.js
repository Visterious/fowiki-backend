const sqlite3 = require('sqlite3').verbose();
const dbName = 'db/FOWiki.sqlite';
const db = new sqlite3.Database(dbName);

class Admins {
    getAdmins(cb) {
        db.all('SELECT * FROM Admins', cb);
    }

    getAdmin(id, cb) {
        db.get('SELECT * FROM Admins WHERE id = ?', id, cb);
    }

    findAdmin(username, cb) {
        db.get("SELECT * FROM Admins WHERE username = ?", username, cb);
    }

    createAdmin(data, cb) {
        const sql = 'INSERT INTO Admins (username, password) VALUES (?, ?)';
        db.run(sql, data.username, data.password, cb);
    }

    deleteAdmin(id, cb) {
        db.run('DELETE FROM Admins WHERE id = ?', id, cb);
    }
}

module.exports = new Admins();
