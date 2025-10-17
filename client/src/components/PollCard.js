import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Tag, message, Radio, Space, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { CloseOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { voteOnPoll, getPolls } from '../services/api';
import './PollCard.css';

const { Title, Text } = Typography;

const PollCard = () => {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchLatestPoll = async () => {
      try {
        setLoading(true);
        // 调用API获取最新的投票
        const response = await getPolls();
        
        if (response.data && response.data.length > 0) {
          // 获取最新的投票
          const latestPoll = response.data[0];
          
          // 检查用户是否已投票
          const token = localStorage.getItem('token');
          if (token) {
            // 尝试通过检查投票详情来判断用户是否已投票
            try {
              // 这里可以添加一个API调用来检查用户是否已投票
              // 暂时假设用户未投票，如果投票时返回"已投票"错误，再更新状态
              setHasVoted(false);
            } catch (voteCheckError) {
              console.error('检查投票状态失败:', voteCheckError);
              setHasVoted(false);
            }
          } else {
            setHasVoted(false);
          }
          
          setPoll(latestPoll);
        } else {
          // 没有投票数据
          setPoll(null);
        }
      } catch (error) {
        console.error('获取最新投票失败:', error);
        message.error('获取投票数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPoll();
  }, []);

  const handleVote = async () => {
    if (selectedOption === null) {
      message.warning('请选择一个选项');
      return;
    }

    try {
      setVoting(true);
      const response = await voteOnPoll(poll.id, selectedOption);
      
      if (response.data) {
        message.success('投票成功！');
        setHasVoted(true);
        
        // 重新获取投票数据以获取最新的投票结果
        try {
          const pollsResponse = await getPolls();
          if (pollsResponse.data && pollsResponse.data.length > 0) {
            const updatedPoll = pollsResponse.data.find(p => p.id === poll.id);
            if (updatedPoll) {
              setPoll(updatedPoll);
            }
          }
        } catch (refreshError) {
          console.error('刷新投票数据失败:', refreshError);
          // 如果刷新失败，手动更新本地数据
          const updatedOptions = [...poll.options];
          updatedOptions[selectedOption] = {
            ...updatedOptions[selectedOption],
            votes: updatedOptions[selectedOption].votes + 1
          };
          
          setPoll({
            ...poll,
            options: updatedOptions,
            totalVotes: (poll.totalVotes || 0) + 1
          });
        }
      } else {
        message.error('投票失败');
      }
    } catch (error) {
      console.error('投票失败:', error);
      if (error.response && error.response.data && error.response.data.message) {
        // 如果是"您已经投过票了"的错误，设置hasVoted为true
        if (error.response.data.message === '您已经投过票了') {
          setHasVoted(true);
          message.info('您已经投过票了');
        } else {
          message.error(error.response.data.message);
        }
      } else {
        message.error('投票失败，请稍后再试');
      }
    } finally {
      setVoting(false);
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  if (loading) {
    return (
      <Card 
        className={`poll-card ${isExpanded ? 'expanded' : 'collapsed'}`}
        loading={true} 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      />
    );
  }

  if (!poll) {
    return null;
  }

  const totalVotes = poll.options ? poll.options.reduce((sum, option) => sum + (option.votes || 0), 0) : 0;

  return (
    <Card 
      className={`poll-card ${isExpanded ? 'expanded' : 'collapsed'}`}
      title={
        <div className="poll-card-header">
          <Title level={4} className="poll-card-title">最新投票</Title>
          <div className="poll-card-badge">
            {poll.isActive ? (
              <Tag color="green">进行中</Tag>
            ) : (
              <Tag color="default">已结束</Tag>
            )}
          </div>
        </div>
      }
      extra={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to={`/polls/${poll.id}`}>
            <Button type="link" size="small">查看详情</Button>
          </Link>
          <Button 
            type="text" 
            size="small" 
            icon={<CloseOutlined />} 
            onClick={handleClose}
            style={{ marginLeft: 4 }}
          />
        </div>
      }
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* 常态下只显示标题和剩余时间 */}
      {!isExpanded ? (
        <div className="poll-card-collapsed">
          <Text className="poll-card-collapsed-title">{poll.title}</Text>
          <div className="poll-card-time-remaining">
            <ClockCircleOutlined /> {poll.timeRemainingText || '计算中...'}
          </div>
        </div>
      ) : (
        // 展开时显示完整内容
        <div className="poll-card-expanded">
          <Text className="poll-card-description">{poll.description}</Text>
          
          <div className="poll-card-options">
            <Radio.Group 
              value={selectedOption} 
              onChange={handleOptionChange}
              disabled={hasVoted || !poll.isActive}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {poll.options && poll.options.map((option, index) => (
                  <Radio 
                    key={index} 
                    value={index}
                    className={`poll-card-option ${selectedOption === index ? 'selected' : ''}`}
                  >
                    <div className="poll-card-option-content">
                      <span className="poll-card-option-text">{option.text}</span>
                      <span className="poll-card-option-votes">{option.votes || 0} 票</span>
                    </div>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
          
          {hasVoted ? (
            <div className="poll-card-voted-message">
              你已投票，感谢参与！
            </div>
          ) : (
            <Button 
              type="primary" 
              block 
              className="poll-card-vote-button"
              onClick={handleVote}
              loading={voting}
              disabled={!poll.isActive}
            >
              {poll.isActive ? '投票' : '投票已结束'}
            </Button>
          )}
          
          <div className="poll-card-footer">
            <Text type="secondary">总票数: {totalVotes}</Text>
            <Text type="secondary">
              {new Date(poll.createdAt).toLocaleDateString('zh-CN')}
            </Text>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PollCard;