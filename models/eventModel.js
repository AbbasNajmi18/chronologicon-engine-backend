const { poolPromise, sql } = require('../db');

async function insertEvent(event) {
  const pool = await poolPromise;

  return await pool.request()
    .input('event_id', sql.Char(36), event.event_id)
    .input('event_name', sql.NVarChar(255), event.event_name)
    .input('description', sql.NVarChar(sql.MAX), event.description)
    .input('start_date', sql.DateTime2, new Date(event.start_date))
    .input('end_date', sql.DateTime2, new Date(event.end_date))
    .input('parent_event_id', sql.Char(36), event.parent_event_id)
    .input('metadata', sql.NVarChar(sql.MAX), event.metadata)
    .query(`
      INSERT INTO historical_events 
      (event_id, event_name, description, start_date, end_date, parent_event_id, metadata)
      VALUES 
      (@event_id, @event_name, @description, @start_date, @end_date, @parent_event_id, @metadata)
    `);
}

module.exports = { insertEvent };
