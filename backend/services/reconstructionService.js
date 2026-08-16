const Event = require('../models/Event');

const fetchCustomerEvents = async (customerId) => {
	return Event.find({ customerId }).sort({ timestamp: 1 }).lean();
};

const calculateCurrentBalance = (events) => {
	let currentBalance = 0;

	for (const event of events) {
		if (event.status === 'confirmed') {
			currentBalance += event.amount;
			continue;
		}

		if (event.status === 'reversed') {
			currentBalance -= event.amount;
			continue;
		}

		if (event.status === 'corrected') {
			// Keep correction handling simple for now: use the correction amount as the new baseline.
			currentBalance = event.amount;
		}
	}

	return currentBalance;
};

const buildCustomerState = (customerId, events) => {
	return {
		customerId,
		currentBalance: calculateCurrentBalance(events),
		eventCount: events.length,
		events
	};
};

const getAuditMeta = (event, isDuplicate) => {
	if (isDuplicate) {
		return {
			action: 'ignored',
			reason: 'Duplicate event'
		};
	}

	if (event.status === 'confirmed') {
		return {
			action: 'confirmed',
			reason: 'Valid payment'
		};
	}

	if (event.status === 'pending') {
		return {
			action: 'ignored',
			reason: 'Payment is pending'
		};
	}

	if (event.status === 'reversed') {
		return {
			action: 'reversed',
			reason: 'Payment was reversed'
		};
	}

	if (event.status === 'corrected') {
		return {
			action: 'corrected',
			reason: 'Payment correction applied'
		};
	}

	return {
		action: 'ignored',
		reason: 'Unknown event status'
	};
};

const buildCustomerAudit = (events) => {
	const seenEventIds = new Set();

	return events.map((event) => {
		const isDuplicate = seenEventIds.has(event.eventId);
		seenEventIds.add(event.eventId);

		const { action, reason } = getAuditMeta(event, isDuplicate);

		return {
			eventId: event.eventId,
			timestamp: event.timestamp,
			amount: event.amount,
			status: event.status,
			action,
			reason
		};
	});
};

module.exports = {
	fetchCustomerEvents,
	calculateCurrentBalance,
	buildCustomerState,
	buildCustomerAudit
};
