const express = require('express');
const { getCustomers, getCustomerState, getCustomerAudit } = require('../controllers/customerController');

const router = express.Router();

router.get('/:id/state', getCustomerState);
router.get('/:id/audit', getCustomerAudit);
router.get('/', getCustomers);

module.exports = router;
