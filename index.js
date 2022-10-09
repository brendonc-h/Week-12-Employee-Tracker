const express = require('express');
const { prompt } = require("inquirer");
const mysql = require('mysql2');
const db = require("./db");


const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({ extented: true }));
app.use(express.json());


// const db = mysql.createConnection(
//     {
//         host: 'localhost',
//         user: 'root',
//         password: 'rootroot',
//         database: 'departments_db'
//     },
//     console.log('Connected to the departments_db database!')
// );

//inquierer for the selections
const menuSelect = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Select what you want to do.",
            name: "menu",
            choices: [
                "Select all departments",
                "Select all employees",
                "Select all roles",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Add a new employee role",
                "Quit"
            ]
        }
    ]).then(res => {
        let choice = res.choice;
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
        .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            console.table(employees);
        })
        .then(() => menuSelect());
}

// All employees that belong to a department
function viewEmployeesByDepartment() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
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
                .then(([rows]) => {
                    let employees = rows;
                    console.log("\n");
                    console.table(employees);
                })
                .then(() => menuSelect())
        });
}


function viewEmployeesByManager() {
    db.findAllEmployees()
        .then(([rows]) => {
            let managers = rows;
            const managerChoices = managers.map(({ id, first_name, last_name }) => ({
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
                .then(([rows]) => {
                    let employees = rows;
                    console.log("\n");
                    if (employees.length === 0) {
                        console.log("The selected employee has no direct reports");
                    } else {
                        console.table(employees);
                    }
                })
                .then(() => menuSelect())
        });
}


function removeEmployee() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
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
                .then(() => menuSelect())
        })
}


function updateEmployeeRole() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
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
                        .then(([rows]) => {
                            let roles = rows;
                            const roleChoices = roles.map(({ id, title }) => ({
                                name: title,
                                value: id
                            }));

                            prompt([
                                {
                                    type: "list",
                                    name: "roleId",
                                    message: "Which role do you want to assign the selected employee?",
                                    choices: roleChoices
                                }
                            ])
                                .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                                .then(() => console.log("Updated employee's role"))
                                .then(() => menuSelect())
                        });
                });
        })
}

// Update an employee's manager
function updateEmployeeManager() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
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
                    let employeeId = res.employeeId
                    db.findAllPossibleManagers(employeeId)
                        .then(([rows]) => {
                            let managers = rows;
                            const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                                name: `${first_name} ${last_name}`,
                                value: id
                            }));

                            prompt([
                                {
                                    type: "list",
                                    name: "managerId",
                                    message:
                                        "Which employee do you want to set as manager for the selected employee?",
                                    choices: managerChoices
                                }
                            ])
                                .then(res => db.updateEmployeeManager(employeeId, res.managerId))
                                .then(() => console.log("Updated employee's manager"))
                                .then(() => menuSelect())
                        })
                })
        })
}

//All roles
function viewRoles() {
    db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            console.log("\n");
            console.table(roles);
        })
        .then(() => menuSelect());
}

// Add a role
function addRole() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt([
                {
                    name: "title",
                    message: "What role in the department are you looking for?"
                },
                {
                    name: "salary",
                    message: "What salary does the role have?"
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "Which department does the role belong to?",
                    choices: departmentChoices
                }
            ])
                .then(role => {
                    db.createRole(role)
                        .then(() => console.log(`Added ${role.title} to the database`))
                        .then(() => menuSelect())
                })
        })
}


function removeRole() {
    db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "roleId",
                    message:
                        "Which role do you want to remove? (Warning: This will also remove employees)",
                    choices: roleChoices
                }
            ])
                .then(res => db.removeRole(res.roleId))
                .then(() => console.log("Removed role from the database"))
                .then(() => menuSelect())
        })
}

function viewDepartments() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => menuSelect());
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
            db.createDepartment(name)
                .then(() => console.log(`Added ${name.name} to the database`))
                .then(() => menuSelect())
        })
}

function removeDepartment() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt({
                type: "list",
                name: "departmentId",
                message:
                    "Which department would you like to remove? (Warning: This will also remove associated roles and employees)",
                choices: departmentChoices
            })
                .then(res => db.removeDepartment(res.departmentId))
                .then(() => console.log(`Removed department from the database`))
                .then(() => menuSelect())
        })
}

// View all departments and show their total utilized department budget
function viewUtilizedBudgetByDepartment() {
    db.viewDepartmentBudgets()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => menuSelect());
}

function addEmployee() {
    prompt([
        {
            name: "first_name",
            message: "What's the employee's first name?"
        },
        {
            name: "last_name",
            message: "What's the employee's last name?"
        }
    ])
        .then(res => {
            let firstName = res.first_name;
            let lastName = res.last_name;

            db.findAllRoles()
                .then(([rows]) => {
                    let roles = rows;
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
                            let roleId = res.roleId;

                            db.findAllEmployees()
                                .then(([rows]) => {
                                    let employees = rows;
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
                                            let employee = {
                                                manager_id: res.managerId,
                                                role_id: roleId,
                                                first_name: firstName,
                                                last_name: lastName
                                            }

                                            db.createEmployee(employee);
                                        })
                                        .then(() => console.log(
                                            `Added ${firstName} ${lastName} to the database`
                                        ))
                                        .then(() => menuSelect())
                                })
                        })
                })
        })
}

// Exit the application
function quit() {
    console.log("Goodbye!");
    process.exit();
}






