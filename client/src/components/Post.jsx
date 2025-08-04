import React, { useState } from 'react';
import { useAuth } from '../App';
import { likePost, addCommentToPost } from '../api';

export default function Post({ post, onPostUpdate }) {
  const { user: currentUser } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [error, setError] = useState('');
  const [localPost, setLocalPost] = useState(post);

  // Update local post when prop changes
  React.useEffect(() => {
    setLocalPost(post);
  }, [post]);

  // Check if current user has liked this post
  const isLiked = localPost.likes?.some(like => {
    const likeUserId = typeof like.user === 'object' ? like.user._id : like.user;
    return likeUserId === currentUser?._id;
  });
  const likeCount = localPost.likes?.length || 0;
  const commentCount = localPost.comments?.length || 0;

  const handleLike = async () => {
    if (!currentUser || likeLoading) return;
    
    // Prevent multiple likes by checking current state
    if (isLiked && !likeLoading) {
      // User is trying to unlike
    } else if (!isLiked && !likeLoading) {
      // User is trying to like
    } else {
      return; // Prevent action if already in progress
    }
    
    try {
      setLikeLoading(true);
      setError('');
      
      const response = await likePost(localPost._id);
      
      // Update local state immediately for better UX
      setLocalPost(prev => {
        const updatedPost = { ...prev };
        
        if (response.data.liked) {
          // Add like
          updatedPost.likes = [...(prev.likes || []), { user: currentUser, createdAt: new Date() }];
        } else {
          // Remove like
          updatedPost.likes = (prev.likes || []).filter(like => {
            const likeUserId = typeof like.user === 'object' ? like.user._id : like.user;
            return likeUserId !== currentUser._id;
          });
        }
        
        return updatedPost;
      });
      
      // Also trigger parent component to refresh posts for consistency
      if (onPostUpdate) {
        onPostUpdate();
      }
    } catch (error) {
      console.error('Error liking post:', error);
      setError('Failed to like post');
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
      
      const response = await addCommentToPost(localPost._id, { content: newComment.trim() });
      
      // Update local state immediately for better UX
      setLocalPost(prev => ({
        ...prev,
        comments: [...(prev.comments || []), response.data.comment]
      }));
      
      setNewComment('');
      
      // Also trigger parent component to refresh posts for consistency
      if (onPostUpdate) {
        onPostUpdate();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
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

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <div className="avatar">
          {post.author?.profilePicture ? (
            <img src={post.author.profilePicture} alt={post.author.name} />
          ) : (
            (post.author?.name || post.authorName || 'U').charAt(0).toUpperCase()
          )}
        </div>
        <div className="post-author">
          <div className="author-name">{localPost.author?.name || localPost.authorName}</div>
          <div className="post-time">{formatDate(localPost.createdAt)}</div>
        </div>
      </div>

      {/* Post Content */}
      <div className="post-content">
        <p>{localPost.content || localPost.text}</p>
        {localPost.image && (
          <img src={localPost.image} alt="Post content" className="post-image" style={{width: '100%', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-3)'}} />
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Post Actions */}
      <div className="post-actions">
        <button 
          className={`action-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={likeLoading}
        >
          {likeLoading ? (
            <div className="spinner" style={{width: '12px', height: '12px'}}></div>
          ) : (
            <span>{isLiked ? '❤️' : '🤍'}</span>
          )}
          <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
        </button>
        
        <button 
          className="action-button"
          onClick={() => setShowComments(!showComments)}
        >
          <span>💬</span>
          <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          {/* Add Comment Form */}
          <form onSubmit={handleComment} style={{marginBottom: 'var(--space-4)'}}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows="2"
              maxLength="500"
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                border: '2px solid var(--gray-200)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'inherit',
                fontSize: 'var(--font-size-sm)',
                resize: 'vertical',
                marginBottom: 'var(--space-2)'
              }}
            />
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span className="text-gray" style={{fontSize: 'var(--font-size-xs)'}}>
                {newComment.length}/500 characters
              </span>
              <button 
                type="submit" 
                disabled={!newComment.trim() || commentLoading}
                className="action-button"
                style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'var(--white)',
                  padding: 'var(--space-2) var(--space-4)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                {commentLoading ? (
                  <>
                    <div className="spinner" style={{width: '12px', height: '12px', marginRight: '4px'}}></div>
                    Posting...
                  </>
                ) : 'Comment'}
              </button>
            </div>
          </form>
          
          {/* Comments List */}
          <div>
            {localPost.comments && localPost.comments.length > 0 ? (
              localPost.comments
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((comment, index) => (
                  <div key={comment._id || index} className="comment">
                    <div className="comment-avatar">
                      {comment.user?.profilePicture ? (
                        <img src={comment.user.profilePicture} alt={comment.user.name} />
                      ) : (
                        (comment.user?.name || 'U').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="comment-content">
                      <div className="comment-author">{comment.user?.name}</div>
                      <div className="comment-text">{comment.content}</div>
                      <div className="text-gray" style={{fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-1)'}}>
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray text-center" style={{padding: 'var(--space-4)'}}>
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
