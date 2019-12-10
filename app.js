const { PORT, DB_HOST,DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = require('./env.js')
const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const endpoints = require('./routes')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection ({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

endpoints(app)

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));