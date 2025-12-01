const mariadb = require("mysql2");

try {
    const DatabaseConnection = mariadb.createPool({
        host: 'localhost',
        user: 'root',
        password: '123456789',
        database: 'zontli',
        port: 3308,
        waitForConnections: true,
        connectionLimit: 10,
    }).promise();
    console.log("OK");
    DatabaseConnection.query("SHOW DATABASES").then(res => {
        console.log(res);
    })
} catch(er) {
    console.log(er);
}

// module.exports = DatabaseConnection;