import { tool } from '@langchain/core/tools';
import mongoose from 'mongoose';
import { z } from 'zod';

import { TrendAnalysisService } from '@/services/TrendAnalysis.service';

const trendAnalysisToolSchema = z.object({
  userId: z.string().describe('The ID of the user for trend analysis.'),
  days: z.number().optional().describe('Number of days to analyze (default: 30)'),
});

export const getHealthTrendAnalysis = tool(
  async (args: any): Promise<string> => {
    try {
      const rawArgs = typeof args === 'string' ? JSON.parse(args) : args;
      const parsedArgs = trendAnalysisToolSchema.parse(rawArgs);
      const { userId, days = 30 } = parsedArgs;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return `Invalid user ID: ${userId}`;
      }

      const analysis = await TrendAnalysisService.analyzeHealthTrends(userId, days);
      
      return JSON.stringify(analysis, null, 2);
    } catch (error) {
      console.error('Error in getHealthTrendAnalysis tool:', error);
      return `Error performing trend analysis: ${error}`;
    }
  },
  {
    name: 'getHealthTrendAnalysis',
    description: 'Performs comprehensive trend analysis across multiple health data sources (wearables, HRV, body composition) to identify patterns and correlations.',
    schema: trendAnalysisToolSchema as any,
  }
);