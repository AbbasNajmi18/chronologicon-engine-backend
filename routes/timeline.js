const express = require('express');
const { getTimelineController } = require('../controllers/timelineController');

const router = express.Router();

router.get('/:rootEventId', getTimelineController);

module.exports = router;
