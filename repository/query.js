class Query { 
static department = `SELECT department_id, department_name, manager_id
                    FROM departments
                    WHERE department_id = :id`;
static usuario = `SELECT 1 
                  FROM usuario u
                  WHERE u.computador = :computador
                  AND u.organizacao = :organizacao`;
static allDeps = `SELECT department_id, department_name, manager_id
                 FROM departments
                 ORDER BY department_id`;

static allEmps = `SELECT * 
                 FROM hr.employees e
                 WHERE e.department_id = :dep
                 ORDER BY e.employee_id` 
}
module.exports = Query;