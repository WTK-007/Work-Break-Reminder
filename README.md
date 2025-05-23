# 🎯 工作休息提醒器 (Work Break Reminder)

一个基于番茄工作法的智能工作休息提醒应用，集成AI智能休息建议功能。

## ✨ 主要功能

- ⏰ **自定义计时器** - 支持预设时间（15/30/60分钟）和自定义时间设置
- 📝 **任务管理** - 必须输入工作内容才能开始计时，确保专注度
- 🎮 **智能控制** - 开始/暂停/重置/重新开始，状态智能切换
- 🤖 **AI休息建议** - 计时完成后自动生成个性化的中文休息建议
- 💾 **本地存储** - 自动保存任务内容和时间设置
- 🎨 **现代UI** - 基于Tailwind CSS和shadcn/ui的美观界面

## 🚀 在线演示

[点击这里查看在线演示](#) *(稍后部署)*

## 📸 界面预览

- 计时器主界面
- 时间设置选项
- AI休息建议展示

## 🛠️ 技术栈

- **框架**: Next.js 13+ (App Router)
- **语言**: TypeScript + React
- **样式**: Tailwind CSS
- **UI组件**: Radix UI + shadcn/ui
- **AI集成**: OpenRouter API
- **状态管理**: React Context + hooks

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
   ```bash
   # 复制示例配置文件
   cp config/api-keys.example.js config/api-keys.js
   
   # 编辑配置文件，填入你的OpenRouter API密钥
   # 获取API密钥: https://openrouter.ai/
   ```
   
   在 `config/api-keys.js` 中填入你的真实API密钥：
   ```javascript
   export const API_CONFIG = {
     OPENROUTER_API_KEY: "your_actual_api_key_here",
     OPENROUTER_BASE_URL: "https://openrouter.ai/api/v1"
   };
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

## 📋 使用说明

1. **设置任务** - 在"当前工作内容"输入框中输入你要进行的工作
2. **选择时间** - 使用预设时间或自定义工作时长
3. **开始专注** - 点击"开始"按钮开始计时
4. **休息提醒** - 计时结束后查看AI生成的个性化休息建议
5. **重新开始** - 可选择重新开始相同时长或调整新的时间

## 🎨 界面状态

- **空闲状态** - 显示"开始"按钮（需要输入任务）
- **运行中** - 显示"暂停"按钮，计时器倒计时
- **暂停状态** - 显示"继续"按钮
- **完成状态** - 显示"重新开始"按钮和AI休息建议

## 🤖 AI功能

本应用集成了智能AI休息建议功能：
- 基于你的工作内容和专注时长
- 生成3个个性化的5-10分钟休息活动建议
- 所有建议均为中文，贴合中国用户习惯

## 📁 项目结构

```
├── app/                    # Next.js App Router
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
├── hooks/                  # 自定义hooks
├── lib/                    # 工具函数
└── public/                 # 静态资源
```

## 🔒 API密钥配置

本应用使用配置文件来管理API密钥，确保敏感信息不会被提交到版本控制系统。

### 配置步骤：
1. 复制示例配置文件：`config/api-keys.example.js` → `config/api-keys.js`
2. 在新文件中填入你的真实API密钥

### 获取API密钥：
- 访问 [OpenRouter](https://openrouter.ai/) 注册账户
- 在控制台中创建新的API密钥
- 将密钥填入配置文件

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