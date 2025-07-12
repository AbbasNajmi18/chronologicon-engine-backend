const { poolPromise } = require('./db');

async function testConnection() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT GETDATE() AS now');
    console.log('Current SQL Server Time:', result.recordset[0].now);
  } catch (err) {
    console.error('Query failed:', err);
  }
}

testConnection();
