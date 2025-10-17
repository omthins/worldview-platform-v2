import React, { useState } from 'react';
import { Button, Popover, Space, message, Input } from 'antd';
import { 
  ShareAltOutlined, 
  WechatOutlined, 
  WeiboOutlined, 
  QqOutlined, 
  LinkOutlined,
  CopyOutlined
} from '@ant-design/icons';
import './ShareButton.css';

const ShareButton = ({ 
  title, 
  description, 
  url, 
  image, 
  type = 'worldview',
  entityId 
}) => {
  const [visible, setVisible] = useState(false);

  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    return url || `${baseUrl}/${type === 'worldview' ? 'worldview' : 'poll'}/${entityId}`;
  };

  const shareToWechat = () => {
    const shareUrl = getShareUrl();
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`;
    
    // 在实际项目中，这里可以集成微信分享SDK
    message.info('请使用微信扫描二维码分享');
    window.open(qrCodeUrl, '_blank');
  };

  const shareToWeibo = () => {
    const shareUrl = getShareUrl();
    const weiboUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`;
    window.open(weiboUrl, '_blank', 'width=615,height=505');
  };

  const shareToQQ = () => {
    const shareUrl = getShareUrl();
    const qqUrl = `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description || '')}`;
    window.open(qqUrl, '_blank', 'width=615,height=505');
  };

  const copyLink = async () => {
    try {
      const shareUrl = getShareUrl();
      await navigator.clipboard.writeText(shareUrl);
      message.success('链接已复制到剪贴板');
    } catch (error) {
      // 降级方案
      const shareUrl = getShareUrl();
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      message.success('链接已复制到剪贴板');
    }
  };

  const shareContent = (
    <div className="share-popover-content">
      <div className="share-title">分享到</div>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div className="share-platforms">
          <Button 
            type="text" 
            icon={<WechatOutlined />}
            className="share-platform-button"
            onClick={shareToWechat}
          >
            微信
          </Button>
          <Button 
            type="text" 
            icon={<WeiboOutlined />}
            className="share-platform-button"
            onClick={shareToWeibo}
          >
            微博
          </Button>
          <Button 
            type="text" 
            icon={<QqOutlined />}
            className="share-platform-button"
            onClick={shareToQQ}
          >
            QQ
          </Button>
        </div>
        
        <div className="share-link-section">
          <div className="share-link-label">分享链接</div>
          <div className="share-link-container">
            <Input 
              value={getShareUrl()}
              readOnly
              size="small"
              className="share-link-input"
            />
            <Button 
              type="primary" 
              icon={<CopyOutlined />}
              size="small"
              onClick={copyLink}
            >
              复制
            </Button>
          </div>
        </div>

        <div className="share-embed-section">
          <div className="share-embed-label">嵌入代码</div>
          <div className="share-embed-container">
            <Input.TextArea 
              value={`<iframe src="${getShareUrl()}/embed" width="100%" height="400" frameborder="0"></iframe>`}
              readOnly
              rows={2}
              className="share-embed-input"
            />
            <Button 
              type="dashed" 
              icon={<CopyOutlined />}
              size="small"
              onClick={() => {
                const embedCode = `<iframe src="${getShareUrl()}/embed" width="100%" height="400" frameborder="0"></iframe>`;
                navigator.clipboard.writeText(embedCode);
                message.success('嵌入代码已复制');
              }}
            >
              复制代码
            </Button>
          </div>
        </div>
      </Space>
    </div>
  );

  return (
    <Popover
      content={shareContent}
      trigger="click"
      visible={visible}
      onVisibleChange={setVisible}
      placement="bottomRight"
      overlayClassName="share-popover"
    >
      <Button 
        type="text" 
        icon={<ShareAltOutlined />}
        className="share-button"
      >
        分享
      </Button>
    </Popover>
  );
};

export default ShareButton;