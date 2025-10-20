# 项目CSS选择器总结

## 全局样式 (index.css)

### CSS变量定义
- `:root` - 默认深色主题变量
- `.light-mode` - 亮色模式变量
- `.dark-mode` - 暗色模式变量

### 基础选择器
- `*` - 全局重置
- `body` - 页面主体
- `code` - 代码样式
- `a` - 链接样式
- `a:hover` - 链接悬停

### 布局类
- `.container` - 容器布局
- `.container` 媒体查询 (1400px, 1600px)

### 通用组件
- `.btn` - 按钮基础样式
- `.btn-outline` - 轮廓按钮
- `.btn-danger` - 危险按钮
- `.card` - 卡片组件
- `.card:hover` - 卡片悬停效果
- `.form-group` - 表单组
- `.form-control` - 表单控件
- `.form-control:focus` - 表单焦点状态
- `.text-center` - 文本居中
- 间距类: `.mt-1` 到 `.mt-5`, `.mb-1` 到 `.mb-5`, `.p-1` 到 `.p-5`
- 布局类: `.d-flex`, `.justify-content-between`, `.align-items-center`
- 文本类: `.text-muted`, `.text-danger`

### 警告组件
- `.alert` - 警告基础样式
- `.alert-danger` - 危险警告
- `.alert-success` - 成功警告

### 主题切换
- `.theme-toggle` - 主题切换按钮
- `.theme-toggle:hover` - 按钮悬停

### 响应式设计
- `@media (max-width: 768px)` - 移动端适配

## 应用布局 (App.css)

- `.App` - 应用容器
- `main` - 主内容区域
- `main` 媒体查询 (768px)
- `.toast-container` - Toast容器
- `.toast-container .toast` - Toast样式

## 首页样式 (Home.css)

### 页面结构
- `.home` - 首页容器
- `.hero` - 英雄区域
- `.hero-content` - 英雄内容
- `.hero h1` - 主标题
- `.hero p` - 描述文本

### 按钮样式
- `.btn-primary` - 主要按钮
- `.btn-lg` - 大按钮

### 筛选区域
- `.filters` - 筛选容器
- `.search-form` - 搜索表单
- `.search-form .form-control` - 搜索输入框
- `.search-form .btn` - 搜索按钮
- `.categories` - 分类区域
- `.category-btn` - 分类按钮
- `.category-btn:hover` - 分类按钮悬停
- `.category-btn.active` - 激活的分类按钮

### 内容区域
- `.worldviews-container` - 世界观容器
- `.loading-container` - 加载容器
- `.loading-spinner` - 加载动画
- `.empty-state` - 空状态
- `.error-state` - 错误状态
- `@keyframes spin` - 旋转动画

### 列表和分页
- `.worldviews-list` - 世界观列表
- `.pagination` - 分页组件
- `.pagination-btn` - 分页按钮
- `.pagination-btn:disabled` - 禁用分页按钮
- `.page-info` - 页面信息

### 作者相关
- `.authors-section` - 作者区域
- `.authors-title` - 作者标题
- `.authors-list` - 作者列表
- `.author-card` - 作者卡片
- `.author-avatar` - 作者头像
- `.author-info` - 作者信息
- `.author-name` - 作者名称
- `.author-id` - 作者ID

### 响应式设计
- 多个媒体查询 (1400px, 1200px, 900px, 768px, 480px)

## 导航栏样式 (Navbar.css)

### 导航栏结构
- `.navbar` - 导航栏容器
- `main` - 主内容模糊效果
- `body.search-blur main` - 搜索模糊状态
- `body.search-blur .navbar` - 导航栏层级
- `body.search-blur .search-suggestions` - 搜索建议层级

### 搜索组件
- `.search-input` - 搜索输入框
- `.search-input:focus` - 搜索框焦点
- `.search-btn` - 搜索按钮
- `.search-suggestions` - 搜索建议
- `.search-suggestion-item` - 建议项
- `.search-suggestion-item:hover` - 建议项悬停

### 导航菜单
- `.navbar-brand` - 品牌标识
- `.navbar-search` - 搜索区域
- `.nav-menu` - 导航菜单
- `.nav-item` - 导航项
- `.nav-link` - 导航链接
- `.nav-link:hover` - 链接悬停
- `.nav-link.active` - 激活链接

### 下拉菜单
- `.dropdown` - 下拉容器
- `.dropdown-toggle` - 下拉触发
- `.dropdown-toggle:hover` - 下拉触发悬停
- `.avatar` - 用户头像
- `.dropdown-menu` - 下拉菜单
- `.dropdown-item` - 下拉项
- `.dropdown-item:hover` - 下拉项悬停

### 动画效果
- `@keyframes slideDown` - 下滑动画
- `@keyframes dropdownSlide` - 下拉动画

### 主题切换按钮
- `.theme-toggle-btn` - 主题切换按钮
- `.theme-toggle-btn:hover` - 按钮悬停

### 响应式设计
- 多个媒体查询 (1200px, 992px, 768px)

## 世界观详情页 (WorldviewDetail.css)

### 页面结构
- `.worldview-detail` - 详情页容器
- `.worldview-header` - 头部区域
- `.worldview-number` - 世界观编号
- `.worldview-title` - 世界观标题
- `.worldview-meta` - 元信息
- `.author-info` - 作者信息
- `.author-avatar` - 作者头像
- `.author-name` - 作者名称
- `.publish-date` - 发布日期
- `.worldview-actions` - 操作区域
- `.worldview-tags` - 标签区域
- `.category-tag` - 分类标签
- `.tag` - 普通标签

### 内容区域
- `.worldview-content` - 内容容器
- `.worldview-description` - 描述区域
- `.worldview-description h3` - 描述标题
- `.worldview-description p` - 描述文本
- `.worldview-body` - 主体内容
- `.worldview-body h1` 到 `.worldview-body h6` - 标题样式
- `.worldview-body p` - 段落文本
- `.worldview-body ul`, `.worldview-body ol` - 列表样式
- `.worldview-body li` - 列表项
- `.worldview-body a` - 内容链接
- `.worldview-body blockquote` - 引用块
- `.worldview-body code` - 行内代码
- `.worldview-body pre` - 代码块

### 页脚和作者信息
- `.worldview-footer` - 页脚
- `.author-bio` - 作者简介
- `.author-bio h3` - 作者标题
- `.author-card` - 作者卡片
- `.author-avatar-large` - 大头像
- `.author-details .author-name` - 作者名称
- `.author-details p` - 作者描述
- `.author-id` - 作者ID
- `.btn-outline` - 轮廓按钮

### 响应式设计
- 媒体查询 (768px, 480px)

## 世界观卡片 (WorldviewCard.css)

### 卡片结构
- `.worldview-card` - 卡片容器
- `.dark-mode .worldview-card` - 暗色模式卡片
- `.worldview-card:hover` - 卡片悬停
- `.card-content` - 卡片内容
- `.card-header` - 卡片头部
- `.card-title` - 卡片标题
- `.card-title:hover` - 标题悬停
- `.card-description` - 卡片描述
- `.description-link` - 描述链接
- `.description-link:hover` - 描述链接悬停
- `.card-description p` - 描述文本

### 作者信息
- `.author-name-link` - 作者名称链接
- `.author-name-link:hover .author-name` - 作者名称悬停
- `.card-divider` - 分隔线
- `.card-footer` - 卡片页脚
- `.card-footer-left` - 页脚左侧
- `.card-footer-right` - 页脚右侧
- `.card-date` - 日期信息
- `.date-label` - 日期标签
- `.card-actions` - 操作区域
- `.card-actions .btn` - 操作按钮
- `.card-author` - 作者信息
- `.author-avatar` - 作者头像
- `.author-avatar img` - 头像图片
- `.avatar-initial` - 头像首字母
- `.author-name` - 作者名称

### 统计信息
- `.card-stats` - 统计区域
- `.stat-icon` - 统计图标
- `.stat-value` - 统计值
- `.card-category` - 分类标签
- `.card-category:hover` - 分类标签悬停

### 响应式设计
- 媒体查询 (768px)

## 评论系统 (CommentSection.css)

### 评论区域
- `.comment-section` - 评论区域
- `.comment-section h3` - 评论标题
- `.comment-form` - 评论表单
- `.comment-form .form-group` - 表单组
- `.comment-form textarea` - 文本区域
- `.comment-form .btn` - 表单按钮
- `.comment-form .btn:not(:disabled)` - 启用按钮
- `.comment-form .btn:disabled` - 禁用按钮

### 回复功能
- `.replying-to` - 回复提示
- `.btn-cancel-reply` - 取消回复按钮
- `.login-prompt` - 登录提示
- `.comments-list` - 评论列表
- `.comment-item` - 评论项
- `.comment-avatar` - 评论头像
- `.comment-avatar img` - 头像图片
- `.comment-content` - 评论内容
- `.comment-header` - 评论头部
- `.comment-author` - 评论作者
- `.comment-date` - 评论日期
- `.comment-body` - 评论正文
- `.comment-actions` - 评论操作
- `.comment-action` - 操作按钮
- `.comment-action:hover` - 操作按钮悬停

### 回复系统
- `.comment-replies-section` - 回复区域
- `.toggle-replies-btn` - 切换回复按钮
- `.comment-replies` - 回复列表
- `.comment-item[data-level="1"]` 到 `[data-level="4"]` - 嵌套层级
- `.deep-nested .comment-replies` - 深层嵌套
- `.deep-nested-notice` - 深层嵌套提示
- `.comment-reply` - 回复项
- `.comment-reply .comment-avatar img` - 回复头像
- `.reply-content` - 回复内容
- `.comment-reply-form` - 回复表单
- `.comment-reply-form .form-group` - 回复表单组
- `.comment-reply-form textarea` - 回复文本区域
- `.comment-form-actions` - 表单操作
- `.btn-sm` - 小按钮
- `.btn-secondary` - 次要按钮
- `.no-comments` - 无评论提示

### Markdown编辑器
- `.comment-input-tabs` - 标签页
- `.tab-button` - 标签按钮
- `.tab-button.active` - 激活标签
- `.tab-button:disabled` - 禁用标签
- `.auto-resize` - 自动调整文本框
- `.auto-resize` 滚动条样式
- `.comment-preview` - 预览区域
- `.markdown-preview` - Markdown预览
- `.markdown-preview` 各级标题
- `.markdown-preview p` - 预览段落
- `.markdown-preview ul`, `.markdown-preview ol` - 预览列表
- `.markdown-preview li` - 预览列表项
- `.markdown-preview code` - 预览代码
- `.markdown-preview pre` - 预览代码块
- `.markdown-preview blockquote` - 预览引用
- `.markdown-preview a` - 预览链接

### 评论内容样式
- `.comment-body` 各级标题
- `.comment-body p` - 评论段落
- `.comment-body ul`, `.comment-body ol` - 评论列表
- `.comment-body li` - 评论列表项
- `.comment-body code` - 评论代码
- `.comment-body pre` - 评论代码块
- `.comment-body blockquote` - 评论引用
- `.comment-body a` - 评论链接

### 响应式设计
- 媒体查询 (768px)

## 创建世界观 (CreateWorldview.css)

### 表单验证
- `.required` - 必填字段标记
- `.is-invalid` - 无效字段
- `.is-invalid:focus` - 无效字段焦点
- `.invalid-feedback` - 无效反馈

### 页面结构
- `.create-worldview` - 创建页面容器
- `.create-header` - 页面头部
- `.create-header h1` - 页面标题
- `.create-header p` - 页面描述
- `.alert` - 警告框
- `.alert-danger` - 危险警告
- `.alert-success` - 成功警告
- `.create-form` - 创建表单

### 表单组件
- `.form-group` - 表单组
- `.form-group label` - 表单标签
- `.form-control` - 表单控件
- `.form-control:focus` - 控件焦点
- `.form-row` - 表单行
- `.content-editor` - 内容编辑器
- `.editor-hint` - 编辑器提示
- `.checkbox-label` - 复选框标签
- `.checkbox-label input[type="checkbox"]` - 复选框

### 表单操作
- `.form-actions` - 表单操作区域
- `.btn-primary` - 主要按钮
- `.btn-primary:hover` - 按钮悬停
- `.btn-primary:disabled` - 禁用按钮
- `.btn-outline` - 轮廓按钮

### 字符计数
- `.character-count` - 字符计数
- `.character-count.warning` - 警告状态
- `.character-count.error` - 错误状态

### 编辑器功能
- `.editor-header` - 编辑器头部
- `.preview-toggle` - 预览切换
- `.preview-toggle.active` - 激活预览
- `.preview-container` - 预览容器
- `.markdown-preview` - Markdown预览
- `.markdown-preview` 各级标题
- `.markdown-preview p` - 预览段落
- `.markdown-preview ul`, `.markdown-preview ol` - 预览列表
- `.markdown-preview code` - 预览代码
- `.markdown-preview pre` - 预览代码块
- `.markdown-preview blockquote` - 预览引用

### 分类和图片上传
- `.category-input-container` - 分类输入容器
- `.category-input-container::after` - 分类下拉箭头
- `.image-upload-container` - 图片上传容器
- `.image-upload-area` - 上传区域
- `.image-upload-input` - 上传输入框
- `.image-upload-label` - 上传标签
- `.upload-hint` - 上传提示
- `.image-preview` - 图片预览
- `.image-preview img` - 预览图片
- `.remove-image-btn` - 删除图片按钮

### 响应式设计
- 媒体查询 (768px)

## 登录/注册页面 (Login.css / Register.css)

### 页面结构
- `.login-container` / `.register-container` - 页面容器
- `.login-card` / `.register-card` - 卡片容器
- `.login-title` / `.register-title` - 页面标题

### 表单样式
- `.btn-primary` - 主要按钮
- `.btn-block` - 块级按钮
- `.login-footer` / `.register-footer` - 页脚区域

## 用户个人资料 (Profile.css / UserProfile.css)

### 个人资料页面
- `.profile-page` - 个人资料页面
- `.profile-header` - 头部区域
- `.profile-avatar` - 个人头像
- `.profile-avatar img` - 头像图片
- `.profile-info h1` - 用户名
- `.profile-email` - 邮箱
- `.profile-id` - 用户ID
- `.profile-bio` - 个人简介

### 标签页系统
- `.profile-tabs` - 标签页容器
- `.tab-btn` - 标签按钮
- `.tab-btn:hover` - 标签悬停
- `.tab-btn.active` - 激活标签
- `.profile-content` - 内容区域

### 表单样式
- `.profile-form-container h2` - 表单标题
- `.profile-form` - 个人资料表单
- `.password-form` - 密码表单
- `.form-group` - 表单组
- `.form-group label` - 表单标签
- `.form-control` - 表单控件
- `.form-control:focus` - 控件焦点
- `.btn` - 按钮基础样式
- `.btn-primary` - 主要按钮
- `.btn-primary:hover` - 按钮悬停
- `.btn-primary:disabled` - 禁用按钮
- `.btn-outline` - 轮廓按钮
- `.btn-sm` - 小按钮
- `.btn-block` - 块级按钮
- `.alert` - 警告框
- `.alert-info` - 信息警告
- `.login-prompt` - 登录提示

### 世界观展示
- `.user-worldviews` - 用户世界观
- `.user-liked-worldviews` - 用户喜欢的世界观
- `.worldviews-grid` - 世界观网格
- `.worldview-card` - 世界观卡片
- `.worldview-card:hover` - 卡片悬停
- `.worldview-image img` - 世界观图片
- `.worldview-content` - 世界观内容
- `.worldview-content h3` - 世界观标题
- `.worldview-number` - 世界观编号
- `.worldview-content p` - 世界观描述
- `.worldview-meta` - 世界观元信息
- `.worldview-actions` - 世界观操作
- `.empty-state` - 空状态

### 头像选择器
- `.avatar-options-container` - 头像选项容器
- `.avatar-option-section` - 头像选项区域
- `.avatar-option-section h5` - 选项标题
- `.avatar-upload` - 头像上传

### 用户个人资料页面
- `.user-profile-page` - 用户个人资料页面
- `.user-profile-header` - 用户头部区域
- `.user-profile-avatar` - 用户头像
- `.user-profile-avatar img` - 头像图片
- `.user-profile-info h1` - 用户名
- `.user-profile-email` - 用户邮箱
- `.user-profile-id` - 用户ID
- `.user-profile-bio` - 用户简介
- `.user-profile-content` - 用户内容区域
- `.user-worldviews-section h2` - 用户世界观标题
- `.worldviews-grid` - 世界观网格

### 响应式设计
- 媒体查询 (768px, 480px)

## 通用组件样式

### 模态框 (Modal.css)
- `.modal-overlay` - 模态框遮罩
- `.modal-content` - 模态框内容
- `.modal-header` - 模态框头部
- `.modal-title` - 模态框标题
- `.modal-close-btn` - 关闭按钮
- `.modal-close-btn:hover` - 关闭按钮悬停
- `.modal-body` - 模态框主体
- `.error-list` - 错误列表
- `.error-item` - 错误项
- `@keyframes fadeIn` - 淡入动画
- `@keyframes slideIn` - 滑入动画

### Toast通知 (Toast.css)
- `.toast` - Toast基础样式
- `.toast.show` - 显示状态
- `.toast.hide` - 隐藏状态
- `.toast.success` - 成功Toast
- `.toast.error` - 错误Toast
- `.toast.info` - 信息Toast
- `.toast-content` - Toast内容
- `.toast-icon` - Toast图标
- `.toast-message` - Toast消息
- `.toast-close` - 关闭按钮
- `.toast-close:hover` - 关闭按钮悬停
- `.toast-progress` - 进度条
- `@keyframes slideIn` - 滑入动画
- `@keyframes slideOut` - 滑出动画

### 点赞按钮 (LikeButton.css)
- `.like-button` - 点赞按钮
- `.like-button:hover` - 按钮悬停
- `.like-button.liked` - 已点赞状态
- `.like-button.liked:hover` - 已点赞悬停
- 尺寸变体: `.size-small`, `.size-medium`, `.size-large`
- `.like-icon` - 点赞图标容器
- `.like-svg` - 点赞图标
- `.like-button.liked .like-svg` - 已点赞图标
- `.like-button.animating .like-svg` - 动画图标
- `.like-button.animating::before` - 脉冲效果
- `.like-count` - 点赞计数
- `.like-button.liked .like-count` - 已点赞计数
- `.like-button:disabled` - 禁用状态
- `@keyframes heartBeat` - 心跳动画
- `@keyframes pulse` - 脉冲动画

### 分享按钮 (ShareButton.css)
- `.share-button` - 分享按钮
- `.share-button:hover` - 按钮悬停
- `.share-popover` - 分享弹窗
- `.share-popover-content` - 弹窗内容
- `.share-title` - 分享标题
- `.share-platforms` - 分享平台
- `.share-platform-button` - 平台按钮
- `.share-platform-button:hover` - 平台按钮悬停
- `.share-platform-button .anticon` - 平台图标
- `.share-platform-button span` - 平台名称
- `.share-link-section` - 链接分享区域
- `.share-embed-section` - 嵌入分享区域
- `.share-link-label` - 链接标签
- `.share-embed-label` - 嵌入标签
- `.share-link-container` - 链接容器
- `.share-embed-container` - 嵌入容器
- `.share-link-input` - 链接输入框
- `.share-embed-input` - 嵌入输入框
- `.share-link-input .ant-input` - 链接输入框样式
- `.share-embed-input .ant-input` - 嵌入输入框样式
- `@keyframes fadeInUp` - 淡入上移动画

## 总结

本项目使用了大量的CSS选择器来构建现代化的用户界面，主要特点包括：

1. **模块化设计** - 每个组件都有独立的CSS文件
2. **响应式布局** - 支持从移动端到桌面端的适配
3. **主题系统** - 使用CSS变量实现主题切换
4. **动画效果** - 丰富的交互动画和过渡效果
5. **可访问性** - 考虑了键盘导航和屏幕阅读器支持

所有选择器都遵循项目的设计规范，保持一致的视觉风格和用户体验。