const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  blog_post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogPost',
    required: true
  },
  author_name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  author_email: {
    type: String,
    required: [true, 'Please add your email'],
    trim: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Please add comment content'],
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  is_approved: {
    type: Boolean,
    default: false
  },
  is_spam: {
    type: Boolean,
    default: false
  },
  parent_comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  user_agent: {
    type: String
  },
  ip_address: {
    type: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  }
}, {
  timestamps: true
});

// Update blog post comment count when comment is saved
commentSchema.post('save', async function() {
  const BlogPost = require('./BlogPost');
  const blogPost = await BlogPost.findById(this.blog_post);
  if (blogPost) {
    await blogPost.updateCommentCount();
  }
});

// Update blog post comment count when comment is deleted
commentSchema.post('remove', async function() {
  const BlogPost = require('./BlogPost');
  const blogPost = await BlogPost.findById(this.blog_post);
  if (blogPost) {
    await blogPost.updateCommentCount();
  }
});

module.exports = mongoose.model('Comment', commentSchema); 