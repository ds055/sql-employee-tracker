// Arrays to be used for prompts for user input 
let departArray = [];
let roleArray = [];
let employeeArray = [];

const mainMenu = [
    {
        type: "list",
        name: "mainChoice",
        message: "What would you like to do?",
        choices: ["View All Employees", "Add Employees", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
    }
];

const addDepartment = [
    {
        type: "input",
        name: "depName",
        message: "What is the name of the department?"
    }
]

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
        name: "role",
        message: "Who is this employee's manager?",
        choices: employeeArray
    }
]

const updateEmployeeRole = [
    {
        type: "list",
        name: "employee",
        message: "Which employee's role do you want to update?",
        list: employeeArray
    },
    {
        type: "list",
        name: "lastName",
        message: "What role do you want to assign the selected employee?",
        list: roleArray
    }
]

module.exports = { departArray, roleArray, employeeArray, mainMenu, addDepartment, addRole, addEmployee, updateEmployeeRole}