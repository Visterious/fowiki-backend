const sqlite3 = require('sqlite3').verbose();
const dbName = 'db/FOWiki.sqlite';
const db = new sqlite3.Database(dbName);

class Accessories {
    getAccessories(cb) {
        db.all('SELECT * FROM Accessories', cb);
    }

    getAccessory(id, cb) {
        db.get('SELECT * FROM Accessories WHERE id = ?', id, cb);
    }

    createAccessory(data, cb) {
        const sql = 'INSERT INTO Accessories (name, description, image) VALUES (?, ?, ?)';
        db.run(sql, data.name, data.description, '/images/accessories/'+data.image, cb);
    }

    updateAccessory(data, cb) {
        const sql = 'UPDATE Accessories SET name=?, description=? WHERE id = ?';
        db.run(sql, data.name, data.description, data.id, cb);
    }

    deleteAccessory(id, cb) {
        db.run('DELETE FROM Accessories WHERE id = ?', id, cb);
    }
}

module.exports = new Accessories();
