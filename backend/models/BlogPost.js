const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
    maxlength: [10000, 'Content cannot be more than 10000 characters']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  featured_image: {
    type: String,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  is_published: {
    type: Boolean,
    default: false
  },
  reading_time: {
    type: Number,
    default: 5
  },
  view_count: {
    type: Number,
    default: 0
  },
  like_count: {
    type: Number,
    default: 0
  },
  comment_count: {
    type: Number,
    default: 0
  },
  meta_title: {
    type: String,
    maxlength: [60, 'Meta title cannot be more than 60 characters']
  },
  meta_description: {
    type: String,
    maxlength: [160, 'Meta description cannot be more than 160 characters']
  }
}, {
  timestamps: true
});

// Create slug from title
blogPostSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  next();
});

// Update comment count when comments are added/removed
blogPostSchema.methods.updateCommentCount = async function() {
  const Comment = require('./Comment');
  const count = await Comment.countDocuments({ blog_post: this._id, is_approved: true });
  this.comment_count = count;
  await this.save();
};

module.exports = mongoose.model('BlogPost', blogPostSchema); 