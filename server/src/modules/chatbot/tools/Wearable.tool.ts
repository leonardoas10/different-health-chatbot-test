import { tool } from '@langchain/core/tools';
import mongoose from 'mongoose';
import { z } from 'zod';

import { WearableData } from '../../../models/WearableData.model';

const wearableToolSchema = z.object({
  userId: z.string().describe('The ID of the user for whom wearable data is requested.'),
  dataType: z.enum(['heart_rate', 'steps', 'calories', 'sleep', 'stress', 'recovery']).describe('Type of wearable data to retrieve'),
  hours: z.number().optional().describe('Number of hours to look back (default: 24)'),
});

export const getWearableMetrics = tool(
  async (args: any): Promise<string> => {
    try {
      const rawArgs = typeof args === 'string' ? JSON.parse(args) : args;
      const parsedArgs = wearableToolSchema.parse(rawArgs);
      const { userId, dataType, hours = 24 } = parsedArgs;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return `Invalid user ID: ${userId}`;
      }

      const startTime = new Date();
      startTime.setHours(startTime.getHours() - hours);

      const wearableData = await WearableData.find({
        userId,
        dataType,
        timestamp: { $gte: startTime }
      }).sort({ timestamp: -1 }).limit(100);

      if (!wearableData.length) {
        return `No ${dataType} data found for this user in the last ${hours} hours.`;
      }

      const values = wearableData.map(d => d.value);
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      const latest = wearableData[0];
      const oldest = wearableData[wearableData.length - 1];

      // Calculate trend
      const recentAvg = values.slice(0, Math.min(10, values.length)).reduce((sum, val) => sum + val, 0) / Math.min(10, values.length);
      const olderAvg = values.slice(-Math.min(10, values.length)).reduce((sum, val) => sum + val, 0) / Math.min(10, values.length);
      const trend = recentAvg > olderAvg * 1.05 ? 'increasing' : recentAvg < olderAvg * 0.95 ? 'decreasing' : 'stable';

      const summary = {
        dataType,
        period: `${hours} hours`,
        latestValue: latest.value,
        latestTimestamp: latest.timestamp,
        average: Math.round(average * 100) / 100,
        min: Math.min(...values),
        max: Math.max(...values),
        trend,
        dataPoints: wearableData.length,
        unit: latest.unit || getDefaultUnit(dataType),
      };

      return JSON.stringify(summary);
    } catch (error) {
      console.error('Error in getWearableMetrics tool:', error);
      return `Error retrieving ${args.dataType} data: ${error}`;
    }
  },
  {
    name: 'getWearableMetrics',
    description: 'Retrieves real-time wearable device metrics (heart rate, steps, calories, sleep, stress, recovery) for trend analysis.',
    schema: wearableToolSchema as any,
  }
);

function getDefaultUnit(dataType: string): string {
  const units = {
    heart_rate: 'bpm',
    steps: 'steps',
    calories: 'kcal',
    sleep: 'hours',
    stress: 'score',
    recovery: 'score'
  };
  return units[dataType] || '';
}