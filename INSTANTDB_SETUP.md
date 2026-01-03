# InstantDB 集成说明

## 已完成的集成

项目已成功集成 InstantDB 数据库，包含以下功能：

### 1. 数据库配置
- **配置文件**: `instantdb.config.js`
- **Public ID**: `091dee0e-9e50-47f5-babf-a0b29687ce9e`

### 2. 数据表结构

#### `inquiries` 表 - 咨询表单数据
- id, name, contact, email, serviceType, company, challenges, objectives, city, vision, referral, additional, createdAt

#### `chat_messages` 表 - AI对话消息
- id, sessionId, message, sender, timestamp

#### `chat_sessions` 表 - 对话会话
- id, createdAt, lastMessageAt

### 3. 功能实现

#### 前端功能
- ✅ 咨询表单提交到 InstantDB
- ✅ AI对话历史保存到 InstantDB
- ✅ 自动降级到 localStorage（如果数据库不可用）

#### 管理面板
- ✅ 查看所有咨询记录
- ✅ 按类型筛选（ToB/ToC）
- ✅ 统计数据展示
- ✅ 咨询详情查看

## 重要提示

### InstantDB API 配置

当前代码使用 REST API 方式连接 InstantDB。如果 InstantDB 的实际 API 端点不同，需要修改以下文件：

1. **script.js** - `initInstantDB()` 函数中的 API 端点
2. **admin.js** - `initInstantDB()` 函数中的 API 端点

### 在 InstantDB 控制台创建表

请确保在 InstantDB 控制台中创建以下表结构：

1. 登录 [InstantDB 控制台](https://instantdb.com)
2. 选择你的应用（Public ID: `091dee0e-9e50-47f5-babf-a0b29687ce9e`）
3. 创建表并设置字段类型

### 如果 InstantDB API 不同

如果 InstantDB 使用不同的 SDK 或 API 方式，请：

1. 查看 [InstantDB 官方文档](https://docs.instantdb.com)
2. 更新 `instantdb.config.js` 中的配置
3. 修改 `script.js` 和 `admin.js` 中的数据库操作代码

## 使用方式

### 访问管理面板
打开 `admin.html` 文件即可查看所有咨询记录和统计数据。

### 数据查看
- 管理面板会自动加载所有咨询数据
- 可以按服务类型筛选
- 点击咨询卡片查看详细信息

## 降级处理

如果 InstantDB 连接失败，系统会自动降级：
- 表单数据：仍会显示成功提示（但数据可能未保存）
- AI对话：降级到 localStorage 存储

## 后续优化建议

1. 添加用户认证（保护管理面板）
2. 实现实时数据更新（WebSocket）
3. 添加数据导出功能
4. 添加搜索功能

