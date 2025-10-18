import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastContext';
import { API_ENDPOINTS, apiRequest } from '../../utils/api';
import './CommentSection.css';

const CommentSection = ({ worldviewId }) => {
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(`${API_ENDPOINTS.COMMENTS}/worldview/${worldviewId}`);
        // 确保每个评论的replies都是数组
        const processedComments = (data.comments || []).map(comment => ({
          ...comment,
          replies: Array.isArray(comment.replies) ? comment.replies : []
        }));
        setComments(processedComments);
        setLoading(false);
      } catch (err) {
        console.error('获取评论失败:', err);
        setComments([]);
        setLoading(false);
      }
    };

    fetchComments();
  }, [worldviewId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    if (!isAuthenticated) {
      showInfo('请先登录后再评论');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const data = await apiRequest(API_ENDPOINTS.COMMENTS, {
        method: 'POST',
        body: JSON.stringify({
          content: newComment,
          worldviewId,
          parentCommentId: replyTo ? replyTo.id : null
        })
      });
      
      if (replyTo) {
        // 如果是回复，更新对应评论的回复列表
        setComments(prevComments => 
          prevComments.map(comment => {
            if (comment.id === replyTo.id) {
              return {
                ...comment,
                replies: [...comment.replies, data]
              };
            }
            return comment;
          })
        );
      } else {
        // 如果是顶级评论，添加到评论列表
        setComments(prevComments => [data, ...prevComments]);
      }
      
      setNewComment('');
      setReplyTo(null);
      
      // 显示成功提示
      showSuccess(replyTo ? '回复成功！' : '评论发表成功！');
    } catch (err) {
      console.error('提交评论失败:', err);
      showError('评论提交失败，请重试');
    }
    
    setSubmitting(false);
  };



  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="comment-section">
      <h3>评论 ({comments.length})</h3>
      
      {isAuthenticated && (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <div className="form-group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="form-control"
              rows="3"
              placeholder={replyTo ? `回复 @${replyTo.username}...` : '写下你的评论...'}
            ></textarea>
          </div>
          
          {replyTo && (
            <div className="replying-to">
              回复给 @{replyTo.username}
              <button 
                type="button" 
                className="btn-cancel-reply"
                onClick={() => setReplyTo(null)}
              >
                取消
              </button>
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? '发送中...' : (replyTo ? '回复评论' : '发表评论')}
          </button>
        </form>
      )}
      
      {!isAuthenticated && (
        <div className="login-prompt">
          <p>请 <a href="/login">登录</a> 后发表评论</p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center">加载评论中...</div>
      ) : comments.length > 0 ? (
        <div className="comments-list">
          {comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onReply={(comment) => setReplyTo(comment)}
              formatDate={formatDate}
            />
          ))}
        </div>
      ) : (
        <div className="no-comments">
          <p>暂无评论，快来发表第一条评论吧！</p>
        </div>
      )}
    </div>
  );
};

// 评论项组件
const CommentItem = ({ comment, onReply, formatDate }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="comment-item">
      <div className="comment-avatar">
        <img 
          src={comment.author.avatar || 'https://picsum.photos/seed/avatar/40/40.jpg'} 
          alt="用户头像" 
        />
      </div>
      
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.author.username}</span>
          <span className="comment-date">{formatDate(comment.createdAt)}</span>
        </div>
        
        <div className="comment-body">{comment.content}</div>
        
        <div className="comment-actions">
          {isAuthenticated && (
            <button 
              className="comment-action"
              onClick={() => onReply(comment)}
            >
              回复
            </button>
          )}
        </div>
        
        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies">
            {comment.replies.map(reply => (
              <div key={reply.id} className="comment-reply">
                <div className="comment-avatar">
                  <img 
                    src={reply.author.avatar || 'https://picsum.photos/seed/avatar/30/30.jpg'} 
                    alt="用户头像" 
                  />
                </div>
                
                <div className="reply-content">
                  <div className="comment-header">
                    <span className="comment-author">{reply.author.username}</span>
                    <span className="comment-date">{formatDate(reply.createdAt)}</span>
                  </div>
                  
                  <div className="comment-body">{reply.content}</div>
                  
                  <div className="comment-actions">
                    {isAuthenticated && (
                      <button 
                        className="comment-action"
                        onClick={() => onReply(reply)}
                      >
                        回复
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;