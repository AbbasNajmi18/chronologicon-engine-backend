const express = require('express');
const { getOverlappingEvents,getLargestTemporalGap } = require('../controllers/insightController');

const router = express.Router();
router.get('/overlapping-events', getOverlappingEvents);
router.get('/temporal-gaps', getLargestTemporalGap);

module.exports = router;
