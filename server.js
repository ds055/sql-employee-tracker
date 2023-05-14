const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001; 
const app = express();

// Express middleware 
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// Connection to db
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root', 
        password: 'rootroot',
        database: 'game_studio_db'
    },
    console.log(`Connected to the Game Studio Database!`)
);