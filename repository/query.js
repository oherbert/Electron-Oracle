class Query { 
static department = `SELECT department_id, department_name, manager_id
                    FROM departments
                    WHERE department_id = :id`;
static acesso = `SELECT 1 
                  FROM acesso u
                  WHERE u.usuario = :usuario
                  AND u.senha = :senha`;
static allDeps = `SELECT department_id, department_name, manager_id
                 FROM departments
                 ORDER BY department_id`;

static allEmps = `SELECT e.employee_id,
                 e.first_name,
                 e.last_name,
                 e.email,
                 e.phone_number,
                 e.job_id,
                 e.salary
                 FROM hr.employees e
                 WHERE e.department_id = :dep
                 ORDER BY e.employee_id` 
}
module.exports = Query;