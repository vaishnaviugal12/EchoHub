import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
    // Descriptive fields
    title: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    description: { 
        type: String, 
        required: true 
    },
    
    // Reward for completing the challenge
    rewardPoints: { 
        type: Number, 
        required: true, 
        min: 10 
    },
    
    // --- Target Criteria ---
    // The activity needed for completion (e.g., reduce 'waste')
    targetActivity: { 
        type: String, 
        enum: ['transport', 'electricity', 'diet', 'waste', 'water', 'shopping'], // Expanded list for granularity
        required: true 
    },
    // The value that must be met (e.g., 50 km driven, or 0.5 kg of waste *saved*)
    targetValue: { 
        type: Number, 
        required: true, 
        min: 0 
    }, 
    targetUnit: { 
        type: String, 
        default: 'unit' 
    }, 

    // --- Status and Frequency ---
    isActive: { 
        type: Boolean, 
        default: true 
    },
    frequency: { 
        type: String, 
        enum: ['daily', 'weekly', 'one-time'], 
        default: 'daily' 
    },
    
    // Record of users who have successfully completed the challenge
    completedBy: [{
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        },
        completedAt: { 
            type: Date, 
            default: Date.now 
        }
    }],
    
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

export default mongoose.model('Challenge', ChallengeSchema);