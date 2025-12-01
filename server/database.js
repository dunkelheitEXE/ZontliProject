const mariadb = require("mysql2");

const DatabaseConnection = mariadb.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456789',
    database: 'zontli',
    port: 3308,
    waitForConnections: true,
    connectionLimit: 10,
}).promise();

module.exports = DatabaseConnection;