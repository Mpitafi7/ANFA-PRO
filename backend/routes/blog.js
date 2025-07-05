const express = require('express');
const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all published blog posts
// @route   GET /api/blog
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, tag, search } = req.query;
    
    const query = { is_published: true };
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const posts = await BlogPost.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const count = await BlogPost.countDocuments(query);
    
    res.json({
      success: true,
      data: posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalPosts: count
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog posts',
      error: error.message
    });
  }
});

// @desc    Get single blog post
// @route   GET /api/blog/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ 
      slug: req.params.slug, 
      is_published: true 
    }).populate('author', 'username avatar');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // Increment view count
    post.view_count += 1;
    await post.save();
    
    // Get comments for this post
    const comments = await Comment.find({ 
      blog_post: post._id, 
      is_approved: true 
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        post,
        comments
      }
    });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: error.message
    });
  }
});

// @desc    Create blog post (Admin only)
// @route   POST /api/blog
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, content, excerpt, featured_image, tags, meta_title, meta_description } = req.body;
    
    const post = await BlogPost.create({
      title,
      content,
      excerpt,
      featured_image,
      tags,
      meta_title,
      meta_description,
      author: req.user._id
    });
    
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: post
    });
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating blog post',
      error: error.message
    });
  }
});

// @desc    Update blog post (Admin only)
// @route   PUT /api/blog/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: updatedPost
    });
  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog post',
      error: error.message
    });
  }
});

// @desc    Delete blog post (Admin only)
// @route   DELETE /api/blog/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    await post.remove();
    
    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog post',
      error: error.message
    });
  }
});

// @desc    Add comment to blog post
// @route   POST /api/blog/:id/comments
// @access  Public
router.post('/:id/comments', async (req, res) => {
  try {
    const { author_name, author_email, content, parent_comment } = req.body;
    
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    const comment = await Comment.create({
      blog_post: req.params.id,
      author_name,
      author_email,
      content,
      parent_comment,
      user_agent: req.get('User-Agent'),
      ip_address: req.ip
    });
    
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
});

// @desc    Approve comment (Admin only)
// @route   PUT /api/blog/comments/:id/approve
// @access  Private/Admin
router.put('/comments/:id/approve', protect, admin, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { is_approved: true },
      { new: true }
    );
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Comment approved successfully',
      data: comment
    });
  } catch (error) {
    console.error('Approve comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving comment',
      error: error.message
    });
  }
});

module.exports = router; 