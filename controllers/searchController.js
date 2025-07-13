const { searchEventList } = require('../services/searchService');

async function searchEvents(req, res) {
  try {
    const result = await searchEventList(req.query);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { searchEvents };
