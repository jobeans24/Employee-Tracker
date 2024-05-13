SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department 
FROM employees
LEFT JOIN roles 
ON employees.role_id = roles.id
LEFT JOIN departments
ON roles.department_id = departments.id;
ORDER BY employees.id;

