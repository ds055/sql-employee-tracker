const inquirer = require ('inquirer');
let prompts = require ('./utils/inquires')

const express = require('express');

const mysql = require('mysql2');
const sqlInq = require('./utils/db_inquiries')

// Port and app constants
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
                case "View All Roles":
                viewAllRoles();
                break;
                case "Add Department":
                addDepart();
                break;
                case "Add Role":
                addRole();
                break;
                case "Add Employee":
                addEmployee();
                break;
                case "Update Employee Role":
                updateEmployee();
                break;
                case "Quit":
                console.log(`\n Thank you for using the Game Studio Database! \n`)
                process.exit();
                break;
        }
    }catch(err){
        console.log(err);
    }
}

init();

// DB Query Methods
function viewAllDeparts() {
    db.query(`SELECT id, department_name AS Department FROM department;`, (err, results) => {
        if (err) console.log(err);
        // console.log(results)
        console.table(results);
        init();
    });
}

function viewAllEmployees() {
    db.query(`SELECT employees.id, 
        employees.first_name AS First_Name, 
        employees.last_name AS Last_Name, 
        role.title, 
        department.department_name,
        role.salary, 
        CONCAT_WS(" ", manager.first_name, manager.last_name) AS Manager
        FROM employee employees
        JOIN role ON employees.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT OUTER JOIN employee manager ON employees.manager_id = manager.id;`, (err, results) => {
    if (err) console.log(err);
    // console.log(results)
    console.table(results);
    init();
});
}

function viewAllRoles() {
    db.query(`SELECT role.id, role.title, role.salary, department.department_name AS Department
        FROM role
        JOIN department ON role.department_id = department.id`, (err, results) => {
        if (err) console.log(err);
        // console.log(results)
        console.table(results);
        init();
    });
}

async function addDepart() {
    try {
        let data = await inquirer.prompt(prompts.addDepartment)
    
        db.query(`INSERT INTO department (department_name)
            VALUES (?);`, data.depName, (err, results) => {
            if (err) console.log(err);
            console.log(`\n -------------------------------- \n Department successfully added! \n -------------------------------- \n`)
            init();
        });
    } catch(err){
        console.log(err);
    }
}

// Add a new role function
async function addRole() {
    try {

        let results = await db.promise().query(`SELECT department_name FROM department`);

        let depObjArray = results[0];

        depObjArray.forEach((obj) => {
            prompts.departArray.push(obj.department_name)
        })

        let data = await inquirer.prompt(prompts.addRole);

        results = await db.promise().query(`SELECT id FROM department WHERE department_name = ?`, data.roleDepart)

        let selDepArray = results[0];

        let selDep = selDepArray[0].id

        let salary = parseFloat(data.roleSalary)
        
        db.query(`INSERT INTO role (title, salary, department_id)
            VALUES (?, ?, ?);`, [data.roleName, salary, selDep], (err, results) => {
            if (err) console.log(err);
            console.log(`\n -------------------------------- \n Role successfully added! \n -------------------------------- \n`)

            init();
        });
    } catch(err){
        console.log(err);
    }
}

// Add a new employee function
async function addEmployee() {
    try {

        let results = await db.promise().query(`SELECT title FROM role`);

        let roleObjArray = results[0];

        roleObjArray.forEach((obj) => {
            prompts.roleArray.push(obj.title)
        });

        results = await db.promise().query(`SELECT CONCAT_WS(" ", first_name, last_name) AS Manager FROM employee`);

        let employeeObjArray = results[0];

        employeeObjArray.forEach((obj) => {
            prompts.employeeArray.push(obj.Manager)
        })

        let data = await inquirer.prompt(prompts.addEmployee);

        results = await db.promise().query(`SELECT id FROM role WHERE title = ?`, data.role)

        let selRoleArray = results[0];

        let selRoleId = selRoleArray[0].id

        results = await db.promise().query(`SELECT id FROM employee WHERE CONCAT_WS(" ", first_name, last_name) = ?`, data.manager)

        let selManArray = results [0];

        let selManId = selManArray[0].id;

        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (?, ?, ?, ?);`, [data.firstName, data.lastName, selRoleId, selManId], (err, results) => {
            if (err) console.log(err);
            console.log(`\n -------------------------------- \n Employee successfully added! \n -------------------------------- \n`)
            init();
        });
    } catch(err){
        console.log(err);
    }
}

// Update employee function

async function updateEmployee() {
    try {

        let results = await db.promise().query(`SELECT CONCAT_WS(" ", first_name, last_name) AS Employee FROM employee`);

        let employeeObjArray = results[0];

        employeeObjArray.forEach((obj) => {
            prompts.employeeArray.push(obj.Employee)
        })

        results = await db.promise().query(`SELECT title FROM role`);

        let roleObjArray = results[0];

        roleObjArray.forEach((obj) => {
            prompts.roleArray.push(obj.title)
        });

        let data = await inquirer.prompt(prompts.updateEmployeeRole);

        results = await db.promise().query(`SELECT id FROM employee WHERE CONCAT_WS(" ", first_name, last_name) = ?`, data.employee)

        let selEmpArray = results [0];

        let selEmpId = selEmpArray[0].id;

        results = await db.promise().query(`SELECT id FROM role WHERE title = ?`, data.role)

        let selRoleArray = results[0];

        let selRoleId = selRoleArray[0].id

        db.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, [selRoleId, selEmpId], (err, results) => {
            if (err) console.log(err);
            console.log(`\n -------------------------------- \n Employee role successfully updated! \n -------------------------------- \n`)
            init();
        });
    } catch(err){
        console.log(err);
    }
}