const express = require('express');
const router = express.Router();
const { getAllAnalyses, getAnalysisById, deleteAnalysis, getScoreHistory } = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllAnalyses);
router.get('/history', protect, getScoreHistory);
router.get('/:id', protect, getAnalysisById);
router.delete('/:id', protect, deleteAnalysis);

module.exports = router;
