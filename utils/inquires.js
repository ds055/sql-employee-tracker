// Arrays to be used for prompts for user input 
let departArray = [];
let roleArray = [];
let employeeArray = [];

// Initial prompt question; answer used in switch to call appropriate function
const mainMenu = [
    {
        type: "list",
        name: "mainChoice",
        message: "What would you like to do?",
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
    }
];

// Add department query
const addDepartment = [
    {
        type: "input",
        name: "depName",
        message: "What is the name of the department?"
    }
]

// Add role query; departArray populated in addRole function
const addRole = [
    {
        type: "input",
        name: "roleName",
        message: "What is the name of the role?"
    },
    {
        type: "input",
        name: "roleSalary",
        message: "What is the salary of the role?"
    },
    {
        type: "list",
        name: "roleDepart",
        message: "What department does this role belong to?",
        choices: departArray
    }
]

// Add employee query; choices arrays populated in addEmployee() function
const addEmployee = [
    {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?"
    },
    {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?"
    },
    {
        type: "list",
        name: "role",
        message: "What is this employee's role?",
        choices: roleArray
    },
    {
        type: "list",
        name: "manager",
        message: "Who is this employee's manager?",
        choices: employeeArray
    }
]

// Update employee query; choices arrays populated in updateEmployee() function
const updateEmployeeRole = [
    {
        type: "list",
        name: "employee",
        message: "Which employee's role do you want to update?",
        choices: employeeArray
    },
    {
        type: "list",
        name: "role",
        message: "What role do you want to assign the selected employee?",
        choices: roleArray
    }
]

// Export arrays for inquire queries in server.js
module.exports = { departArray, roleArray, employeeArray, mainMenu, addDepartment, addRole, addEmployee, updateEmployeeRole }