import { tool } from '@langchain/core/tools';
import mongoose from 'mongoose';
import { z } from 'zod';

import { HRVData } from '../../../models/HRVData.model';

const hrvToolSchema = z.object({
  userId: z.string().describe('The ID of the user for whom HRV data is requested.'),
  days: z.number().optional().describe('Number of days to look back (default: 7)'),
});

export const getHRVTrends = tool(
  async (args: any): Promise<string> => {
    try {
      const rawArgs = typeof args === 'string' ? JSON.parse(args) : args;
      const parsedArgs = hrvToolSchema.parse(rawArgs);
      const { userId, days = 7 } = parsedArgs;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return `Invalid user ID: ${userId}`;
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const hrvRecords = await HRVData.find({
        userId,
        'data.timestamp': { $gte: startDate }
      }).sort({ createdAt: -1 }).limit(10);

      if (!hrvRecords.length) {
        return 'No HRV data found for this user in the specified period.';
      }

      // Process HRV data for trends
      const allDataPoints = hrvRecords.flatMap(record => 
        record.data.filter(point => point.timestamp >= startDate)
      ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      if (!allDataPoints.length) {
        return 'No HRV data points found in the specified period.';
      }

      const avgHRV = allDataPoints.reduce((sum, point) => sum + point.value, 0) / allDataPoints.length;
      const recentHRV = allDataPoints.slice(-10).reduce((sum, point) => sum + point.value, 0) / Math.min(10, allDataPoints.length);
      const trend = recentHRV > avgHRV ? 'improving' : recentHRV < avgHRV ? 'declining' : 'stable';

      const summary = {
        period: `${days} days`,
        averageHRV: Math.round(avgHRV),
        recentAverageHRV: Math.round(recentHRV),
        trend,
        dataPoints: allDataPoints.length,
        latestReading: allDataPoints[allDataPoints.length - 1]?.value,
        latestTimestamp: allDataPoints[allDataPoints.length - 1]?.timestamp,
      };

      return JSON.stringify(summary);
    } catch (error) {
      console.error('Error in getHRVTrends tool:', error);
      return `Error retrieving HRV data: ${error}`;
    }
  },
  {
    name: 'getHRVTrends',
    description: 'Retrieves HRV (Heart Rate Variability) trends and analysis for a user over a specified period.',
    schema: hrvToolSchema as any,
  }
);