# 世界观平台 API 文档

## 基本信息
- **基础URL**: `http://localhost:5000`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

## 认证说明
大部分API需要在请求头中包含JWT令牌：
```
Authorization: Bearer <your_jwt_token>
```

## API 端点列表

### 1. 认证相关 (/api/auth)

#### 1.1 用户注册
- **端点**: `POST /api/auth/register`
- **描述**: 创建新用户账户
- **请求体**:
```json
{
  "username": "string (3-20字符)",
  "email": "string (有效邮箱)",
  "password": "string (至少6字符)"
}
```
- **成功响应** (201):
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "bio": "string"
  }
}
```
- **错误响应** (400):
```json
{
  "message": "用户名或邮箱已存在"
}
```

#### 1.2 用户登录
- **端点**: `POST /api/auth/login`
- **描述**: 用户登录获取访问令牌
- **请求体**:
```json
{
  "email": "string (有效邮箱)",
  "password": "string"
}
```
- **成功响应** (200):
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "bio": "string"
  }
}
```
- **错误响应** (400):
```json
{
  "message": "邮箱或密码错误"
}
```

#### 1.3 获取当前用户信息
- **端点**: `GET /api/auth/me`
- **描述**: 获取当前登录用户的信息
- **认证**: 需要Bearer Token
- **成功响应** (200):
```json
{
  "id": "number",
  "username": "string",
  "email": "string",
  "avatar": "string",
  "bio": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 2. 用户相关 (/api/users)

#### 2.1 获取用户资料
- **端点**: `GET /api/users/:id`
- **描述**: 获取指定用户的公开资料
- **成功响应** (200):
```json
{
  "id": "number",
  "username": "string",
  "email": "string",
  "avatar": "string",
  "bio": "string",
  "worldviews": [
    {
      "id": "number",
      "title": "string",
      "coverImage": "string",
      "createdAt": "datetime",
      "views": "number"
    }
  ]
}
```

#### 2.2 更新用户资料
- **端点**: `PUT /api/users/profile`
- **描述**: 更新当前用户的资料
- **认证**: 需要Bearer Token
- **请求体**:
```json
{
  "username": "string (可选, 3-20字符)",
  "bio": "string (可选, 最多500字符)",
  "avatar": "string (可选)"
}
```
- **成功响应** (200):
```json
{
  "message": "资料更新成功"
}
```

#### 2.3 上传头像
- **端点**: `POST /api/users/avatar`
- **描述**: 上传用户头像图片
- **认证**: 需要Bearer Token
- **请求**: multipart/form-data
- **字段**: `avatar` (图片文件，最大5MB)
- **成功响应** (200):
```json
{
  "avatarUrl": "string (完整头像URL)"
}
```

#### 2.4 获取用户点赞的世界观
- **端点**: `GET /api/users/liked`
- **描述**: 获取当前用户点赞的所有世界观
- **认证**: 需要Bearer Token
- **成功响应** (200):
```json
{
  "likedWorldviews": [
    {
      "id": "number",
      "title": "string",
      "coverImage": "string",
      "createdAt": "datetime",
      "views": "number",
      "author": {
        "id": "number",
        "username": "string",
        "avatar": "string"
      }
    }
  ]
}
```

### 3. 世界观相关 (/api/worldviews)

#### 3.1 获取世界观列表
- **端点**: `GET /api/worldviews`
- **描述**: 获取世界观列表，支持分页
- **查询参数**:
  - `page`: 页码 (默认: 1)
  - `limit`: 每页数量 (默认: 12)
  - `search`: 搜索关键词 (可选)
- **成功响应** (200):
```json
{
  "worldviews": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "coverImage": "string",
      "tags": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "author": {
        "id": "number",
        "username": "string",
        "avatar": "string"
      },
      "likes": "number",
      "views": "number",
      "isLiked": "boolean"
    }
  ],
  "totalPages": "number",
  "currentPage": "number",
  "total": "number"
}
```

#### 3.2 获取世界观详情
- **端点**: `GET /api/worldviews/:id`
- **描述**: 获取指定世界观的详细信息
- **成功响应** (200):
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "content": "string",
  "coverImage": "string",
  "tags": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "author": {
    "id": "number",
    "username": "string",
    "avatar": "string"
  },
  "likes": "number",
  "views": "number",
  "isLiked": "boolean"
}
```

#### 3.3 创建世界观
- **端点**: `POST /api/worldviews`
- **描述**: 创建新的世界观
- **认证**: 需要Bearer Token
- **请求体**:
```json
{
  "title": "string",
  "description": "string",
  "content": "string",
  "coverImage": "string (可选)",
  "tags": "string (可选)"
}
```
- **成功响应** (201):
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "content": "string",
  "coverImage": "string",
  "tags": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "authorId": "number"
}
```

#### 3.4 更新世界观
- **端点**: `PUT /api/worldviews/:id`
- **描述**: 更新指定的世界观
- **认证**: 需要Bearer Token (仅作者可更新)
- **请求体**:
```json
{
  "title": "string (可选)",
  "description": "string (可选)",
  "content": "string (可选)",
  "coverImage": "string (可选)",
  "tags": "string (可选)"
}
```
- **成功响应** (200):
```json
{
  "message": "世界观更新成功"
}
```

#### 3.5 删除世界观
- **端点**: `DELETE /api/worldviews/:id`
- **描述**: 删除指定的世界观
- **认证**: 需要Bearer Token (仅作者可删除)
- **成功响应** (200):
```json
{
  "message": "世界观删除成功"
}
```

#### 3.6 点赞/取消点赞世界观
- **端点**: `POST /api/worldviews/:id/like`
- **描述**: 点赞或取消点赞指定的世界观
- **认证**: 需要Bearer Token
- **成功响应** (200):
```json
{
  "message": "点赞成功" 或 "取消点赞",
  "likesCount": "number",
  "isLiked": "boolean"
}
```

#### 3.7 搜索世界观
- **端点**: `GET /api/worldviews/search`
- **描述**: 根据关键词搜索世界观
- **查询参数**:
  - `q`: 搜索关键词
- **成功响应** (200):
```json
{
  "worldviews": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "coverImage": "string",
      "tags": "string",
      "createdAt": "datetime",
      "author": {
        "id": "number",
        "username": "string",
        "avatar": "string"
      }
    }
  ]
}
```

### 4. 评论相关 (/api/comments)

#### 4.1 获取世界观评论
- **端点**: `GET /api/comments/worldview/:worldviewId`
- **描述**: 获取指定世界观的所有评论
- **查询参数**:
  - `page`: 页码 (默认: 1)
  - `limit`: 每页数量 (默认: 20)
- **成功响应** (200):
```json
{
  "comments": [
    {
      "id": "number",
      "content": "string",
      "createdAt": "datetime",
      "author": {
        "id": "number",
        "username": "string",
        "avatar": "string"
      },
      "replies": [
        {
          "id": "number",
          "content": "string",
          "createdAt": "datetime",
          "author": {
            "id": "number",
            "username": "string",
            "avatar": "string"
          }
        }
      ]
    }
  ],
  "totalPages": "number",
  "currentPage": "number",
  "total": "number"
}
```

#### 4.2 创建评论
- **端点**: `POST /api/comments`
- **描述**: 为世界观创建评论或回复
- **认证**: 需要Bearer Token
- **请求体**:
```json
{
  "content": "string (1-500字符)",
  "worldviewId": "number",
  "parentCommentId": "number (可选，用于回复)"
}
```
- **成功响应** (201):
```json
{
  "id": "number",
  "content": "string",
  "createdAt": "datetime",
  "author": {
    "id": "number",
    "username": "string",
    "avatar": "string"
  },
  "worldviewId": "number",
  "parentCommentId": "number"
}
```

#### 4.3 删除评论
- **端点**: `DELETE /api/comments/:id`
- **描述**: 删除指定的评论
- **认证**: 需要Bearer Token (仅评论作者可删除)
- **成功响应** (200):
```json
{
  "message": "评论已删除"
}
```

#### 4.4 点赞/取消点赞评论
- **端点**: `POST /api/comments/:id/like`
- **描述**: 点赞或取消点赞指定的评论
- **认证**: 需要Bearer Token
- **成功响应** (200):
```json
{
  "message": "点赞成功" 或 "取消点赞",
  "likesCount": "number"
}
```

## 错误响应格式

所有API在出错时都会返回以下格式的响应：

```json
{
  "message": "错误描述信息"
}
```

或

```json
{
  "errors": [
    {
      "msg": "具体错误信息",
      "param": "参数名",
      "location": "body"
    }
  ]
}
```

## 常见HTTP状态码

- `200` - 请求成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未认证
- `403` - 权限不足
- `404` - 资源不存在
- `500` - 服务器内部错误

## WinUI3 集成示例

### 1. 使用 HttpClient 进行 API 调用

```csharp
// 设置基础URL和HttpClient
private readonly HttpClient _httpClient = new HttpClient();
private const string BaseUrl = "http://localhost:5000/api";

// 添加认证头
private void SetAuthToken(string token)
{
    _httpClient.DefaultRequestHeaders.Authorization = 
        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
}

// 登录示例
public async Task<(bool Success, string Token, UserInfo User)> LoginAsync(string email, string password)
{
    try
    {
        var loginData = new
        {
            email = email,
            password = password
        };
        
        var json = JsonSerializer.Serialize(loginData);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await _httpClient.PostAsync($"{BaseUrl}/auth/login", content);
        var responseString = await response.Content.ReadAsStringAsync();
        
        if (response.IsSuccessStatusCode)
        {
            var result = JsonSerializer.Deserialize<LoginResponse>(responseString);
            SetAuthToken(result.Token);
            return (true, result.Token, result.User);
        }
        
        return (false, null, null);
    }
    catch (Exception ex)
    {
        // 处理异常
        return (false, null, null);
    }
}

// 获取世界观列表示例
public async Task<List<Worldview>> GetWorldviewsAsync(int page = 1, int limit = 12)
{
    try
    {
        var response = await _httpClient.GetAsync($"{BaseUrl}/worldviews?page={page}&limit={limit}");
        var responseString = await response.Content.ReadAsStringAsync();
        
        if (response.IsSuccessStatusCode)
        {
            var result = JsonSerializer.Deserialize<WorldviewsResponse>(responseString);
            return result.Worldviews;
        }
        
        return new List<Worldview>();
    }
    catch (Exception ex)
    {
        // 处理异常
        return new List<Worldview>();
    }
}
```

### 2. 数据模型定义

```csharp
// 用户信息模型
public class UserInfo
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string Avatar { get; set; }
    public string Bio { get; set; }
}

// 登录响应模型
public class LoginResponse
{
    public string Token { get; set; }
    public UserInfo User { get; set; }
}

// 世界观模型
public class Worldview
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Content { get; set; }
    public string CoverImage { get; set; }
    public string Tags { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public UserInfo Author { get; set; }
    public int Likes { get; set; }
    public int Views { get; set; }
    public bool IsLiked { get; set; }
}

// 世界观列表响应模型
public class WorldviewsResponse
{
    public List<Worldview> Worldviews { get; set; }
    public int TotalPages { get; set; }
    public int CurrentPage { get; set; }
    public int Total { get; set; }
}

// 评论模型
public class Comment
{
    public int Id { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public UserInfo Author { get; set; }
    public List<Comment> Replies { get; set; }
}
```

## 注意事项

1. **跨域问题**: 如果在WinUI3应用中遇到跨域问题，可能需要在服务器端配置CORS
2. **图片上传**: 头像和封面图片上传使用multipart/form-data格式
3. **分页**: 大多数列表API支持分页，使用page和limit参数
4. **认证**: 大多数API需要在请求头中包含JWT令牌
5. **错误处理**: 建议在应用中实现适当的错误处理机制
6. **网络状态**: 考虑实现网络状态检查和重试机制

## 更新日志

- **v1.0** (2023-12-01): 初始版本，包含用户认证、世界观管理和评论系统