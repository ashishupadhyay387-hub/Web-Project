const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeFileName: {
      type: String,
      required: true,
      trim: true,
    },
    jobTitle: {
      type: String,
      trim: true,
      default: 'Untitled Job',
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    categoryScores: {
      keywordMatch: { type: Number, min: 0, max: 100, default: 0 },
      skillsMatch: { type: Number, min: 0, max: 100, default: 0 },
      experienceMatch: { type: Number, min: 0, max: 100, default: 0 },
      educationMatch: { type: Number, min: 0, max: 100, default: 0 },
      projectRelevance: { type: Number, min: 0, max: 100, default: 0 },
      formatting: { type: Number, min: 0, max: 100, default: 0 },
    },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: [{ type: String }],
    sectionAnalysis: {
      summary: { type: String, default: '' },
      skills: { type: String, default: '' },
      experience: { type: String, default: '' },
      projects: { type: String, default: '' },
      education: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

analysisSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Analysis', analysisSchema);
