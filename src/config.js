function getDatabaseConfig() {
    const config = {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        database: process.env.DB_NAME || "techstore",
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    };

    if (!config.username || !config.password) {
        throw new Error(
            "Database credentials are not configured. Check DB_USER and DB_PASSWORD."
        );
    }

    return config;
}

module.exports = {
    getDatabaseConfig
};