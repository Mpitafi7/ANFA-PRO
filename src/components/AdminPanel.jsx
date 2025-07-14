import React, { useState, useEffect } from 'react';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { 
  Users, 
  Edit, 
  Save, 
  X, 
  Shield, 
  Ban,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';
import { User } from '../entities/User.js';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would fetch from API
      const allUsers = JSON.parse(localStorage.getItem('publicProfiles') || '{}');
      const userList = Object.values(allUsers).map(user => ({
        ...user,
        id: user.publicId,
        status: user.banned ? 'banned' : 'active'
      }));
      setUsers(userList);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    const filtered = users.filter(user => 
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.publicId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.displayName || '',
      plan: user.plan || 'basic',
      linksCreated: user.total_links || 0,
      totalViews: user.total_clicks || 0
    });
  };

  const handleSave = async () => {
    try {
      if (!editingUser) return;

      // Update user data
      const updatedUsers = users.map(user => 
        user.publicId === editingUser.publicId 
          ? { ...user, ...editForm }
          : user
      );
      setUsers(updatedUsers);

      // Update localStorage
      const allUsers = JSON.parse(localStorage.getItem('publicProfiles') || '{}');
      allUsers[editingUser.publicId] = {
        ...allUsers[editingUser.publicId],
        ...editForm
      };
      localStorage.setItem('publicProfiles', JSON.stringify(allUsers));

      setEditingUser(null);
      setEditForm({});
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleBan = async (user) => {
    try {
      const updatedUsers = users.map(u => 
        u.publicId === user.publicId 
          ? { ...u, banned: true, status: 'banned' }
          : u
      );
      setUsers(updatedUsers);

      // Update localStorage
      const allUsers = JSON.parse(localStorage.getItem('publicProfiles') || '{}');
      if (allUsers[user.publicId]) {
        allUsers[user.publicId].banned = true;
        localStorage.setItem('publicProfiles', JSON.stringify(allUsers));
      }
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const handleUnban = async (user) => {
    try {
      const updatedUsers = users.map(u => 
        u.publicId === user.publicId 
          ? { ...u, banned: false, status: 'active' }
          : u
      );
      setUsers(updatedUsers);

      // Update localStorage
      const allUsers = JSON.parse(localStorage.getItem('publicProfiles') || '{}');
      if (allUsers[user.publicId]) {
        allUsers[user.publicId].banned = false;
        localStorage.setItem('publicProfiles', JSON.stringify(allUsers));
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
    }
  };

  const getPlanBadge = (plan) => {
    const planConfig = {
      basic: { label: 'Free', color: 'bg-gray-100 text-gray-800' },
      pro: { label: 'Pro', color: 'bg-blue-100 text-blue-800' },
      team: { label: 'Team', color: 'bg-purple-100 text-purple-800' }
    };
    
    const config = planConfig[plan] || planConfig.basic;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      banned: { label: 'Banned', color: 'bg-red-100 text-red-800', icon: Ban }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Public ID</th>
                  <th className="text-left p-3">Plan</th>
                  <th className="text-left p-3">Stats</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.publicId} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {user.displayName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.displayName || 'Anonymous'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.joined ? new Date(user.joined).toLocaleDateString() : 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {user.publicId}
                      </code>
                    </td>
                    <td className="p-3">
                      {getPlanBadge(user.plan)}
                    </td>
                    <td className="p-3">
                      <div className="text-xs">
                        <div>{user.total_links || 0} links</div>
                        <div>{user.total_clicks || 0} views</div>
                      </div>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {editingUser?.publicId === user.publicId ? (
                          <>
                            <Button size="sm" onClick={handleSave}>
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setEditingUser(null)}
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEdit(user)}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            {user.status === 'active' ? (
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleBan(user)}
                              >
                                <Ban className="w-3 h-3 mr-1" />
                                Ban
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleUnban(user)}
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Unban
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No users found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingUser && (
        <Card className="fixed inset-4 z-50 bg-white dark:bg-gray-800 shadow-2xl">
          <CardHeader>
            <CardTitle>Edit User: {editingUser.displayName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Plan</label>
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="basic">Free</option>
                  <option value="pro">Pro</option>
                  <option value="team">Team</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Links Created</label>
                  <Input
                    type="number"
                    value={editForm.linksCreated}
                    onChange={(e) => setEditForm({ ...editForm, linksCreated: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Total Views</label>
                  <Input
                    type="number"
                    value={editForm.totalViews}
                    onChange={(e) => setEditForm({ ...editForm, totalViews: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPanel; 