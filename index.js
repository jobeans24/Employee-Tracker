const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db/index.js");

init();

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();

  console.log(logoText);

  loadMainPrompts();
}

function loadMainPrompts() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "View All Employees By Department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
        },
        {
          name: "View All Employees By Manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER"
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE"
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "Update Employee Manager",
          value: "UPDATE_EMPLOYEE_MANAGER"
        },
        {
          name: "View All Roles",
          value: "VIEW_ROLES"
        },
        {
          name: "Add Role",
          value: "ADD_ROLE"
        },
        {
          name: "Remove Role",
          value: "REMOVE_ROLE"
        },
        {
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS"
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "Remove Department",
          value: "REMOVE_DEPARTMENT"
        },
        {
          name: "View Total Utilized Budget By Department",
          value: "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT"
        },
        {
          name: "Quit",
          value: "QUIT"
        }
      ]
    }
  ]).then(res => {
    let choice = res.choice;
    // Call the appropriate function depending on what the user chose
    switch (choice) {
      case "VIEW_EMPLOYEES":
        viewEmployees();
        break;
      case "VIEW_EMPLOYEES_BY_DEPARTMENT":
        viewEmployeesByDepartment();
        break;
      case "VIEW_EMPLOYEES_BY_MANAGER":
        viewEmployeesByManager();
        break;
      case "ADD_EMPLOYEE":
        addEmployee();
        break;
      case "REMOVE_EMPLOYEE":
        removeEmployee();
        break;
      case "UPDATE_EMPLOYEE_ROLE":
        updateEmployeeRole();
        break;
      case "UPDATE_EMPLOYEE_MANAGER":
        updateEmployeeManager();
        break;
      case "VIEW_DEPARTMENTS":
        viewDepartments();
        break;
      case "ADD_DEPARTMENT":
        addDepartment();
        break;
      case "REMOVE_DEPARTMENT":
        removeDepartment();
        break;
      case "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT":
        viewUtilizedBudgetByDepartment();
        break;
      case "VIEW_ROLES":
        viewRoles();
        break;
      case "ADD_ROLE":
        addRole();
        break;
      case "REMOVE_ROLE":
        removeRole();
        break;
      default:
        quit();
    }
  }
  )
}

// View all employees
function viewEmployees() {
    db.findAllEmployees()
    .then(rows => {
         console.log("\n");
   
    }
    )
    .then(() => loadMainPrompts());
}

// View all employees by department
function viewEmployeesByDepartment() {
    db.findAllDepartments()
    .then(departments => {
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));
        prompt([
            {
                type: "list",
                name: "departmentId",
                message: "Which department would you like to see employees for?",
                choices: departmentChoices
            }
        ])
        .then(res => db.findAllEmployeesByDepartment(res.departmentId))
        .then(rows => {
            console.table(rows);
        })
        .then(() => loadMainPrompts());
    });
}

// View all employees by manager
function viewEmployeesByManager() {
    db.findAllEmployees()
    .then(employees => {
        const managerChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        prompt([
            {
                type: "list",
                name: "managerId",
                message: "Which employee do you want to see direct reports for?",
                choices: managerChoices
            }
        ])
        .then(res => db.findAllEmployeesByManager(res.managerId))
        .then(rows => {
            console.table(rows);
        })
        .then(() => loadMainPrompts());
    });
}

// Add an employee
function addEmployee() {
    prompt([
        {
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            message: "What is the employee's last name?"
        }
    ])
    .then(res => {
        const employee = {
            first_name: res.first_name,
            last_name: res.last_name
        }
        db.findAllRoles()
        .then(roles => {
            const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }));
            prompt({
                type: "list",
                name: "roleId",
                message: "What is the employee's role?",
                choices: roleChoices
            })
            .then(res => {
                employee.role_id = res.roleId;
                db.findAllEmployees()
                .then(employees => {
                    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                    }));
                    managerChoices.unshift({ name: "None", value: null });
                    prompt({
                        type: "list",
                        name: "managerId",
                        message: "Who is the employee's manager?",
                        choices: managerChoices
                    })
                    .then(res => {
                        employee.manager_id = res.managerId;
                        db.createEmployee(employee);
                    })
                    .then(() => console.log(
                        `Added ${employee.first_name} ${employee.last_name} to the database`
                    ))
                    .then(() => loadMainPrompts());
                });
            });
        });
    });
}

// Remove an employee
function removeEmployee() {
    db.findAllEmployees()
    .then(employees => {
        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee do you want to remove?",
                choices: employeeChoices
            }
        ])
        .then(res => db.removeEmployee(res.employeeId))
        .then(() => console.log("Removed employee from the database"))
        .then(() => loadMainPrompts());
    });
}

// Update an employee's role
function updateEmployeeRole() {
    db.findAllEmployees()
    .then(employees => {
        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee's role do you want to update?",
                choices: employeeChoices
            }
        ])
        .then(res => {
            let employeeId = res.employeeId;
            db.findAllRoles()
            .then(roles => {
                const roleChoices = roles.map(({ id, title }) => ({
                    name: title,
                    value: id
                }));
                prompt([
                    {
                        type: "list",
                        name: "roleId",
                        message: "What is the employee's new role?",
                        choices: roleChoices
                    }
                ])
                .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                .then(() => console.log("Updated employee's role"))
                .then(() => loadMainPrompts());
            });
        });
    });
}

// Update an employee's manager
function updateEmployeeManager() {
    db.findAllEmployees()
    .then(employees => {
        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee's manager do you want to update?",
                choices: employeeChoices
            }
        ])
        .then(res => {
            let employeeId = res.employeeId;
            db.findAllPossibleManagers(employeeId)
            .then(employees => {
                const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                }));
                prompt([
                    {
                        type: "list",
                        name: "managerId",
                        message: "Who is the employee's new manager?",
                        choices: managerChoices
                    }
                ])
                .then(res => db.updateEmployeeManager(employeeId, res.managerId))
                .then(() => console.log("Updated employee's manager"))
                .then(() => loadMainPrompts());
            });
        });
    });
}

// View all roles
function viewRoles() {
    db.findAllRoles()
    .then(rows => {
        console.table(rows);
    })
    .then(() => loadMainPrompts());
}

// Add a role
function addRole() {
    db.findAllDepartments()
    .then(departments => {
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));
        prompt([
            {
                name: "title",
                message: "What is the name of the role?"
            },
            {
                name: "salary",
                message: "What is the salary of the role?"
            },
            {
                type: "list",
                name: "department_id",
                message: "Which department does the role belong to?",
                choices: departmentChoices
            }
        ])
        .then(role => {
            db.createRole(role);
        })
        .then(() => console.log(`Added role to the database`))
        .then(() => loadMainPrompts());
    });
}

// Remove a role
function removeRole() {
    db.findAllRoles()
    .then(roles => {
        const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
        }));
        prompt([
            {
                type: "list",
                name: "roleId",
                message: "Which role do you want to remove?",
                choices: roleChoices
            }
        ])
        .then(res => db.removeRole(res.roleId))
        .then(() => console.log("Removed role from the database"))
        .then(() => loadMainPrompts());
    });
}

// View all departments
function viewDepartments() {
    db.findAllDepartments()
    .then(rows => {
        console.table(rows);
    })
    .then(() => loadMainPrompts());
}

// Add a department
function addDepartment() {
    prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ])
    .then(res => {
        let name = res;
        db.createDepartment(name);
    })
    .then(() => console.log(`Added department to the database`))
    .then(() => loadMainPrompts());
}

// Remove a department
function removeDepartment() {
    db.findAllDepartments()
    .then(departments => {
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));
        prompt([
            {
                type: "list",
                name: "departmentId",
                message: "Which department do you want to remove?",
                choices: departmentChoices
            }
        ])
        .then(res => db.removeDepartment(res.departmentId))
        .then(() => console.log("Removed department from the database"))
        .then(() => loadMainPrompts());
    });
}

// View total utilized budget by department
function viewUtilizedBudgetByDepartment() {
    db.viewDepartmentBudgets()
    .then(rows => {
        console.table(rows);
    })
    .then(() => loadMainPrompts());
}

// Quit
function quit() {
    console.log("Goodbye!");
    process.exit();
}
