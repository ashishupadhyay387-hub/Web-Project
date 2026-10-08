const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const extractJobTitle = (jobDescription) => {
  if (!jobDescription) return 'Untitled Job';
  const lines = jobDescription.split('\n').filter((l) => l.trim());
  if (lines.length > 0 && lines[0].trim().length < 100) {
    return lines[0].trim().slice(0, 100);
  }
  return jobDescription.trim().slice(0, 80) + '...';
};

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

module.exports = { generateToken, extractJobTitle, formatBytes };
