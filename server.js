const inquirer = require ('inquirer');
let prompts = require ('./utils/inquires')

const express = require('express');

const mysql = require('mysql2');
const sqlInq = require('./utils/db_inquiries')

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

const init = async () => {
    try{
        let data = await inquirer.prompt(prompts.mainMenu)
        switch(data.mainChoice) {
            case "View All Employees":
                viewAllEmployees();
                break;
            case "View All Departments":
                viewAllDeparts();
                break;
        }
    }catch(err){
        console.log(err);
    }
}

init();

// DB Query Methods
const viewAllEmployees = () => {
    db.query(`SELECT id, department_name AS Department FROM department;`, (err, results) => {
        if (err) console.log(err);
        // console.log(results)
        console.table(results);
        init();
    });
}

const viewAllDeparts = () => {
    db.query(`SELECT id, department_name AS Department FROM department;`, (err, results) => {
        if (err) console.log(err);
        // console.log(results)
        console.table(results);
        init();
    });
}

