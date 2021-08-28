// Enable access to .env variables
require('dotenv').config();

const inquirer = require("inquirer");
const companyDatabase = require("./db/companyDB");
require("console.table");


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
            "Add department",
            "Quit"
        ]
    }];
}

async function chooseOption(res) {
    switch (res.view) {
        case "View all employees":

            let employeeTable = await companyDatabase.selectAllemployees();
            console.table(employeeTable[0]);
            return inquirer.prompt(viewOptions()).then(chooseOption);

        case "Add employee":

            let roleTitles = await getRoleList();
            let managerNames = await getEmployeeList();

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
                },
                {
                    type: "list",
                    name: "role",
                    choices: roleTitles,
                    message: "What is the employee's role?"
                },
                {
                    type: "list",
                    name: "manager",
                    choices: managerNames,
                    message: "Who is the employee's manager?"
                }
            ])
            .then(async (res)=>
                {   
                    let roleId = await companyDatabase.selectRoleId(res.role); 

                    if(res.manager==="none"){
                        
                        await companyDatabase.addEmployee(res.first_name, res.last_name, roleId[0][0].id, null); 

                    } else{

                        let managerName = res.manager.split(' ')
                        let firstName = managerName[0];
                        let lastName = managerName[1];
                        let managerId = await companyDatabase.selectEmployeeId(firstName, lastName)
                        await companyDatabase.addEmployee(res.first_name, res.last_name, roleId[0][0].id, managerId[0][0].id);
                    }

                    let newEmployeeTable = await companyDatabase.selectAllemployees();
                    console.table(newEmployeeTable[0]);

                    console.log(`${res.first_name} ${res.last_name} has been added to the database.`);
                    
                    return inquirer.prompt(viewOptions()).then(chooseOption);
                });
            break;
           
        case "Update Employee Role":
                
                let employeeList = await getEmployeeList();
                let roleList = await getRoleList();

                inquirer.prompt([{
                    type: "list",
                    name: "name",
                    choices: employeeList,
                    message: "Which employee's role do you want to update?"
                },
                {
                    type: "list",
                    name: "title",
                    choices: roleList,
                    message: "Which role do you want to assign to the employee?"
                }
                ]).then( async (res) => {
                    let roleId = await companyDatabase.selectRoleId(res.title);
            
                    let employeeName = res.name.split(' ')
                    let first = employeeName[0];
                    let last = employeeName[1];
                    let employeeId =  await companyDatabase.selectEmployeeId(first, last);
                    await companyDatabase.updateRole(roleId[0][0].id, employeeId[0][0].id);
                    return inquirer.prompt(viewOptions()).then(chooseOption);
                });
                break;

        case "View all Roles":
            let roleTable = await companyDatabase.selectAllRoles();
            console.table(roleTable[0]);
            return inquirer.prompt(viewOptions()).then(chooseOption);

        case "Add Role":
            let departmentsForRole = await companyDatabase.selectAllDepartments();
            let departmentNamesForRole = [];
            for(let i=0; i<departmentsForRole[0].length; i++){
                departmentNamesForRole.push(departmentsForRole[0][i].department_name)
                }
            inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "What is the name of the role?"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary of the role?"
                },
                {
                    type: "list",
                    name: "department",
                    choices: departmentNamesForRole,
                    message: "What department does the role belong to?"
                }
            ])
            .then(async (res)=>
                {   
                    let title = res.title;
                    let salary = res.salary;
                    let departmentId = await companyDatabase.selectDepartmentId(res.department);
                    await companyDatabase.addRole(title, salary, departmentId[0][0].id);
                    return inquirer.prompt(viewOptions()).then(chooseOption);
                });
            break;
       
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
                    console.log(`${newDepartment} has been added to the database.`);
                    return inquirer.prompt(viewOptions()).then(chooseOption);
                });
            break;
        case "Quit":
            process.exit();
            break;
    }
}

async function getEmployeeList() {
    let employeeData = await companyDatabase.selectAllemployees();
    let employeeList = [];
    
    for(let i=0; i<employeeData[0].length; i++){
        let first = employeeData[0][i].first_name;
        let last = employeeData[0][i].last_name;
        let full = first.concat(' ',last);
        employeeList.push(full);
    }
    employeeList.push("none");
    return employeeList;
}

async function getRoleList() {
    let roleData = await companyDatabase.selectAllRoles();
    let roleList = [];

    for(let i=0; i<roleData[0].length; i++){
        roleList.push(roleData[0][i].title)
        }
    return roleList;
}

inquirer.prompt(viewOptions())
    .then(chooseOption);