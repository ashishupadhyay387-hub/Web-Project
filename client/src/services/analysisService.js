import api from './api';

export const getAllAnalyses = (params = {}) =>
  api.get('/analyses', { params }).then((r) => r.data);

export const getAnalysisById = (id) =>
  api.get(`/analyses/${id}`).then((r) => r.data);

export const deleteAnalysis = (id) =>
  api.delete(`/analyses/${id}`).then((r) => r.data);

export const getScoreHistory = () =>
  api.get('/analyses/history').then((r) => r.data);
