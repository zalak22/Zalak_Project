const allowedStatuses = ['confirmed', 'pending', 'reversed', 'corrected'];

const isValidIsoDate = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
  if (!isoDateRegex.test(value)) {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

const validateCreateEvent = (req, res, next) => {
  const errors = [];
  const { customerId, eventId, timestamp, amount, source, status } = req.body || {};

  if (!customerId || typeof customerId !== 'string' || !customerId.trim()) {
    errors.push({
      field: 'customerId',
      message: 'customerId is required'
    });
  }

  if (!eventId || typeof eventId !== 'string' || !eventId.trim()) {
    errors.push({
      field: 'eventId',
      message: 'eventId is required'
    });
  }

  if (!timestamp) {
    errors.push({
      field: 'timestamp',
      message: 'timestamp is required'
    });
  } else if (!isValidIsoDate(timestamp)) {
    errors.push({
      field: 'timestamp',
      message: 'timestamp must be a valid ISO date'
    });
  }

  if (amount === undefined || amount === null || amount === '') {
    errors.push({
      field: 'amount',
      message: 'amount is required'
    });
  } else if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
    errors.push({
      field: 'amount',
      message: 'amount must be a number greater than 0'
    });
  }

  if (!source || typeof source !== 'string' || !source.trim()) {
    errors.push({
      field: 'source',
      message: 'source is required'
    });
  }

  if (!status) {
    errors.push({
      field: 'status',
      message: 'status is required'
    });
  } else if (!allowedStatuses.includes(status)) {
    errors.push({
      field: 'status',
      message: `status must be one of: ${allowedStatuses.join(', ')}`
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  return next();
};

module.exports = {
  validateCreateEvent
};
