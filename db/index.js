//intialize the database
const connection = require('../config/connection');

//create a class that will hold all the methods that will be used to query the database
class DB {
    constructor(connection) {
        this.connection = connection;
    }
 
    findAllEmployees() {
        console.log('findAllEmployees');
        return this.connection.query(
            'SELECT * from employee'
        );
    }

    findAllPossibleManagers(employeeId) {
        return this.connection.query(
            'SELECT id, first_name, last_name FROM employee WHERE id != ?',
            employeeId
        );
    }

    createEmployee(employee) {
        return this.connection.query('INSERT INTO employee SET ?', employee);
    }

    removeEmployee(employeeId) {
        return this.connection.query(
            'DELETE FROM employee WHERE id = ?',
            employeeId
        );
    }

    updateEmployeeRole(employeeId, roleId) {
        return this.connection.query(
            'UPDATE employee SET role_id = ? WHERE id = ?',
            [roleId, employeeId]
        );
    }

    updateEmployeeManager(employeeId, managerId) {
        return this.connection.query(
            'UPDATE employee SET manager_id = ? WHERE id = ?',
            [managerId, employeeId]
        );
    }

    findAllRoles() {
        return this.connection.query(
            'SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;'
        );
    }

    createRole(role) {
        return this.connection.query('INSERT INTO role SET ?', role);
    }

    removeRole(roleId) {
        return this.connection.query('DELETE FROM role WHERE id = ?', roleId);
    }

    findAllDepartments() {
        return this.connection.query(
            'SELECT department.id, department.name FROM department;'
        );
    }

    viewDepartmentBudgets() {
        return this.connection.query(
            'SELECT department_id AS id, department.name, SUM(salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department_id, department.name;'
        );
    }

    createDepartment(department) {
        return this.connection.query('INSERT INTO department SET ?', department);
    }

    removeDepartment(departmentId) {
        return this.connection.query(
            'DELETE FROM department WHERE id = ?',
            departmentId
        );
    }

    findAllEmployeesByDepartment(departmentId) {
        return this.connection.query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id WHERE role.department_id = ?;',
            departmentId
        );
    }

    findAllEmployeesByManager(managerId) {
        return this.connection.query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id WHERE manager_id = ?;',
            managerId
        );
    }
}

module.exports = new DB(connection);
