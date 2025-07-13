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

async function getSortEventsByStartDate(start_date,end_date) {
    const pool = await poolPromise;
    const result= await pool.request()
    .input('start_date', sql.DateTime2, new Date(start_date))
    .input('end_date', sql.DateTime2, new Date(end_date))
    .query('SELECT * FROM historical_events WHERE start_date >= @start_date AND end_date <= @end_date ORDER BY start_date ASC', { start_date, end_date });
    return result.recordset;
}

async function searchEvents(filters, sortBy, sortOrder, offset, limit) {
  const pool = await poolPromise;

  const whereClauses = [];
  const params = [];

  if (filters.name) {
    whereClauses.push("LOWER(event_name) LIKE LOWER(@name)");
    params.push({ key: 'name', type: sql.NVarChar, value: `%${filters.name}%` });
  }

  if (filters.start_date_after) {
    whereClauses.push("start_date > @start_date_after");
    params.push({ key: 'start_date_after', type: sql.DateTime2, value: new Date(filters.start_date_after) });
  }

  if (filters.end_date_before) {
    whereClauses.push("end_date < @end_date_before");
    params.push({ key: 'end_date_before', type: sql.DateTime2, value: new Date(filters.end_date_before) });
  }

  const whereSQL = whereClauses.length ? "WHERE " + whereClauses.join(" AND ") : "";
  const orderSQL = sortBy ? `ORDER BY ${sortBy} ${sortOrder}` : "";

  const countQuery = `SELECT COUNT(*) as total FROM historical_events ${whereSQL}`;
  const countRequest = pool.request();
  params.forEach(p => countRequest.input(p.key, p.type, p.value));
  const countResult = await countRequest.query(countQuery);

  const query = `
    SELECT * FROM historical_events
    ${whereSQL}
    ${orderSQL}
    OFFSET @offset ROWS
    FETCH NEXT @limit ROWS ONLY;
  `;
  const dataRequest = pool.request();
  params.forEach(p => dataRequest.input(p.key, p.type, p.value));
  dataRequest.input("offset", sql.Int, offset);
  dataRequest.input("limit", sql.Int, limit);

  const result = await dataRequest.query(query);

  return {
    events: result.recordset,
    total: countResult.recordset[0].total
  };
}



module.exports = { insertEvent,getEventById,getChildrenEvents,getEvensInTimeRange,getSortEventsByStartDate,searchEvents };
