const sql = require('mssql');

const config = {
  user: 'sa',                       
  password: 'password',            
  server: 'localhost',             
  port: 1433,                      
  database: 'chronologicon',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

module.exports = { sql, poolPromise };
