import axios from 'axios';
import { 
  AnalysisResult, 
  AnalysisHistoryItem, 
  DashboardStats, 
  DemoCase, 
  EducationModule, 
  QuizQuestion 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AnalysisService = {
  // Analyze text/message
  analyzeText: async (text: string, source: string = 'direct'): Promise<AnalysisResult> => {
    const res = await api.post<AnalysisResult>('/analyze/text', { text, source });
    return res.data;
  },

  // Analyze static URL
  analyzeUrl: async (url: string): Promise<AnalysisResult> => {
    const res = await api.post<AnalysisResult>('/analyze/url', { url });
    return res.data;
  },

  // Analyze complete email
  analyzeEmail: async (data: {
    sender_name?: string;
    sender_email?: string;
    reply_to?: string;
    subject?: string;
    body: string;
    links?: string[];
  }): Promise<AnalysisResult> => {
    const res = await api.post<AnalysisResult>('/analyze/email', data);
    return res.data;
  },

  // Analyze screenshot / image
  analyzeImage: async (file: File): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<AnalysisResult>('/analyze/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Get history
  getHistory: async (): Promise<AnalysisHistoryItem[]> => {
    const res = await api.get<AnalysisHistoryItem[]>('/analyses');
    return res.data;
  },

  // Get single analysis by ID
  getAnalysisById: async (id: string): Promise<AnalysisResult> => {
    const res = await api.get<AnalysisResult>(`/analyses/${id}`);
    return res.data;
  },

  // Delete analysis
  deleteAnalysis: async (id: string): Promise<void> => {
    await api.delete(`/analyses/${id}`);
  },

  // Clear all history
  clearAllHistory: async (): Promise<void> => {
    await api.delete('/analyses');
  },

  // Get dashboard metrics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await api.get<DashboardStats>('/dashboard/stats');
    return res.data;
  },

  // Get demo scenarios
  getDemoCases: async (): Promise<DemoCase[]> => {
    const res = await api.get<DemoCase[]>('/demo-cases');
    return res.data;
  },

  // Get education modules
  getEducationModules: async (): Promise<EducationModule[]> => {
    const res = await api.get<EducationModule[]>('/education/modules');
    return res.data;
  },

  // Get quiz questions
  getQuizQuestions: async (): Promise<QuizQuestion[]> => {
    const res = await api.get<QuizQuestion[]>('/education/quiz');
    return res.data;
  },

  // Health check
  checkHealth: async (): Promise<any> => {
    const res = await api.get('/health');
    return res.data;
  }
};
