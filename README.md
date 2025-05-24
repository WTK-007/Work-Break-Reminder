# 🎯 工作休息提醒器 (Work Break Reminder)

一个基于番茄工作法的智能工作休息提醒应用，集成AI智能休息建议功能。

## ✨ 主要功能

- ⏰ **自定义计时器** - 支持预设时间（15/30/60分钟）和自定义时间设置
- 📝 **任务管理** - 必须输入工作内容才能开始计时，确保专注度
- 🎮 **智能控制** - 开始/暂停/重置/重新开始，状态智能切换
- 🤖 **AI休息建议** - 计时完成后自动生成个性化的中文休息建议
- 🔊 **温柔语音提醒** - 计时结束时播放甜美女声语音提醒，支持多种语音选择
- 💾 **本地存储** - 自动保存任务内容和时间设置
- 🎨 **现代UI** - 基于Tailwind CSS和shadcn/ui的美观界面
- 🔒 **安全架构** - API密钥安全存储，支持生产环境部署

## 🚀 在线演示

**Live Demo**: [https://work-break-reminder.vercel.app](https://work-break-reminder.vercel.app)

## 📸 界面预览

- 🎯 计时器主界面 - 显示剩余时间和进度
- ⚙️ 时间设置选项 - 预设和自定义时间
- 🔊 语音设置界面 - 语音开关、选择和试听功能
- 🤖 AI休息建议展示 - 个性化中文建议

## 🛠️ 技术栈

- **前端框架**: Next.js 13+ (App Router)
- **开发语言**: TypeScript + React
- **样式设计**: Tailwind CSS
- **UI组件**: Radix UI + shadcn/ui
- **AI集成**: OpenRouter API (服务器端)
- **语音功能**: Web Speech API (浏览器原生)
- **状态管理**: React Context + hooks
- **部署平台**: Vercel

## 🔧 本地开发

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/WTK-007/Work-Break-Reminder.git
   cd Work-Break-Reminder
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置API密钥**
   
   **方式一：使用配置文件（开发环境推荐）**
   ```bash
   # 复制示例配置文件
   cp config/api-keys.example.js config/api-keys.js
   ```
   
   在 `config/api-keys.js` 中填入你的真实API密钥：
   ```javascript
   export const API_CONFIG = {
     OPENROUTER_API_KEY: "your_actual_api_key_here",
     OPENROUTER_BASE_URL: "https://openrouter.ai/api/v1"
   };
   ```

   **方式二：使用环境变量**
   ```bash
   # 创建环境变量文件
   echo "OPENROUTER_API_KEY=your_api_key_here" > .env.local
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 🚀 Vercel部署

### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/WTK-007/Work-Break-Reminder)

### 手动部署步骤

1. **连接GitHub**
   - 访问 [Vercel.com](https://vercel.com)
   - 使用GitHub账号登录
   - 导入 `Work-Break-Reminder` 仓库

2. **配置环境变量** ⚠️ 重要
   
   在Vercel项目设置中添加：
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
   ```

3. **部署完成**
   - Vercel自动构建和部署
   - 获得在线访问链接

## 📋 使用说明

1. **设置任务** - 在"当前工作内容"输入框中输入你要进行的工作 *
2. **选择时间** - 使用预设时间（15/30/60分钟）或自定义工作时长
3. **配置语音** - 开启语音提醒并选择喜欢的语音角色（可试听）
4. **开始专注** - 点击"开始"按钮开始倒计时
5. **享受提醒** - 计时结束后听到温柔的语音提醒和AI休息建议
6. **重新开始** - 可选择重新开始相同时长或调整新的时间

> *注：必须输入工作内容才能开始计时

## 🎨 界面状态

- **空闲状态** - 显示"开始"按钮（需要输入任务）
- **运行中** - 显示"暂停"按钮，计时器倒计时运行
- **暂停状态** - 显示"继续"按钮，可恢复计时
- **完成状态** - 显示"重新开始"按钮和AI休息建议

## 🤖 AI功能

本应用集成了智能AI休息建议功能：
- 🎯 基于你的工作内容和专注时长
- 📝 生成3个个性化的5-10分钟休息活动建议
- 🇨🇳 所有建议均为中文，贴合中国用户习惯
- 🔒 服务器端安全调用，保护API密钥

## 🔊 语音提醒功能

应用提供温柔贴心的语音提醒服务：

### 🎤 语音选项
- **瑶瑶(甜美女声)** - Microsoft高质量语音，音色甜美自然
- **婷婷(娇柔女生)** - Google普通话语音，声音娇柔温柔  
- **花花(粤语女声)** - Google粤语语音，适合粤语用户

### ⚙️ 语音设置
- **开关控制** - 可自由开启/关闭语音提醒功能
- **语音选择** - 支持切换不同语音角色
- **试听功能** - 可预览测试各种语音效果
- **智能优化** - 自动调节语速、音调，确保温柔舒适的听感

### 🎵 语音特性
- **温柔参数** - 语速 0.8x，音调 1.3x，营造舒缓氛围
- **贴心提醒** - "工作辛苦了，休息一下吧" 等温馨话语
- **完美时机** - 计时结束后延迟播放，避免突兀感
- **本地存储** - 语音偏好设置自动保存

## 🏗️ 架构设计

```
客户端应用 → Next.js API路由 → OpenRouter API
    ↓              ↓               ↓
  用户界面    安全代理服务      AI模型服务
```

### 安全特性
- ✅ API密钥仅在服务器端使用
- ✅ 客户端无敏感信息暴露  
- ✅ 环境变量安全管理
- ✅ 生产环境安全部署

## 📁 项目结构

```
├── app/                    # Next.js App Router
│   ├── api/                # API路由
│   │   └── rest-suggestions/
│   │       └── route.ts    # AI建议API端点
│   ├── components/         # 页面组件
│   │   ├── TaskInput.tsx
│   │   ├── TimerDisplay.tsx
│   │   ├── TimerControls.tsx
│   │   ├── TimerSettings.tsx
│   │   └── RestSuggestions.tsx
│   ├── providers/          # Context提供者
│   │   └── TimerProvider.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/ui/          # shadcn/ui组件
├── config/                 # 配置文件
│   ├── api-keys.example.js # API密钥示例
│   └── api-keys.js         # API密钥配置(本地)
├── hooks/                  # 自定义hooks
├── lib/                    # 工具函数
└── public/                 # 静态资源
```

## 🔒 API密钥配置

### 本地开发
使用配置文件管理API密钥：
1. 复制 `config/api-keys.example.js` 为 `config/api-keys.js`
2. 在新文件中填入真实API密钥
3. 文件已在 `.gitignore` 中，不会被提交

### 生产部署
使用环境变量安全管理：
- Vercel: 在项目设置中配置环境变量
- 其他平台: 参考 `vercel.env.example`

### 获取API密钥
- 访问 [OpenRouter](https://openrouter.ai/) 注册账户
- 在控制台中创建新的API密钥
- 将密钥填入配置文件或环境变量

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork这个仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个Pull Request

## 📄 许可证

这个项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [shadcn/ui](https://ui.shadcn.com/) - UI组件库
- [OpenRouter](https://openrouter.ai/) - AI API服务

---

⭐ 如果这个项目对你有帮助，别忘了给它一个星标！ 