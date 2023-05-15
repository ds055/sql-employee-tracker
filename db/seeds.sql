INSERT INTO department (department_name)
VALUES ("Coding"),
       ("Music"),
       ("Art"),
       ("Designer");

INSERT INTO role (title, salary, department_id)
VALUES ("Enemy AI Programmer", 75000, 1),
       ("Physics Engine Programmer", 90000, 1),
       ("Lead Composer", 80000, 2),
       ("Choral Member", 40000, 2),
       ("Background Artist", 50000, 3),
       ("Character Artist", 55000, 3),
       ("Senior Narrative Designer", 85000, 4),
       ("Level Designer", 67000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Koopa", "Bowser", 1, 2),
       ("Isaac", "Newton", 2, null),
       ("High", "Jump", 2, 2),
       ("Nobuo", "Uematsu", 3, null),
       ("Lee", "Flat", 4, 4),
       ("Bea", "Sharpe", 4, 4),
       ("Sene", "Ery", 5, null),
       ("Relm", "Arrowny", 6, null),
       ("Masato", "Kato", 7, null),
       ("Bergholdt", "Johnson", 8, 9);
