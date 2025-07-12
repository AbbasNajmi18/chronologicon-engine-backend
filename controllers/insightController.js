const { getOverlapEventPairs } = require('../services/insightService');

async function getOverlappingEvents(req, res) {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate are required' });
  }

  try {
    const overlaps = await getOverlapEventPairs(startDate, endDate);
    res.status(200).json(overlaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getOverlappingEvents };
