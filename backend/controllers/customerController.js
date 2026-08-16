const { fetchCustomerEvents, buildCustomerState, buildCustomerAudit } = require('../services/reconstructionService');

const getCustomers = (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Customer controller is not implemented yet'
  });
};

const getCustomerState = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const customerEvents = await fetchCustomerEvents(customerId);
    const state = buildCustomerState(customerId, customerEvents);

    return res.status(200).json(state);
  } catch (error) {
    return next(error);
  }
};

const getCustomerAudit = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const customerEvents = await fetchCustomerEvents(customerId);
    const audit = buildCustomerAudit(customerEvents);

    return res.status(200).json({
      customerId,
      eventCount: customerEvents.length,
      events: audit
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCustomers,
  getCustomerState,
  getCustomerAudit
};
