const express = require('express');
const cors = require('cors');
const upload = require('express-fileupload');

const PORT = process.env.PORT || 3000;

const dbSerialize = () => {
    const sqlite3 = require('sqlite3').verbose();
    const dbName = 'db/FOWiki.sqlite';
    const db = new sqlite3.Database(dbName);

    db.serialize(() => {
        let sql = `
		 CREATE TABLE IF NOT EXISTS Admins (
            id integer PRIMARY KEY AUTOINCREMENT,
            username, password TEXT
         );
	    `;
        db.run(sql);
        sql = `
         CREATE TABLE IF NOT EXISTS Weapons (
            id integer PRIMARY KEY AUTOINCREMENT,
            name, type TEXT,
            damage, pumping_level integer,
            description, image TEXT
         );
        `;
        db.run(sql);
        sql = `
         CREATE TABLE IF NOT EXISTS Accessories (
            id integer PRIMARY KEY AUTOINCREMENT,
            name, description, image TEXT
         );
        `;
        db.run(sql);
        sql = `
         CREATE TABLE IF NOT EXISTS Heroes (
            id integer PRIMARY KEY AUTOINCREMENT,
            name, gender, weapon, class,
            quality, fraction, description, image TEXT
         );
        `;
        db.run(sql);
    });
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(upload());
app.use(express.static('public'));

app.use('/', require('./routes/main'));
app.use('/admin', require('./routes/admin'));

const start = () => {
    try {
        dbSerialize();
        app.listen(PORT, () => {
            console.log("SERVER STARTED ON PORT: " + PORT)
        });
    } catch (e) {
        console.log(e);
    }
};

start();
