const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Analysis = require('../models/Analysis');

exports.getAllAnalyses = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const analyses = await Analysis.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .select('resumeFileName jobTitle overallScore categoryScores createdAt');

  const total = await Analysis.countDocuments({ userId: req.user._id });

  const stats = await Analysis.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: null,
        bestScore: { $max: '$overallScore' },
        avgScore: { $avg: '$overallScore' },
        total: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    count: analyses.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    stats: stats[0]
      ? {
          totalAnalyses: stats[0].total,
          bestScore: Math.round(stats[0].bestScore),
          averageScore: Math.round(stats[0].avgScore),
        }
      : { totalAnalyses: 0, bestScore: 0, averageScore: 0 },
    data: analyses,
  });
});

exports.getAnalysisById = asyncHandler(async (req, res, next) => {
  const analysis = await Analysis.findById(req.params.id);
  if (!analysis) {
    return next(new ErrorResponse('Analysis not found', 404));
  }
  if (analysis.userId.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized to access this analysis', 403));
  }
  res.status(200).json({
    success: true,
    data: analysis,
  });
});

exports.deleteAnalysis = asyncHandler(async (req, res, next) => {
  const analysis = await Analysis.findById(req.params.id);
  if (!analysis) {
    return next(new ErrorResponse('Analysis not found', 404));
  }
  if (analysis.userId.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized to delete this analysis', 403));
  }
  await Analysis.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Analysis deleted successfully',
  });
});

exports.getScoreHistory = asyncHandler(async (req, res, next) => {
  const analyses = await Analysis.find({ userId: req.user._id })
    .sort({ createdAt: 1 })
    .select('overallScore createdAt');

  const history = analyses.map((a) => ({
    date: a.createdAt,
    score: a.overallScore,
  }));

  res.status(200).json({
    success: true,
    data: history,
  });
});
