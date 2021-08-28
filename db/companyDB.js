const connection = require('./connection.js');

class CompanyDatabase {
    constructor(connection) {
        this.connection = connection;
    }
    selectAllDepartments() {
        return this.connection.promise().query("SELECT * FROM department")
    }

    selectAllRoles() {
        return this.connection.promise().query(
            `SELECT 
                employee_role.id, 
                title, 
                department.department_name AS department, 
                salary
            FROM employee_role 
            JOIN department ON department.id=employee_role.department_id`)
    }

    selectAllemployees() {
        return this.connection.promise().query(`
        SELECT 
            e1.id, 
            e1.first_name, 
            e1.last_name, 
            r.title, 
            d.department_name AS department, 
            r.salary, 
        CASE 
            WHEN e2.first_name IS NULL THEN NULL 
            ELSE CONCAT(e2.first_name, " ", e2.last_name) 
        END AS manager
        FROM employee AS e1
        JOIN employee_role AS r ON r.id=e1.role_id
        JOIN department AS d ON d.id=r.department_id
        LEFT JOIN employee AS e2 ON e2.id=e1.manager_id
        `)
    }

    addDepartment(name) {
        return this.connection.promise().query("INSERT INTO department(department_name) VALUES (?)", [name])
    }

    addEmployee(first_name, last_name, role_id, manager_id) {
        return this.connection.promise().query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [first_name, last_name, role_id, manager_id])
    }

    addRole(title, salary, department_id) {
        return this.connection.promise().query("INSERT INTO employee_role(title, salary, department_id) VALUES (?,?,?)", [title, salary, department_id])
    }

    selectDepartmentId(department_name) {
        return this.connection.promise().query("SELECT id FROM department WHERE department_name = ?", [department_name])
    }

    selectEmployeeId(first_name, last_name) {
        return this.connection.promise().query("SELECT id FROM employee WHERE first_name = ? AND last_name = ?", [first_name, last_name])
    }

    selectRoleId(title) {
        return this.connection.promise().query("SELECT id FROM employee_role WHERE title = ?", [title])
    } 

    updateRole(role_id, employee_id) {
        return this.connection.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [role_id, employee_id])
    }
}

module.exports = new CompanyDatabase(connection);