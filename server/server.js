require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET. Copy .env.example to .env and set it.');
  process.exit(1);
}

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim()),
  })
);
app.use(express.json({ limit: '1mb' }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok' }));
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/contact', contactLimiter, require('./routes/contactRoutes'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app;
