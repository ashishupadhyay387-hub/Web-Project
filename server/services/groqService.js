const Groq = require('groq-sdk');
const ErrorResponse = require('../utils/errorResponse');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const ANALYSIS_SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) resume analyzer. Your task is to compare a candidate's resume against a job description and provide an in-depth ATS-style analysis.

IMPORTANT RULES:
1. Compare the resume ONLY against the provided job description.
2. Do NOT invent skills, experience, or qualifications not present in the resume.
3. Be honest but constructive.
4. The score is an AI-based ATS-style estimate, not a guarantee.
5. Return STRICTLY VALID JSON in the exact schema specified below with no markdown, no extra text, no code blocks.

JSON SCHEMA TO RETURN (no deviations):
{
  "overallScore": number between 0-100,
  "categoryScores": {
    "keywordMatch": number between 0-100,
    "skillsMatch": number between 0-100,
    "experienceMatch": number between 0-100,
    "educationMatch": number between 0-100,
    "projectRelevance": number between 0-100,
    "formatting": number between 0-100
  },
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keywordA", "keywordB"],
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "sectionAnalysis": {
    "summary": "analysis of professional summary section",
    "skills": "analysis of skills section",
    "experience": "analysis of experience/work history section",
    "projects": "analysis of projects section",
    "education": "analysis of education section"
  }
}

Analyze these factors: keyword match, technical skills, soft skills, experience relevance, education relevance, project relevance, job title relevance, resume structure, formatting/readability, action verbs, quantifiable achievements.`;

const safeParseJson = (content) => {
  let cleaned = content.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  }
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
  }
  return JSON.parse(cleaned);
};

const validateAnalysisStructure = (data) => {
  const required = [
    'overallScore',
    'categoryScores',
    'matchedKeywords',
    'missingKeywords',
    'strengths',
    'weaknesses',
    'suggestions',
    'sectionAnalysis',
  ];
  for (const key of required) {
    if (!(key in data)) {
      throw new Error(`Missing field in AI response: ${key}`);
    }
  }
  if (typeof data.overallScore !== 'number' || data.overallScore < 0 || data.overallScore > 100) {
    throw new Error('Invalid overallScore');
  }
  const cats = ['keywordMatch', 'skillsMatch', 'experienceMatch', 'educationMatch', 'projectRelevance', 'formatting'];
  for (const cat of cats) {
    const v = data.categoryScores[cat];
    if (typeof v !== 'number' || v < 0 || v > 100) {
      data.categoryScores[cat] = 0;
    }
  }
  const arrFields = ['matchedKeywords', 'missingKeywords', 'strengths', 'weaknesses', 'suggestions'];
  for (const f of arrFields) {
    if (!Array.isArray(data[f])) data[f] = [];
  }
  const sections = ['summary', 'skills', 'experience', 'projects', 'education'];
  for (const s of sections) {
    if (typeof data.sectionAnalysis[s] !== 'string') data.sectionAnalysis[s] = '';
  }
  return data;
};

const analyzeResume = async (resumeText, jobDescription) => {
  if (!process.env.GROQ_API_KEY) {
    throw new ErrorResponse(
      'Groq API key is not configured. Please set GROQ_API_KEY in the server environment.',
      500
    );
  }
  try {
    const userPrompt = `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME TEXT:\n${resumeText}\n\nPlease provide the ATS analysis in strict JSON as specified.`;
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      model: 'llama-3.1-70b-versatile',
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const content = response?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from Groq API');
    }
    const parsed = safeParseJson(content);
    return validateAnalysisStructure(parsed);
  } catch (error) {
    console.error('Groq API error:', error);
    if (error instanceof ErrorResponse) throw error;
    throw new ErrorResponse(
      `AI analysis failed: ${error.message || 'Unable to analyze resume at this time'}`,
      500
    );
  }
};

const IMPROVE_SYSTEM_PROMPT = `You are an expert professional resume writer. Your task is to improve a specific section of a candidate's resume.

CRITICAL RULES:
1. NEVER invent qualifications, achievements, skills, metrics, or experience that are NOT present in the user's input.
2. Rephrase for clarity, impact, and ATS-friendliness using strong action verbs.
3. Keep all the factual content from the original - expand wording, do not add new facts.
4. Keep the tone professional and concise.
5. Return strictly valid JSON: { "improvedText": "the improved content" }
6. No markdown, no code blocks, only valid JSON.`;

const improveSection = async (sectionType, currentText, resumeContext, jobDescription) => {
  if (!process.env.GROQ_API_KEY) {
    throw new ErrorResponse(
      'Groq API key is not configured. Please set GROQ_API_KEY in the server environment.',
      500
    );
  }
  try {
    const userPrompt = `SECTION TO IMPROVE: ${sectionType}

ORIGINAL TEXT:
${currentText}

CONTEXT FROM FULL RESUME (for reference, do not invent):
${resumeContext}

TARGET JOB DESCRIPTION (for tone/keywords where already applicable):
${jobDescription}

Return improved text in JSON: { "improvedText": "..." }`;

    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: IMPROVE_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      model: 'llama-3.1-70b-versatile',
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = response?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from Groq API');
    const parsed = safeParseJson(content);
    if (!parsed.improvedText || typeof parsed.improvedText !== 'string') {
      throw new Error('Invalid improve response structure');
    }
    return parsed.improvedText;
  } catch (error) {
    console.error('Groq API improve error:', error);
    if (error instanceof ErrorResponse) throw error;
    throw new ErrorResponse(
      `AI section improvement failed: ${error.message || 'Unable to improve section at this time'}`,
      500
    );
  }
};

module.exports = { analyzeResume, improveSection };
