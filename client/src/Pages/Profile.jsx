import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserProfile, likeUserProfile, commentOnUserProfile, fetchUserPosts } from '../api';
import { useAuth } from '../App';
import Post from '../components/Post';

export default function Profile() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch user profile with likes and comments
        const profileRes = await fetchUserProfile(uid);
        const profileData = profileRes.data.user;
        setUserData(profileData);
        
        // Check if current user has liked this profile
        const userLike = profileData.likes?.find(like => 
          like.user._id === currentUser?._id
        );
        setIsLiked(!!userLike);
        
        // Fetch user posts
        const postsRes = await fetchUserPosts(uid);
        setPosts(postsRes.data.posts || postsRes.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    if (uid) {
      fetchData();
    }
  }, [uid, currentUser]);

  const handleLike = async () => {
    if (!currentUser || likeLoading) return;
    
    // Can't like your own profile
    if (uid === currentUser._id) {
      setError('You cannot like your own profile');
      return;
    }
    
    try {
      setLikeLoading(true);
      setError('');
      
      const response = await likeUserProfile(uid);
      
      // Update local state
      setIsLiked(response.data.liked);
      setUserData(prev => ({
        ...prev,
        likes: response.data.liked 
          ? [...(prev.likes || []), { user: currentUser, createdAt: new Date() }]
          : (prev.likes || []).filter(like => like.user._id !== currentUser._id)
      }));
    } catch (error) {
      console.error('Error liking profile:', error);
      setError(error.response?.data?.message || 'Failed to like profile');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim() || commentLoading) return;
    
    try {
      setCommentLoading(true);
      setError('');
      
      const response = await commentOnUserProfile(uid, { content: newComment.trim() });
      
      // Update local state with new comment
      setUserData(prev => ({
        ...prev,
        comments: [...(prev.comments || []), response.data.comment]
      }));
      
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (!userData) {
    return <div className="profile-error">Profile not found</div>;
  }

  const isOwnProfile = currentUser?._id === uid;

  return (
    <div className="profile">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {userData.profilePicture ? (
            <img src={userData.profilePicture} alt={userData.name} />
          ) : (
            <div className="avatar-placeholder">
              {userData.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <h1>{userData.name}</h1>
          <p className="profile-email">{userData.email}</p>
          {userData.location && (
            <p className="profile-location">📍 {userData.location}</p>
          )}
          {userData.bio && (
            <div className="profile-bio">
              <h3>About</h3>
              <p>{userData.bio}</p>
            </div>
          )}
        </div>
        
        <div className="profile-actions">
          <button 
            className="back-button"
            onClick={() => navigate('/home')}
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Like Section */}
      <div className="profile-interactions">
        <div className="like-section">
          {!isOwnProfile && (
            <button 
              className={`like-button ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
              disabled={likeLoading}
            >
              {likeLoading ? 'Loading...' : (isLiked ? '❤️ Liked' : '🤍 Like')}
            </button>
          )}
          <span className="like-count">
            {userData.likes?.length || 0} {userData.likes?.length === 1 ? 'like' : 'likes'}
          </span>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3>Comments ({userData.comments?.length || 0})</h3>
          
          {/* Add Comment Form */}
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows="3"
              maxLength="500"
            />
            <button 
              type="submit" 
              disabled={!newComment.trim() || commentLoading}
              className="comment-submit"
            >
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
          
          {/* Comments List */}
          <div className="comments-list">
            {userData.comments && userData.comments.length > 0 ? (
              userData.comments
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((comment, index) => (
                  <div key={comment._id || index} className="comment">
                    <div className="comment-avatar">
                      {comment.user.profilePicture ? (
                        <img src={comment.user.profilePicture} alt={comment.user.name} />
                      ) : (
                        <div className="avatar-placeholder small">
                          {comment.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">{comment.user.name}</span>
                        <span className="comment-time">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="comment-text">{comment.content}</p>
                    </div>
                  </div>
                ))
            ) : (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="profile-posts">
        <h3>Posts ({posts.length})</h3>
        {posts.length > 0 ? (
          <div className="posts-list">
            {posts.map(post => <Post key={post._id} post={post} />)}
          </div>
        ) : (
          <p className="no-posts">No posts yet.</p>
        )}
      </div>
    </div>
  );
}