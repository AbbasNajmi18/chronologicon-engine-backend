const express = require('express');
const { handleIngestRequest,getIngestionStatus } = require('../controllers/ingestionController');
const { searchEvents } = require('../controllers/searchController');
const router = express.Router();

router.post('/ingest',handleIngestRequest)
router.get('/ingestion-status/:jobId',getIngestionStatus)   
router.get('/search', searchEvents);

module.exports = router;
