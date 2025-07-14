import mongoose from 'mongoose';
import { WearableData } from '../models/WearableData.model';
import { HRVData } from '../models/HRVData.model';
import DEXAResult from '../models/DEXAResult.model';

export class TrendAnalysisService {
  static async analyzeHealthTrends(userId: string, days: number = 30) {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Analyze multiple data sources
      const [wearableData, hrvData, dexaData] = await Promise.all([
        this.analyzeWearableTrends(userObjectId, startDate),
        this.analyzeHRVTrends(userObjectId, startDate),
        this.analyzeDEXATrends(userObjectId)
      ]);

      return {
        period: `${days} days`,
        wearable: wearableData,
        hrv: hrvData,
        bodyComposition: dexaData,
        insights: this.generateInsights(wearableData, hrvData, dexaData),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error analyzing health trends:', error);
      throw error;
    }
  }

  private static async analyzeWearableTrends(userId: mongoose.Types.ObjectId, startDate: Date) {
    const dataTypes = ['heart_rate', 'steps', 'calories', 'stress', 'recovery'];
    const trends = {};

    for (const dataType of dataTypes) {
      const data = await WearableData.find({
        userId,
        dataType,
        timestamp: { $gte: startDate }
      }).sort({ timestamp: 1 });

      if (data.length > 0) {
        const values = data.map(d => d.value);
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));

        const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
        const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;

        trends[dataType] = {
          current: data[data.length - 1].value,
          average: values.reduce((sum, val) => sum + val, 0) / values.length,
          trend: changePercent > 5 ? 'increasing' : changePercent < -5 ? 'decreasing' : 'stable',
          changePercent: Math.round(changePercent * 100) / 100,
          dataPoints: data.length
        };
      }
    }

    return trends;
  }

  private static async analyzeHRVTrends(userId: mongoose.Types.ObjectId, startDate: Date) {
    const hrvRecords = await HRVData.find({
      userId,
      'data.timestamp': { $gte: startDate }
    }).sort({ createdAt: 1 });

    if (!hrvRecords.length) return null;

    const allDataPoints = hrvRecords.flatMap(record => 
      record.data.filter(point => point.timestamp >= startDate)
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    if (!allDataPoints.length) return null;

    const values = allDataPoints.map(point => point.value);
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;

    return {
      current: values[values.length - 1],
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      trend: changePercent > 5 ? 'improving' : changePercent < -5 ? 'declining' : 'stable',
      changePercent: Math.round(changePercent * 100) / 100,
      dataPoints: values.length
    };
  }

  private static async analyzeDEXATrends(userId: mongoose.Types.ObjectId) {
    const dexaScans = await DEXAResult.find({ userId }).sort({ createdAt: -1 }).limit(3);

    if (dexaScans.length < 2) return null;

    const latest = dexaScans[0];
    const previous = dexaScans[1];

    const fatPercentChange = latest.adiposeIndices?.totalBodyFat?.result - previous.adiposeIndices?.totalBodyFat?.result;
    const leanMassChange = (latest.resultSummary?.total?.leanMass || 0) - (previous.resultSummary?.total?.leanMass || 0);

    return {
      latestScan: latest.createdAt,
      fatPercentChange: Math.round(fatPercentChange * 100) / 100,
      leanMassChangeGrams: Math.round(leanMassChange),
      trend: fatPercentChange < -0.5 && leanMassChange > 500 ? 'improving' : 
             fatPercentChange > 0.5 && leanMassChange < -500 ? 'declining' : 'stable',
      totalScans: dexaScans.length
    };
  }

  private static generateInsights(wearableData: any, hrvData: any, dexaData: any) {
    const insights = [];

    // Stress and recovery correlation
    if (wearableData.stress && wearableData.recovery) {
      if (wearableData.stress.trend === 'increasing' && wearableData.recovery.trend === 'decreasing') {
        insights.push('High stress levels correlating with decreased recovery - consider stress management techniques');
      }
    }

    // HRV and recovery correlation
    if (hrvData && wearableData.recovery) {
      if (hrvData.trend === 'improving' && wearableData.recovery.trend === 'increasing') {
        insights.push('Positive correlation between HRV improvement and recovery scores - excellent progress');
      }
    }

    // Activity and body composition
    if (wearableData.steps && dexaData) {
      if (wearableData.steps.trend === 'increasing' && dexaData.trend === 'improving') {
        insights.push('Increased activity levels supporting positive body composition changes');
      }
    }

    // Heart rate trends
    if (wearableData.heart_rate) {
      if (wearableData.heart_rate.trend === 'decreasing') {
        insights.push('Resting heart rate trending downward - indicates improving cardiovascular fitness');
      }
    }

    return insights;
  }
}