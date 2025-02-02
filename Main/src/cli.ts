import inquirer from 'inquirer';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

function queryAsync(sql: string, params: any[] = []): Promise<QueryResult> {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}


await connectToDb();

class Cli {
    exit: boolean = false;
    sql: string = '';

    

    async viewDepartments(): Promise<void> {
      console.log('Viewing all departments...');
      this.sql = `SELECT * FROM department`;
      try {
        const result = await queryAsync(this.sql);
        console.table(result.rows);
      } catch (err) {
        console.error('Error executing query:', err);
      }
      this.performActions();
    }

    async viewRoles(): Promise<void> {
      console.log('Viewing all roles...');
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'department_id',
          message: 'Enter department ID:',
        },
      ]);
      this.sql = `SELECT * FROM role WHERE department_id = $1`;
      try {
        const result = await queryAsync(this.sql, [answers.department_id]);
        console.table(result.rows);
      } catch (err) {
        console.error('Error executing query:', err);
      }
      this.performActions();
    }

    async addDepartment(): Promise<void> {
      console.log('Adding department...');
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter department name:',
        },
      ]);
      this.sql = `INSERT INTO department (name) VALUES ($1)`;
      try {
        await queryAsync(this.sql, [answers.name]);
        console.log('Department added successfully.');
      } catch (err) {
        console.error('Error executing query:', err);
      }
      this.performActions();
    }

    async addRole(): Promise<void> {
      console.log('Adding role...');
      const answers = await inquirer.prompt([
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
      ]);
      this.sql = `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`;
      try {
        await queryAsync(this.sql, [answers.title, answers.salary, answers.department_id]);
        console.log('Role added successfully.');
      } catch (err) {
        console.error('Error executing query:', err);
      }
      this.performActions();
    }

    async addEmployee(): Promise<void> {
      console.log('Adding employee...');
      const answers = await inquirer.prompt([
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
      ]);
      this.sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
      try {
        await queryAsync(this.sql, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
        console.log('Employee added successfully.');
      } catch (err) {
        console.error('Error executing query:', err);
      }
      this.performActions();
    }   

    async updateEmployeeRole(): Promise<void> {
      console.log('Updating employee role...');
      const answers = await inquirer.prompt([
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
      ]);
      this.sql = `UPDATE employee SET role_id = $1 WHERE id = $2`;
      try {
        await queryAsync(this.sql, [answers.role_id, answers.employee_id]);
        console.log('Employee role updated successfully.');
      } catch (err) {
        console.error('Error executing query: ', err);
      }
      this.performActions();
    }

    async viewEmployees(): Promise<void> {
      console.log('Viewing all employees...');
      this.sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                  FROM employee 
                  LEFT JOIN role ON employee.role_id = role.id
                  LEFT JOIN department ON role.department_id = department.id
                  LEFT JOIN employee manager ON employee.manager_id = manager.id`;
      try {
        const result = await queryAsync(this.sql);
        console.table(result.rows);
      } catch (err) {
        console.error('Error executing query:', err);
      }
      this.performActions();
    }

    async performActions(): Promise<void> {
      console.log('perform actions');
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
        .then(async (answers: { action: string }) => {
          if (answers.action === 'View All Employees') {
            await this.viewEmployees();
          } else if (answers.action === 'Add Employee') {
            await this.addEmployee();
          } else if (answers.action === 'Update Employee Role') {
            await this.updateEmployeeRole();
          } else if (answers.action === 'View All Roles') {
            await this.viewRoles();
          } else if (answers.action === 'Add Role') {
            await this.addRole();
          } else if (answers.action === 'View All Departments') {
            await this.viewDepartments();
          } else if (answers.action === 'Add Department') {
            await this.addDepartment();
          } else {
            this.exit = true;
          }
          if (this.exit) {
            console.log('Goodbye!');
            pool.end();
          }
        });
    }
  }

  export default Cli;