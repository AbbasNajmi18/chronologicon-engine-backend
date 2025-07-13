const express = require('express');
const { getOverlappingEvents,getLargestTemporalGap,getEventInfluence } = require('../controllers/insightController');

const router = express.Router();
router.get('/overlapping-events', getOverlappingEvents);
router.get('/temporal-gaps', getLargestTemporalGap);
router.get('/event-influence', getEventInfluence);

module.exports = router;
