// create a new express application
const express = require('express');

// import the Pool object from the pg package
const { Pool } = require('pg');

// create a new express application
const PORT = process.env.PORT || 3000;
const app = express();

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connect to database
const pool = new Pool({
    user: 'postgres',
    password: 'CaptainCrunch89!',
    host: 'localhost',
    port: 5432,
    database: 'employee_tracker_db'
}); 

//create a new department
app.post('/departments', async (req, res) => {
    const { name } = req.body;
    const newDepartment = await pool.query(
        'INSERT INTO departments (name) VALUES ($1) RETURNING *',
        [name]
    );
    res.json(newDepartment.rows[0]);
});

// get all departments
app.get('/departments', async (req, res) => {
    const allDepartments = await pool.query('SELECT * FROM departments');
    res.json(allDepartments.rows);
});

// get a specific department
app.get('/departments/:id', async (req, res) => {
    const { id } = req.params;
    const department = await pool.query('SELECT * FROM departments WHERE id = $1', [id]);
    res.json(department.rows);
});

// update a department
app.put('/departments/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const updatedDepartment = await pool.query(
        'UPDATE departments SET name = $1 WHERE id = $2',
        [name, id]
    );
    res.json('Department was updated');
});

// delete a department
app.delete('/departments/:id', async (req, res) => {
    const { id } = req.params;
    const deletedDepartment = await pool.query('DELETE FROM departments WHERE id = $1', [id]);
    res.json('Department was deleted');
});

// create a new role
app.post('/roles', async (req, res) => {
    const { title, salary, department_id } = req.body;
    const newRole = await pool.query(
        'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *',
        [title, salary, department_id]
    );
    res.json(newRole.rows[0]);
});

// get all roles
app.get('/roles', async (req, res) => {
    const allRoles = await pool.query('SELECT * FROM roles');
    res.json(allRoles.rows);
});

// get a specific role
app.get('/roles/:id', async (req, res) => {
    const { id } = req.params;
    const role = await pool.query('SELECT * FROM roles WHERE id = $1', [id]);
    res.json(role.rows);
});

// update a role
app.put('/roles/:id', async (req, res) => {
    const { id } = req.params;
    const { title, salary, department_id } = req.body;
    const updatedRole = await pool.query(
        'UPDATE roles SET title = $1, salary = $2, department_id = $3 WHERE id = $4',
        [title, salary, department_id, id]
    );
    res.json('Role was updated');
});

// delete a role
app.delete('/roles/:id', async (req, res) => {
    const { id } = req.params;
    const deletedRole = await pool.query('DELETE FROM roles WHERE id = $1', [id]);
    res.json('Role was deleted');
});

// create a new employee
app.post('/employees', async (req, res) => {
    const { first_name, last_name, role_id, manager_id } = req.body;
    const newEmployee = await pool.query(
        'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [first_name, last_name, role_id, manager_id]
    );
    res.json(newEmployee.rows[0]);
});

// get all employees
app.get('/employees', async (req, res) => {
    const allEmployees = await pool.query('SELECT * FROM employees');
    res.json(allEmployees.rows);
});

// get a specific employee
app.get('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const employee = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
    res.json(employee.rows);
});

// update an employee
app.put('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, role_id, manager_id } = req.body;
    const updatedEmployee = await pool.query(
        'UPDATE employees SET first_name = $1, last_name = $2, role_id = $3, manager_id = $4 WHERE id = $5',
        [first_name, last_name, role_id, manager_id, id]
    );
    res.json('Employee was updated');
});

// delete an employee
app.delete('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const deletedEmployee = await pool.query('DELETE FROM employees WHERE id = $1', [id]);
    res.json('Employee was deleted');
});

// start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

