const connection = require('./connection.js');

class CompanyDatabase {
    constructor(connection) {
        this.connection = connection;
    }
    selectAllDepartments() {
        return this.connection.promise().query("SELECT * FROM department")
    }

    selectAllRoles() {
        return this.connection.promise().query("SELECT * FROM employee_role")
    }

    selectAllemployees() {
        return this.connection.promise().query("SELECT * FROM employee")
    }

    addDepartment(name) {
        return this.connection.promise().query("INSERT INTO department(department_name) VALUES (?)", [name])
    }

    addEmployee(first_name, last_name) {
        return this.connection.promise().query("INSERT INTO employee (first_name, last_name) VALUES (?, ?)", [first_name, last_name])
    }
    selectOneEmployee(id) {
        return this.connection.promise().query("SELECT * FROM employee WHERE id = ?", id)
    }
    updateRole(role_id, employee_id) {
        return this.connection.promise().query("UPDATE employee SET role_id = ? WHERE employee_id = ?", [role_id, employee_id])
    }
}

module.exports = new CompanyDatabase(connection);