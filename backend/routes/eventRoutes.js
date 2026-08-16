const express = require('express');
const { getEvents, createEvent } = require('../controllers/eventController');
const { validateCreateEvent } = require('../middleware/eventValidationMiddleware');

const router = express.Router();

router.get('/', getEvents);
router.post('/', validateCreateEvent, createEvent);

module.exports = router;
