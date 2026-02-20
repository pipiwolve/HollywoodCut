# 智龄汇 (HollywoodCut)

本项目是一款面向银发族（退休老年人）及适老企业的求职招聘 Web 端高保真演示系统（Demo）。

核心定位：银发族专属的“Boss直聘+轻沟通”平台。采用 Vite + React (TypeScript) + TailwindCSS 开发，支持完全零后端的本地体验（通过 LocalStorage 实现状态模拟与持久化）。

## 环境要求与配置 (Environment)
本项目为纯前端系统，目前所有的模拟数据与状态存储均运行在本地浏览器中。未来如果需要接入云服务（例如更高级的 STT 语音识别或自建数据库），请通过环境变量配置：

1. 在项目根目录复制 `.env.example` 文件并重命名为 `.env.local`
2. 根据您的云服务商，填写相关参数：
```bash
# .env.example
# VITE_APP_API_BASE_URL=https://api.example.com
# VITE_SPEECH_RECOGNITION_KEY=your_key_here
```
> **安全警告**：永远不要把带有真实 API Key 的 `.env.local` 文件提交到代码仓库！本项目通过 `.gitignore` 保护了以 `.env` 结尾的核心涉密文件。

## 如何本地运行 (Development)
1. 确保系统已安装 Node.js (推荐 v18+)
2. 进入项目目录并安装依赖：
```bash
npm install
```
3. 启动开发服务器：
```bash
npm run dev
```

## GitHub 页面部署流程 (Deployment Workflow)
本仓库使用了 GitHub Actions 配置自动化部署。

### 自动化部署 (推荐)
1. 确保您的仓库已开启 Github Pages 服务：`Settings -> Pages -> Build and deployment -> Source (选择 GitHub Actions)`
2. 每次往 `main` 分支 `push` 代码时，GitHub Actions 会自动触发 `.github/workflows/deploy.yml` 定义的工作流。
3. 工作流会自动执行 `npm run build` 并将打包后的静态文件发布到您个人的 `*.github.io` 域名下。

### 手动构建打包
如果您想要在任何其他静态托管服务（如 Vercel, Netlify, Nginx 等）部署：
```bash
npm run build
```
执行后，将生成的 `dist` 目录下的所有文件上传推送到对应的服务器根目录即可。对于不支持 history 模式的纯静态主机，建议保持 `App.tsx` 中的 `HashRouter` 使用，以避免 404 问题。
