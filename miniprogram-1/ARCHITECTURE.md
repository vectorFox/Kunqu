# 游园惊梦 - 项目架构说明

本文档介绍「游园惊梦」昆曲文化传承互动游戏的整体架构，包括 Web 演示版与微信小程序版的组成与协作方式。

---

## 一、项目概览

| 形态 | 目录 | 用途 |
|------|------|------|
| Web 演示版 | `web/` | 独立站点，用于演示、本地/Docker 部署，无包体限制 |
| 微信小程序版 | `miniprogram/` | 正式发布端，受 2MB 包体限制 |

两端共享同一套剧情与玩法设计；Web 版在 `web/story.py`、`web/quiz.py` 中复刻剧情与问答逻辑，与小程序数据约定一致。

---

## 二、Web 演示版架构

### 2.1 技术栈

- **后端**: FastAPI（Python 3.11）
- **模板**: Jinja2（HTML）
- **静态资源**: 原生 CSS / JavaScript
- **数据**: SQLite（`database.py`）
- **部署**: 单进程 uvicorn，可选 Docker

### 2.2 目录与职责

```
web/
├── main.py              # 入口：路由、中间件、API、认证
├── story.py             # 剧情节点数据 STORY_NODES + StoryManager
├── quiz.py              # 问答题目 + QuizManager
├── database.py          # SQLite：用户、进度、答题记录、档案
├── requirements.txt
├── Dockerfile
├── templates/           # 服务端渲染页
│   ├── auth.html        # 访问密码页
│   ├── menu.html        # 主菜单
│   ├── story.html       # 剧情页（视觉小说式布局）
│   ├── quiz.html        # 问答页
│   ├── archive.html     # 学习档案
│   └── settings.html
└── static/
    ├── css/             # common + 各页样式
    │   └── story.css    # 剧情页：背景/人物/前景/UI 分层
    ├── js/
    └── images/
        └── characters/  # 立绘（透明 PNG）
```

### 2.3 剧情页分层结构（视觉小说式）

剧情页采用固定层级，从底到顶：

| 层级 | 类名 | z-index | 内容 |
|------|------|---------|------|
| 背景层 | `.background-layer` | 0 | 场景渐变、背景文字 |
| 人物层 | `.character-layer` | 1 | 立绘（左/右，大图、透明底） |
| 前景层 | `.foreground-layer` | 2 | 装饰纹样、浮动圆形等 |
| UI 层 | `.ui-layer` | 3 | 状态栏、对话框、选项、菜单 |

- **人物层**：李师父 / 金丽卿立绘，容器无背景，图片使用透明 PNG，尺寸用 vw/vh 做响应式。
- **对话框**：视觉小说风格，包含名签（`.dialog-nameplate`）、正文（`.story-text`）、右侧控制区（后退/自动/快进/下一步）。下一步按钮在有唯一选项时代为触发该选项。

### 2.4 剧情系统（Story）

- **数据**: `story.py` 中 `STORY_NODES` 字典，key 为节点 id。
- **节点字段**: `id`, `text`, `character`, `characterId`, `secondaryCharacter`, `secondaryCharacterId`, `options`, `type`(normal/quiz/ending), `background`, `music` 等。
- **选项**: `text`, `next`, `condition`, `effect`；条件与效果作用于 `StoryManager` 的 `gameState`（理解值、好感值、积分等）。
- **管理器**: `StoryManager` 提供 `get_current_node`, `set_current_node`, `get_available_options`, `select_option`, `get_game_state`, `set_game_state`, `reset`。

### 2.5 问答系统（Quiz）

- **题目**: `quiz.py` 中按分类（如 hangdang, shuimo）组织。
- **流程**: 剧情节点 `type: 'quiz'` 时跳转 `/quiz?category=xxx&next_node=xxx`，答完再回 `/story?node=xxx` 继续剧情。
- **结果**: 正确加分，记录写入 `quiz_history`，可进学习档案。

### 2.6 认证与访问控制

- 入口由 `main.py` 的 HTTP 中间件做统一校验：未带有效认证 cookie 的请求（除静态、`/auth`、`/api/auth/verify`）重定向到认证页。
- 认证页提交密码到 `POST /api/auth/verify`，通过后写 cookie，再跳转主菜单。
- 密码默认 `enjian`，可通过环境变量 `KUNQU_ACCESS_PASSWORD` 覆盖。

### 2.7 主要 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/`, `/story`, `/quiz`, `/archive`, `/settings` | 页面 |
| GET | `/auth` | 认证页 |
| POST | `/api/auth/verify` | 验证密码并写 cookie |
| POST | `/api/story/select` | 选择剧情选项，返回下一节点与可用选项 |
| POST | `/api/story/jump` | 跳转指定节点 |
| POST | `/api/story/restart` | 重新开始 |
| POST | `/api/quiz/answer` | 提交作答 |
| POST | `/api/settings/clear` | 清除用户数据 |

---

## 三、微信小程序版（概要）

- **入口**: `miniprogram/app.js`，页面与组件在 `pages/`、`components/`。
- **剧情/问答**: 逻辑与 Web 版对齐，数据可在 `data/` 或云开发中维护。
- **包体**: 注意 2MB 限制，大图、音频可走 CDN 或云存储。

---

## 四、数据与状态

### 4.1 游戏状态（前端 + 后端一致）

- `understandingValue`: 理解值，影响选项条件（如「理解值≥3」）
- `favorValue`: 好感值
- `score`: 积分（答题、成就）
- `unlockedChapters` / `unlockedEndings`: 已解锁章节与结局

### 4.2 SQLite 表（Web）

- **users**: 用户 id、当前章节/节点、分数、理解值、好感值、解锁信息
- **quiz_history**: 答题记录
- **archives**: 学习档案

---

## 五、部署与运行

- **本地**: `cd web && pip install -r requirements.txt && python main.py`，访问 http://localhost:8080
- **Docker**: `cd web && docker build -t kunqu-web . && docker run -d -p 8080:8080 --name kunqu-web kunqu-web`，访问 http://127.0.0.1:8080
- 生产可替换为 gunicorn+uvicorn、反向代理与 HTTPS；密码务必通过环境变量配置。

---

## 六、立绘与资源约定

- 立绘放在 `web/static/images/characters/`，建议使用**透明背景 PNG**（如 `master_li.png`, `jin_liqing.png`），以便在人物层与背景/前景融合。
- 若现有图片带白底，可用去背工具处理后替换；项目内 `web/static/images/characters/README.md` 有简短说明。

---

以上为当前项目的架构说明，便于后续扩展剧情、新增角色或对接小程序/其他前端时保持结构一致。
