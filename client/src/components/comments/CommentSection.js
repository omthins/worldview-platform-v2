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
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState(new Set());

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(`${API_ENDPOINTS.COMMENTS}/${worldviewId}`);
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

  const handleReply = (comment) => {
    setReplyTo(comment);
    setReplyingToCommentId(comment.id);
    setNewComment('');
  };

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
      setReplyingToCommentId(null);
      
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

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  return (
    <div className="comment-section">
      <h3>评论 ({comments.length})</h3>
      
      {isAuthenticated && !replyTo && (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <div className="form-group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="form-control"
              rows="3"
              placeholder="写下你的评论..."
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? '发送中...' : '发表评论'}
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
              onReply={handleReply}
              formatDate={formatDate}
              isExpanded={expandedReplies.has(comment.id)}
              onToggleReplies={() => toggleReplies(comment.id)}
              replyingToCommentId={replyingToCommentId}
              onCancelReply={() => {
                setReplyTo(null);
                setReplyingToCommentId(null);
              }}
              newComment={newComment}
              setNewComment={setNewComment}
              handleCommentSubmit={handleCommentSubmit}
              submitting={submitting}
              isAuthenticated={isAuthenticated}
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

// 递归评论组件（支持多层嵌套）
const CommentItem = ({ 
  comment, 
  onReply, 
  formatDate, 
  isExpanded, 
  onToggleReplies, 
  replyingToCommentId,
  onCancelReply,
  newComment,
  setNewComment,
  handleCommentSubmit,
  submitting,
  isAuthenticated,
  level = 0 
}) => {
  const maxNestingLevel = 5; // 最大嵌套层级
  
  // 如果超过最大嵌套层级，使用不同的样式
  const isDeepNested = level >= maxNestingLevel;
  const isReplyingToThisComment = replyingToCommentId === comment.id;
  
  return (
    <div className={`comment-item ${isDeepNested ? 'deep-nested' : ''}`} data-level={level}>
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
          {isAuthenticated && level < maxNestingLevel && (
            <button 
              className="comment-action"
              onClick={() => onReply(comment)}
            >
              回复
            </button>
          )}
        </div>
        
        {/* 回复表单 - 显示在被回复的评论下方 */}
        {isReplyingToThisComment && (
          <form onSubmit={handleCommentSubmit} className="comment-reply-form">
            <div className="form-group">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="form-control"
                rows="3"
                placeholder={`回复 @${comment.author?.username || '用户'}...`}
              ></textarea>
            </div>
            
            <div className="comment-form-actions">
              <button 
                type="submit" 
                className="btn btn-primary btn-sm"
                disabled={submitting || !newComment.trim()}
              >
                {submitting ? '发送中...' : '回复'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={onCancelReply}
              >
                取消
              </button>
            </div>
          </form>
        )}
        
        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies-section">
            {level < maxNestingLevel && (
              <button 
                className="toggle-replies-btn"
                onClick={onToggleReplies}
              >
                {isExpanded ? '收起' : `展开 ${comment.replies.length} 条回复`}
              </button>
            )}
            
            {isExpanded && level < maxNestingLevel && (
              <div className="comment-replies">
                {comment.replies.map(reply => (
                  <CommentItem 
                    key={reply.id}
                    comment={reply}
                    onReply={onReply}
                    formatDate={formatDate}
                    isExpanded={isExpanded}
                    onToggleReplies={onToggleReplies}
                    replyingToCommentId={replyingToCommentId}
                    onCancelReply={onCancelReply}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    handleCommentSubmit={handleCommentSubmit}
                    submitting={submitting}
                    isAuthenticated={isAuthenticated}
                    level={level + 1}
                  />
                ))}
              </div>
            )}
            
            {isDeepNested && (
              <div className="deep-nested-notice">
                回复层级过深，无法继续显示
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;