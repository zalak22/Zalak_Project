const mongoose = require('mongoose');

const EVENT_STATUSES = ['confirmed', 'pending', 'reversed', 'corrected'];

const eventSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: [true, 'customerId is required'],
      trim: true,
    },
    eventId: {
      type: String,
      required: [true, 'eventId is required'],
      trim: true,
    },
    timestamp: {
      type: Date,
      required: [true, 'timestamp is required'],
    },
    amount: {
      type: Number,
      required: [true, 'amount is required'],
    },
    paymentMethod: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      required: [true, 'source is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: EVENT_STATUSES,
        message: '{VALUE} is not a valid event status',
      },
      default: 'pending',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'events',
  }
);

eventSchema.index({ customerId: 1, timestamp: 1 });
eventSchema.index({ customerId: 1, status: 1 });
eventSchema.index({ customerId: 1, eventId: 1 }, { unique: true });

module.exports =
  mongoose.models.Event || mongoose.model('Event', eventSchema);
