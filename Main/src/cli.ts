import inquirer from 'inquirer';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

await connectToDb();

class Cli {
    exit: boolean = false;
    sql: string = '';

    async viewDepartments(): Promise<void> {
      console.log('Viewing all departments...');
      this.sql = `SELECT * FROM department`;
      pool.query(this.sql, (err: Error, result: QueryResult) => {
        if (err) {
          console.error('Error executing query:', err);
          return;
        }
      console.table(result.rows);
      });
      this.performActions();
    }

    async viewRoles(): Promise<void> {
      console.log('Viewing all roles...');
      await inquirer.prompt([
        {
          type: 'input',
          name: 'department_id',
          message: 'Enter department ID:',
        },
      ]).then((answers: any) => {
        this.sql = `SELECT * FROM role WHERE department_id = $1`;
        pool.query(this.sql, [answers.department_id], (err: Error, result: QueryResult) => {
          if (err) {
            console.error('Error executing query:', err);
            return;
          }
          console.table(result.rows);
        });
      });
      this.performActions();
    }

    async addDepartment(): Promise<void> {
      console.log('Adding department...');
      await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter department name:',
        },
      ]).then((answers: any) => {
        this.sql = `INSERT INTO department (name) VALUES ($1)`;
        pool.query(this.sql, [answers.name], (err: Error, _result: QueryResult) => {
          if (err) {
            console.error('Error executing query:', err);
            return;
          }
          console.log('Department added successfully.');
        });
      });
      this.performActions();
    }

    async addRole(): Promise<void> {
      console.log('Adding role...');
      await inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter role title:',
        },
        {
          type: 'number',
          name: 'salary',
          message: 'Enter role salary:',
        },
        {
          type: 'number',
          name: 'department_id',
          message: 'Enter role department ID:',
        },
      ]).then((answers: any) => {
        this.sql = `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`;
        pool.query(this.sql, [answers.title, answers.salary, answers.department_id], (err: Error, _result: QueryResult) => {
          if (err) {
            console.error('Error executing query:', err);
            return;
          }
          console.log('Role added successfully.');
        });
      });
      this.performActions();
    }

    async addEmployee(): Promise<void> {
      console.log('Adding employee...');
      await inquirer.prompt([
        {
          type: 'input',
          name: 'first_name',
          message: 'Enter employee first name:',
        },
        {
          type: 'input',
          name: 'last_name',
          message: 'Enter employee last name:',
        },
        {
          type: 'number',
          name: 'role_id',
          message: 'Enter employee role ID:',
        },
        {
          type: 'number',
          name: 'manager_id',
          message: 'Enter employee manager ID:',
        },
      ]).then((answers: any) => {
        this.sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
        pool.query(this.sql, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err: Error, _result: QueryResult) => {
          if (err) {
            console.error('Error executing query:', err);
            return;
          }
          console.log('Employee added successfully.');
        });
      });
      this.performActions();
    }   

    async updateEmployeeRole(): Promise<void> {
      console.log('Updating employee role...');
      await inquirer.prompt([
        {
          type: 'number',
          name: 'employee_id',
          message: 'Enter employee ID:',
        },
        {
          type: 'number',
          name: 'role_id',
          message: 'Enter new role ID:',
        },
      ]).then((answers: any) => {
        this.sql = `UPDATE employee SET role_id = $1 WHERE id = $2`;
        pool.query(this.sql, [answers.role_id, answers.employee_id], (err: Error, _result: QueryResult) => {
          if (err) {
            console.error('Error executing query: ', err);
            return;
          }
          console.log('Employee role updated successfully.');
        });
    });
    this.performActions();
    }

    async viewEmployees(): Promise<void> {
      console.log('Viewing all employees...');
      this.sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id`;
      pool.query(this.sql, (err: Error, result: QueryResult) => {
        if (err) {
          console.error('Error executing query:', err);
          return;
        }
        console.table(result.rows);
      });
      this.performActions();
    }

    async performActions(): Promise<void> {
      console.log("perform actions");
        await inquirer
          .prompt([
            {
              type: 'list',
              name: 'action',
              message: 'What would you like to do?',
              choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Exit',
              ],
            },
          ])
          .then(async (answers: { action: string; }) => {
            
            
            if (answers.action === 'View All Employees') {
              this.viewEmployees();
            } else if (answers.action === 'Add Employee') {
              this.addEmployee();
            } else if (answers.action === 'Update Employee Role') {
              this.updateEmployeeRole();
            } else if (answers.action === 'View All Roles') {
              this.viewRoles();
            } else if (answers.action === 'Add Role') {
              this.addRole();
            } else if (answers.action === 'View All Departments') {
              this.viewDepartments();
            } else if (answers.action === 'Add Department') {
              this.addDepartment();
            } else {
              this.exit = true;
            }
            if (this.exit) {
              console.log('Goodbye!');
              pool.end();
              return;
            }
          });
          
      }
  }

  export default Cli;