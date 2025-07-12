const express = require('express');
const { getOverlappingEvents } = require('../controllers/insightController');

const router = express.Router();
router.get('/overlapping-events', getOverlappingEvents);

module.exports = router;
