const sqlite3 = require('sqlite3').verbose();
const dbName = 'db/FOWiki.sqlite';
const db = new sqlite3.Database(dbName);

class Weapons {
    getWeapons(cb) {
        db.all('SELECT * FROM Weapons', cb);
    }

    getWeapon(id, cb) {
        db.get('SELECT * FROM Weapons WHERE id = ?', id, cb);
    }

    createWeapon(data, cb) {
        const sql = 'INSERT INTO Weapons (name, type, damage, pumping_level,' +
            ' description, image) VALUES (?, ?, ?, ?, ?, ?)';
        db.run(sql, data.name, data.type, data.damage,
            data.pumping_level, data.description, '/images/weapons/'+data.image, cb);
    }

    updateWeapon(data, cb) {
        const sql = 'UPDATE Weapons SET name=?, type=?, damage=?, pumping_level=?, description=?' +
            'WHERE id = ?';
        db.run(sql, data.name, data.type, data.damage, data.pumping_level,
            data.description, data.id, cb);
    }

    deleteWeapon(id, cb) {
        db.run('DELETE FROM Weapons WHERE id = ?', id, cb);
    }
}

module.exports = new Weapons();
