import mongoose from 'mongoose';
import { WearableData } from '@/models/WearableData.model';

export class DataSimulatorService {
  private static isRunning = false;
  private static intervalId: NodeJS.Timeout | null = null;

  static start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🔄 Starting health data simulator...');
    
    // Generate data every hour
    this.intervalId = setInterval(() => {
      this.generateHourlyData();
    }, 60 * 60 * 1000); // 1 hour

    // Generate initial data
    this.generateHourlyData();
  }

  static stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('⏹️ Health data simulator stopped');
  }

  private static async generateHourlyData() {
    try {
      const userId = new mongoose.Types.ObjectId('66955bbf8b55fd3b498af3ad');
      const timestamp = new Date();
      
      const wearableData = [
        {
          userId,
          timestamp,
          dataType: 'heart_rate',
          value: this.generateHeartRate(),
          unit: 'bpm',
          source: { device: 'Apple Watch', provider: 'HealthKit' }
        },
        {
          userId,
          timestamp,
          dataType: 'steps',
          value: this.generateSteps(),
          unit: 'steps',
          source: { device: 'iPhone', provider: 'HealthKit' }
        },
        {
          userId,
          timestamp,
          dataType: 'calories',
          value: this.generateCalories(),
          unit: 'kcal',
          source: { device: 'Apple Watch', provider: 'HealthKit' }
        },
        {
          userId,
          timestamp,
          dataType: 'stress',
          value: this.generateStressScore(),
          unit: 'score',
          source: { device: 'Oura Ring', provider: 'Oura' }
        },
        {
          userId,
          timestamp,
          dataType: 'recovery',
          value: this.generateRecoveryScore(),
          unit: 'score',
          source: { device: 'WHOOP', provider: 'WHOOP' }
        }
      ];

      await WearableData.insertMany(wearableData);
      console.log(`📊 Generated ${wearableData.length} health data points at ${timestamp.toISOString()}`);
      
    } catch (error) {
      console.error('Error generating simulated data:', error);
    }
  }

  private static generateHeartRate(): number {
    const baseHR = 70;
    const timeOfDay = new Date().getHours();
    
    // Higher HR during day, lower at night
    const timeMultiplier = timeOfDay >= 6 && timeOfDay <= 22 ? 1.2 : 0.8;
    const variation = (Math.random() - 0.5) * 20;
    
    return Math.round((baseHR * timeMultiplier) + variation);
  }

  private static generateSteps(): number {
    const timeOfDay = new Date().getHours();
    
    // More steps during active hours
    if (timeOfDay >= 7 && timeOfDay <= 19) {
      return Math.round(Math.random() * 2000 + 500); // 500-2500 steps per hour
    } else {
      return Math.round(Math.random() * 100); // 0-100 steps per hour
    }
  }

  private static generateCalories(): number {
    const timeOfDay = new Date().getHours();
    
    // More calories burned during active hours
    if (timeOfDay >= 6 && timeOfDay <= 22) {
      return Math.round(Math.random() * 150 + 50); // 50-200 kcal per hour
    } else {
      return Math.round(Math.random() * 30 + 20); // 20-50 kcal per hour
    }
  }

  private static generateStressScore(): number {
    const timeOfDay = new Date().getHours();
    
    // Higher stress during work hours
    if (timeOfDay >= 9 && timeOfDay <= 17) {
      return Math.round(Math.random() * 40 + 40); // 40-80 stress score
    } else {
      return Math.round(Math.random() * 30 + 10); // 10-40 stress score
    }
  }

  private static generateRecoveryScore(): number {
    // Recovery score typically inversely related to recent stress
    const baseRecovery = 75;
    const variation = (Math.random() - 0.5) * 30;
    
    return Math.max(0, Math.min(100, Math.round(baseRecovery + variation)));
  }

  static async generateHistoricalData(days: number = 7) {
    try {
      console.log(`📈 Generating ${days} days of historical data...`);
      
      const userId = new mongoose.Types.ObjectId('66955bbf8b55fd3b498af3ad');
      const dataPoints = [];
      
      for (let day = days; day >= 0; day--) {
        for (let hour = 0; hour < 24; hour++) {
          const timestamp = new Date();
          timestamp.setDate(timestamp.getDate() - day);
          timestamp.setHours(hour, 0, 0, 0);
          
          dataPoints.push(
            {
              userId,
              timestamp,
              dataType: 'heart_rate',
              value: this.generateHeartRate(),
              unit: 'bpm',
              source: { device: 'Apple Watch', provider: 'HealthKit' }
            },
            {
              userId,
              timestamp,
              dataType: 'steps',
              value: this.generateSteps(),
              unit: 'steps',
              source: { device: 'iPhone', provider: 'HealthKit' }
            },
            {
              userId,
              timestamp,
              dataType: 'calories',
              value: this.generateCalories(),
              unit: 'kcal',
              source: { device: 'Apple Watch', provider: 'HealthKit' }
            },
            {
              userId,
              timestamp,
              dataType: 'stress',
              value: this.generateStressScore(),
              unit: 'score',
              source: { device: 'Oura Ring', provider: 'Oura' }
            },
            {
              userId,
              timestamp,
              dataType: 'recovery',
              value: this.generateRecoveryScore(),
              unit: 'score',
              source: { device: 'WHOOP', provider: 'WHOOP' }
            }
          );
        }
      }
      
      await WearableData.insertMany(dataPoints);
      console.log(`✅ Generated ${dataPoints.length} historical data points`);
      
    } catch (error) {
      console.error('Error generating historical data:', error);
    }
  }
}