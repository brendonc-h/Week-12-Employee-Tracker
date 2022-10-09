DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

 CREATE TABLE role (
     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(30) NOT NULL,
     salary DECIMAL(10, 2) NOT NULL,
     department_id INT NOT NULL,
     PRIMARY KEY(id),
     FOREIGN KEY (department_id) REFERENCES department(id)
 );
 CREATE TABLE employee (
     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY.
     first_name VARCHAR(30) NOT NULL,
     last_name VARCHAR(30) NOT NULL,
     role_id INT NOT NULL,
     manager_id INT,
     FOREIGN KEY (manager_id) REFERENCES employee(id),
     PRIMARY KEY(id),
     FOREIGN KEY(role_id) REFERENCES role(id)
 );