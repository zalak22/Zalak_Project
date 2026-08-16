const Event = require('../models/Event');
const { fetchCustomerEvents, buildCustomerState } = require('../services/reconstructionService');

const getEvents = (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Event controller is not implemented yet'
  });
};

const createEvent = async (req, res, next) => {
  try {
    const { customerId, eventId, timestamp, amount, paymentMethod, source, status } = req.body;

    const duplicateEvent = await Event.findOne({ customerId, eventId }).lean();

    if (duplicateEvent) {
      return res.status(200).json({
        success: false,
        duplicate: true,
        message: 'Duplicate event ignored'
      });
    }

    await Event.create({
      customerId,
      eventId,
      timestamp,
      amount,
      paymentMethod,
      source,
      status
    });

    const customerEvents = await fetchCustomerEvents(customerId);
    const state = buildCustomerState(customerId, customerEvents);

    return res.status(201).json({
      success: true,
      message: 'Event processed',
      state: {
        customerId: state.customerId,
        currentBalance: state.currentBalance,
        eventCount: state.eventCount
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({
        success: false,
        duplicate: true,
        message: 'Duplicate event ignored'
      });
    }

    return next(error);
  }
};

module.exports = {
  getEvents,
  createEvent
};
