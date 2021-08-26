const sqlite3 = require('sqlite3').verbose();
const dbName = 'db/FOWiki.sqlite';
const db = new sqlite3.Database(dbName);

class Heroes {
    getHeroes(cb) {
        db.all('SELECT * FROM Heroes', cb);
    }

    getHero(id, cb) {
        db.get('SELECT * FROM Heroes WHERE id = ?', id, cb);
    }

    createHero(data, cb) {
        const sql = 'INSERT INTO Heroes (name, gender, weapon, class,' +
            ' quality, fraction, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.run(sql, data.name, data.gender, data.weapon, data.class,
            data.quality, data.fraction, data.description, '/images/heroes/'+data.image, cb);
    }

    updateHero(data, cb) {
        const sql = 'UPDATE Heroes SET name=?, gender=?, weapon=?, class=?, quality=?, fraction=?, description=?' +
            'WHERE id = ?';
        db.run(sql, data.name, data.gender, data.weapon, data.class,
            data.quality, data.fraction, data.description, data.id, cb);
    }

    deleteHero(id, cb) {
        db.run('DELETE FROM Heroes WHERE id = ?', id, cb);
    }
}

module.exports = new Heroes();
