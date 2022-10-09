DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
   
);

 CREATE TABLE role (
     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(30) NOT NULL,
     salary DECIMAL(10, 2) NOT NULL,
     department_key INT NOT NULL,
     index department_id(department_key),
   
     FOREIGN KEY (department_key) REFERENCES department(id)
 );
 CREATE TABLE employee (
     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     first_name VARCHAR(30) NOT NULL,
     last_name VARCHAR(30) NOT NULL,
     role_key INT NOT NULL,
     manager_key INT,
     index role_id(role_key),
    index manager_id(manager_key),
     FOREIGN KEY (manager_key) REFERENCES employee(id),
    
     FOREIGN KEY(role_key) REFERENCES role(id)
 );