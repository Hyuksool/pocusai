
import { AnalyticsData } from '../types';

const ANALYTICS_KEY = 'pocus_ai_global_analytics';

const initialAnalytics: AnalyticsData = {
  topicCounts: {
    'Intussusception': 12,
    'Appendicitis': 8,
    'eFAST': 15,
    'Pneumothorax': 7,
    'Pneumonia': 5,
    'AAA': 4,
    'DVT': 9
  },
  hourlyUsage: {
    9: 5, 10: 12, 11: 8, 14: 15, 15: 10, 16: 6, 20: 4
  },
  totalMessages: 60,
  lastActive: Date.now()
};

export const getAnalytics = (): AnalyticsData => {
  const data = localStorage.getItem(ANALYTICS_KEY);
  if (!data) {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(initialAnalytics));
    return initialAnalytics;
  }
  return JSON.parse(data);
};

export const trackUsage = (topic?: string) => {
  const data = getAnalytics();
  const hour = new Date().getHours();
  
  data.totalMessages += 1;
  data.lastActive = Date.now();
  data.hourlyUsage[hour] = (data.hourlyUsage[hour] || 0) + 1;
  
  if (topic) {
    data.topicCounts[topic] = (data.topicCounts[topic] || 0) + 1;
  } else {
    // Attempt to extract topic from content loosely (mock logic)
    data.topicCounts['General Query'] = (data.topicCounts['General Query'] || 0) + 1;
  }

  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
};
