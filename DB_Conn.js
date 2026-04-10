const mysql = require('mysql');

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10,       // Max number of connections in the pool
  host: "localhost",         // Your DB host
  user: "root",              // Your DB user
  password: "root1",          // Your DB password
  database: "db1"            // Your database name
});

// Test connection once on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("✅ Connected to MySQL Database 'db1' successfully!");
    connection.release(); // Release after test
  }
});

// Export pool to use in other files
module.exports = pool;
