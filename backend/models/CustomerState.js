const mongoose = require('mongoose');

const emiScheduleSchema = new mongoose.Schema(
  {
    nextDueDate: {
      type: Date,
    },
    amount: {
      type: Number,
      min: 0,
    },
  },
  { _id: false }
);

const paymentHistoryEntrySchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
    },
    timestamp: {
      type: Date,
    },
    status: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const customerStateSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: [true, 'customerId is required'],
      trim: true,
      unique: true,
    },
    version: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    paymentHistory: {
      type: [paymentHistoryEntrySchema],
      default: [],
    },
    emiSchedule: {
      type: emiScheduleSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'customer_states',
  }
);

customerStateSchema.index({ customerId: 1 });
customerStateSchema.index({ 'emiSchedule.nextDueDate': 1 });

module.exports =
  mongoose.models.CustomerState ||
  mongoose.model('CustomerState', customerStateSchema);
