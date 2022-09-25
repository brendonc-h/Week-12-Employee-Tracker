const express = require('express');

const mysql = require('mysql2');


const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({extented: false}));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'movies_db'
    },
    console.log('Connected to the departments_db database!')
);

//inquierer for the selections
const commonQuestions = [
    {
        type: 'input',
        message: 'view all departments',
        name: 'Deparments'
    },
    {
        type: 'input',
        message: 'view all roles',
        name: 'Roles'
    }, {
        type: 'input',
        message: 'view all employees',
        name: 'Employees'
    }, {
        type: 'input',
        message: 'add a department',
        name: 'ViewDeparments'
    }, {
        type: 'input',
        message: 'add a role',
        name: 'AddRole'
    }, {
        type: 'input',
        message: 'add a employee',
        name: 'AddEmployee'
    }, {
        type: 'input',
        message: 'update an employee role',
        name: 'UpdateEmployee'
    },
]
// functions to make the selections have options
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'confirm',
            message: "Would you like to add another team member?",
            name: "add",

        }
    ]).then((data) => {
        if (data.add === true) {
            choice()
        } else {
            wholeTeam()
        }
    })
}


app.get("url", (res, req)) => {

};

db.query('')
