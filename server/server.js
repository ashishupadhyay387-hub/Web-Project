require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

const app = express();

connectDB();

const normalizeOrigin = (origin, callback) => {
  const allowList = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'https://cvreaderai.vercel.app',
    'https://web-project-glhl.onrender.com',
  ];

  if (process.env.CLIENT_ORIGINS) {
    process.env.CLIENT_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean).forEach((o) => allowList.push(o));
  }
  if (process.env.CLIENT_URL) {
    allowList.push(process.env.CLIENT_URL);
  }

  const allowed = (o) =>
    allowList.some((allowedOrigin) => {
      if (!o) return true;
      if (o === allowedOrigin) return true;
      if (allowedOrigin.endsWith('/*')) {
        const prefix = allowedOrigin.slice(0, -2);
        return o.startsWith(prefix);
      }
      return false;
    });

  const isOnrender = (o) => !!o && o.endsWith('.onrender.com');
  const isVercelPreview = (o) =>
    !!o && o.endsWith('-cvreaderai.vercel.app') || (o && o.includes('.vercel.app') && o.startsWith('https://cvreaderai-'));

  if (!origin || allowed(origin) || isOnrender(origin) || isVercelPreview(origin)) {
    callback(null, true);
  } else {
    console.warn('[CORS] blocked origin:', origin);
    callback(new Error(`CORS blocked origin: ${origin}`));
  }
};

app.use(cors({
  origin: normalizeOrigin,
  credentials: true,
  maxAge: 86400,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ResumeAI ATS Checker API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analyses', analysisRoutes);

app.use(errorHandler);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`API Health Check: http://localhost:${PORT}/api/health`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});
