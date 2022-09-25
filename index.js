require("dotenv").config();

const EmployeeTracker = require("./lib/EmployeeTracker");

const newEt = new EmployeeTracker();

newEt.start();