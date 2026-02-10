# 灵宝集市 · LingbaoShop

> 发现优质分享码，一键复制，即刻使用

一个面向王者荣耀玩家的游戏小马糕分享码展示与分享平台，支持浏览、复制、提交分享码，数据每 5 秒自动刷新。

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | Vue 3 + TypeScript |
| 构建工具 | Vite 7 |
| 状态管理 | Pinia |
| 路由 | Vue Router 5 |
| 样式 | Tailwind CSS 4 + CSS Variables |
| 动画 | motion-v |
| 工具库 | @vueuse/core、clsx、tailwind-merge |
| 代码规范 | ESLint + oxlint + Prettier |

## 功能特性

- **分享码浏览** — 响应式双列网格布局，支持分页加载
- **排序切换** — 按时间（最新）或按价格（最高）排序
- **一键复制** — 点击即复制分享码到剪贴板，自动记录使用次数
- **提交分享码** — 弹窗表单支持从剪贴板粘贴并自动解析分享码与价格
- **自动刷新** — 5 秒倒计时自动拉取最新数据，右上角环形进度指示
- **标签系统** — NEW（使用 < 6 次）、HOT（价格 ≥ 850）、SHARE（普通）
- **欢迎引导** — 首次访问展示动画引导页
- **骨架屏加载** — 数据加载时展示 shimmer 骨架占位
- **无障碍适配** — 语义化 HTML、aria-label、`prefers-reduced-motion` 支持

## 项目结构

```
src/
├── assets/                  # 全局样式（CSS Variables、Tailwind）
├── components/              # 业务组件
│   ├── ui/                  # 通用 UI 组件（动画按钮、背景、特效文字等）
│   ├── AddShareCodeModal    # 新增分享码弹窗
│   ├── AppHeader / Footer   # 页头页脚
│   ├── ShareCodeCard        # 分享码卡片
│   └── StatsBar             # 统计栏
├── lib/                     # 工具函数
├── router/                  # 路由配置
├── services/                # API 请求封装
├── stores/                  # Pinia 状态管理
├── types/                   # TypeScript 类型定义
└── views/                   # 页面视图（Home / Welcome）
```

## 快速开始

### 环境要求

- Node.js `^20.19.0 || >=22.12.0`
- npm / pnpm / yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器启动后会自动将 `/sharecode` 请求代理到后端 API。

### 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist/` 目录，为纯静态文件（HTML / CSS / JS），需要配合 Web 服务器部署。

### 生产环境与后端协作

前端所有 API 请求都发往**同源**的 `/sharecode` 路径（见 [api.ts](src/services/api.ts#L3)）：

```
GET  /sharecode/page
GET  /sharecode
POST /sharecode
POST /sharecode/{code}/use
```

开发环境下由 Vite proxy 将这些请求转发到后端（见 [vite.config.ts](vite.config.ts#L29-L33)），但 **生产构建后 Vite proxy 不存在**，需要你自行配置反向代理。有两种常见方案：

#### 方案一：Nginx 反向代理（推荐）

将前端静态文件和后端 API 统一由 Nginx 托管：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    root /path/to/dist;
    index index.html;

    # API 请求反向代理到后端服务
    location /sharecode {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Vue Router history 模式 — 所有非文件请求回退到 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 方案二：通过环境变量指定后端地址

如果后端部署在不同域名/端口（需后端配置 CORS），可在构建时指定 `VITE_API_BASE_URL`：

```bash
VITE_API_BASE_URL=http://your-api-server:8080 npm run build
```

此时前端会直接向该地址发起跨域请求，后端需允许对应的 Origin。

#### 方案对比

| | Nginx 反向代理 | 环境变量 + CORS |
| --- | --- | --- |
| 跨域问题 | 无（同源） | 需后端配置 CORS |
| 部署复杂度 | 需配置 Nginx | 仅需设置环境变量 |
| 适用场景 | 正式生产环境 | 快速验证 / 前后端分离部署 |

### 预览生产构建

```bash
npm run preview
```

> 注意：`preview` 命令不包含 API 代理，仅用于检查静态资源是否正确打包。如需完整测试请使用上述 Nginx 方案或设置 `VITE_API_BASE_URL`。

### 代码检查与格式化

```bash
# Lint（oxlint + ESLint，自动修复）
npm run lint

# 格式化
npm run format

# 类型检查
npm run type-check
```

## 环境变量

开发环境下 API 通过 Vite proxy 转发，无需额外配置。生产部署时需确保 `/sharecode` 路径正确指向后端服务。

## API 接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/sharecode/page` | 分页获取分享码（支持 sort、page、pageSize） |
| GET | `/sharecode` | 获取全部分享码（支持 sort、limit） |
| POST | `/sharecode` | 提交新分享码 |
| POST | `/sharecode/{code}/use` | 标记分享码已使用 |

## License

仅供学习交流使用。
