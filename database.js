const mariadb = require("mariadb");

const DatabaseConnection = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '211104',
    database: 'zontli',
    connectionLimit: 5
});

module.exports = DatabaseConnection;