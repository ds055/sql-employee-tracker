// Import required files/apps
const inquirer = require ('inquirer');
let prompts = require ('./utils/inquires')
const express = require('express');

// Import mySql
const mysql = require('mysql2');

// Port and app constants
const PORT = process.env.PORT || 3001; 
const app = express();

// Express middleware 
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// Connection to DB
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root', 
        password: 'rootroot',
        database: 'game_studio_db'
    },
    console.log(`Connected to the Game Studio Database!`)
);

const init = () => {
    console.log(`
_________________________________________
|                                       |
|            Welcome to the             |
|        ## Video Game Studio ##        |
|              Employee                 |
|            Database Editor            |
|                                       |
_________________________________________
\n`)
    query();
}

// Init method
const query = async () => {
    try{
        // Switch statement calls methods based on user response to first prompt
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

// Call init function
init();

// DB Query Methods
// Shows all departments
function viewAllDeparts() {
    // 
    db.query(`SELECT id, department_name AS Department FROM department;`, (err, results) => {
        if (err) console.log(err);
        // returns results in a tabled form
        console.table(results);
        console.log(`\n`);
        // return to initial prompt
        query();
    });
}

// Displays all employees in database; Concat links together two table values to create a single name for manager
// Left Outer Join keeps overlapping data from disappearing
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
    // display results to console
    console.table(results);
    console.log(`\n`)
    // return to initial prompt
    query();
});
}

// Displays all roles in database
function viewAllRoles() {
    db.query(`SELECT role.id, role.title, role.salary, department.department_name AS Department
        FROM role
        JOIN department ON role.department_id = department.id`, (err, results) => {
        if (err) console.log(err);
        // sends results in table to user
        console.table(results);
        console.log(`\n`)
        // return to initial prompt
        query();
    });
}

// Add department by taking in a department name through inquire query
async function addDepart() {
    try {
        // gets inputs from prompt
        let data = await inquirer.prompt(prompts.addDepartment)
    
        // records new department to db
        db.query(`INSERT INTO department (department_name)
            VALUES (?);`, data.depName, (err, results) => {
            if (err) console.log(err);
            console.log(`\n -------------------------------- \n Department successfully added! \n -------------------------------- \n`)
            // return to initial prompt
            query();
        });
    } catch(err){
        console.log(err);
    }
}

// Add a new role function
async function addRole() {
    try {
        // gets department names from table as promise
        let results = await db.promise().query(`SELECT department_name FROM department`);

        // pulls department names from promise object
        let depObjArray = results[0];

        // loop to push each department name from object into a new array
        depObjArray.forEach((obj) => {
            prompts.departArray.push(obj.department_name)
        })

        // runs addRole prompt for user input, adding department names pulled from pervious steps
        let data = await inquirer.prompt(prompts.addRole);

        // gets department id from the user's inputted selected department, where data.roleDepart is the string name of department
        results = await db.promise().query(`SELECT id FROM department WHERE department_name = ?`, data.roleDepart)

        // pulls object array from promise
        let selDepArray = results[0];

        // pulls id number from object
        let selDep = selDepArray[0].id

        // converts salary input into Float to match table's type for salary
        let salary = parseFloat(data.roleSalary)
        
        // uses data from prompt to write new role into table
        db.query(`INSERT INTO role (title, salary, department_id)
            VALUES (?, ?, ?);`, [data.roleName, salary, selDep], (err, results) => {
            if (err) console.log(err);
            console.log(`\n -------------------------------- \n Role successfully added! \n -------------------------------- \n`)
            // restart initial prompt
            query();
        });
    } catch(err){
        console.log(err);
    }
}

// Add a new employee function
async function addEmployee() {
    try {
        // get all roles from db as promise
        let results = await db.promise().query(`SELECT title FROM role`);

        // pull role obj array from promise
        let roleObjArray = results[0];

        // push data from object into string array
        roleObjArray.forEach((obj) => {
            prompts.roleArray.push(obj.title)
        });

        // get employee names, pushed together with CONCAT, to be used as manager
        results = await db.promise().query(`SELECT CONCAT_WS(" ", first_name, last_name) AS Manager FROM employee`);

        // pull object array from promise
        let employeeObjArray = results[0];

        // pushes data from object in string array
        employeeObjArray.forEach((obj) => {
            prompts.employeeArray.push(obj.Manager)
        })

        // issues prompts to user, awaiting responses
        let data = await inquirer.prompt(prompts.addEmployee);

        // gets the id number from database based on the role as selected by user
        results = await db.promise().query(`SELECT id FROM role WHERE title = ?`, data.role)

        // gets object from promise
        let selRoleArray = results[0];

        // pulls id int from obj
        let selRoleId = selRoleArray[0].id

        // gets employee id via matching the concatenated first and last names
        results = await db.promise().query(`SELECT id FROM employee WHERE CONCAT_WS(" ", first_name, last_name) = ?`, data.manager)

        // pulls object from promise
        let selManArray = results [0];

        // pulls id from object
        let selManId = selManArray[0].id;

        // inserts pulled id's from above and inquire responses into db query; must use array since multiple variables used in query literal
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (?, ?, ?, ?);`, [data.firstName, data.lastName, selRoleId, selManId], (err, results) => {
            if (err) console.log(err);
            console.log(`\n -------------------------------- \n Employee successfully added! \n -------------------------------- \n`)
            query();
        });
    } catch(err){
        console.log(err);
    }
}

// Update employee function
async function updateEmployee() {
    try {
        // get employee concatenated names, renamed Employee as a promise
        let results = await db.promise().query(`SELECT CONCAT_WS(" ", first_name, last_name) AS Employee FROM employee`);

        // pull object array from promise
        let employeeObjArray = results[0];

        // take data from object array and push into string array for use in inquire query
        employeeObjArray.forEach((obj) => {
            prompts.employeeArray.push(obj.Employee)
        })

        // get roles from db as promise
        results = await db.promise().query(`SELECT title FROM role`);

        // get obj from promise
        let roleObjArray = results[0];

        // push strings into array from obj to use in inquire query
        roleObjArray.forEach((obj) => {
            prompts.roleArray.push(obj.title)
        });

        // uses above arrays in prompt
        let data = await inquirer.prompt(prompts.updateEmployeeRole);

        // gets employee id based on matching concatenated names
        results = await db.promise().query(`SELECT id FROM employee WHERE CONCAT_WS(" ", first_name, last_name) = ?`, data.employee)

        // pull obj from promise
        let selEmpArray = results [0];

        // pull id from obj
        let selEmpId = selEmpArray[0].id;

        // get role id from db based on matching role title
        results = await db.promise().query(`SELECT id FROM role WHERE title = ?`, data.role)

        // pull obj from promise
        let selRoleArray = results[0];

        // get role id from obj
        let selRoleId = selRoleArray[0].id
        
        // update database using above ids
        db.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, [selRoleId, selEmpId], (err, results) => {
            if (err) console.log(err);
            console.log(`\n -------------------------------- \n Employee role successfully updated! \n -------------------------------- \n`)
            // return to initial query
            query();
        });
    } catch(err){
        console.log(err);
    }
}