const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost', // <--- El nombre del servicio de tu base de datos en docker-compose
  user: 'root',
  port: 3308,
  password: '123456789',
  database: 'zontli'
});

connection.connect(function(err) {
  if (err) {
    console.error('Error conectándose a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos con ID: ' + connection.threadId);
});

// module.exports = DatabaseConnection;