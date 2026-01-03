# Vercel 环境变量快速配置指南

## 方法一：使用 PowerShell 脚本（推荐）

我已经为您创建了一个 PowerShell 脚本，可以自动配置所有环境变量：

```powershell
.\setup-vercel-env.ps1
```

## 方法二：使用 Vercel CLI 手动配置

### 1. 配置 RESEND_API_KEY

在 PowerShell 中运行以下命令（需要为每个环境分别配置）：

```powershell
# Production 环境
echo re_VMgEmj1m_2iJDELumHDX9KqUVC9pdiaHv | vercel env add RESEND_API_KEY production

# Preview 环境
echo re_VMgEmj1m_2iJDELumHDX9KqUVC9pdiaHv | vercel env add RESEND_API_KEY preview

# Development 环境
echo re_VMgEmj1m_2iJDELumHDX9KqUVC9pdiaHv | vercel env add RESEND_API_KEY development
```

### 2. 配置 FROM_EMAIL（可选）

```powershell
# Production 环境
echo onboarding@resend.dev | vercel env add FROM_EMAIL production

# Preview 环境
echo onboarding@resend.dev | vercel env add FROM_EMAIL preview

# Development 环境
echo onboarding@resend.dev | vercel env add FROM_EMAIL development
```

### 3. 验证配置

```powershell
vercel env ls
```

### 4. 重新部署

```powershell
vercel --prod --yes
```

## 方法三：使用 Vercel Dashboard（图形界面）

如果 CLI 方式遇到问题，可以使用 Web 界面：

1. 访问 https://vercel.com/dashboard
2. 选择项目 `chad-web`
3. 进入 Settings → Environment Variables
4. 添加以下变量：

   **RESEND_API_KEY**
   - Key: `RESEND_API_KEY`
   - Value: `re_VMgEmj1m_2iJDELumHDX9KqUVC9pdiaHv`
   - Environment: Production, Preview, Development（全选）

   **FROM_EMAIL**（可选）
   - Key: `FROM_EMAIL`
   - Value: `onboarding@resend.dev`
   - Environment: Production, Preview, Development（全选）

5. 保存后，Vercel 会自动重新部署

## 验证配置是否成功

1. 检查环境变量：
   ```powershell
   vercel env ls
   ```

2. 查看部署日志：
   - 访问 Vercel Dashboard → Deployments
   - 查看最新的部署日志，确认没有错误

3. 测试邮件功能：
   - 访问网站并提交表单
   - 检查浏览器控制台（F12）查看日志
   - 检查收件箱

## 故障排查

如果遇到问题：

1. **环境变量未生效**：
   - 确认已为所有环境（Production, Preview, Development）配置
   - 重新部署项目

2. **邮件发送失败**：
   - 检查 Resend Dashboard → Logs 查看错误信息
   - 确认 API Key 正确且未过期

3. **CLI 命令失败**：
   - 确保已登录 Vercel：`vercel login`
   - 确保在正确的项目目录中

## 您的 API Key 信息

- **API Key**: `re_VMgEmj1m_2iJDELumHDX9KqUVC9pdiaHv`
- **状态**: 已准备好配置
- **建议**: 使用 PowerShell 脚本自动配置所有环境

