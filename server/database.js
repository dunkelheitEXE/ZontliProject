const mariadb = require("mysql2");

const DatabaseConnection = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Alan7702alan21',
    database: 'zontli',
    waitForConnections: true,
    connectionLimit: 10,
}).promise();

module.exports = DatabaseConnection;