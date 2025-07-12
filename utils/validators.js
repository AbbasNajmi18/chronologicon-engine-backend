const { validate: isUuid } = require('uuid');

function isValidDate(value) {
  return !isNaN(Date.parse(value));
}

function isValidJson(json) {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
}

module.exports = { isUuid, isValidDate, isValidJson };
