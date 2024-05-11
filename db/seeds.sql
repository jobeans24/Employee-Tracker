INSERT INTO departments (name)
VALUES ('Engineering'), ('Sales'), ('Finance'), ('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES ('Software Engineer', 100000, 1),
       ('Sales Lead', 80000, 2),
       ('Accountant', 75000, 3),
       ('Lawyer', 120000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Alice', 'Johnson', 1, NULL),
       ('Bob', 'Smith', 2, 1),
       ('Charlie', 'Brown', 3, NULL),
       ('Diana', 'Jones', 4, 3);

    