const { getOverlapEventPairs,findLargestTemporalGap,findShortestInfluencePath } = require('../services/insightService');

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

async function getLargestTemporalGap(req, res) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    try {
      const largestGap = await findLargestTemporalGap(startDate, endDate);
      res.status(200).json(largestGap);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function getEventInfluence(req, res) {
    const { sourceEventId, targetEventId } = req.query;
  
    if (!sourceEventId || !targetEventId) {
      return res.status(400).json({ error: 'sourceEventId and targetEventId are required.' });
    }
  
    try {
      const result = await findShortestInfluencePath(sourceEventId, targetEventId);
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  

module.exports = { getOverlappingEvents,getLargestTemporalGap,getEventInfluence };
