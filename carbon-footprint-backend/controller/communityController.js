import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Post from '../models/Post.js';
import User from '../models/userModel.js';

// --- Multer setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });

// --- CREATE POST ---
export const createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, title, content } = req.body;

    const user = await User.findById(userId).select('username');

    const newPost = new Post({
      user: userId,
      username: user.username,
      type: ['tip', 'post', 'challenge_win'].includes(type) ? type : 'post',
      title,
      content,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ error: "Failed to create post." });
  }
};

// --- GET POSTS ---
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ title: { $not: { $regex: /^\[EVENT\]/, $options: 'i' } } })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('user', 'username');
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ error: "Failed to fetch posts." });
  }
};

// --- EVENTS ---
export const hostEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventTitle, description, eventDate, location } = req.body;

    if (!eventTitle || !description || !eventDate || !location) {
      return res.status(400).json({ message: "Missing required event fields" });
    }

    const user = await User.findById(userId).select('username role');
    if (!user || user.role !== 'Leader') {
      return res.status(403).json({ message: "Only Leaders can host events" });
    }

    const newEventPost = new Post({
      user: userId,
      username: user.username,
      type: 'post',
      title: `[EVENT] ${eventTitle}`,
      content: `**Date:** ${new Date(eventDate).toLocaleString()}\n**Location:** ${location}\n\n${description}`,
      tags: ['event', location.toLowerCase()],
    });

    await newEventPost.save();
    res.status(201).json({ message: "Event hosted successfully", event: newEventPost });
  } catch (error) {
    console.error("Error hosting event:", error.message);
    res.status(500).json({ error: "Failed to host event." });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Post.find({ title: { $regex: /^\[EVENT\]/, $options: 'i' } })
      .sort({ createdAt: 1 })
      .limit(50)
      .populate('user', 'username');
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ error: "Failed to fetch events." });
  }
};

// --- COMMENTS ---
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const { text } = req.body;

    const user = await User.findById(userId).select('username');

    const comment = { user: userId, username: user.username, text };

    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment }, $inc: { commentCount: 1 } },
      { new: true }
    );

    if (!post) return res.status(404).json({ message: "Post not found." });

    res.status(201).json({ message: "Comment added successfully", comment: post.comments[post.comments.length - 1] });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ error: "Failed to add comment." });
  }
};

// --- REACTIONS ---
// --- REACTIONS ---
export const toggleReaction = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const { type } = req.body;

    // Validate user ID
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    const reactionIndex = post.reactions.findIndex(r => 
      r.user && r.user.toString() === userId
    );
    
    if (reactionIndex > -1) {
      post.reactions.splice(reactionIndex, 1);
      post.reactionCount = Math.max(0, post.reactionCount - 1);
      await post.save();
      return res.status(200).json({ message: "Reaction removed." });
    } else {
      if (!['like', 'heart', 'tree'].includes(type)) {
        return res.status(400).json({ message: "Invalid reaction type." });
      }
      
      // Ensure we don't add duplicate reactions
      const existingReaction = post.reactions.find(r => 
        r.user && r.user.toString() === userId
      );
      
      if (!existingReaction) {
        post.reactions.push({ user: userId, type });
        post.reactionCount += 1;
        await post.save();
        return res.status(201).json({ message: `Reaction '${type}' added.` });
      }
      
      return res.status(400).json({ message: "Reaction already exists." });
    }
  } catch (error) {
    console.error("Error toggling reaction:", error.message);
    res.status(500).json({ error: "Failed to toggle reaction." });
  }
};

// --- DELETE POST ---
export const deletePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    // Only allow the creator to delete the post
    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this post." });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).json({ error: "Failed to delete post." });
  }
};

