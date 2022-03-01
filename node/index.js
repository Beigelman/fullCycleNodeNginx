const express = require('express');
const axios = require('axios').default;
const mysql = require('mysql');

const app = express();
const PORT = 3000;

const config = {
  host: 'db',
  user: 'root',
  database: 'nodedb',
  password: 'root',
};

const connection = mysql.createConnection(config);

const createTable  = `CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL);`
connection.query(createTable);

app.get('/', async (req, res) => {
  const RANDOM = Math.floor(Math.random() * 10);
  const response = await axios.get('https://swapi.dev/api/people');
  const personName = response.data.results[RANDOM].name;

  const insertQuery = `INSERT INTO people(name) values('${personName}')`;
    
  connection.query(insertQuery);
  console.log(`${personName} inserido no banco!`);    

  const getUsersQuery = `SELECT id, name FROM people`;  
  
  connection.query(getUsersQuery, (error, results, fields) => {
    if (error) {
      throw error
    };
    
    let table = '<table>';
    table += '<tr><th>#</th><th>Name</th></tr>';
    for(let people of results) {      
      table += `<tr><td>${people.id}</td><td>${people.name}</td></tr>`;
    }

    table += '</table>';    
    res.send('<h1>Full Cycle Rocks!</h1>' + table);    
  });   
  connection.end();
  res.send('<h1>Full Cycle Rocks!</h1>');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});