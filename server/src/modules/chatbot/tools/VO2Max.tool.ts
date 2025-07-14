import { tool } from '@langchain/core/tools';
import mongoose from 'mongoose';
import { z } from 'zod';

import { VO2MaxData } from '../../../models/VO2MaxData.model';

const vo2MaxToolSchema = z.object({
  userId: z.string().describe('The ID of the user for whom VO2 Max data is requested.'),
});

export const getVO2MaxProgress = tool(
  async (args: any): Promise<string> => {
    try {
      const rawArgs = typeof args === 'string' ? JSON.parse(args) : args;
      const parsedArgs = vo2MaxToolSchema.parse(rawArgs);
      const { userId } = parsedArgs;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return `Invalid user ID: ${userId}`;
      }

      const vo2MaxRecords = await VO2MaxData.find({ userId })
        .sort({ date: -1 })
        .limit(5);

      if (!vo2MaxRecords.length) {
        return 'No VO2 Max test results found for this user.';
      }

      const latest = vo2MaxRecords[0];
      const previous = vo2MaxRecords[1];

      let trend = 'stable';
      let improvement = 0;

      if (previous && latest.vo2MaxTest?.maxVO2?.MlKgMin && previous.vo2MaxTest?.maxVO2?.MlKgMin) {
        const currentVO2 = latest.vo2MaxTest.maxVO2.MlKgMin;
        const previousVO2 = previous.vo2MaxTest.maxVO2.MlKgMin;
        improvement = ((currentVO2 - previousVO2) / previousVO2) * 100;
        trend = improvement > 2 ? 'improving' : improvement < -2 ? 'declining' : 'stable';
      }

      const summary = {
        latestTest: latest.date,
        currentVO2Max: latest.vo2MaxTest?.maxVO2?.MlKgMin,
        currentMETS: latest.vo2MaxTest?.maxVO2?.METS,
        trend,
        improvementPercent: Math.round(improvement * 100) / 100,
        totalTests: vo2MaxRecords.length,
        fitnessLevel: getFitnessLevel(latest.vo2MaxTest?.maxVO2?.MlKgMin || 0, latest.patientInformation?.age || 30),
      };

      return JSON.stringify(summary);
    } catch (error) {
      console.error('Error in getVO2MaxProgress tool:', error);
      return `Error retrieving VO2 Max data: ${error}`;
    }
  },
  {
    name: 'getVO2MaxProgress',
    description: 'Retrieves VO2 Max test results and fitness progress analysis for a user.',
    schema: vo2MaxToolSchema as any,
  }
);

// Helper function to determine fitness level
function getFitnessLevel(vo2Max: number, age: number): string {
  if (age < 30) {
    if (vo2Max >= 55) return 'Excellent';
    if (vo2Max >= 45) return 'Good';
    if (vo2Max >= 35) return 'Fair';
    return 'Poor';
  } else if (age < 40) {
    if (vo2Max >= 50) return 'Excellent';
    if (vo2Max >= 40) return 'Good';
    if (vo2Max >= 30) return 'Fair';
    return 'Poor';
  } else {
    if (vo2Max >= 45) return 'Excellent';
    if (vo2Max >= 35) return 'Good';
    if (vo2Max >= 25) return 'Fair';
    return 'Poor';
  }
}