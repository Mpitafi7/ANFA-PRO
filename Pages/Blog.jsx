import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../src/utils/index.js";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card.jsx";
import { Button } from "../src/components/ui/button.jsx";
import { Badge } from "../src/components/ui/badge.jsx";
import { Input } from "../src/components/ui/input.jsx";
import { Textarea } from "../src/components/ui/textarea.jsx";
import { 
  MessageSquare, 
  Calendar, 
  User as UserIcon, 
  Search,
  Plus,
  BookOpen,
  Clock
} from "lucide-react";
import { User } from "../src/entities/User.js";
import { BlogPost } from "../src/entities/BlogPost.js";
import { Comment } from "../src/entities/Comment.js";
import { format } from "date-fns";

export default function Blog() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
    loadPosts();
    loadComments();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  const loadPosts = async () => {
    try {
      const allPosts = await BlogPost.filter({ is_published: true }, "-created_date");
      setPosts(allPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
    setIsLoading(false);
  };

  const loadComments = async () => {
    try {
      const allComments = await Comment.filter({ is_approved: true }, "-created_date");
      setComments(allComments);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPostComments = (postId) => {
    return comments.filter(comment => comment.blog_post_id === postId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ANFA Pro Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Insights, tips, and updates from the world of URL shortening and digital marketing
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-2 border-gray-200 dark:border-gray-600"
            />
          </div>
        </div>

        {/* Admin Controls */}
        {user?.role === "admin" && (
          <div className="mb-8">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                      Admin Panel
                    </h3>
                    <p className="text-blue-700 dark:text-blue-200">
                      Manage your blog posts and comments
                    </p>
                  </div>
                  <Link to={createPageUrl("AdminPanel")}>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Blog Posts */}
        <div className="space-y-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Card key={post.id} className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 mr-1" />
                      Admin
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(post.created_date), "MMM d, yyyy")}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.reading_time || 5} min read
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {post.excerpt || post.content.substring(0, 200) + "..."}
                  </p>
                  
                  {/* Comments Section */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Comments ({getPostComments(post.id).length})
                      </h4>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4 mb-6">
                      {getPostComments(post.id).slice(0, 3).map((comment) => (
                        <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white text-sm">
                                {comment.author_name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {format(new Date(comment.created_date), "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment Form - Only for Google users */}
                    {user ? (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                          Add a comment
                        </h5>
                        <Textarea
                          placeholder="Share your thoughts..."
                          className="mb-3"
                        />
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Post Comment
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                        <p className="text-yellow-800 dark:text-yellow-200 mb-3">
                          Sign in with Google to leave a comment
                        </p>
                        <Link to={createPageUrl("Login")}>
                          <Button size="sm" variant="outline">
                            Sign In
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? "No posts found" : "No blog posts yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "Check back soon for exciting content about URL shortening and digital marketing!"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}