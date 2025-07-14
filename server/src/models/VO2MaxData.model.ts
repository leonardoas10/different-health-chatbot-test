import mongoose from 'mongoose';

const VO2MaxMeasurementSchema = new mongoose.Schema({
  TimeMin: Number,
  VO2LMin: Number,
  VO2KgMlKgMin: Number,
  METS: Number,
  VCO2LMin: Number,
  VELMin: Number,
  RER: Number,
  HRBpm: Number,
  SpeedMPH: Number,
  GradePercent: Number,
  ActiveCaloriesKcal: Number,
}, { _id: false });

const VO2MaxTestSchema = new mongoose.Schema({
  maxVO2: {
    LMin: Number,
    MlKgMin: Number,
    METS: Number,
  },
  measurements: [VO2MaxMeasurementSchema],
}, { _id: false });

const VO2MaxDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, index: true },
  date: { type: Date, required: true },
  patientInformation: {
    name: String,
    age: Number,
    sex: String,
    heightCm: Number,
    weightKg: Number,
  },
  vo2MaxTest: VO2MaxTestSchema,
}, { timestamps: true });

VO2MaxDataSchema.index({ userId: 1, date: -1 });

export const VO2MaxData = mongoose.model('VO2MaxData', VO2MaxDataSchema);