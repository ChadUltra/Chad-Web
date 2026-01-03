# 环境变量配置说明

## 邮件功能环境变量

为了启用表单确认邮件功能，需要在 Vercel 项目中配置以下环境变量：

### 必需的环境变量

#### `RESEND_API_KEY`
- **说明**: Resend API 密钥
- **获取方式**:
  1. 访问 [Resend 官网](https://resend.com)
  2. 注册/登录账户
  3. 进入 Dashboard → API Keys
  4. 创建新的 API Key
  5. 复制 API Key（只显示一次，请妥善保存）

- **在 Vercel 中配置**:
  1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
  2. 选择项目 `chad-web`
  3. 进入 Settings → Environment Variables
  4. 添加新变量：
     - Name: `RESEND_API_KEY`
     - Value: 您的 Resend API Key
     - Environment: Production, Preview, Development（全选）
  5. 点击 Save

### 可选的环境变量

#### `FROM_EMAIL`
- **说明**: 发送邮件的邮箱地址
- **默认值**: `onboarding@resend.dev`（Resend 测试邮箱）
- **推荐**: 使用您自己的域名邮箱，如 `noreply@yourdomain.com`
- **配置方式**: 同 `RESEND_API_KEY`，在 Vercel Environment Variables 中添加

### 验证域名（推荐）

为了使用自定义发送邮箱地址，需要在 Resend 中验证域名：

1. 登录 Resend Dashboard
2. 进入 Domains 页面
3. 添加您的域名
4. 按照提示添加 DNS 记录
5. 等待验证完成（通常几分钟）

### 测试邮件功能

配置完成后，可以通过以下方式测试：

1. 在网站上提交一个测试表单
2. 检查浏览器控制台（F12）查看邮件发送日志
3. 检查收件箱（包括垃圾邮件文件夹）
4. 如果使用测试邮箱，检查 Resend Dashboard 的 Logs 页面

### 故障排查

如果邮件发送失败，请检查：

1. **API Key 是否正确**: 在 Vercel Environment Variables 中确认
2. **API Key 权限**: 确保 API Key 有发送邮件的权限
3. **域名验证**: 如果使用自定义邮箱，确保域名已验证
4. **Vercel 部署**: 确保环境变量已部署到生产环境
5. **浏览器控制台**: 查看是否有错误日志

### Resend 免费额度

- 免费版: 每月 3,000 封邮件
- 发送限制: 每天 100 封邮件
- 如需更多额度，可升级到付费计划

### 安全注意事项

- ⚠️ **不要**将 API Key 提交到 Git 仓库
- ⚠️ **不要**在客户端代码中暴露 API Key
- ✅ 使用 Vercel Environment Variables 安全存储
- ✅ API Key 只应在 Serverless Function 中使用

