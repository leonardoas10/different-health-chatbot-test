import mongoose from 'mongoose';

const WearableDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, index: true },
  timestamp: { type: Date, required: true, index: true },
  dataType: { 
    type: String, 
    required: true, 
    enum: ['heart_rate', 'steps', 'calories', 'sleep', 'stress', 'recovery'] 
  },
  value: { type: Number, required: true },
  unit: String,
  source: {
    device: String,
    provider: String,
  },
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

WearableDataSchema.index({ userId: 1, dataType: 1, timestamp: -1 });
WearableDataSchema.index({ timestamp: -1 });

export const WearableData = mongoose.model('WearableData', WearableDataSchema);