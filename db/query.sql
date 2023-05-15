SELECT employees.id, 
       employees.first_name AS First_Name, 
       employees.last_name AS Last_Name, 
       role.title, 
       department.department_name,
       role.salary, 
       CONCAT_WS(" ", manager.first_name, manager.last_name) AS Manager
FROM employee employees
JOIN role ON employees.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT OUTER JOIN employee manager ON employees.manager_id = manager.id;
       