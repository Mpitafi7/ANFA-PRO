import { blogAPI } from '../utils/api.js';

export class BlogPost {
  static async filter(query, sort) {
    try {
      const response = await blogAPI.getPosts({
        search: query?.search,
        tag: query?.tag,
        page: query?.page || 1,
        limit: query?.limit || 10
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  }

  static async getById(id) {
    try {
      const response = await blogAPI.getPost(id);
      return response.data?.post;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
  }

  static async create(postData) {
    try {
      const response = await blogAPI.createPost(postData);
      return response.data;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  static async update(id, postData) {
    try {
      const response = await blogAPI.updatePost(id, postData);
      return response.data;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await blogAPI.deletePost(id);
      return true;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }
} 