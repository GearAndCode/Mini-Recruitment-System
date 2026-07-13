require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testConnection() {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL Connected Successfully");
  } catch (err) {
  console.error("❌ Database Connection Failed");
  console.error(err);
  throw err;
}
}

testConnection();

module.exports = pool;