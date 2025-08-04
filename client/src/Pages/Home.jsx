import React, { useEffect, useState } from 'react';
import { createPost, fetchAllPosts, fetchAllUsers } from '../api';
import Post from '../components/Post';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

export default function Home() {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'posts'
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetchAllUsers();
      setUsers(res.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetchAllPosts();
      setPosts(res.data.posts || res.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts');
    }
  };

  const handlePostUpdate = () => {
    // Refresh posts when a post is liked or commented on
    fetchPosts();
  };

  const handlePost = async () => {
    if (!user || !content.trim()) return;
    
    setLoading(true);
    try {
      await createPost({ content });
      setContent('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users by default
    fetchPosts();
  }, []);

  if (!user) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <a href="/home" className="logo">Mini LinkedIn</a>
          <div className="nav-buttons">
            <span className="text-gray">Welcome, {user.name}!</span>
            <button 
              className="nav-button primary" 
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="home-container">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <div className="welcome-section">
            <div className="avatar">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <h3 className="font-semibold mb-2">{user.name}</h3>
            <p className="text-gray text-center">{user.bio || 'Professional networking enthusiast'}</p>
            <div className="user-stats">
              <div className="stat-item">
                <span className="stat-number">{posts.filter(p => p.author?.id === user.id || p.author?._id === user.id).length}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{users.length}</span>
                <span className="stat-label">Connections</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {error && <div className="error-message">{error}</div>}
          
          {/* Tab Navigation */}
          <div className="welcome-section">
            <div className="user-stats">
              <button 
                className={`nav-button ${activeTab === 'users' ? 'primary' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                People ({users.length})
              </button>
              <button 
                className={`nav-button ${activeTab === 'posts' ? 'primary' : ''}`}
                onClick={() => setActiveTab('posts')}
              >
                Posts ({posts.length})
              </button>
            </div>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="suggestions-card">
              <h3>Connect with People</h3>
              {usersLoading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <p className="text-gray text-center">No users found.</p>
              ) : (
                <div>
                  {users.map(userData => (
                    <div key={userData._id || userData.id} className="suggestion-item">
                      <div className="avatar">
                        {userData.profilePicture ? (
                          <img src={userData.profilePicture} alt={userData.name} />
                        ) : (
                          userData.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="suggestion-info">
                        <div className="suggestion-name">{userData.name}</div>
                        <div className="suggestion-title">{userData.email}</div>
                        {userData.bio && (
                          <p className="text-gray" style={{fontSize: '0.75rem', marginTop: '4px'}}>
                            {userData.bio}
                          </p>
                        )}
                        {userData.location && (
                          <p className="text-gray" style={{fontSize: '0.75rem'}}>📍 {userData.location}</p>
                        )}
                      </div>
                      <button 
                        className="connect-button"
                        onClick={() => navigate(`/profile/${userData._id || userData.id}`)}
                      >
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <>
              <div className="create-post">
                <h3>Share an update</h3>
                <form className="create-post-form" onSubmit={(e) => { e.preventDefault(); handlePost(); }}>
                  <textarea 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    placeholder="What's on your mind?" 
                    rows="4"
                  />
                  <div className="create-post-actions">
                    <span className="text-gray">{content.length}/1000 characters</span>
                    <button 
                      type="submit"
                      className="post-button"
                      disabled={loading || !content.trim()}
                    >
                      {loading ? (
                        <>
                          <div className="spinner" style={{width: '16px', height: '16px', marginRight: '8px'}}></div>
                          Posting...
                        </>
                      ) : 'Share Post'}
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="posts-feed">
                {posts.length === 0 ? (
                  <div className="suggestions-card text-center">
                    <h3>No posts yet</h3>
                    <p className="text-gray">Be the first to share something with the community!</p>
                  </div>
                ) : (
                  posts.map(post => (
                    <Post 
                      key={post._id} 
                      post={post} 
                      onPostUpdate={handlePostUpdate}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          <div className="suggestions-card">
            <h3>Quick Stats</h3>
            <div className="suggestion-item">
              <div className="suggestion-info">
                <div className="suggestion-name">Total Users</div>
                <div className="suggestion-title">{users.length} members</div>
              </div>
            </div>
            <div className="suggestion-item">
              <div className="suggestion-info">
                <div className="suggestion-name">Total Posts</div>
                <div className="suggestion-title">{posts.length} posts</div>
              </div>
            </div>
            <div className="suggestion-item">
              <div className="suggestion-info">
                <div className="suggestion-name">Your Posts</div>
                <div className="suggestion-title">{posts.filter(p => p.author?.id === user.id || p.author?._id === user.id).length} posts</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}