import mongoose from 'mongoose';

const DailyFootprintSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true,
    },
    totalEmissions: {
        type: Number,
        required: true,
    },
    details: {
        electricity: { co2e: Number, unit: String, factor: String },
        shopping: { co2e: Number, unit: String, factor: String },
        diet: { co2e: Number, unit: String, factor: String },
        transport: { co2e: Number, unit: String, factor: String },
        cooking: { co2e: Number, unit: String, factor: String },
        water: { co2e: Number, unit: String, factor: String },
        waste: { co2e: Number, unit: String, factor: String }
    },
}, { timestamps: true });

// Compound index to prevent multiple records per user per day
DailyFootprintSchema.index({ user: 1, date: 1 }, { unique: true });

const DailyFootprint = mongoose.model('DailyFootprint', DailyFootprintSchema);
export default DailyFootprint;
