const { searchEvents } = require('../models/eventModel');

async function searchEventList(query) {
    const {
    name,
    start_date_after,
    end_date_before,
    sortBy = 'start_date',
    sortOrder = 'asc',
    page = 1,
    limit = 10
  } = query;
  const offset = (page - 1) * limit;

  const filters = {
    name,
    start_date_after,
    end_date_before
  };

  const result = await searchEvents(filters, sortBy, sortOrder.toUpperCase(), offset, parseInt(limit));

  return {
    totalEvents: result.total,
    page: parseInt(page),
    limit: parseInt(limit),
    events: result.events.map(e => ({
      event_id: e.event_id,
      event_name: e.event_name
    }))
  };
}

module.exports = { searchEventList };
