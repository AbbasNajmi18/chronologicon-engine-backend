const fs = require('fs');
const readline = require('readline');
const ingestionJobs = require('../memory/ingestion');
const { insertEvent } = require('../models/eventModel');
const { isValidDate, isValidJson } = require('../utils/validators');

async function ingestFileService(filePath, jobId) {
  const job = {
    jobId,
    status: 'PROCESSING',
    processedLines: 0,
    errorLines: 0,
    totalLines: 0,
    errors: [],
    startTime: new Date().toISOString(),
    endTime: null
  };

  ingestionJobs.set(jobId, job);

  try {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    let lineNumber = 0;

    for await (const line of rl) {
      lineNumber++;
      job.totalLines++;
      job.processedLines++;

      const parts = line.split('|');
      if (parts.length !== 7) {
        job.errorLines++;
        job.errors.push(`Line ${lineNumber}: Malformed entry: '${line}' | Missing fields.`);
        continue;
      }

      let [event_id, event_name, description, start_date, end_date, parent_event_id, metadata] = parts;

      if (!event_id || event_id.length !== 36) {
        job.errorLines++;
        job.errors.push(`Line ${lineNumber}: Invalid UUID for event_id: '${event_id}'`);
        continue;
      }

      if (!event_name || !start_date || !end_date) {
        job.errorLines++;
        job.errors.push(`Line ${lineNumber}: Missing required fields`);
        continue;
      }

      if (!isValidDate(start_date) || !isValidDate(end_date)) {
        job.errorLines++;
        job.errors.push(`Line ${lineNumber}: Invalid date format`);
        continue;
      }

      if (metadata && !isValidJson(metadata)) {
        job.errorLines++;
        job.errors.push(`Line ${lineNumber}: Invalid JSON in metadata`);
        continue;
      }

      try {
        await insertEvent({
          event_id,
          event_name,
          description,
          start_date,
          end_date,
          parent_event_id: parent_event_id || null,
          metadata
        });
      } catch (err) {
        job.errorLines++;
        job.errors.push(`Line ${lineNumber}: DB Error - ${err.message}`);
      }
    }

    job.status = 'COMPLETED';
    job.endTime = new Date().toISOString();
  } catch (err) {
    job.status = 'FAILED';
    job.endTime = new Date().toISOString();
    job.errors.push(`Fatal error: ${err.message}`);
  }

  ingestionJobs.set(jobId, job);
}

module.exports = ingestFileService;
