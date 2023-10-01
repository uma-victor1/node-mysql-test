const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 3002

// create a connection with mysql

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'employee_db',
})

//connect db

db.connect((err) => {
  if (err) {
    throw err
  }
  console.log('mysql created')
})

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// create Table

app.get('/createemptab', (req, res) => {
  let sql =
    'CREATE TABLE employee_table(id int AUTO_INCREMENT, name VARCHAR(255), age VARCHAR(255), PRIMARY KEY(id) )'
  db.query(sql, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send('employee table created')
  })
})

// add an employee to our table
app.get('/newemp', (req, res) => {
  const sql =
    'INSERT INTO employee_table (name, age) VALUES ("Uma Victor", "33")'
  db.query(sql, (err, result) => {
    if (err) {
      throw err
    }
    console.log(result)
    res.status(200)
    res.send(JSON.stringify(result) + 'added new employee to db')
  })
})

// dynamically add an employee
app.post('/newhire', (req, res) => {
  const { name, age } = req.body

  const sql = `INSERT INTO employee_table (name, age) VALUES ("${name}", "${age}")`
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500)
      res.send('operation failed')
      throw err
    }
    res.status(200)
    res.send(`added new employee ${name} to db`)
  })
})
// remove an employee
app.delete('/delete/:id', (req, res) => {
  let id = parseInt(req.params['id'])
  let sql = `DELETE FROM employee_table WHERE id = ${id}`
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500)
      res.send('can not delete employee')
      throw err
    }

    res.send(`employee with ${id} deleted`)
  })
})

// update an employee information

app.patch('/update/:id', (req, res) => {
  const { name, age } = req.body

  let id = parseInt(req.params['id'])
  const sql = `UPDATE employee_table SET name = "${name}", age = "${age}" WHERE id = ${id}`
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500)
      res.send('Could not update user')
      throw err
    }
    res.send(`updated ${name} succesfully`)
  })
})

const html = `<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
    Hello from Victors app
    </body>
</html>`

app.get('/', (req, res) => {
  res.type('html').send(html)
})

const server = app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})

server.keepAliveTimeout = 120 * 1000
server.headersTimeout = 120 * 1000
