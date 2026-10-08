const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const ErrorResponse = require('../utils/errorResponse');

const extractPdfText = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('No text could be extracted from the PDF');
    }
    return data.text.trim();
  } catch (error) {
    throw new ErrorResponse(
      `PDF parsing failed: ${error.message || 'Unable to read PDF file'}`,
      400
    );
  }
};

const extractDocxText = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('No text could be extracted from the DOCX');
    }
    return result.value.trim();
  } catch (error) {
    throw new ErrorResponse(
      `DOCX parsing failed: ${error.message || 'Unable to read DOCX file'}`,
      400
    );
  }
};

const extractText = async (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  switch (ext) {
    case '.pdf':
      return await extractPdfText(file.path);
    case '.docx':
      return await extractDocxText(file.path);
    default:
      throw new ErrorResponse(
        `Unsupported file format: ${ext}. Only PDF and DOCX are supported.`,
        400
      );
  }
};

const cleanupFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('Failed to cleanup file:', err);
  }
};

module.exports = { extractText, cleanupFile };
