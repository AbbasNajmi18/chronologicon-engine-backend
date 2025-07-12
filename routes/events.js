const express = require('express');
const { handleIngestRequest,getIngestionStatus } = require('../controllers/ingestionController');
const router = express.Router();

router.post('/ingest',handleIngestRequest)
router.get('/ingestion-status/:jobId',getIngestionStatus)   

module.exports = router;
