const sendJsonResponse = (
  response,
  httpCode,
  status = false,
  message = "No Message To Show!",
  payload = null
) => {
  return response
    .status(HTTP_STATUS_CODES.OK)
    .json({ httpCode, status, message, count: payload?.length, payload });
};

const checkForMissingKeysInObject = (object, keys) => {
  const missingFields = [];
  for (let key of keys) {
    if (!(key in object)) {
      missingFields.push(key);
    }
  }
  return missingFields.length > 0 ? missingFields : null;
};

module.exports = {
  sendJsonResponse,
  checkForMissingKeysInObject,
};
