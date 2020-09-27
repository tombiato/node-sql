const express = require('express');
const app = express();
const axios = require('axios');
const mysql = require('mysql');

const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded())

const con = mysql.createConnection({
    host: "localhost",
    port: "8889",
    user: "root",
    password: "root",
    database: "mydb"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.all('/', (req, res) => {
    con.query("SELECT * FROM users", function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });
})

app.post('/users', (req, res) => {
    const sql = "INSERT INTO users (pseudo, email, firstname, lastname) VALUES (?)";
    const values = [
        req.body.pseudo,
        req.body.email,
        req.body.firstname,
        req.body.lastname
    ]
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        res.send('1 record inserted')
        console.log("1 record inserted");
    });
})

app.get('/users/:userId', (req, res) => {
    const sql = `SELECT * FROM users WHERE id = ${req.params.userId}`
    con.query(sql, function (err, result, field) {
        if (err) throw err
        res.send(result)
    })
})

app.get('/users', (req, res) => {
    const sql = `SELECT * FROM users LIMIT ${req.query.limit} OFFSET ${req.query.offset}`
    con.query(sql, function (err, result, field) {
        if (err) throw err
        res.send(result)
    })
})

app.delete('/users/:userId', (req, res) => {
    const sql = `DELETE FROM users WHERE id = ${req.params.userId}`
    con.query(sql, function (err, result, field) {
        if (err) throw err
        res.send(result)
    })
})

app.put('/users/:userId', (req, res) => {
    const sql = `UPDATE users SET pseudo = ?, email = ?, firstname = ?, lastname = ? WHERE id = ${req.params.userId}`;
    const values = [
        req.body.pseudo,
        req.body.email,
        req.body.firstname,
        req.body.lastname
    ]
    con.query(sql, values, function (err, result) {
        if (err) throw err;
        res.send(result.affectedRows + " record(s) updated")
    });
})

console.log(port)

app.listen(port);