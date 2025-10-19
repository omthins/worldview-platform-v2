import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastContext';
import { API_ENDPOINTS, apiRequest } from '../../utils/api';
import ReactMarkdown from 'react-markdown';
import './CommentSection.css';

const CommentSection = ({ worldviewId }) => {
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const maxCommentLength = 500; // 评论最大字数限制
  const textareaRef = useRef(null);
  const [replyTo, setReplyTo] = useState(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // 移除未使用的状态变量

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

  // 自动调整文本框高度
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [newComment, showPreview]);

  const handleCommentChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxCommentLength) {
      setNewComment(value);
    }
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
      await apiRequest(API_ENDPOINTS.COMMENTS, {
        method: 'POST',
        body: JSON.stringify({
          content: newComment,
          worldviewId,
          parentCommentId: replyTo ? replyTo.id : null
        })
      });
      
      // 重新获取完整的评论列表，确保多层嵌套结构正确
      const response = await apiRequest(`${API_ENDPOINTS.COMMENTS}/${worldviewId}`);
      const processedComments = (response.comments || []).map(comment => ({
        ...comment,
        replies: Array.isArray(comment.replies) ? comment.replies : []
      }));
      setComments(processedComments);
      
      setNewComment('');
      setShowPreview(false);
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

  // 移除未使用的函数

  return (
    <div className="comment-section">
      <h3>评论 ({comments.length})</h3>
      
      {isAuthenticated && !replyTo && (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <div className="comment-input-tabs">
            <button 
              type="button"
              className={`tab-button ${!showPreview ? 'active' : ''}`}
              onClick={() => setShowPreview(false)}
            >
              编辑
            </button>
            <button 
              type="button"
              className={`tab-button ${showPreview ? 'active' : ''}`}
              onClick={() => setShowPreview(true)}
              disabled={!newComment.trim()}
            >
              预览
            </button>
          </div>
          
          <div className="form-group">
            {!showPreview ? (
              <>
                <textarea
                  ref={textareaRef}
                  value={newComment}
                  onChange={handleCommentChange}
                  className="form-control auto-resize"
                  placeholder="写下你的评论..."
                  maxLength={maxCommentLength}
                ></textarea>
                <div className="comment-length-counter">
                  <span className={newComment.length > maxCommentLength * 0.8 ? 'text-warning' : ''}>
                    {newComment.length}/{maxCommentLength}
                  </span>
                </div>
              </>
            ) : (
              <div className="comment-preview">
                <div className="preview-content markdown-preview">
                  <ReactMarkdown>{newComment}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
          
          <div className="comment-form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting || !newComment.trim() || newComment.length > maxCommentLength}
            >
              {submitting ? '发送中...' : '发表评论'}
            </button>
          </div>
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
              maxCommentLength={maxCommentLength}
              showPreview={showPreview}
              setShowPreview={setShowPreview}
              textareaRef={textareaRef}
              handleCommentChange={handleCommentChange}
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

// 递归函数计算评论的所有回复数量（包括嵌套回复）
const countAllReplies = (comment) => {
  if (!comment.replies || comment.replies.length === 0) {
    return 0;
  }
  
  let total = comment.replies.length;
  comment.replies.forEach(reply => {
    total += countAllReplies(reply);
  });
  
  return total;
};

// 递归评论组件（支持多层嵌套）
const CommentItem = ({ 
  comment, 
  onReply, 
  formatDate, 
  replyingToCommentId,
  onCancelReply,
  newComment,
  setNewComment,
  handleCommentSubmit,
  submitting,
  isAuthenticated,
  maxCommentLength,
  showPreview,
  setShowPreview,
  textareaRef,
  handleCommentChange,
  level = 0 
}) => {
  // 为每个评论创建独立的展开状态
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  // 支持无限嵌套，移除层级限制
  const isDeepNested = false; // 不再限制嵌套层级
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
        
        <div className="comment-body">
          <ReactMarkdown>{comment.content}</ReactMarkdown>
        </div>
        
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
        
        {/* 回复表单 - 显示在被回复的评论下方 */}
        {isReplyingToThisComment && (
          <form onSubmit={handleCommentSubmit} className="comment-reply-form">
            <div className="comment-input-tabs">
              <button 
                type="button"
                className={`tab-button ${!showPreview ? 'active' : ''}`}
                onClick={() => setShowPreview(false)}
              >
                编辑
              </button>
              <button 
                type="button"
                className={`tab-button ${showPreview ? 'active' : ''}`}
                onClick={() => setShowPreview(true)}
                disabled={!newComment.trim()}
              >
                预览
              </button>
            </div>
            
            <div className="form-group">
              {!showPreview ? (
                <>
                  <textarea
                    ref={textareaRef}
                    value={newComment}
                    onChange={handleCommentChange}
                    className="form-control auto-resize"
                    placeholder={`回复 @${comment.author?.username || '用户'}...`}
                    maxLength={maxCommentLength}
                  ></textarea>
                  <div className="comment-length-counter">
                    <span className={newComment.length > maxCommentLength * 0.8 ? 'text-warning' : ''}>
                      {newComment.length}/{maxCommentLength}
                    </span>
                  </div>
                </>
              ) : (
                <div className="comment-preview">
                  <div className="preview-content markdown-preview">
                    <ReactMarkdown>{newComment}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
            
            <div className="comment-form-actions">
              <button 
                type="submit" 
                className="btn btn-primary btn-sm"
                disabled={submitting || !newComment.trim() || newComment.length > maxCommentLength}
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
            <button 
              className="toggle-replies-btn"
              onClick={() => {
                // 为当前评论的回复创建独立的展开状态
                setExpandedReplies(prev => {
                  const newSet = new Set(prev);
                  if (newSet.has('replies')) {
                    newSet.delete('replies');
                  } else {
                    newSet.add('replies');
                  }
                  return newSet;
                });
              }}
            >
              {expandedReplies.has('replies') ? '收起' : `展开 ${countAllReplies(comment)} 条回复`}
            </button>
            
            {expandedReplies.has('replies') && (
              <div className="comment-replies">
                {comment.replies.map(reply => (
                  <CommentItem 
                    key={reply.id}
                    comment={reply}
                    onReply={onReply}
                    formatDate={formatDate}
                    replyingToCommentId={replyingToCommentId}
                    onCancelReply={onCancelReply}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    handleCommentSubmit={handleCommentSubmit}
                    submitting={submitting}
                    isAuthenticated={isAuthenticated}
                    maxCommentLength={maxCommentLength}
                    showPreview={showPreview}
                    setShowPreview={setShowPreview}
                    textareaRef={textareaRef}
                    handleCommentChange={handleCommentChange}
                    level={level + 1}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;