import api from './api';

export const uploadResume = (formData, onProgress) =>
  api
    .post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          onProgress(Math.round((evt.loaded * 100) / evt.total));
        }
      },
    })
    .then((r) => r.data);

export const analyzeResume = (data) =>
  api.post('/resumes/analyze', data).then((r) => r.data);

export const improveSection = (data) =>
  api.post('/resumes/improve-section', data).then((r) => r.data);
