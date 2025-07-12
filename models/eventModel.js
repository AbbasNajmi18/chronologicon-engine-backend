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

async function getEventById(event_id) {

const pool = await poolPromise;
const result= await pool.request().input('event_id', sql.Char(36), event_id).query('SELECT * FROM historical_events WHERE event_id = @event_id', { event_id });
return result.recordset[0];
}

async function getChildrenEvents(event_id) {
const pool = await poolPromise;
const result= await pool.request().input('event_id', sql.Char(36), event_id).query('SELECT * FROM historical_events WHERE parent_event_id = @event_id', { event_id });
return result.recordset;
}

async function getEvensInTimeRange(start_date, end_date) {
const pool = await poolPromise;
const result= await pool.request().input('start_date', sql.DateTime2, new Date(start_date))
.input('end_date', sql.DateTime2, new Date(end_date))
.query('SELECT * FROM historical_events WHERE start_date >= @start_date AND end_date <= @end_date', { start_date, end_date });
return result.recordset;
}

module.exports = { insertEvent,getEventById,getChildrenEvents,getEvensInTimeRange };
