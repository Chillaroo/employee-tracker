// Enable access to .env variables
require('dotenv').config();

const inquirer = require("inquirer");
const companyDatabase = require("./db/companyDB");
const table = require("console.table");

function viewOptions() {
    return [{
        type: "list",
        name: "view",
        message: "What would you like to do?",
        choices: [
            "View all employees",
            "Add employee",
            "Update Employee Role",
            "View all Roles",
            "Add Role",
            "View all departments",
            "Add department"]
    }];
}

async function chooseOption(res) {
    switch (res.view) {
        case "View all employees":
            let employeeTable = await companyDatabase.selectAllemployees();
            console.table(employeeTable[0]);
            return inquirer.prompt(viewOptions()).then(chooseOption);

        case "Add employee":
            inquirer
            .prompt([
                {
                    type: "input",
                    name: "first_name",
                    message: "What is the employee's first name?"
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "What is the employee's last name?"
                }
            ])
            .then(async (res)=>
                {
                    let firstName = res.first_name;
                    let lastName = res.last_name;
                    await companyDatabase.addEmployee(firstName, lastName);

                    let newEmployeeTable = await companyDatabase.selectAllemployees();
                    console.table(newEmployeeTable[0]);

                    return inquirer.prompt(viewOptions()).then(chooseOption);
                });
            break;
           
        case "Update Employee Role":
            return inquirer.prompt(viewOptions()).then(chooseOption);
      
        case "View all Roles":
            let roleTable = await companyDatabase.selectAllRoles();
            console.table(roleTable[0]);
            return inquirer.prompt(viewOptions()).then(chooseOption);

        case "Add Role":
            return inquirer.prompt(viewOptions()).then(chooseOption);
       
        case "View all departments":
            let departmentTable = await companyDatabase.selectAllDepartments();
            console.table(departmentTable[0]);
            return inquirer.prompt(viewOptions()).then(chooseOption);

        case "Add department":
            inquirer
            .prompt([
                {
                    type: "input",
                    name: "department",
                    message: "What department would you like to add?"
                }
            ])
            .then(async (res)=>
                {
                    let newDepartment = res.department;
                    await companyDatabase.addDepartment(newDepartment);

                    let newDepartmentTable = await companyDatabase.selectAllDepartments();
                    console.table(newDepartmentTable[0]);

                    return inquirer.prompt(viewOptions()).then(chooseOption);
                });
            break;
    }
}

inquirer.prompt(viewOptions())
    .then(chooseOption);