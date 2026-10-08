const express = require('express');
const router = express.Router();
const { upload, uploadResume, analyzeResume, improveSection } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.post('/analyze', protect, analyzeResume);
router.post('/improve-section', protect, improveSection);

module.exports = router;
