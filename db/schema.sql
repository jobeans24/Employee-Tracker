-- Drop the database if it exists.
DROP DATABASE IF EXISTS employee_tracker_db;
-- Create a new database called employee_tracker_db.
CREATE DATABASE employee_tracker_db;

-- Use the employee_tracker_db database.
\c employee_tracker_db;

-- Create a department table to store data about employee departments.
CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

-- Create a role table to store data about employee roles and add foreign key constraints to the department_id column to reference the department table.
CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(10, 2),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);
-- Add a department_id column to the employee table to track which department the employee belongs to and add foreign key constraints to the role_id and manager_id columns to reference the role and manager columns in the role and employee tables, respectively.
CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30), 
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);
