INSERT INTO department (name)
VALUES ('Human Resources'),
       ('Accounting'),
       ('Marketing'),
       ('Sales'),
       ('Engineering');

INSERT INTO role (title, salary, department_id)
VALUES ('CEO', 500000, 1),
       ('CFO', 400000, 2),
       ('COO', 400000, 3),
       ('CTO', 400000, 5),
       ('HR Manager', 150000, 1),
       ('Accountant', 125000, 2),
       ('Marketing Manager', 150000, 3),
       ('Sales Manager', 150000, 4),
       ('Lead Engineer', 200000, 5),
       ('Software Engineer', 150000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Smith', 1, NULL),
       ('Dave', 'Crockett', 2, 1),
       ('Bo', 'Peep', 3, 1),
       ('Lord', 'Snuffles', 4, 1),
       ('Syr Konrad', 'Curze', 5, 1),
       ('Genghis', 'Khan', 6, 2),
       ('Cleopatra', 'VII', 7, 3),
       ('Alexander', 'The Great', 8, 4),
       ('Nikola', 'Tesla', 9, 5),
       ('Thomas', 'Edison', 10, 5);
       
