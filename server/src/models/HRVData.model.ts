import mongoose from 'mongoose';

const HRVDataPointSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  timezone_offset: Number,
  type: String,
  unit: { type: String, default: 'rmssd' },
  tags: [String],
  value: { type: Number, required: true },
}, { _id: false });

const HRVDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, index: true },
  data: [HRVDataPointSchema],
  provider: {
    logo: String,
    name: String,
    slug: String,
  },
  source: {
    provider: String,
    type: String,
  },
  source_id: Number,
}, { timestamps: true });

HRVDataSchema.index({ userId: 1, createdAt: -1 });
HRVDataSchema.index({ 'data.timestamp': -1 });

export const HRVData = mongoose.model('HRVData', HRVDataSchema);