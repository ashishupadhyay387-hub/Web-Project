const multer = require('multer');
const path = require('path');
const fs = require('fs');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { extractText, cleanupFile } = require('../services/parserService');
const { analyzeResume, improveSection } = require('../services/groqService');
const Analysis = require('../models/Analysis');
const { extractJobTitle, formatBytes } = require('../utils/helpers');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `resume-${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new ErrorResponse('Only PDF and DOCX files are supported', 400), false);
  }
};

exports.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

exports.uploadResume = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a resume file', 400));
  }
  try {
    const text = await extractText(req.file);
    res.status(200).json({
      success: true,
      data: {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileSizeFormatted: formatBytes(req.file.size),
        fileType: path.extname(req.file.originalname).toUpperCase().slice(1),
        extractedText: text,
      },
    });
  } finally {
    cleanupFile(req.file.path);
  }
});

exports.analyzeResume = asyncHandler(async (req, res, next) => {
  const { resumeText, jobDescription, fileName } = req.body;

  if (!resumeText || resumeText.trim().length < 50) {
    return next(new ErrorResponse('Resume text is too short or empty. Please upload a valid resume.', 400));
  }
  if (!jobDescription || jobDescription.trim().length < 30) {
    return next(new ErrorResponse('Job description is too short or empty. Please provide a valid job description.', 400));
  }

  const analysisData = await analyzeResume(resumeText.trim(), jobDescription.trim());

  const analysis = await Analysis.create({
    userId: req.user._id,
    resumeFileName: fileName || 'resume.pdf',
    jobTitle: extractJobTitle(jobDescription),
    overallScore: analysisData.overallScore,
    categoryScores: analysisData.categoryScores,
    matchedKeywords: analysisData.matchedKeywords,
    missingKeywords: analysisData.missingKeywords,
    strengths: analysisData.strengths,
    weaknesses: analysisData.weaknesses,
    suggestions: analysisData.suggestions,
    sectionAnalysis: analysisData.sectionAnalysis,
  });

  res.status(200).json({
    success: true,
    data: analysis,
  });
});

exports.improveSection = asyncHandler(async (req, res, next) => {
  const { sectionType, currentText, resumeContext, jobDescription } = req.body;

  if (!sectionType || !currentText) {
    return next(new ErrorResponse('Section type and current text are required', 400));
  }

  const allowedSections = ['summary', 'experience', 'projects', 'skills', 'education'];
  if (!allowedSections.includes(sectionType)) {
    return next(new ErrorResponse(`Invalid section type. Allowed: ${allowedSections.join(', ')}`, 400));
  }

  if (currentText.trim().length < 10) {
    return next(new ErrorResponse('Current text is too short to improve', 400));
  }

  const improvedText = await improveSection(
    sectionType,
    currentText,
    resumeContext || '',
    jobDescription || ''
  );

  res.status(200).json({
    success: true,
    data: { improvedText },
  });
});
