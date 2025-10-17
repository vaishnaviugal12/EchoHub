import mongoose from 'mongoose';

// --- Comment Schema ---
const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

// --- Reaction Schema ---
const reactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['like', 'heart', 'tree'], default: 'like' },
}, { _id: false });

// --- Main Post Schema ---
const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  type: { type: String, enum: ['tip', 'post', 'challenge_win'], default: 'post' },
  title: { type: String, trim: true, maxlength: 100 },
  content: { type: String, required: true, maxlength: 500 },
  image: { type: String, default: null },
  comments: [commentSchema],
  reactions: [reactionSchema],
  reactionCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// --- Indexes ---
PostSchema.index({ user: 1, type: 1 });
PostSchema.index({ "reactions.user": 1 });

export default mongoose.model('Post', PostSchema);