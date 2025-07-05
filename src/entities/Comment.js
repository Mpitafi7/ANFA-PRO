import { blogAPI } from '../utils/api.js';

export class Comment {
  static async filter(query, sort) {
    try {
      // Comments are fetched with blog posts, so we'll return empty array here
      // Individual comments are handled by the blog post API
      return [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  static async create(commentData) {
    try {
      const response = await blogAPI.addComment(commentData.blog_post_id, {
        author_name: commentData.author_name,
        author_email: commentData.author_email,
        content: commentData.content,
        parent_comment: commentData.parent_comment
      });
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  static async approve(commentId) {
    try {
      const response = await blogAPI.approveComment(commentId);
      return response.data;
    } catch (error) {
      console.error('Error approving comment:', error);
      throw error;
    }
  }
} 