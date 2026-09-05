# 游园惊梦 - 昆曲文化传承互动游戏

昆曲文化传承互动游戏，通过沉浸式剧情体验让玩家了解昆曲艺术。

## 项目简介

本项目是一款以昆曲文化为主题的互动叙事游戏，玩家将扮演一名初入昆山戏班的新学徒，通过与师父李师父和师姐金丽卿的互动，学习昆曲知识，体验昆曲之美。

## 项目结构

```
miniprogram-1/
├── web/                          # Web演示版后端服务
│   ├── main.py                   # FastAPI主程序
│   ├── story.py                  # 剧情数据与管理器
│   ├── quiz.py                   # 问答题目与管理器
│   ├── database.py               # SQLite数据库操作
│   ├── requirements.txt          # Python依赖
│   ├── Dockerfile                # Docker镜像构建
│   ├── templates/                # HTML模板
│   │   ├── menu.html             # 主菜单页面
│   │   ├── story.html            # 剧情页面
│   │   ├── quiz.html             # 问答页面
│   │   ├── archive.html          # 学习档案页面
│   │   └── settings.html         # 设置页面
│   └── static/                   # 静态资源
│       ├── css/                  # 样式文件
│       │   ├── common.css        # 公共样式
│       │   ├── menu.css          # 菜单样式
│       │   ├── story.css         # 剧情样式
│       │   ├── quiz.css          # 问答样式
│       │   ├── archive.css       # 档案样式
│       │   └── settings.css      # 设置样式
│       ├── js/                   # JavaScript
│       │   └── common.js         # 公共脚本
│       └── images/               # 图片资源
│           └── characters/       # 人物立绘
│               ├── master_li.png # 李师父立绘
│               └── jin_liqing.png # 金丽卿立绘
│           └── backgrounds/      # 场景背景
│           └── audio/             # 背景音乐
├── miniprogram/                  # 微信小程序版本
│   ├── app.js                    # 小程序入口
│   ├── app.json                  # 小程序配置
│   ├── pages/                    # 页面目录
│   │   ├── index/                # 首页
│   │   ├── story/                # 剧情页面
│   │   ├── quiz/                 # 问答页面
│   │   ├── archive/              # 学习档案
│   │   ├── settings/             # 设置
│   │   ├── menu/                 # 菜单
│   │   └── admin/                # 管理页面
│   ├── components/               # 自定义组件
│   └── utils/                    # 工具函数
│       ├── story.js              # 剧情管理器
│       ├── quiz.js               # 问答管理器
│       └── db.js                 # 数据库操作
├── data/                         # 数据文件
│   ├── chapter1_data.json        # 第一章数据
│   ├── chapter1_summary.md       # 第一章摘要
│   └── prompts_for_ai.md         # AI提示词
└── README.md                     # 项目说明
```

## 技术栈

### Web版本
- **后端**: FastAPI + Python 3.11
- **数据库**: SQLite
- **前端**: HTML5 + CSS3 + JavaScript (原生)
- **部署**: Docker

### 微信小程序版本
- **框架**: 微信小程序原生开发
- **云开发**: 微信云开发 (CloudBase)
- **数据库**: 云数据库

## 核心模块

### 1. 剧情系统 (Story)

剧情系统采用节点式结构，每个节点包含：
- `id`: 节点唯一标识
- `text`: 对话/旁白文本
- `character`: 说话角色
- `characterId`: 角色ID (用于显示对应立绘)
- `secondaryCharacter`: 次要角色
- `secondaryCharacterId`: 次要角色ID
- `options`: 选项数组
  - `text`: 选项文本
  - `next`: 下一节点ID
  - `condition`: 显示条件 (如理解值≥3)
  - `effect`: 选择效果 (如增加理解值)
- `type`: 节点类型 (normal/quiz/ending)
- `background`: 背景场景
- `music`: 背景音乐

剧情节点定义示例:
```python
'start': {
    'id': 'start',
    'text': '你是一名初入昆山戏班的新学徒...',
    'character': '师父',
    'characterId': 'master_li',
    'options': [
        {'text': '观察环境', 'next': 'observe', 'effect': {'understandingValue': 1}},
        {'text': '请教知识', 'next': 'ask_teacher', 'effect': {'understandingValue': 1}}
    ],
    'background': 'rehearsal_hall'
}
```

### 2. 问答系统 (Quiz)

问答系统用于测试玩家对昆曲知识的理解：
- 支持多种分类: hangdang(行当), shuimo(水磨腔), character(角色), general(常识)
- 答题正确后奖励积分
- 保存答题历史到数据库

### 3. 游戏状态

游戏状态包含以下属性:
- `understandingValue`: 理解值 - 影响剧情分支
- `favorValue`: 好感值 - 影响与角色的关系
- `score`: 积分 - 答题和成就获得
- `unlockedChapters`: 已解锁章节
- `unlockedEndings`: 已解锁结局

### 4. 人物立绘系统

支持显示两名主要角色:
- **李师父 (master_li)**: 戏班师父，五十余岁，面容慈祥
- **金丽卿 (jin_liqing)**: 师姐，专攻旦角，二十三四岁

立绘图片放置位置:
```
web/static/images/characters/
├── master_li.png    # 李师父立绘 (建议尺寸: 400x700)
└── jin_liqing.png   # 金丽卿立绘 (建议尺寸: 360x640)
```

## 人物立绘规格

| 角色 | 文件名 | 建议尺寸 | 位置 |
|------|--------|----------|------|
| 李师父 | master_li.png | 400x700px | 左侧 |
| 金丽卿 | jin_liqing.png | 360x640px | 右侧 |

立绘图片要求:
- 透明背景PNG格式
- 人物居中，底部对齐
- 风格统一，古典服饰

## 部署指南

### 本地开发

1. 进入web目录:
```bash
cd web
```

2. 安装依赖:
```bash
pip install -r requirements.txt
```

3. 启动服务:
```bash
python main.py
```

4. 访问 http://localhost:8080

### Docker部署

1. 构建镜像:
```bash
cd web
docker build -t kunqu-web .
```

2. 运行容器 (映射8080端口):
```bash
docker run -d -p 8080:8080 --name kunqu-web --restart=always kunqu-web
```

3. NAS部署:
   - 使用群晖Docker或极空间Docker
   - 确保路由器端口映射: 外网端口 → NAS IP:8080
   - 可配合花生壳实现DDNS动态域名访问

## API接口

### 页面路由
- `GET /` - 主菜单
- `GET /story` - 剧情页面 (参数: mode=new/continue, node=节点ID)
- `GET /quiz` - 问答页面 (参数: category=分类, next_node=下一节点)
- `GET /archive` - 学习档案
- `GET /settings` - 设置页面

### API接口
- `POST /api/story/select` - 选择剧情选项
- `POST /api/story/jump` - 跳转剧情节点
- `POST /api/quiz/answer` - 提交问答答案
- `POST /api/story/restart` - 重新开始
- `POST /api/settings/clear` - 清除数据
- `GET /api/user/info` - 获取用户信息

## 数据库表结构

### users 表
| 字段 | 类型 | 说明 |
|------|------|------|
| user_id | TEXT | 用户唯一ID |
| username | TEXT | 用户名 |
| current_chapter | TEXT | 当前章节 |
| current_node | TEXT | 当前节点 |
| score | INTEGER | 积分 |
| understanding_value | INTEGER | 理解值 |
| favor_value | INTEGER | 好感值 |
| unlocked_chapters | TEXT | 已解锁章节(JSON) |
| unlocked_endings | TEXT | 已解锁结局(JSON) |

### quiz_history 表
| 字段 | 类型 | 说明 |
|------|------|------|
| user_id | TEXT | 用户ID |
| quiz_id | TEXT | 题目ID |
| question | TEXT | 问题 |
| selected_answer | INTEGER | 用户答案 |
| correct_answer | INTEGER | 正确答案 |
| is_correct | INTEGER | 是否正确 |
| category | TEXT | 题目分类 |

## 扩展开发

### 添加新角色

1. 在 `story.py` 的 `STORY_NODES` 中添加角色ID:
```python
'new_character': {
    'id': 'new_character',
    'character': '新角色名',
    'characterId': 'new_character_id',
    ...
}
```

2. 在 `web/templates/story.html` 添加角色立绘和文字描述HTML

3. 在 `web/static/css/story.css` 添加角色样式

4. 放置角色立绘图片到 `web/static/images/characters/`

### 添加新问答

在 `quiz.py` 的 `DEFAULT_QUIZZES` 字典中添加:
```python
'new_category': {
    'id': 'quiz_xxx',
    'question': '问题内容',
    'type': 'single',
    'options': ['A. ', 'B. ', 'C. ', 'D. '],
    'answer': 0,  // 正确答案索引
    'explanation': '解析内容',
    'category': 'new_category'
}
```

### 添加新剧情节点

在 `story.py` 中添加新节点:
```python
'new_node': {
    'id': 'new_node',
    'text': '剧情文本',
    'character': '角色名',
    'characterId': '角色ID',
    'options': [
        {'text': '选项文本', 'next': '下一节点', 'effect': {'属性': 值}}
    ],
    'type': 'normal'  // 或 'quiz', 'ending'
}
```

## 版本信息

- Web演示版: v1.0
- 微信小程序版: v1.0
- 数据库: SQLite

## 许可证

MIT License

## 贡献者

昆曲文化传承项目
