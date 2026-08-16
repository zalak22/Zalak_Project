const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');
const customerRoutes = require('./routes/customerRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server running'
  });
});

app.use('/api/events', eventRoutes);
app.use('/api/customers', customerRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
