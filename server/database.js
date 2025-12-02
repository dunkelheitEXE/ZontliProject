const mariadb = require("mysql2");

const DatabaseConnection = mariadb.createPool({
    host: 'zontli-db',
    user: 'root',
    password: '123456789',
    database: 'zontli',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
}).promise();

module.exports = DatabaseConnection;