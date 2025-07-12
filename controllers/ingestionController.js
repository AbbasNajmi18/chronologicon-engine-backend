const { v4: uuidv4 } = require('uuid');
const ingestionJobs = require('../memory/ingestion');
const ingestFileService = require('../services/ingestionService');

async function handleIngestRequest(req, res) {
  const { filePath } = req.body;
  if (!filePath) {
    return res.status(400).json({ error: 'filePath is required' });
  }

  const jobId = "ingest-job-" + uuidv4();
  ingestFileService(filePath, jobId);

  res.status(202).json({
    status: 'Ingestion initiated',
    jobId,
    message: "Check /api/events/ingestion-status/" + jobId + " for updates."
  });
}

function getIngestionStatus(req, res) {
  const { jobId } = req.params;
  const job = ingestionJobs.get(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json({
    jobId,
    ...job
  });
}

module.exports = { handleIngestRequest, getIngestionStatus };
