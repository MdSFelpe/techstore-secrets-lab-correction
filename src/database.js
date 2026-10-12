const { getDatabaseConfig } = require('./config');

function connect() {
    const database = getDatabaseConfig();

    const connection = {
        host: database.host,
        port: database.port,
        database: database.database,
        user: database.username,
        password: database.password
    };

    console.log('Database configuration loaded successfully.');

    return connection;
}

module.exports = {
    connect
};